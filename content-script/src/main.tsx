

import React from "react";
import CLDComponent from "./components/CLDComponent";
import WarehouseComponent from "./components/WarehouseComponent";
import { createRoot } from "react-dom/client";
import {useState} from "react";
import '../../src/main.css'
import App from "./App";

type objType = {
    parentDivClass: string,
    component: JSX.Element | undefined,
    type: 'asSecondChild' | 'inFirstChild'
}

type injectArrayType = objType[]




const injectArray: injectArrayType =
    [
        {parentDivClass: '.product-page__aside-container', component:  <CLDComponent/>, type: 'asSecondChild'},
        {parentDivClass: '.product-page__price-block--common', component:  <CLDComponent/>, type: 'inFirstChild'},
        {parentDivClass: '.product-page .product-page__aside-sticky', component:  <WarehouseComponent/>, type: 'asSecondChild'},
    ]



const injectComponent = (obj: objType) => {
    console.log('inject')
    const {parentDivClass, component, type} = obj
     const check = setInterval(() => {
         const parentElement =   document.querySelector(parentDivClass)
        if ( parentElement) {
            const newElement = document.createElement('div');


            if (type === 'asSecondChild') {

            // Check if there's an existing second child element
            const existingSecondChild = parentElement?.children[1];

            // Insert the new element as the second child
            if (existingSecondChild) {
                parentElement.insertBefore(newElement, existingSecondChild);
            } else {
                parentElement?.appendChild(newElement);
            }
            }

            if (type === 'inFirstChild') {
                const placeForInjection = parentElement.querySelector('div')
                placeForInjection?.appendChild(newElement)

            }

            // const container = document.querySelector('.price-history__btn');
            const root = createRoot(newElement!);

            root.render(component);

            clearInterval(check)

        }

    }, 50)

    return check
}



injectArray.forEach((item) => injectComponent(item))




