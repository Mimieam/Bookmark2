// background.js - Handles requests from the UI, runs the model, then sends back a response

////////////////////// 1. Context Menus //////////////////////
//
// Add a listener to create the initial context menu items,
// context menu items only need to be created at runtime.onInstalled
chrome.runtime.onInstalled.addListener(function () {
    // Register a context menu item that will only show up for selection text.
    chrome.contextMenus.create({
        id: 'classify-selection',
        title: 'Classify "%s"',
        contexts: ['selection'],
    });
});

// // Perform inference when the user clicks a context menu
// chrome.contextMenus.onClicked.addListener(async (info, tab) => {
//     // Ignore context menu clicks that are not for classifications (or when there is no input)
//     if (info.menuItemId !== 'classify-selection' || !info.selectionText) return;

//     // Perform classification on the selected text
//     let result = await classify(info.selectionText);

//     // Do something with the result
//     chrome.scripting.executeScript({
//         target: { tabId: tab.id },    // Run in the tab that the user clicked in
//         args: [result],               // The arguments to pass to the function
//         function: (result) => {       // The function to run
//             // NOTE: This function is run in the context of the web page, meaning that `document` is available.
//             console.log('result', result)
//             console.log('document', document)
//         },
//     });
// });
//////////////////////////////////////////////////////////////

////////////////////// 2. Message Events /////////////////////
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(`Message received`, request)
    if (request.action === "checkLinks") {
        const [url] = request.urls
        try {
            fetch(url, { method: 'HEAD' })
                .then(response => {
                    sendResponse({ ok: response.ok, status: response.status });
                })
                .catch(error => {
                    sendResponse({ ok: false, status: 'Error' });
                });
            
        } catch (error) {
            sendResponse({ ok: false, status: `${error}` }); 
        }
        return true; // Indicates that the response will be sent asynchronously
    } if (request.action === "classify") {
        (async function () {
            // Perform classification
            let result = await classify(request.text);

            // Send response back to UI
            sendResponse(result);
        })();
        return true; // Indicates that the response will be sent asynchronously
    }
});
