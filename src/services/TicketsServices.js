import Service from './Service'
import { RequestQueryBuilder } from '@nestjsx/crud-request'
import { API_URL } from '../config'

const resource = `${API_URL}/support/tickets`
const typeResource = `${API_URL}/support/ticket-types`

const token = localStorage.getItem('token')

export default {
    getNewTickets (itemsPerPage, page, pageNumber, keyWord) {
        const queryString = RequestQueryBuilder.create({
            search: {
                status: 0,
                name: { $contL: keyWord.name },
                phone: { $contL: keyWord.mobile },
            },
            // join: [{ field: 'user' }],
            page: page,
            limit: itemsPerPage,
            pageNumber: pageNumber,
            resetCache: true,
        }).query()
        return Service.get(`${resource}?${queryString}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.data.done) {
                return response.data
            }
        })
    },
    getPendingTickets (itemsPerPage, page, pageNumber, keyWord) {
        const queryString = RequestQueryBuilder.create({
            search: {
                status: 1,
                name: { $contL: keyWord.name },
                phone: { $contL: keyWord.mobile },
            },
            page: page,
            limit: itemsPerPage,
            pageNumber: pageNumber,
            resetCache: true,
        }).query()
        return Service.get(`${resource}?${queryString}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.data.done) {
                return response.data
            }
        })
    },
    getSolvedTickets (itemsPerPage, page, pageNumber, keyWord) {
        const queryString = RequestQueryBuilder.create({
            search: {
                status: 2,
                name: { $contL: keyWord.name },
                phone: { $contL: keyWord.mobile },
            },
            page: page,
            limit: itemsPerPage,
            pageNumber: pageNumber,
            resetCache: true,
        }).query()
        return Service.get(`${resource}?${queryString}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.data.done) {
                return response.data
            }
        })
    },
    getClosedTickets (itemsPerPage, page, pageNumber, keyWord) {
        const queryString = RequestQueryBuilder.create({
            search: {
                status: 3,
                name: { $contL: keyWord.name },
                phone: { $contL: keyWord.mobile },
            },
            page: page,
            limit: itemsPerPage,
            pageNumber: pageNumber,
            resetCache: true,
        }).query()
        return Service.get(`${resource}?${queryString}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.data.done) {
                return response.data
            }
        })
    },
    pendTickets (ticketId) {
        return Service.patch(`${resource}/${ticketId}`, {
            status: 1,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.data.done) {
                return true
            }
        })
    },
    solveTickets (ticketId) {
        return Service.patch(`${resource}/${ticketId}`, {
            status: 2,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.data.done) {
                return true
            }
        })
    },
    closeTickets (ticketId) {
        return Service.patch(`${resource}/${ticketId}`, {
            status: 3,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.data.done) {
                return true
            }
        })
    },
    getAllTicketsType (itemsPerPage, page, pageNumber) {
        const queryString = RequestQueryBuilder.create({
            search: {},
            page: page,
            limit: itemsPerPage,
            pageNumber: pageNumber,
            resetCache: true,
        }).query()

        return Service.get(`${typeResource}?${queryString}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.data.done) {
                return response.data
            }
        })
    },
    createTicketType (ticketTypeData) {
        return Service.post(`${typeResource}`, {
            ...ticketTypeData,
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
    updateType (ticketTypeId, ticketTypeData) {
        return Service.patch(`${typeResource}/${ticketTypeId}`, {
            ...ticketTypeData,
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
