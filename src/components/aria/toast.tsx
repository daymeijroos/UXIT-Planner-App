import React from 'react';
import {useState} from "react";
import { AlertOctagon, X } from 'react-feather';

interface ToastProps {
  title: string;
  msg: string;
  type: number;

  seconds?: number;
}

const Toast: React.FC<ToastProps> = ({children, title ,msg, type, seconds}) => {

  const [shown, setShown] = useState(true);
  const [opacity, setOpacity] = useState(false);
  const [up, setUp] = useState(false);

  if (seconds != undefined){
    setTimeout(() =>{
      setUp(true);
    },seconds/1.02)
  }

  if (seconds != undefined){
    setTimeout(() =>{
      setOpacity(true);
    },seconds/1.07)
  }

  if (seconds != undefined){
    setTimeout(() =>{
      setOpacity(false);
      setShown(false);
    },seconds)
  }
  function handleClick(){
    setShown(false)
  }



  return (
    <>
      {shown && (
      <div className={`absolute w-96 bottom-5 right-5 h-1/5 bg-black p-0.5 select-none rounded ${opacity ? "opacity-60" : ""} ${up ? "bottom-10" : ""}`}>
        <div className={`p-2.5 h-full rounded ${type === 0 ? "bg-gray-100" : type === 1 ? "bg-green-300" : type == 2 ? "bg-red-400" : ""}`}>
        <AlertOctagon className={"absolute top-5 left-5 w-10 h-10 inline-block  "} />
          <X onClick={handleClick} className={"absolute right-4 w-8 h-8 cursor-pointer"}/>
          <p className={"absolute top-5 left-16 text-3xl font-bold ml-2"}>{title}</p>
          <h1 className={"absolute top-20 left-7 text-xl font-bold"}>{msg}</h1>
        </div>
      </div>
      )}
    </>
  );
};

export default Toast;

