import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
})

export const insertMeme = payload => api.post(`/meme`, payload);
export const getAllMemes = userId => api.get(`/meme`, {params: {userId}});
export const getOwnMemes = userId => api.get(`/meme/own`, {params: {userId}});
export const getMemeById = id => api.get(`/meme/${id}`);
export const deleteMemeById = id => api.delete(`/meme/${id}`);
export const patchMeme = (payload, id) => api.patch(`/meme/${id}`, payload);

export const postViewMeme = id => api.post(`/meme/view/${id}`);
export const postUpvotesMeme = (update, id) => api.post(`/meme/upvote/${id}`, update);
export const postDownvotesMeme = (update, id) => api.post(`/meme/downvote/${id}`, update);

export const getStatsForMeme = (id) => api.get(`/stats/meme/${id}`);
export const getStatsForTemplate = (id) => api.get(`/stats/template/${id}`);

export const insertTemplate = payload => api.post(`/templates`, payload);
export const getAllTemplates = userId => api.get(`/templates`, {params: {userId}});
export const getTemplateById = id => api.get(`/templates/${id}`);
export const deleteTemplateById = id => api.delete(`/templates/${id}`);

export const getMemeVisibilityOptions = userId => api.get(`/guidata/visibility-options/meme/`, {params: {userId}});
export const getTemplateVisibilityOptions = userId => api.get(`/guidata/visibility-options/template/`, {params: {userId}});

export const getAllDrafts = userId => api.get(`/drafts/`, {params: {userId}});
export const insertDraft = (payload, userId) => api.post(`/drafts/`, payload, {params: {userId}});
export const deleteDraft = (userId, draftId) => api.delete(`/drafts/${draftId}`, {params: {userId}});

export const fetchWebImage = url => api.get(`/webcontent/image/${url}`);
export const fetchWebSnapshot = url => api.get(`/webcontent/snapshot/${url}`);


const apis = {
    insertMeme,
    postViewMeme,
    postUpvotesMeme,
    postDownvotesMeme,
    patchMeme,
    getAllMemes,
    getOwnMemes,
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
}

export default apis