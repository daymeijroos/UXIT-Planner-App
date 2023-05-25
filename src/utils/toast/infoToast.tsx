import toast, { Toast } from "react-hot-toast";
import { Info, X } from 'react-feather';

export const infoToast = (message: string) => {
  toast.custom((t: Toast) => (
    <>
      {(
        <div className="bg-zinc-50 w-1/4 h-40 drop-shadow-xl border-black border-2 dark:bg-zinc-900 dark:border-zinc-400">
          <div className="h-full absolute top-2 left-5">
            <Info className="w-12 h-12 text-black p-1 stroke-3 dark:text-white" />
          </div>
          <div
            onClick={() => {
              toast.remove(t.id);
            }}
            className="cursor-pointer absolute top-1 right-2"
          >
            <X className="w-10 h-10 text-black p-1 stroke-1 dark:text-white" />
          </div>
          <div className="p-3 ml-16 mt-0.5">
            <h2 className="font-bold text-3xl dark:text-white">Info</h2>
          </div>
          <p className="text-ellipsis p-3 ml-4 text-lg font-bold dark:text-white">{message}</p>
        </div>
      )}
    </>

  ))
}

