import toast, { Toast } from "react-hot-toast";
import { AlertOctagon, X } from 'react-feather';

export const errorToast = (message: string) => {
  toast.custom((t: Toast) => (
    <>
      {(
        <div className="bg-red-400 w-1/4 h-40 drop-shadow-xl border-black border-2 dark:bg-red-600 dark:border-red-400">
          <div className="h-full absolute top-2 left-5">
            <AlertOctagon className="w-12 h-12 text-black p-1 stroke-3 dark:text-white" />
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
            <h2 className="font-bold text-3xl dark:text-white">Error</h2>
          </div>
          <p className="text-ellipsis p-3 ml-4 text-lg font-bold dark:text-white">{message}</p>
        </div>
      )}
    </>
  ))
}

