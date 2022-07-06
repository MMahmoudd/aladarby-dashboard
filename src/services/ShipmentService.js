// import axios from 'axios'
import Service from './Service'
import { RequestQueryBuilder } from '@nestjsx/crud-request'
import { API_URL } from '../config'

const resource = `${API_URL}/shipments`
const resourceType = `${API_URL}/package-types`
const token = localStorage.getItem('token')
// const token = JSON.parse(sessionStorage.getItem('data'))

export default {
    getNewShipments (itemsPerPage, page, pageNumber, keyWord) {
        const queryString = RequestQueryBuilder.create({
            search: {
                status: 0,
                condition: 1,
                'sender.user.userName': { $contL: keyWord.senderName },
                'sender.user.mobile': { $contL: keyWord.senderMobile },
                'driver.user.userName': { $contL: keyWord.driverName },
                'driver.user.mobile': { $contL: keyWord.driverMobile },
            },
            page: page,
            limit: itemsPerPage,
            pageNumber: pageNumber,
            sort: [{ field: 'id', order: 'DESC' }],
            // filter: { field: 'sender.user.userName', operator: '$cont', value: keyWord.senderName } ||
            // { field: 'sender.user.mobile', operator: '$cont', value: keyWord.senderMobile } ||
            // { field: 'driver.user.userName', operator: '$cont', value: keyWord.driverName } ||
            // { field: 'driver.user.mobile', operator: '$cont', value: keyWord.driverMobile },
            // or: { field: 'driver.user.userName', operator: '$cont', value: keyWord },
            // or: { field: 'driver.user.mobile', operator: '$cont', value: keyWord },

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
    getWithDriverShipments (itemsPerPage, page, pageNumber, keyWord) {
        const queryString = RequestQueryBuilder.create({
            search: {
                status: 1,
                'sender.user.userName': { $contL: keyWord.senderName },
                'sender.user.mobile': { $contL: keyWord.senderMobile },
                'driver.user.userName': { $contL: keyWord.driverName },
                'driver.user.mobile': { $contL: keyWord.driverMobile },
            },
            join: [],
            page: page,
            limit: itemsPerPage,
            pageNumber: pageNumber,
            sort: [{ field: 'id', order: 'DESC' }],
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
    getShippedShipments (itemsPerPage, page, pageNumber, keyWord) {
        const queryString = RequestQueryBuilder.create({
            search: {
                status: 2,
                'sender.user.userName': { $contL: keyWord.senderName },
                'sender.user.mobile': { $contL: keyWord.senderMobile },
                'driver.user.userName': { $contL: keyWord.driverName },
                'driver.user.mobile': { $contL: keyWord.driverMobile },
            },
            join: [],
            page: page,
            limit: itemsPerPage,
            pageNumber: pageNumber,
            sort: [{ field: 'id', order: 'DESC' }],
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
    getInWayShipments (itemsPerPage, page, pageNumber, keyWord) {
        const queryString = RequestQueryBuilder.create({
            search: {
                status: 3,
                'sender.user.userName': { $contL: keyWord.senderName },
                'sender.user.mobile': { $contL: keyWord.senderMobile },
                'driver.user.userName': { $contL: keyWord.driverName },
                'driver.user.mobile': { $contL: keyWord.driverMobile },
            },
            join: [],
            page: page,
            limit: itemsPerPage,
            pageNumber: pageNumber,
            sort: [{ field: 'id', order: 'DESC' }],
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
    getDeliveredShipments (itemsPerPage, page, pageNumber, keyWord) {
        const queryString = RequestQueryBuilder.create({
            search: {
                status: 4,
                'sender.user.userName': { $contL: keyWord.senderName },
                'sender.user.mobile': { $contL: keyWord.senderMobile },
                'driver.user.userName': { $contL: keyWord.driverName },
                'driver.user.mobile': { $contL: keyWord.driverMobile },
            },
            join: [],
            page: page,
            limit: itemsPerPage,
            pageNumber: pageNumber,
            sort: [{ field: 'id', order: 'DESC' }],
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
    getCanceledShipments (itemsPerPage, page, pageNumber, keyWord) {
        const queryString = RequestQueryBuilder.create({
            search: {
                status: 5,
                'sender.user.userName': { $contL: keyWord.senderName },
                'sender.user.mobile': { $contL: keyWord.senderMobile },
                'driver.user.userName': { $contL: keyWord.driverName },
                'driver.user.mobile': { $contL: keyWord.driverMobile },
            },
            join: [],
            page: page,
            limit: itemsPerPage,
            pageNumber: pageNumber,
            sort: [{ field: 'id', order: 'DESC' }],
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
    getDriverSnippingShipments (itemsPerPage, page, pageNumber, keyWord) {
        const queryString = RequestQueryBuilder.create({
            search: {
                status: 6,
                'sender.user.userName': { $contL: keyWord.senderName },
                'sender.user.mobile': { $contL: keyWord.senderMobile },
                'driver.user.userName': { $contL: keyWord.driverName },
                'driver.user.mobile': { $contL: keyWord.driverMobile },
            },
            join: [],
            page: page,
            limit: itemsPerPage,
            pageNumber: pageNumber,
            sort: [{ field: 'id', order: 'DESC' }],
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
    getSnippedShipments (itemsPerPage, page, pageNumber, keyWord) {
        const queryString = RequestQueryBuilder.create({
            search: {
                status: 7,
                'sender.user.userName': { $contL: keyWord.senderName },
                'sender.user.mobile': { $contL: keyWord.senderMobile },
                'driver.user.userName': { $contL: keyWord.driverName },
                'driver.user.mobile': { $contL: keyWord.driverMobile },
            },
            join: [],
            page: page,
            limit: itemsPerPage,
            pageNumber: pageNumber,
            resetCache: true,
            sort: [{ field: 'id', order: 'DESC' }],
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
    getRejectedShipments (itemsPerPage, page, pageNumber) {
        const queryString = RequestQueryBuilder.create({
            search: { condition: 2 },
            join: [],
            page: page,
            limit: itemsPerPage,
            pageNumber: pageNumber,
            sort: [{ field: 'id', order: 'DESC' }],
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
    getResonRejectedShipments (shipmentId) {
        return Service.get(`${resource}/${shipmentId}/audits`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.data.done) {
                return response.data.data
            }
        })
    },
    getPendingShipments (itemsPerPage, page, pageNumber) {
        const queryString = RequestQueryBuilder.create({
            search: { status: 0, condition: 0 },
            join: [],
            page: page,
            limit: itemsPerPage,
            pageNumber: pageNumber,
            sort: [{ field: 'id', order: 'DESC' }],
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
    approveShipment (shipmentId) {
        return Service.post(`${resource}/${shipmentId}/validate`, {
            valid: true,
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
    rejectShipment (shipmentId, rejectionResson) {
        return Service.post(`${resource}/${shipmentId}/validate`, {
            valid: false,
            review: rejectionResson,
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
    getAllShipmentType (itemsPerPage, page, pageNumber) {
        const queryString = RequestQueryBuilder.create({
            search: {},
            page: page,
            limit: itemsPerPage,
            pageNumber: pageNumber,
            sort: [{ field: 'id', order: 'DESC' }],
            resetCache: true,
        }).query()

        return Service.get(`${resourceType}?${queryString}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.data.done) {
                return response.data
            }
        })
    },
    updatePackage (packageId, Package) {
        const formData = new FormData()
        formData.append('name', Package.name)
        formData.append('details', Package.details)
        if (Package.icon === Object) {
            Package.icon = null
        } else {
            formData.append('icon', Package.icon)
        }
        return Service.patch(`${resourceType}/${packageId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.data.done) {
                return response.data
            }
        })
    },
    addPackage (packageData) {
        const formData = new FormData()
        formData.append('icon', packageData.icon,
            packageData.icon.name)
        formData.append('name', packageData.name)
        formData.append('details', packageData.details)

        return Service.post(`${resourceType}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.data.done) {
                return response.data.data
            }
        })
    },
    deletePackage (packageId) {
        return Service.delete(`${resourceType}/${packageId}`, {
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
