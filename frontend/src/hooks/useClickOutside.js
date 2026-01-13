import { useEffect, useRef } from "react";

export default function useClickOutside (onClickOutside){
    const domElement = useRef()
    useEffect(()=>{
        const eventListener = (event)=>{
            if(domElement.current && !domElement.current.contains(event.target)){
                onClickOutside()
            }
        }
    document.addEventListener("mousedown", eventListener);
    return () => document.removeEventListener("mousedown", eventListener);
    },[onClickOutside])

    return domElement;
}
