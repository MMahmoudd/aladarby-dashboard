import Service from './Service'
import { RequestQueryBuilder } from '@nestjsx/crud-request'
import { API_URL } from '../config'

const resource = `${API_URL}/clients`
const blockResource = `${API_URL}/users/block`
const notifiRessource = `${API_URL}/users/send-notification`

const token = localStorage.getItem('token')

export default {
    getAllUsers (itemsPerPage, page, pageNumber, keyWord) {
        const queryString = RequestQueryBuilder.create({
            search: {
                'user.blocked': false,
                'user.userName': { $contL: keyWord.name },
                'user.mobile': { $contL: keyWord.mobile },
            },
            join: ['user'],
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

    blockUser (userId) {
        return Service.post(`${blockResource}/${userId}`, {
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
    unBlockUser (userId) {
        return Service.post(`${blockResource}/${userId}`, {
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

    getAllBlockedUsers (itemsPerPage, page, pageNumber, keyWord) {
        const queryString = RequestQueryBuilder.create({
            search: {
                'user.blocked': true,
                'user.userName': { $contL: keyWord.name },
                'user.mobile': { $contL: keyWord.mobile },
            },
            join: ['user'],
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
    getAllNotifications (userId) {
        const queryString = RequestQueryBuilder.create({
            search: { 'user.id': userId },
            join: ['user'],
            page: 1,
            // limit: 50,
            resetCache: true,
        }).query()

        return Service.get(`${API_URL}/users-notifications?${queryString}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.data.done) {
                return response.data.data
            }
        })
    },
    sendNotifi (userId, notification) {
        return Service.post(`${notifiRessource}/${userId}`, {
            title: notification.title,
            body: notification.body,
            payload: {
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

}
