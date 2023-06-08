import { errorToast } from "./errorToast"
import { successToast } from "./successToast"
import { infoToast } from "./infoToast"

const displayErrorToast = (message: string) => { errorToast(message) }
const displaySuccessToast = (message: string) => { successToast(message) }
const displayInfoToast = (message: string) => { infoToast(message) }

export const ToastService = {
  error: displayErrorToast,
  success: displaySuccessToast,
  info: displayInfoToast
}
