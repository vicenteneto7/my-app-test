import axios from "axios";

export const apiTCE = axios.create({
    baseURL: 'https://api-dados-abertos.tce.ce.gov.br'
})

apiTCE.interceptors.request.use((config) => {
    return config
}, (error) => {
    return Promise.reject(error)
})