
// @ts-ignore
import React from "react";
import CLDComponent from "./components/CLDComponent";
import WarehouseComponent from "./components/WarehouseComponent";
import { createRoot } from "react-dom/client";
import {useState} from "react";
import '../../src/main.css'
import App from "./App";






const check = setInterval(() => {

    if ( document.querySelector('.product-page__aside')) {


        document.querySelector('.product-page__aside')




        const container = document.querySelector('.price-history__btn');
        const root = createRoot(container!);

        root.render(
            <React.StrictMode>
                <CLDComponent  />
            </React.StrictMode>
        );


        clearInterval(check)


    }

}, 100)

const checkSecond = setInterval(() => {

    if ( document.querySelector('.details-section__header-wrap')) {





        console.log('2check')

        const container = document.querySelector('.details-section__header-wrap');
        const root = createRoot(container!);

        root.render(
            <React.StrictMode>
                <WarehouseComponent/>
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

