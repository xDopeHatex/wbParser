

const urlStartPattern = 'https://card.wb.ru/cards/v1/detail'
const prev = 'https://www.wildberries.ru/webapi/product/'


chrome.webRequest.onCompleted.addListener(
    function(details) {
        if (details.method === "GET" && details.url.startsWith(urlStartPattern)) {
            // You can customize the conditions for capturing responses as needed

            const url = details.url

            // Send the response information to the content script
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { type: "URL", data: {url, tabUrl: tabs[0].url} });
            });
        }
    },
    { urls: ["<all_urls>"] },
    ["responseHeaders"]
);












//
//
// chrome?.runtime?.onInstalled.addListener(function() {
//
//     chrome?.webRequest?.onBeforeRequest.addListener(
//         function(details) {
//
//
//
//
//             if ( (details.method === "GET" && regexUrlPattern2.test(details.url))) {
//
//                 const message = {
//                     type: "GET_REQUEST",
//                     url: details.url
//                 };
//
//                 // Send the message to the content script
//                 chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//                     chrome.tabs.sendMessage(tabs[0].id, message);
//                 });
//             }
//         },
//         { urls: ["<all_urls>"] },
//         ["requestBody"]
//     );
// });
//
//
