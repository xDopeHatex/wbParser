/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
import {useState} from "react";
import {useEffect} from "react";
import axios from "axios";


import {BoltIcon} from "@heroicons/react/24/solid";


type dataType = any


let fetchDataStock: dataType
let fetchDataWHNames: dataType
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    // if (message.type === "WAREHOUSE_STOCK_PAYLOAD") {
    //     fetchDataStock = message.data.payload
    //     console.log('fetchData', fetchDataStock)
    // }

    if (message.type === "WAREHOUSE_NAME_PAYLOAD") {
        fetchDataWHNames = message.data.payload
        console.log('fetchDataWH', fetchDataWHNames)
    }

});


function WarehouseComponent() {

    const [data, setData] = useState<dataType>(fetchDataStock)
    useEffect(() => {
        // Listen for every update of URL from BG and update urlForDataFetch and productId
        const messageListener = (message: any) => {

            if (message.type === "WAREHOUSE_STOCK_PAYLOAD") {
                setData(message.data.payload)
            }
        };
        chrome.runtime.onMessage.addListener(messageListener);

        return () => chrome.runtime.onMessage.removeListener(messageListener)
    }, []);



  return (


        <div className='box-shadow text-sm rounded-xl bg-white p-[20px] flex flex-col gap-y-4  mb-[24px]'>
           <div className='text-neutral-700 text-xl'>Раскладка по складам</div>
            <div className='text-neutral-700 text-lg'>Электросталь: <span>50 час.</span> <span className='inline-block h-5 w-5'><BoltIcon/></span></div>
            <div className='border-t-[1px] border-neutral-800'></div>
            <div className='flex items-center'><span className='flex-1'>Коледино</span><span>56 ч.</span><span>4 шт.</span></div>
            <div className='flex items-center text-red-700'><span className='flex-1'>Коледино</span><span>56 ч.</span><span>4 шт.</span></div>
            <div className='flex items-center'><span className='flex-1'>Коледино</span><span>56 ч.</span><span>4 шт.</span></div>
            <div className='flex items-center'><span className='flex-1'>Коледино</span><span>56 ч.</span><span>4 шт.</span></div>
        </div>


    )
}

export default WarehouseComponent;





