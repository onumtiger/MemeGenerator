import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
})

export const insertMeme = payload => api.post(`/meme`, payload)
//Pls doublecheck this following line, if it makes any sense - in love, Domi
export const patchMeme = (payload, id) => api.patch(`/meme/${id}`, payload)
export const getAllMemes = () => api.get(`/meme`)
export const getMemesWithStats = () => api.get(`/memeswithstats`)
export const getAllStats = () => api.get(`/stats`)
export const getMemeById = id => api.get(`/meme/${id}`)

const apis = {
    insertMeme,
    patchMeme,
    getMemesWithStats,
    getAllMemes,
    getAllStats,
    getMemeById,
}

export default apis