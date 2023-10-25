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
let currentUrlWarhouse: string

let pageReloadedProducts: boolean = false
let pageReloadedWarehouse: boolean = false
let pageChangedUrlProducts: boolean = false
let pageChangedUrlWarehouse: boolean = false

const readyForFetch: readyForFetchType = {
    fetchProducts : null,
    fetchWarehouse : null
}

chrome.alarms.onAlarm.addListener(a => {
    console.log('Alarm! Alarm!', a);
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.get('alarm', a => {
        if (!a) {
            console.log('ALARM')
            chrome.alarms.create('alarm', {periodInMinutes: 0.1});
        }
    });
});




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

const fetchWarehouseNames: any = {}


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



                     const maxRetries = 10; // Define the maximum number of retry attempts
                     let retryCount = 0;

                    async function fetchData(url: any) {
                        try {



                            while (retryCount < maxRetries) {
                                const responseWH = await fetch(currentUrlWarhouse);
                                const responseWHJSON = await responseWH.json();
                                const payloadWarehouse = responseWHJSON;
                                fetchWarehouseNames.data = payloadWarehouse;



                            const response = await fetch(url);
                                if (!response.ok) {
                                    throw new Error('Network response was not ok');
                                }
                            const responseJSON = await response.json();

                            const product = responseJSON.data.products.find((item: any) => item.id === productId);


                            const warehousePayload = product
                                console.log(warehousePayload, 'THATS GO FOR RAW FROM BG')

                                chrome.tabs.sendMessage(tabs[0].id!, {
                                    type: "COMBINED_PAYLOAD",
                                    data: {
                                        productsPayload: { payload: product.extended },
                                        warehousePayload: { payload: warehousePayload, names: fetchWarehouseNames.data },
                                    }
                                });
                            return response.ok
                        }} catch (error) {
                            console.error(`Fetch error: ${error}`);
                            retryCount++;
                            console.log(`Retrying (attempt ${retryCount})...`);
                            await new Promise(resolve => setTimeout(resolve, 10)); // Retry after a delay (e.g., 1 second)
                        }
                    }

                    fetchData(details.url);




                }
            }

        if (details.url.endsWith(urlWarehouseEndsWith)) {
            if ( details.url !== prevUrlProducts ) {
                currentUrlWarhouse = details.url

            }



        }




        }



    )}






// Add an event listener for onBeforeRequest
chrome.webRequest.onBeforeRequest.addListener(
    handleBeforeRequest,
    { urls: ['https://card.wb.ru/cards/v1/detail?appType*', '*://*/*/stores-data.json*'] }
);