


const urlProductsStartPattern = 'https://card.wb.ru/cards/v1/detail?appType'
const urlWarehouseEndsWith = 'stores-data.json'
const prev = 'https://www.wildberries.ru/webapi/product/'
const regexTabUrl = /\/(\d+)\/detail.aspx/;

let prevUrlProducts: string
let prevUrlWarehouse: string

let pageReloaded: boolean = false
let dataProductsFetched: boolean = false




const fetchData = async (fetchUrl: string) => {
    try {
        const response = await fetch(fetchUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }
        console.log('how many times')
        const data = await response.json();

        return await data
    } catch (error) {
        console.error("An error occurred while fetching data:", error);
        throw error; // Rethrow the error for further handling, if necessary
    }
};


chrome.webNavigation.onCommitted.addListener((details) => {
    if (details?.transitionType === "reload") {
       pageReloaded = true

    }
});

// @ts-ignore
bgFetch.match("/ep-5.mp3").then(async (record) => {
    if (!record) {
        console.log("No record found");
        return;
    }

    console.log(`Here's the request`, record.request);
    const response = await record.responseReady;
    console.log(`And here's the response`, response);
});


chrome.webRequest.onCompleted.addListener(
    async function(details) {


            // You can customize the conditions for capturing responses as needed
            const url = details.url

            let payloadProducts
            let payloadProductsRaw: any
            let fetchProducts

               if (url && !dataProductsFetched) {
                   try {
                       payloadProductsRaw = await fetchData(url)

                      if (payloadProductsRaw !== undefined)
                      {

                          payloadProducts = payloadProductsRaw
                          dataProductsFetched = true
                      } else {
                          dataProductsFetched = false
                      }
                   } catch (error) {console.log(error) }


               }



            // Send the response information to the content script
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                console.log('tabsUEL', tabs[0].url !== prevUrlProducts)
                if ( tabs[0].url !== prevUrlProducts || pageReloaded) {


                    const productIdRaw = tabs[0]?.url?.match(regexTabUrl)![1] as string
                    const productId = parseInt(productIdRaw ,10)



                        if (payloadProductsRaw !== undefined) {

                        payloadProducts = payloadProductsRaw?.data?.products?.find((item: any) => item.id === productId)?.extended
                        console.log(payloadProducts)
                        console.log('send', payloadProducts)
                        chrome.tabs.sendMessage(tabs[0].id!, {type: "PRODUCTS_PAYLOAD", data: {payload: payloadProducts}});
                            dataProductsFetched = false
                            prevUrlProducts = tabs[0].url!
                            pageReloaded = false
                      }

                }
            });




    },
    { urls: ["https://card.wb.ru/cards/v1/detail?appType*"] },

);




