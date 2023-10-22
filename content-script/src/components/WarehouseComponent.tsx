/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
import {useState} from "react";
import {useEffect} from "react";
import axios from "axios";

import {TagIcon} from "@heroicons/react/24/solid";



import '../../../src/main.css'

const regexTabUrl = /\/(\d+)\/detail.aspx/;

let dataUrl
let currentId
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type === "URL") {
        currentId =  parseInt(message.data.tabUrl.match(regexTabUrl)[1],10)
        dataUrl = message.data.url
    }
});


function WarehouseComponent() {

    type dataType = {
        basicPriceU
            :
            number,
        basicSale
            :
            number,
        clientPriceU
            :
            number,
        clientSale
            :
            number
    }

    const  [urlForData, setUrlForData] = useState(dataUrl)
    const  [id, setId] = useState(currentId)
    const [fetchedData, setFetchedData] = useState<dataType>()

    useEffect(() => {


        const fetch = async () => {
            try {

                const res = await  axios.get(urlForData)
                setFetchedData(res.data.data.products.find((item) => item.id === id).extended)

            } catch (error) {
                console.log(error)
            }
        }
        fetch()
    }, [])



    return (

        <div className='mb-4 text-sm rounded-lg bg-neutral-50 px-4 py-4 text-base text-xl text-neutral-900 flex gap-x-3 items-center'>
            <div className='w-6 h-6 flex justify-center items-center'><TagIcon /></div>
            <div>
                <span className='text-sm text-gray-500'>СПП</span>
                {fetchedData?.clientSale}%</div>

            <div className='text-gray-500'>
                <span className='text-sm ml-3'>До СПП:</span>
                {parseInt(fetchedData?.basicPriceU.toString().slice(0, -2), 10)}&#8381;
            </div>
        </div>
    );
}

export default WarehouseComponent;





