import toast, { type Toast } from "react-hot-toast"
import { AlertOctagon, X } from 'react-feather'
import React from 'react'

export const errorToast = (message: string) => {
  toast.custom((t: Toast) => (
    <div className="flex flex-col w-full max-w-sm gap-4 p-4 bg-red-500 border-2 border-black dark:bg-red-300 dark:border-red-400 drop-shadow-xl">
      <div className="flex justify-between">
        <span className="flex items-center gap-4">
          <AlertOctagon size={30} />
          <h2>Oops!</h2>
        </span>
        <X size={30} className="cursor-pointer" onClick={() => { toast.remove(t.id) }} />
      </div>
      <p className="text-ellipsis">{message}</p>
    </div>
  ))
}

