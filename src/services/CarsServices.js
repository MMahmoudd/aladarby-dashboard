import Service from './Service'
import { RequestQueryBuilder } from '@nestjsx/crud-request'
import { API_URL } from '../config'

const resource = `${API_URL}/driver-cars`
const token = localStorage.getItem('token')

export default {
    getAllCars (itemsPerPage, page, pageNumber, keyWord) {
        const queryString = RequestQueryBuilder.create({
            search: {
                confirmed: true,
                isRejected: false,
                isBlocked: false,
                // name: { $contL: keyWord.name },
                // plateCharacters: { $contL: keyWord.carCharacters },
                // plateNumbers: { $contL: keyWord.carNumber },
            },
            join: [{ field: 'driver' }, { field: 'driver.user' }],
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
    getPendingCars (itemsPerPage, page, pageNumber) {
        const queryString = RequestQueryBuilder.create({
            search: { confirmed: false, isRejected: false },
            join: [{ field: 'driver' }, { field: 'driver.user' }, { field: 'brand' }],
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
    getBlockedCars (itemsPerPage, page, pageNumber, keyWord) {
        console.log(keyWord)
        const queryString = RequestQueryBuilder.create({
            search: {
                confirmed: true,
                isRejected: false,
                isBlocked: true,
            },
            join: [{ field: 'driver' }, { field: 'driver.user' }, { field: 'driver.car.brand' }],
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
    approveCar (carId) {
        return Service.patch(`${resource}/${carId}`, {
            confirmed: true,
            isRejected: false,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.data.done) {
                return true
            }
        })
    },
    rejectCar (carId) {
        return Service.patch(`${resource}/${carId}`, {
            confirmed: false,
            isRejected: true,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.data.done) {
                return true
            }
        })
    },
    blockCar (carId) {
        return Service.patch(`${resource}/${carId}`, {
            isBlocked: true,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.data.done) {
                return true
            }
        })
    },
    unBlockCar (carId) {
        return Service.patch(`${resource}/${carId}`, {
            isBlocked: false,
        },
        {
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
