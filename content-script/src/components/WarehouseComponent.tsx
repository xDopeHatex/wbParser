/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
import {useState} from "react";
import {useEffect} from "react";
import axios from "axios";


import {TagIcon, BoltIcon} from "@heroicons/react/24/solid";



import '../../../src/main.css'

const regexTabUrl = /\/(\d+)\/detail.aspx/;
type dataType = { basicPriceU: number,
    basicSale: number,
    clientPriceU: number,
    clientSale: number }




let data: dataType
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

    let dataUrl: string | null = null
    let currentId: number | null = null
    let warehouseDataUrl: string | null = null

    if (dataUrl === null || warehouseDataUrl === null ) {

        if (message.type === "URL") {
            currentId = parseInt(message.data.tabUrl.match(regexTabUrl)[1], 10)
            dataUrl = message.data.url

        }

        const fetch = async () => {
            try {

                const res = await axios.get(dataUrl!)
                data = res.data.data.products.find((item: any) => item.id === currentId)?.extended

            } catch (error) {
                console.log(error)
            }
        }
        fetch()
    }
});


function WarehouseComponent () {




    const [fetchedData, setFetchedData] = useState<dataType>(data)
    const [dataUrlFetch, setDataUrlFetch] = useState<string>("");
    const [productId, setProductId] = useState<number | null>(null)
    const [loading, setLoading] = useState<boolean>(false)







    useEffect(() => {
        // Listen for every update of URL from BG and update urlForDataFetch and productId

        const messageListener = (message: any) => {

            if (message.type === "URL") {

                // set productId
                const productIdRaw = message.data.tabUrl.match(regexTabUrl);

                setProductId(parseInt(productIdRaw[1], 10))

                if (dataUrlFetch !== message.data.url)
                    // set Loading
                    setLoading(true)
                {

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

                    setLoading(false)
                } catch (error) {
                    console.log(error)
                }
            }
            fetch()
        }


    }, [dataUrlFetch])







    if (fetchedData && !loading) { return (


        <div className='box-shadow text-sm rounded-xl bg-white p-[20px] flex flex-col gap-y-4  mb-[24px]'>
           <div className='text-neutral-700 text-xl'>Раскладка по складам</div>
            <div className='text-neutral-700 text-lg'>Электросталь: <span>50 час.</span> <span className='inline-block h-5 w-5'><BoltIcon/></span></div>
            <div className='border-t-[1px] border-neutral-800'></div>
            <div className='flex items-center'><span className='flex-1'>Коледино</span><span>56 ч.</span><span>4 шт.</span></div>
            <div className='flex items-center text-red-700'><span className='flex-1'>Коледино</span><span>56 ч.</span><span>4 шт.</span></div>
            <div className='flex items-center'><span className='flex-1'>Коледино</span><span>56 ч.</span><span>4 шт.</span></div>
            <div className='flex items-center'><span className='flex-1'>Коледино</span><span>56 ч.</span><span>4 шт.</span></div>
        </div>


    ) } else {return (<></>)}
}

export default WarehouseComponent;





