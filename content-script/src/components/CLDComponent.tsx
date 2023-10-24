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




let fetchData: dataType
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.type === "PRODUCTS_PAYLOAD") {
            fetchData = message.data.payload
        }
});


function CLDComponent() {





    const [dataUrlFetch, setDataUrlFetch] = useState<string>("");
    const [productId, setProductId] = useState<number | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState<dataType>(fetchData)







    useEffect(() => {
        // Listen for every update of URL from BG and update urlForDataFetch and productId

        const messageListener = (message: any) => {

            if (message.type === "PRODUCTS_PAYLOAD") {
                    setData(message.data.payload)

            }
        };
        chrome.runtime.onMessage.addListener(messageListener);

        return () => chrome.runtime.onMessage.removeListener(messageListener)
    }, []);






console.log('rendered')

    return (


        <div className='mb-4 text-sm rounded-lg bg-[#F6F6F9] px-4 py-4 text-base text-xl text-neutral-900 flex gap-x-3 items-center'>
            <div className='w-6 h-6 flex justify-center items-center'><TagIcon /></div>
            <div>
                <span className='text-sm text-gray-500'>СПП</span>
                {data?.clientSale}%</div>

            <div className='text-gray-500'>
                <span className='text-sm ml-3'>До СПП:</span>
                {data.basicPriceU ?   parseInt(data?.basicPriceU.toString().slice(0, -2), 10) : null}&#8381;
            </div>
        </div>


    )
}

export default CLDComponent;





