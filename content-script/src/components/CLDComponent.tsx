/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
import {useState} from "react";
import {useEffect} from "react";
import {RocketLaunchIcon, TagIcon} from "@heroicons/react/24/solid";
import '../../../src/main.css'

type dataType = { basicPriceU: number,
    basicSale: number,
    clientPriceU: number,
    clientSale: number }


let fetchData: dataType
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type === "COMBINED_PAYLOAD") {
        fetchData = message.data.productsPayload.payload
    }
});


function CLDComponent() {

    const [data, setData] = useState<dataType>(fetchData)
    useEffect(() => {
        // Listen for every update of URL from BG and update urlForDataFetch and productId
        const messageListener = (message: any) => {

            if (message.type === "COMBINED_PAYLOAD") {
                setData(message.data.productsPayload.payload)
            }
        };
        chrome.runtime.onMessage.addListener(messageListener);

        return () => chrome.runtime.onMessage.removeListener(messageListener)
    }, []);

if (data) {
    return (
        <div
            className='mb-4 text-sm rounded-lg bg-[#F6F6F9] px-4 py-4 text-base text-xl text-neutral-900 flex gap-x-3 items-center min-w-[300px]'>
            <div className='w-6 h-6 flex justify-center items-center text-teal-200'><RocketLaunchIcon/></div>
            <div>
                <span className='text-sm text-gray-500 font-medium'>СПП</span>
                &nbsp;
                <span className='text-xl font-black'>{data?.clientSale}%</span>
            </div>
            <div className='text-gray-500'>
                <span className='text-sm ml-3 font-medium'>До СПП:</span>
                {data.basicPriceU ? parseInt(data?.basicPriceU?.toString()?.slice(0, -2), 10) : null}&#8381;
            </div>
        </div>


    )
} else {return (<></>)}
}

export default CLDComponent;