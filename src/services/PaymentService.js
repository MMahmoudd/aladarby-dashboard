import Service from './Service'
import { API_URL } from '../config'

import { RequestQueryBuilder } from '@nestjsx/crud-request'

const creditResource = `${API_URL}/payments/commition/credit`
const debitResource = `${API_URL}/payments/commition/debit`
const sendDriverProfitResource = `${API_URL}/drivers/send-profit`
const transfersResource = `${API_URL}/payments/transfers`
const confirmTransfers = `${API_URL}/payments/transfers/confirm`
const historyRessource = `${API_URL}/payments`
const token = localStorage.getItem('token')
// const blockResource = 'https://www.aladarbi.app/api/v2/users/block'
// const notifiRessource = 'https://www.aladarbi.app/api/v2/users/send-notification'

export default {
  getCreditDrivers (itemsPerPage, page, pageNumber) {
    const queryString = RequestQueryBuilder.create({
      search: {},
      page: page,
      limit: itemsPerPage,
      pageNumber: pageNumber,
      resetCache: true,
    }).query()
    return Service.get(`${creditResource}?${queryString}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      if (response.data.done) {
        return response.data
      }
    })
  },
  getDebitDrivers (itemsPerPage, page, pageNumber) {
    const queryString = RequestQueryBuilder.create({
      search: {},
      page: page,
      limit: itemsPerPage,
      pageNumber: pageNumber,
      resetCache: true,
    }).query()
    return Service.get(`${debitResource}?${queryString}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      if (response.data.done) {
        return response.data
      }
    })
  },
  getUnConfirmedTransfers (itemsPerPage, page, pageNumber) {
    const queryString = RequestQueryBuilder.create({
      search: { confirmed: false },
      page: page,
      limit: itemsPerPage,
      pageNumber: pageNumber,
      resetCache: true,
    }).query()
    return Service.get(`${transfersResource}?${queryString}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      if (response.data.done) {
        return response
      }
    })
  },
  getTransformsHistory (itemsPerPage, page, pageNumber) {
    const queryString = RequestQueryBuilder.create({
      search: { confirmed: true },
      page: page,
      limit: itemsPerPage,
      pageNumber: pageNumber,
      resetCache: true,
    }).query()
    return Service.get(`${historyRessource}?${queryString}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      if (response.data.done) {
        return response.data
      }
    })
  },
  sendProfit (amount) {
    return Service.post(`${sendDriverProfitResource}`, {
      driverId: amount.driver.id,
      amount: parseFloat(amount.amount),
      bankName: amount.driver.bankName,
      transactionRef: amount.ref,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      if (response.data.done) {
        return response.data
      }
    })
  },
  confirmTransfers (transaction) {
    return Service.patch(`${confirmTransfers}/${transaction}`, {
      confirmed: true,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      if (response.data.done) {
        return response.data
      }
    })
  },
  unConfirmTransfers (transaction) {
    return Service.patch(`${confirmTransfers}/${transaction}`, {
      confirmed: false,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      if (response.data.done) {
        return response.data
      }
    })
  },
}
