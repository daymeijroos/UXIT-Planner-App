import toast, { type Toast } from "react-hot-toast"
import { CheckSquare, X } from 'react-feather'

export const successToast = (message: string) => {

  toast.custom((t: Toast) => (
    <div className="flex flex-col w-full max-w-sm gap-4 p-4 bg-teal-500 border-2 border-black dark:bg-teal-300 dark:border-teal-400 drop-shadow-xl">
      <div className="flex justify-between">
        <span className="flex items-center gap-4">
          <CheckSquare size={30} />
          <h2>Gelukt!</h2>
        </span>
        <X size={30} className="cursor-pointer" onClick={() => { toast.remove(t.id) }} />
      </div>
      <p className="text-ellipsis">{message}</p>
    </div>
  ))
}

