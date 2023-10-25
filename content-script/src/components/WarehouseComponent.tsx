/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
import {useState} from "react";
import {useEffect} from "react";
import axios from "axios";


import {BoltIcon} from "@heroicons/react/24/solid";


type dataType = any

let fetchedRawPayload: any
let fetchFinalData: any
let firstSizeActive: any


function handleMessage(message: any) {
    if (message.type === "COMBINED_PAYLOAD") {
        const fetchNames = message.data.warehousePayload?.names;
        const preFetchRaw = message.data.warehousePayload.payload;


        const preFinal = preFetchRaw?.sizes?.map((size: any) => size?.stocks?.map((warehouse: any) => {
            const whName = fetchNames.find((whNames: any) => warehouse.wh === whNames.id);
            return whName ? { ...warehouse, whName: whName?.name?.substring(0, whName?.name?.length - 3), name: size?.name, origName: size?.origName  } : null;
        }))

        const final = preFinal.map((arr: any) => arr.sort((a:any , b:any) => b.priority - a.priority))


        const fetchRaw = preFetchRaw.sizes.sort((a:any , b:any) => a.name - b.name)





        fetchedRawPayload = fetchRaw
        fetchFinalData = final


        firstSizeActive =  final.find((size: any) => size?.length > 0 )[0].name
        console.log(firstSizeActive, 'yeeee')
        console.log('raw', fetchedRawPayload)
        console.log('final', fetchFinalData)





        chrome.runtime.onMessage.removeListener(handleMessage);

    }
}
chrome.runtime.onMessage.addListener(handleMessage);

function WarehouseComponent() {

    const [data, setData] = useState<any>(fetchFinalData)
    const [rawData, setRawData] = useState<any>(fetchedRawPayload)
    const [sizeActive, setSizeActive] = useState<any>(firstSizeActive)


    useEffect(() => {
        // Listen for every update of URL from BG and update urlForDataFetch and productId
        const messageListener = (message: any) => {

            if (message.type === "COMBINED_PAYLOAD") {
                const names = message.data.warehousePayload.names
                const preRaw = message.data.warehousePayload.payload

                const preFinal = preRaw.sizes.map((size: any) => size.stocks.map((warehouse: any) => {
                    const whName = names.find((whNames: any) => warehouse.wh === whNames.id);
                    return whName ? { ...warehouse, whName: whName.name.substring(0, whName.name.length - 3), name: size.name, origName: size.origName } : null;
                }))

                const raw = preRaw.sizes.sort((a:any , b:any) => a.name - b.name)
                const final = preFinal.map((arr: any) => arr.sort((a:any , b:any) => a.priority - b.priority))


                 setData(final)
                 setRawData(raw)
                setSizeActive(final.find((size: any) => size?.stocks?.length !== 0 )[0].name)
                console.log(rawData, 'rawState')
                console.log(data, 'dataState')


                // const fuck = data.map((sizes: any) => sizes.filter((item: any) => item.name == sizeData.name )).filter((arr:any) => arr.length !== 0 )
                // console.log(fuck, 'kkkdf')

            }

        };
        chrome.runtime.onMessage.addListener(messageListener);

        return () => chrome.runtime.onMessage.removeListener(messageListener)
    }, []);

    const activeSizeHandler = (qty: number, size: any ) => {

        if (qty > 0) {

            setSizeActive(size)
        }

    }


    if (data && rawData && sizeActive) {
        const fastestWarehouse = data.map((sizes: any) => sizes.filter((item: any) => item?.name == sizeActive )).filter((arr:any) => arr.length !== 0 )[0][0]
        const allWarehousesArr = data.map((sizes: any) => sizes.filter((item: any) => item?.name == sizeActive )).filter((arr:any) => arr.length !== 0 )[0]


        return  (


        <div className='mediaQueriesLg text-sm rounded-xl bg-white lg:p-[20px] flex flex-col gap-y-4  mb-[24px] mt-[24px] '>
            <div className='text-neutral-700 text-xl'>Раскладка по складам</div>
            <div className='flex items-center gap-3  flex-wrap'>{rawData.map((size: any) =>  <button key={size.name} onClick={() => activeSizeHandler(size.stocks.length, size.name)}  className={`rounded-lg button-border-style py-[3px] px-[12px] flex flex-col  ${size.stocks?.length === 0 ? ' cursor-not-allowed  bg-neural-400 disabled-button-bg' :    sizeActive == size.name ? "active-button-size  hover:border-teal-500 hover:outline-4 cursor-pointer" :  ' hover:border-teal-500 hover:outline-4 cursor-pointer'  }`} ><span className={`${size?.stocks.length === 0 ? "disabled-text-color" :  '' }`}>{size?.origName}</span><span className={`text-xs ${size?.stocks?.length !== 0 ? "text-neutral-400" : 'disabled-text-color'}`}>{size?.name}</span></button> )}</div>
            {<div className='text-neutral-700 text-lg'>{fastestWarehouse?.whName}: <span>{fastestWarehouse?.time1 + fastestWarehouse?.time2} час.</span> <span className='inline-block h-5 w-5 text-teal-200'><BoltIcon/></span></div> }
            <div className='border-t-[1px] border-teal-200'></div>
            {allWarehousesArr?.map((item:any) =>  <div key={item?.wh} className='flex items-center'><span className='flex-1'>{item?.whName}</span><span>{item?.time1 + item?.time2} ч.</span><span>{item?.qty} шт.</span></div>)}
        </div>


    ) } else {return <></>}
}

export default WarehouseComponent;