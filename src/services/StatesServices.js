import Service from './Service'
// import { RequestQueryBuilder } from '@nestjsx/crud-request'
import { API_URL } from '../config'

const resource = `${API_URL}/drivers/stats`
const shipmentResource = `${API_URL}/shipments/stats`
const token = localStorage.getItem('token')

export default {
    getAllActivateDrivers (startDate, endDate) {
        return Service.get(`${resource}`, {
            params: {
                fromDate: startDate,
                toDate: endDate,
                approved: true,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.data.done) {
                return response.data.data
            }
        })
    },
    getAllRejectiedDrivers (startDate, endDate) {
        return Service.get(`${resource}`, {
            params: {
                fromDate: startDate,
                toDate: endDate,
                isRejected: true,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.data.done) {
                return response.data.data
            }
        })
    },
    getAllPendingDrivers (startDate, endDate) {
        return Service.get(`${resource}`, {
            params: {
                fromDate: startDate,
                toDate: endDate,
                isRejected: false,
                approved: false,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.data.done) {
                return response.data.data
            }
        })
    },
    // Shipments
    getAllPendingShipments (startDate, endDate) {
        return Service.get(`${shipmentResource}`, {
            params: {
                fromDate: startDate,
                toDate: endDate,
                condition: 0,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.data.done) {
                return response.data.data
            }
        })
    },
    getAllRejectedShipments (startDate, endDate) {
        return Service.get(`${shipmentResource}`, {
            params: {
                fromDate: startDate,
                toDate: endDate,
                condition: 2,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.data.done) {
                return response.data.data
            }
        })
    },
    getAllstateShipments (status, startDate, endDate, condition) {
        return Service.get(`${shipmentResource}`, {
            params: {
                fromDate: startDate,
                toDate: endDate,
                status: status,
                condition: condition,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.data.done) {
                return response.data.data
            }
        })
    },
}
