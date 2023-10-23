

// @ts-ignore
const urlProductsStartPattern = 'https://card.wb.ru/cards/v1/detail'
const urlWarehouseEndsWith = 'stores-data.json'
const prev = 'https://www.wildberries.ru/webapi/product/'

let prevUrlProducts: string
let prevUrlWarehouse: string

let pageReloaded: boolean = false




chrome.webNavigation.onCommitted.addListener((details) => {
    if (details?.transitionType === "reload") {
       pageReloaded = true

    }
});




chrome.webRequest.onCompleted.addListener(
    function(details) {
        if (details.method === "GET" && details.url.startsWith(urlProductsStartPattern)) {
            // You can customize the conditions for capturing responses as needed

            const url = details.url

            // Send the response information to the content script
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {


                if ( tabs[0].url !== prevUrlProducts || pageReloaded) {

                    pageReloaded = false
                    prevUrlProducts = tabs[0].url!
                    chrome.tabs.sendMessage(tabs[0].id!, {type: "URL_PRODUCTS", data: {url, tabUrl: tabs[0].url}});

                }
            });
        }

        if (details.method === "GET" && details.url.endsWith(urlWarehouseEndsWith)) {
            // You can customize the conditions for capturing responses as needed

            const url = details.url

            // Send the response information to the content script
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {


                if ( tabs[0].url !== prevUrlWarehouse || pageReloaded) {

                    pageReloaded = false
                    prevUrlWarehouse = tabs[0].url!
                    chrome.tabs.sendMessage(tabs[0].id!, {type: "URL_WAREHOUSE", data: {url, tabUrl: tabs[0].url}});

                }
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
