import { URL_BACK } from "../../config/consts"

export const CERTIFICATE_EDIT = URL_BACK + "/certificate/"
export const CERTIFICATE_LIST_APPROVE = URL_BACK + "/certificate/list_to_approve"
export const CERTIFICATE_UPDATE_STATUS = URL_BACK + "/certificate/status/:status/:id"

export const CERTIFICATE_URL_STATUS_APPROVED = URL_BACK + "/certificate/status/approved/"
export const CERTIFICATE_URL_STATUS_REJECTED = URL_BACK + "/certificate/status/rejected/"

export const CERTIFICATE_CHECKING = "CERTIFICATE_CHECKING"
export const CERTIFICATE_APPROVED = "CERTIFICATE_APPROVED"
export const CERTIFICATE_REJECTED = "CERTIFICATE_REJECTED"
