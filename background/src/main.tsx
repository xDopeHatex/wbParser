const urlProductsStartPattern = 'https://card.wb.ru/cards/v1/detail?appType'
const urlWarehouseEndsWith = 'stores-data.json'
const prev = 'https://www.wildberries.ru/webapi/product/'
const regexTabUrl = /\/(\d+)\/detail.aspx/;


type readyForFetchType = {
    fetchProducts : null | string
    fetchWarehouse : null | string
}

let prevUrlProducts: string
let prevUrlWarehouse: string

let pageReloadedProducts: boolean = false
let pageReloadedWarehouse: boolean = false
let pageChangedUrlProducts: boolean = false
let pageChangedUrlWarehouse: boolean = false

const readyForFetch: readyForFetchType = {
    fetchProducts : null,
    fetchWarehouse : null
}




chrome.webNavigation.onCommitted.addListener((details) => {
    if (details?.transitionType === "reload") {

        pageReloadedProducts = true
        pageReloadedWarehouse = true
    }
});

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    pageChangedUrlProducts = true
    pageChangedUrlWarehouse = true
});


function handleBeforeRequest(details: any) {



    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {

            if (details.url.startsWith(urlProductsStartPattern)) {

                if (pageChangedUrlProducts || pageReloadedProducts) {

                    if (pageReloadedProducts) {
                        pageReloadedProducts = false
                    }

                    if (pageChangedUrlProducts) {
                        pageChangedUrlProducts = false
                    }


                        const productIdRaw = tabs[0]?.url?.match(regexTabUrl)![1] as string;
                        const productId = parseInt(productIdRaw, 10);


                        fetch(details.url)
                            .then(response => response.json())
                            .then(responseJSON => {

                                const payloadProducts = responseJSON.data.products.find((item: any) => item.id === productId)

                                chrome.tabs.sendMessage(tabs[0].id!, {
                                    type: "PRODUCTS_PAYLOAD",
                                    data: {payload: payloadProducts.extended}
                                });
                                chrome.tabs.sendMessage(tabs[0].id!, {
                                    type: "WAREHOUSE_STOCK_PAYLOAD",
                                    data: {payload: payloadProducts.sizes[0].stocks}
                                });

                            });



                }
            }


            if (details.url.endsWith(urlWarehouseEndsWith)) {
                if (pageChangedUrlWarehouse|| pageReloadedWarehouse) {
                    if (pageReloadedWarehouse) {
                       pageReloadedWarehouse = false
                    }


                    if (pageChangedUrlWarehouse) {
                        pageChangedUrlWarehouse = false
                    }





                        // @ts-ignore

                        console.log('send')
                        fetch(details.url)
                            .then(response => response.json())
                            .then(responseJSON => {
                                const payloadWarehouse = responseJSON
                                chrome.tabs.sendMessage(tabs[0].id!, {
                                    type: "WAREHOUSE_NAME_PAYLOAD",
                                    data: {payload: payloadWarehouse}
                                });
                            });



                }}

        }



    )}






// Add an event listener for onBeforeRequest
chrome.webRequest.onBeforeRequest.addListener(
    handleBeforeRequest,
    { urls: ['https://card.wb.ru/cards/v1/detail?appType*', '*://*/*/stores-data.json*'] }
);


