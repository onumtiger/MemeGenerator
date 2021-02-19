import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
})

export const insertMeme = payload => api.post(`/meme`, payload);
export const getAllMemes = () => api.get(`/meme`);
export const getMemeById = id => api.get(`/meme/${id}`);
export const deleteMemeById = id => api.delete(`/meme/${id}`);

export const insertTemplate = payload => api.post(`/templates`, payload);
export const getAllTemplates = () => api.get(`/templates`);
export const getTemplateById = id => api.get(`/templates/${id}`);
export const deleteTemplateById = id => api.delete(`/templates/${id}`);

const apis = {
    insertMeme,
    getAllMemes,
    getMemeById,
    deleteMemeById,
    insertTemplate,
    getAllTemplates,
    getTemplateById,
    deleteTemplateById,
}

export default apis