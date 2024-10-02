chrome.action.onClicked.addListener(() => {
    bookmarkAllOpenTabs();
});

export async function bookmarkAllOpenTabs() {
    try {
        const tabs = await getAllOpenTabs();
        const folder = await chrome.bookmarks.create({ title: "Bookmarks from Open Tabs" });

        // Create bookmarks for each tab
        const bookmarkPromises = tabs.map(tab => createBookmark(tab, folder.id));
        await Promise.all(bookmarkPromises);

        console.log("All open tabs have been bookmarked.");
    } catch (error) {
        console.error("Error bookmarking tabs:", error);
    }
}

export async function getAllOpenTabs() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({}, (tabs) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(tabs);
        });
    });
}

export async function createBookmark(tab, parentId) {
    return new Promise((resolve, reject) => {
        chrome.bookmarks.create({
            parentId: parentId,
            title: tab.title,
            url: tab.url
        }, (bookmark) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(bookmark);
        });
    });
}
