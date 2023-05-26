import toast, { type Toast } from "react-hot-toast"
import { Info, X } from 'react-feather'

export const infoToast = (message: string) => {
  toast.custom((t: Toast) => (
    <>
      {(
        <div className="w-1/4 h-40 border-2 border-black bg-zinc-50 drop-shadow-xl dark:bg-zinc-900 dark:border-zinc-400">
          <div className="absolute h-full top-2 left-5">
            <Info className="w-12 h-12 p-1 text-black stroke-3 dark:text-white" />
          </div>
          <div
            onClick={() => {
              toast.remove(t.id)
            }}
            className="absolute cursor-pointer top-1 right-2"
          >
            <X className="w-10 h-10 p-1 text-black stroke-1 dark:text-white" />
          </div>
          <div className="p-3 ml-16 mt-0.5">
            <h2 className="text-3xl font-bold dark:text-white">Info</h2>
          </div>
          <p className="p-3 ml-4 text-lg font-bold text-ellipsis dark:text-white">{message}</p>
        </div>
      )}
    </>
  ))
}

