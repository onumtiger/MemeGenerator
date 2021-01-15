import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
})

export const insertMeme = payload => api.post(`/meme`, payload)
export const getAllMemes = () => api.get(`/meme`)
export const getMemeById = id => api.get(`/meme/${id}`)

const apis = {
    insertMeme,
    getAllMemes,
    getMemeById,
}

export default apis