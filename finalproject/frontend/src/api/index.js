import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
})

export const insertMeme = payload => api.post(`/meme`, payload);
export const getAllMemes = () => api.get(`/meme`);
export const getMemeById = id => api.get(`/meme/${id}`);
export const deleteMemeById = id => api.delete(`/meme/${id}`);
export const patchMeme = (payload, id) => api.patch(`/meme/${id}`, payload);

export const getMemesWithStats = () => api.get(`/memeswithstats`);
export const getAllStats = () => api.get(`/stats`);

export const insertTemplate = payload => api.post(`/templates`, payload);
export const getAllTemplates = () => api.get(`/templates`);
export const getTemplateById = id => api.get(`/templates/${id}`);
export const deleteTemplateById = id => api.delete(`/templates/${id}`);

export const fetchWebImage = payload => api.get(`/webcontent/image`, payload);
export const fetchWebSnapshot = payload => api.get(`/webcontent/snapshot`, payload);

const apis = {
    insertMeme,
    patchMeme,
    getAllMemes,
    getMemeById,
    deleteMemeById,
    getMemesWithStats,
    getAllStats,
    insertTemplate,
    getAllTemplates,
    getTemplateById,
    deleteTemplateById,
    fetchWebImage,
    fetchWebSnapshot
}

export default apis