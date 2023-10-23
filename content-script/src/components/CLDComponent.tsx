/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
import {useState} from "react";
import {useEffect} from "react";
import axios from "axios";


import {TagIcon} from "@heroicons/react/24/solid";



import '../../../src/main.css'


const urlProductsStartPattern = 'https://card.wb.ru/cards/v1/detail'
const urlWarehouseEndsWith = 'stores-data.json'

const regexTabUrl = /\/(\d+)\/detail.aspx/;
type dataType = { basicPriceU: number,
    basicSale: number,
    clientPriceU: number,
    clientSale: number }




let data: dataType
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

    let dataUrl: string | null = null
    let currentId: number | null = null

    console.log('prePreFetching!!!')
    if (dataUrl === null && currentId === null) {

        if (message.type === "URL_PRODUCTS") {
            currentId = parseInt(message.data.tabUrl.match(regexTabUrl)[1], 10)
            dataUrl = message.data.url

        }
        console.log('prePreFetching')

            console.log('preFetching')
            const fetch = async () => {
                try {

                    const res = await axios.get(dataUrl!)
                    data = res.data.data.products.find((item: any) => item.id === currentId)?.extended
                    console.log('productsFirst', res.data.data.products)
                } catch (error) {
                    console.log(error)
                }
            }
            fetch()

    }
});


function CLDComponent() {




    const [fetchedData, setFetchedData] = useState<dataType>(data)
    const [dataUrlFetch, setDataUrlFetch] = useState<string>("");
    const [productId, setProductId] = useState<number | null>(null)
    const [loading, setLoading] = useState<boolean>(false)







    useEffect(() => {
        // Listen for every update of URL from BG and update urlForDataFetch and productId

        const messageListener = (message: any) => {

            if (message.type === "URL_PRODUCTS") {

                // set productId
                const productIdRaw = message.data.tabUrl.match(regexTabUrl);

                setProductId(parseInt(productIdRaw[1], 10))

                if (dataUrlFetch !== message.data.url) {
                    // set Loading
                    setLoading(true)
                    console.log('setDataUrl')
                setDataUrlFetch(message.data.url)
                }



            }
        };



        chrome.runtime.onMessage.addListener(messageListener);

        return () => chrome.runtime.onMessage.removeListener(messageListener)
    }, []);

      useEffect(() => {
          if (dataUrlFetch !== '' && productId !== null) {

              const fetch = async () => {
                  try {

                      const res = await axios.get(dataUrlFetch)
                      setFetchedData(res.data.data.products.find((item: any) => item.id === productId)?.extended)
                      console.log('products', res.data.data.products)
                      setLoading(false)
                  } catch (error) {
                      console.log(error)
                  }
              }
              fetch()
          }


      }, [dataUrlFetch])





console.log('rendered')

   if (fetchedData && !loading) { return (


        <div className='mb-4 text-sm rounded-lg bg-[#F6F6F9] px-4 py-4 text-base text-xl text-neutral-900 flex gap-x-3 items-center'>
            <div className='w-6 h-6 flex justify-center items-center'><TagIcon /></div>
            <div>
                <span className='text-sm text-gray-500'>СПП</span>
                {fetchedData?.clientSale}%</div>

            <div className='text-gray-500'>
                <span className='text-sm ml-3'>До СПП:</span>
                {fetchedData?.basicPriceU ?   parseInt(fetchedData.basicPriceU.toString().slice(0, -2), 10) : null}&#8381;
            </div>
        </div>


    ) } else {return (<></>)}
}

export default CLDComponent;





