import axios from "axios";

export const apiTCE = axios.create({
    baseURL: 'https://api.tce.ce.gov.br/index.php/sim/1_0/'
})

apiTCE.interceptors.request.use((config) => {
    return config
}, (error) => {
    return Promise.reject(error)
})

export const apiTCEAtual = axios.create({
    baseURL: 'https://api-dados-abertos.tce.ce.gov.br'
})

apiTCEAtual.interceptors.request.use((config) => {
    return config
}, (error) => {
    return Promise.reject(error)
})