import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
})

export const insertMeme = payload => api.post(`/meme`, payload);
export const getAllMemes = () => api.get(`/meme`);
export const getMemeById = id => api.get(`/meme/${id}`);
export const deleteMemeById = id => api.delete(`/meme/${id}`);
export const patchMeme = (payload, id) => api.patch(`/meme/${id}`, payload);

export const postViewMeme = id => api.post(`/meme/view/${id}`);
export const postUpvotesMeme = (update, id) => api.post(`/meme/upvote/${id}`, update);
export const postDownvotesMeme = (update, id) => api.post(`/meme/downvote/${id}`, update);

export const getStatsForMeme = (id) => api.get(`/stats/meme/${id}`);
export const getStatsForTemplate = (id) => api.get(`/stats/template/${id}`);

export const insertTemplate = payload => api.post(`/templates`, payload);
export const getAllTemplates = () => api.get(`/templates`);
export const getTemplateById = id => api.get(`/templates/${id}`);
export const deleteTemplateById = id => api.delete(`/templates/${id}`);

export const getMemeVisibilityOptions = userId => api.get(`/guidata/visibility-options/meme/${userId}`);
export const getTemplateVisibilityOptions = userId => api.get(`/guidata/visibility-options/template/${userId}`);

export const getAllDrafts = userId => api.get(`/drafts/${userId}`);
export const insertDraft = (payload, userId) => api.post(`/drafts/${userId}`, payload);
export const deleteDraft = (userId, draftId) => api.delete(`/drafts/${userId}/${draftId}`);

export const fetchWebImage = url => api.get(`/webcontent/image/${url}`);
export const fetchWebSnapshot = url => api.get(`/webcontent/snapshot/${url}`);

export const executeImageCreation = payload => api.post('/meme/imageCreation', payload);
export const getSearchImages = () => api.get('/webcontent/parameters');

const apis = {
    insertMeme,
    postViewMeme,
    postUpvotesMeme,
    postDownvotesMeme,
    executeImageCreation,
    patchMeme,
    getAllMemes,
    getMemeById,
    deleteMemeById,
    getStatsForMeme,
    getStatsForTemplate,
    getMemeVisibilityOptions,
    getTemplateVisibilityOptions,
    getAllDrafts,
    insertDraft,
    deleteDraft,
    insertTemplate,
    getAllTemplates,
    getTemplateById,
    deleteTemplateById,
    fetchWebImage,
    fetchWebSnapshot, 
    getSearchImages
}

export default apis