import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
})

export const insertMeme = memeData => api.post(`/meme`, memeData);
export const getAllMemes = userId => api.get(`/meme`, {params: {userId}});
export const getOwnMemes = userId => api.get(`/meme/own`, {params: {userId}});
export const getMemeById = id => api.get(`/meme/${id}`);
export const deleteMemeById = id => api.delete(`/meme/${id}`);
export const patchMeme = (memeData, id) => api.patch(`/meme/${id}`, memeData);

export const viewMeme = id => api.post(`/meme/view/${id}`);
export const upvoteMeme = (memeId, userId) => api.post(`/meme/upvote/${memeId}`, {userId});
export const downvoteMeme = (memeId, userId) => api.post(`/meme/downvote/${memeId}`, {userId});

export const upvoteTemplate = (id) => api.post(`/template/upvote/${id}`);
export const downvoteTemplate = (id) => api.post(`/template/downvote/${id}`);

export const getStatsForMeme = (id) => api.get(`/stats/meme/${id}`);
export const getStatsForTemplate = (id) => api.get(`/stats/template/${id}`);

export const insertTemplate = templateData => api.post(`/templates`, templateData);
export const getAllTemplates = userId => api.get(`/templates`, {params: {userId}});
export const getTemplateById = id => api.get(`/templates/${id}`);
export const deleteTemplateById = id => api.delete(`/templates/${id}`);

export const getMemeVisibilityOptions = userId => api.get(`/guidata/visibility-options/meme/`, {params: {userId}});
export const getTemplateVisibilityOptions = userId => api.get(`/guidata/visibility-options/template/`, {params: {userId}});

export const getAllDrafts = userId => api.get(`/drafts/`, {params: {userId}});
export const insertDraft = (draftData, userId) => api.post(`/drafts/`, draftData, {params: {userId}});
export const deleteDraft = (userId, draftId) => api.delete(`/drafts/${draftId}`, {params: {userId}});

export const fetchWebImage = url => api.get(`/webcontent/image/${url}`);
export const fetchWebSnapshot = url => api.get(`/webcontent/snapshot/${url}`);


const apis = {
    insertMeme,
    viewMeme,
    upvoteMeme,
    downvoteMeme,
    upvoteTemplate,
    downvoteTemplate,
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