// import axios from 'axios'
import Service from './Service'
import { RequestQueryBuilder } from '@nestjsx/crud-request'
import { API_URL } from '../config'

const resource = `${API_URL}/drivers`
const token = localStorage.getItem('token')
const blockResource = `${API_URL}/users/block`
const pendingResource = `${API_URL}/users`
const notifiRessource = `${API_URL}/users/send-notification`
const bulckNotifiRessource = `${API_URL}/users/notifiy-bulk`
const smsRessource = `${API_URL}/users/send-sms`
const confirmDriverRessource = `${API_URL}/users/confirm`
const integrationRessource = `${API_URL}/drivers/integration/new`
// const historyNotifiRessourse = `${API_URL}/users-notifications`
const checkStatusRessource = `${API_URL}/drivers/integration`

export default {

    getAllDrivers (itemsPerPage, page, pageNumber, keyWord) {
        const queryString = RequestQueryBuilder.create({
            search: {
                approved: true,
                isRejected: false,
                'user.blocked': false,
                'user.userName': { $contL: keyWord.name },
                'user.mobile': { $contL: keyWord.mobile },
            },
            join: [{ field: 'user' }, { field: 'cars' }, { field: 'cars.brand' }, { field: 'cars.license' }],
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
    getPendingDrivers (itemsPerPage, page, pageNumber, keyWord) {
        console.log('namekeyWord', keyWord)
        const queryString = RequestQueryBuilder.create({
            search: {
                approved: false,
                isRejected: false,
                'user.blocked': false,
                completeRequiredDocs: true,
                isAddedToCitc: true,
                'user.userName': { $contL: keyWord.name },
                'user.mobile': { $contL: keyWord.mobile },
            },
            join: [{ field: 'user' }, { field: 'cars' }, { field: 'cars.license' }],
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
    // searchByKeyWordAndPendingStat (keyWord, approved = false, isRejected = false, isAddedToCitc = false) {
    //     const queryString = RequestQueryBuilder.create({
    //         search: {
    //             approved: approved,
    //             isRejected: isRejected,
    //             'user.blocked': false,
    //             completeRequiredDocs: true,
    //             isAddedToCitc: isAddedToCitc,
    //             'user.userName': { $contL: keyWord },
    //             // 'user.mobile': { $or: { $contL: keyWord } },

    //         },
    //         join: [{ field: 'user' }, { field: 'cars' }, { field: 'cars.license' }],
    //         page: 1,
    //         // limit: 200,
    //         resetCache: true,
    //     }).query()
    //     return Service.get(`${resource}?${queryString}`, {
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //         },
    //     }).then((response) => {
    //         if (response.data.done) {
    //             return response.data
    //         }
    //     })
    // },
    getPendingSentDriversOnCIT (itemsPerPage, page, pageNumber, keyWord) {
        const queryString = RequestQueryBuilder.create({
            search: {
                approved: false,
                isRejected: false,
                'user.blocked': false,
                completeRequiredDocs: true,
                isAddedToCitc: false,
                'user.userName': { $contL: keyWord.name },
                'user.mobile': { $contL: keyWord.mobile },
            },
            join: [{ field: 'user' }, { field: 'cars' }, { field: 'cars.license' }],
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
    getRejectedDrivers (itemsPerPage, page, pageNumber, keyWord) {
        const queryString = RequestQueryBuilder.create({
            search: {
                isRejected: true,
                approved: false,
                'user.userName': { $contL: keyWord.name },
                'user.mobile': { $contL: keyWord.mobile },
            },
            join: [{ field: 'user' }],
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
    // approveDriver (driverId) {

    approveDriver (driverId) {
        return Service.patch(`${resource}/${driverId}`, {
            approved: true,
            isRejected: false,
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
    rejectDriver (driverId) {
        return Service.patch(`${resource}/${driverId}`, {
            approved: false,
            isRejected: true,
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
    blockDriver (driverId) {
        return Service.post(`${blockResource}/${driverId}`, {
            isBlocked: true,
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
    unBlockDriver (driverId) {
        return Service.post(`${blockResource}/${driverId}`, {
            isBlocked: false,
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
    getAllBlockedDrivers (itemsPerPage, page, pageNumber, keyWord) {
        const queryString = RequestQueryBuilder.create({
            search: {
                'user.blocked': true,
                'user.userName': { $contL: keyWord.name },
                'user.mobile': { $contL: keyWord.mobile },
            },
            join: [{ field: 'user' }, { field: 'cars.brand' }, { field: 'cars.license' }],
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
    sendNotifi (userId, notification) {
        return Service.post(`${notifiRessource}/${userId}`, {
            // ...notification,
            title: notification.title,
            body: notification.body,
            payload: {
                driverId: notification.id,
                clientId: userId,
            },
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
    getPendingVirification (itemsPerPage, page, pageNumber, keyWord) {
        console.log(keyWord)
        const queryString = RequestQueryBuilder.create({
            search: {
                confirmed: false,
                userName: { $contL: keyWord.name },
                mobile: { $contL: keyWord.mobile },
            },
            page: page,
            limit: itemsPerPage,
            pageNumber: pageNumber,
            resetCache: true,
        }).query()

        return Service.get(`${pendingResource}?${queryString}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.data.done) {
                return response.data
            }
        })
    },
    confirmDriver (driverId) {
        return Service.post(`${confirmDriverRessource}/${driverId}`, {
            confirmed: true,
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
    async integration (driverId) {
        const response = await Service.post(`${integrationRessource}/${driverId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        console.log(response)
        console.log(token)
        if (response.data.done) {
            return response.data
        }
    },
    checkStatus (driverId) {
        return Service.get(`${checkStatusRessource}/${driverId}/status`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.data.done) {
                return response.data
            }
        })
    },
    sendMultiSMS (driversIds, SMS) {
        return Service.post(`${smsRessource}`, {
            usersIds: driversIds,
            message: SMS,
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
    sendSMS (driverId, SMS) {
        return Service.post(`${smsRessource}/${driverId}`, {
            message: SMS,
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
    sendMultiNotifi (driversIds, notification) {
        return Service.post(`${bulckNotifiRessource}`, {
            usersIds: driversIds,
            notification: notification,
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
}
