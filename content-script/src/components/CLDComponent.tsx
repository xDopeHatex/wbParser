/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
import {useState} from "react";
import {useEffect} from "react";
import {TagIcon} from "@heroicons/react/24/solid";
import '../../../src/main.css'

type dataType = { basicPriceU: number,
    basicSale: number,
    clientPriceU: number,
    clientSale: number }


// let fetchData: dataType
// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//         if (message.type === "PRODUCTS_PAYLOAD") {
//             fetchData = message.data.payload
//         }
// });





function CLDComponent() {

    const [data, setData] = useState<dataType>()

    useEffect(() => {
        const listener = () => {
            chrome.storage.local.get(["storageChange"], (result) => {
                console.log(result, 'LISYENER')
                setData(result.storageChange);
            })
        };
        chrome.storage.onChanged.addListener(listener);

        chrome.storage.local.get(["storageChange"], (result) => {

            setData(result.storageChange);
            console.log(result.storageChange)
        })

        return () => {
            chrome.storage.onChanged.removeListener(listener);
        };
    }, []);






    return (
        <div className='mb-4 text-sm rounded-lg bg-[#F6F6F9] px-4 py-4 text-base text-xl text-neutral-900 flex gap-x-3 items-center'>
            <div className='w-6 h-6 flex justify-center items-center'><TagIcon /></div>
            <div>
                <span className='text-sm text-gray-500'>СПП</span>
                {data?.clientSale}%</div>
            <div className='text-gray-500'>
                <span className='text-sm ml-3'>До СПП:</span>
                {data?.basicPriceU ?   parseInt(data.basicPriceU.toString().slice(0, -2), 10) : null}&#8381;
            </div>
        </div>


    )
}

export default CLDComponent;



//

//


