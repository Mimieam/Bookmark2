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
    }
});

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     console.log(`Message received`, request)
//     if (request.action === "checkLinks") {
//         const results = [];
//         let pendingRequests = request.urls.length; // Track the number of pending requests

//         request.urls.forEach(url => {
//             fetch(url, { method: 'HEAD' })
//                 .then(response => {
//                     results.push({ url, ok: response.ok, status: response.status });
//                 })
//                 .catch(error => {
//                     results.push({ url, ok: false, status: 'Error' });
//                 })
//                 .finally(() => {
//                     pendingRequests--; // Decrement pending requests
//                     if (pendingRequests === 0) {
//                         // All requests are done
//                         sendResponse({ results });
//                     }
//                 });
//         });

//         return true; // Indicates that the response will be sent asynchronously
//     }
// });
