// import axios from 'axios'
import Service from './Service'
import { RequestQueryBuilder } from '@nestjsx/crud-request'
import { API_URL } from '../config'

const resourceType = `${API_URL}/info/about-app`
const token = localStorage.getItem('token')

export default {
    getAllAboutAppData (itemsPerPage, page, pageNumber) {
        const queryString = RequestQueryBuilder.create({
            search: { },
            page: page,
            limit: itemsPerPage,
            pageNumber: pageNumber,
            resetCache: true,
        }).query()
        return Service.get(`${resourceType}?${queryString}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.data.done) {
                return response
            }
        })
    },
    updateAboutAppData (packageId, Package) {
        const formData = new FormData()
        formData.append('text', Package.text)
        if (Package.media === Object) {
            Package.media = null
        } else {
            formData.append('image', Package.media)
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
    addAboutAppData (packageData) {
        const formData = new FormData()
        formData.append('image', packageData.media,
                        packageData.media.name)
        formData.append('text', packageData.text)

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
    deleteAboutAppData (packageId) {
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
