const urlProductsStartPattern = 'https://card.wb.ru/cards/v1/detail?appType'
const urlWarehouseEndsWith = 'stores-data.json'
const prev = 'https://www.wildberries.ru/webapi/product/'
const regexTabUrl = /\/(\d+)\/detail.aspx/;


type readyForFetchType = {
    fetchProducts : null | string
    fetchWarehouse : null | string
}



let pageReloadedProducts: boolean = false

let pageChangedUrlProducts: boolean = false
let prevProdUrl: string  =''



const readyForFetch: readyForFetchType = {
    fetchProducts : null,
    fetchWarehouse : null
}

const fetchedData: any = {}








chrome.webNavigation.onCommitted.addListener((details) => {
    if (details?.transitionType === "reload") {
        pageReloadedProducts = true

    }
});

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {

    pageChangedUrlProducts = true


});


chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace === 'local' && changes.key) {

        chrome.runtime.sendMessage({ action: 'storageChange', newValue: changes.key.newValue });
    }
});


function handleBeforeRequest(details: any) {



    chrome.tabs.query({active: true, currentWindow: true}, async function (tabs) {



            console.log('2nd step url', details.url)
            if (details.url.startsWith(urlProductsStartPattern) && readyForFetch.fetchProducts === null) {

                readyForFetch.fetchProducts = details.url
                console.log(readyForFetch.fetchProducts, 'what to fetch')
            }


            if (details.url.endsWith(urlWarehouseEndsWith) && readyForFetch.fetchWarehouse === null) {

                readyForFetch.fetchWarehouse = details.url
            }


            if (readyForFetch.fetchWarehouse && readyForFetch.fetchProducts) {

                if (pageChangedUrlProducts || pageReloadedProducts) {

                    console.log('guess you changed')

                    if (pageReloadedProducts) {
                        pageReloadedProducts = false
                    }

                    if (pageChangedUrlProducts) {
                        pageChangedUrlProducts = false
                    }
                    if (tabs[0].url !== prevProdUrl) {
                        prevProdUrl = tabs[0].url!

                    const productIdRaw = tabs[0]?.url?.match(regexTabUrl)![1] as string;
                    const productId = parseInt(productIdRaw, 10);



                        const fetchProd = async (url: string) => {
                            try { const res = await fetch(url)
                                const final = await res.json()

                                return final
                            } catch (error) {console.log(error)}
                        }

                           const payloadProductsRaw = await fetchProd(readyForFetch.fetchProducts)
                            console.log(payloadProductsRaw)
                            const payloadProducts = await payloadProductsRaw.data.products.find((item: any) => item.id === productId)
                            console.log( await payloadProducts, 'kkk')
                            chrome.storage.local.set({storageChange: await payloadProducts.extended}).then(() => {
                                console.log('SET NEW DATA BG', payloadProducts.extended)
                            });





                    if (fetchedData.warehouseNames === undefined) {
                        fetch(readyForFetch.fetchWarehouse)
                            .then(response => response.json())
                            .then(responseJSON => {

                                fetchedData.warehouseNames = responseJSON


                            });

                    }

                }
            }


        }

        }


    )

}






// Add an event listener for onBeforeRequest
chrome.webRequest.onBeforeRequest.addListener(
    handleBeforeRequest,
    { urls: ['https://card.wb.ru/cards/v1/detail?appType*', '*://*/*/stores-data.json*'] }
);





