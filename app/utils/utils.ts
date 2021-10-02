import moment from "moment"

export const DATE_FORMATS = {
  DD_MM_YYYY: "DD-MM-YYYY",
  hh_mm_ss: "hh:mm:ss",
  YYYY_MM_DD_hh_mm_ss: "YYYY-MM-DD hh:mm:ss",
  YYYY_MM_DD: "YYYY-MM-DD",
}

/**
 * Formatea una fecha
 * @param {object|string} date Fecha a formatear
 * @param {string} format Formato a aplicar
 * @returns {string} Fecha formateada
 */
export const formatDate = (date, format = DATE_FORMATS.YYYY_MM_DD) => moment(date).format(format)
