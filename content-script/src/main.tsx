
// @ts-ignore
import React from "react";
import CLDComponent from "./components/CLDComponent";
import WarehouseComponent from "./components/WarehouseComponent";
import { createRoot } from "react-dom/client";
import {useState} from "react";
import '../../src/main.css'
import App from "./App";






const check = setInterval(() => {

    if ( document.querySelector('.product-page__aside-container')) {





        const newElement = document.createElement('div');



        const parentElement =   document.querySelector('.product-page__aside-container')

// Check if there's an existing second child element
        const existingSecondChild = parentElement?.children[1];

// Insert the new element as the second child
        if (existingSecondChild) {
            parentElement.insertBefore(newElement, existingSecondChild);
        } else {
            parentElement.appendChild(newElement);
        }


        // const container = document.querySelector('.price-history__btn');
        const root = createRoot(newElement!);

        root.render(
            <React.StrictMode>
                <CLDComponent  />
            </React.StrictMode>
        );


        clearInterval(check)


    }

}, 100)

const checkSecond = setInterval(() => {

    if ( document.querySelector('.product-page__price-block--common')) {





        const newElement = document.createElement('div');



        const parentElement =   document.querySelector('.product-page__price-block--common')

// Check if there's an existing second child element
        const existingSecondChild = parentElement?.children[1];

// Insert the new element as the second child
        if (existingSecondChild) {
            parentElement.insertBefore(newElement, existingSecondChild);
        } else {
            parentElement.appendChild(newElement);
        }


        // const container = document.querySelector('.price-history__btn');
        const root = createRoot(newElement!);





        root.render(
            <React.StrictMode>
                <CLDComponent/>
            </React.StrictMode>
        );


        clearInterval(checkSecond)


    }

}, 100)



// const body = document.querySelector("body");
//
// const app = document.createElement("div");

// app.id = "root";

// Make sure the element that you want to mount the app to has loaded. You can
// also use `append` or insert the app using another method:
// https://developer.mozilla.org/en-US/docs/Web/API/Element#methods
//
// Also control when the content script is injected from the manifest.json:
// https://developer.chrome.com/docs/extensions/mv3/content_scripts/#run_time

//
// if (body) {
//   body.prepend(app);
// }

