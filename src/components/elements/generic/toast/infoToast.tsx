import toast, { type Toast } from "react-hot-toast"
import { Info, X } from 'react-feather'
import React from 'react'

export const infoToast = (message: string) => {
  toast.custom((t: Toast) => (
    <div className="flex flex-col w-full max-w-sm gap-4 p-4 border-2 border-black dark:border-blue-gray-600 drop-shadow-xl">
      <div className="flex justify-between">
        <span className="flex items-center gap-4">
          <Info size={30} />
          <h2>Info</h2>
        </span>
        <X size={30} className="cursor-pointer" onClick={() => { toast.remove(t.id) }} />
      </div>
      <p className="text-ellipsis">{message}</p>
    </div>
  ))
}

