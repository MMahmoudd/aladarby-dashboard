import Service from './Service'
import { API_URL } from '../config'
// import { RequestQueryBuilder } from '@nestjsx/crud-request'

const resource = `${API_URL}/config`
const changePassword = `${API_URL}/auth/update-password`

const token = localStorage.getItem('token')
export default {
    getAllSetting () {
        return Service.get(`${resource}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.data.done) {
                return response.data.data
            }
        })
    },
    updateSetting (dataId, data) {
        return Service.patch(`${resource}/${dataId}`, {
            ...data,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.data.done) {
                return response.data.data
            }
        })
    },
    updatePassword (password) {
        return Service.post(`${changePassword}`, {
            password: password,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            console.log(response.data)
                return response.data
        })
    },
}
