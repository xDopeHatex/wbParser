/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
import {useState} from "react";
import {useEffect} from "react";
import axios from "axios";


import {BoltIcon} from "@heroicons/react/24/solid";


type dataType = any

let fetchedRawPayload: any
let fetchFinalData: any




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

        const allWarehouses: any = []
        const dataToWork = [...final]
        dataToWork.forEach((size:any) => size.forEach((wh:any) => allWarehouses.push(wh)))
        const sortedAllWarehouses: any = [];

        for (let i = 0; i < allWarehouses.length; i++) {
            const whInWork: any = { ...allWarehouses[i], name : 1036, };

            const existingWarehouseIndex = sortedAllWarehouses.findIndex((wh: any) => wh.wh === whInWork.wh);

            if (existingWarehouseIndex !== -1) {

                sortedAllWarehouses[existingWarehouseIndex].qty += whInWork.qty;
            } else {

                sortedAllWarehouses.push(whInWork);
            }
        }

        fetchedRawPayload = fetchRaw
        fetchFinalData = [...final, sortedAllWarehouses]



















        chrome.runtime.onMessage.removeListener(handleMessage);

    }
}
chrome.runtime.onMessage.addListener(handleMessage);

function WarehouseComponent() {

    const [data, setData] = useState<any>(fetchFinalData)
    const [rawData, setRawData] = useState<any>(fetchedRawPayload)
    const [sizeActive, setSizeActive] = useState<any>(1036)


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

                const allWarehouses: any = []
                const dataToWork = [...final]
                dataToWork.forEach((size:any) => size.forEach((wh:any) => allWarehouses.push(wh)))
                const sortedAllWarehouses: any = [];

                for (let i = 0; i < allWarehouses.length; i++) {
                    const whInWork: any = { ...allWarehouses[i], name : 1036, };

                    const existingWarehouseIndex = sortedAllWarehouses.findIndex((wh: any) => wh.wh === whInWork.wh);

                    if (existingWarehouseIndex !== -1) {

                        sortedAllWarehouses[existingWarehouseIndex].qty += whInWork.qty;
                    } else {

                        sortedAllWarehouses.push(whInWork);
                    }
                }


                 setData([...final, sortedAllWarehouses])
                 setRawData(raw)
                setSizeActive(1036)
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

    const allSizesHandler = () => {
            setSizeActive(1036)
    }


    if (data && rawData && sizeActive) {
        const fastestWarehouse = data.map((sizes: any) => sizes.filter((item: any) => item.name == sizeActive )).filter((arr:any) => arr.length !== 0 )[0][0]
        const allWarehousesArr = data.map((sizes: any) => sizes.filter((item: any) => item.name == sizeActive )).filter((arr:any) => arr.length !== 0 )[0]


        return  (


        <div className='mediaQueriesLg text-sm rounded-xl bg-white lg:p-[20px] flex flex-col gap-y-4  mb-[24px] mt-[24px] '>
            <div className='text-neutral-700 text-xl font-semibold'>Раскладка по складам</div>
            <div className='flex items-center gap-3  flex-wrap'>
                <button onClick={allSizesHandler}  className={`rounded-lg button-border-style py-[3px] px-[12px] flex flex-col  ${ sizeActive == 1036 ? "active-button-size  hover:border-teal-500 hover:outline-4 cursor-pointer" :  ' hover:border-teal-500 hover:outline-4 cursor-pointer'  }`} ><span>все</span><span className="text-neutral-400">размеры</span></button>
                {rawData.map((size: any) =>  <button key={size.name} onClick={() => activeSizeHandler(size.stocks.length, size.name)}  className={`rounded-lg  py-[3px] px-[12px] flex flex-col  ${size.stocks?.length === 0 ? ' cursor-not-allowed  bg-neural-400 disabled-button-bg' :    sizeActive == size.name ? "active-button-size  hover:border-teal-500 hover:outline-4 cursor-pointer" :  ' button-border-style hover:border-teal-500 hover:outline-4 cursor-pointer'  }`} ><span className={`${size?.stocks.length === 0 ? "disabled-text-color" :  '' }`}>{size?.origName}</span><span className={`text-xs ${size?.stocks?.length !== 0 ? "text-neutral-400" : 'disabled-text-color'}`}>{size?.name}</span></button> )}</div>
            {<div className='text-neutral-700 text-lg font-medium'>{fastestWarehouse?.whName}: <span>{fastestWarehouse?.time1 + fastestWarehouse?.time2} час.</span> <span className='inline-block h-5 w-5 text-teal-200'><BoltIcon/></span></div> }
            <div className='border-t-[1px] border-teal-200'></div>
            {allWarehousesArr?.map((item:any) =>  <div key={item.wh} className='flex max-w-[400px] items-center'><span className='flex-1'>{item?.whName}</span><div  className='w-[40%] flex justify-between'><span className='font-medium'>{item?.time1 + item?.time2} ч.</span><span>{item?.qty} шт.</span></div></div>)}
        </div>


    ) } else {return <></>}
}

export default WarehouseComponent;