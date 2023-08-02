import browser from 'webextension-polyfill';

// globalThis.browser = browser
(async () => {

    const parentWindow = await browser.windows.getCurrent();
    console.log(parentWindow)

    // browser.browserAction.onClicked.addListener(async () => {
    //     console.log("browser.browserAction.onClicked")
    // })
})();

let OPENED_POPUP = [];

// https://stackoverflow.com/a/64194171
(browser.browserAction||browser.action).onClicked.addListener(async () => {
    console.log('OPENING FROM BACKGROUND');
    let screen = globalThis?.screen;
    const currentMonitor = (typeof screen !== 'undefined')? {
        top: screen.availTop,
        left: screen.availLeft,
        width: screen.availWidth,
        height: screen.availHeight,
    } : (await chrome.system.display.getInfo())[0].workArea

    const parentWindow = await browser.windows.getCurrent();

    const parentConfig = {
        'width': parseInt(currentMonitor.width * (3 / 4)),
        'height': parseInt(currentMonitor.height * (5 / 5)),
        'left': parseInt(currentMonitor.left),
        'top': parseInt(currentMonitor.top)
    };
    const appConfig = {
        'width': currentMonitor.width - parentConfig.width,
        'height': parentConfig.height,
        'left': currentMonitor.left + parentConfig.width,
        'top': currentMonitor.top
    };

    if (OPENED_POPUP.length) {
        const { popupWindowId, parentId } = OPENED_POPUP[0]
        let _parentId =  parentWindow.id != parentId ? parentWindow.id: parentId

        await browser.windows.update(popupWindowId, { focused: true })
        await browser.tabs.highlight({ windowId: popupWindowId, tabs: 0 })

        browser.windows.update(popupWindowId, { drawAttention: true, ...appConfig }).then((w) => console.log(w));
        browser.windows.update(_parentId, { drawAttention: true, ...parentConfig }).then((w) => console.log(w));

    } else {
        browser.windows.create({
            'url': 'popup.html',
            'type': 'popup',
            ...appConfig
        }).then(async (appWindow) => {

            await browser.windows.update(parentWindow.id, { ...parentConfig })
            OPENED_POPUP.push({
                popupWindowId: appWindow.id,
                popupTabId: appWindow.tabs[0].id,
                parentId: parentWindow.id
            })
        });
    }
});


browser.windows.onRemoved.addListener((id) => {
    OPENED_POPUP = OPENED_POPUP.filter(x => x.popupWindowId != id)
})


