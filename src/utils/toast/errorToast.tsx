import toast from "react-hot-toast";
import { X } from 'react-feather';

export const errorToast = (message:string) => {

  toast.custom((t) => (
    <div className={"bg-white w-1/4 drop-shadow-lg rounded"}>
      <div className={"h-full w-2 bg-rose-500 flex rounded-l"}>
        <div className={"h-full absolute top-6 left-7"}>
          <X className={"w-max rounded-full bg-rose-500 text-white p-1 stroke-5 scale-125"}/>
        </div>
        <div className={"p-3 ml-16"}>
          <h2 className={"font-bold text-lg"}>Error</h2>
          <p className="text-ellipsis w-72">
            {message}
          </p>
        </div>
      </div>
    </div>
  ))
}

