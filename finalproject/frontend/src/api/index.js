import axios from 'axios'

/**
 * API 
 * backend connection
 */
const api = axios.create({
    baseURL: 'http://localhost:3001/api',
})

// MEME
export const insertMeme = memeData => api.post(`/meme`, memeData);
export const getAllMemes = userId => api.get(`/meme`, { params: { userId } });
export const getOwnMemes = userId => api.get(`/meme/own`, { params: { userId } });
export const getMemeById = id => api.get(`/meme/${id}`);
export const deleteMemeById = id => api.delete(`/meme/${id}`);
export const patchMeme = (memeData, id) => api.patch(`/meme/${id}`, memeData);
export const viewMeme = id => api.post(`/meme/view/${id}`);
// MEME VOTES
export const toggleUpvoteMeme = (memeId, userId, newValue) => api.post(`/meme/upvote/${memeId}`, { userId, newValue });
export const toggleDownvoteMeme = (memeId, userId, newValue) => api.post(`/meme/downvote/${memeId}`, { userId, newValue });
// TEMPLATE VOTES
export const toggleUpvoteTemplate = (templateId, userId, newValue) => api.post(`/templates/upvote/${templateId}`, { userId, newValue });
export const toggleDownvoteTemplate = (templateId, userId, newValue) => api.post(`/templates/downvote/${templateId}`, { userId, newValue });
// MEME STATS
export const getStatsForMeme = (id) => api.get(`/stats/meme/${id}`);
export const getStatsForTemplate = (id) => api.get(`/stats/template/${id}`);
// TEMPLATE
export const insertTemplate = templateData => api.post(`/templates`, templateData);
export const getAllTemplates = userId => api.get(`/templates`, { params: { userId } });
export const getTemplateById = id => api.get(`/templates/${id}`);
export const deleteTemplateById = id => api.delete(`/templates/${id}`);
// VISIBILITY
export const getMemeVisibilityOptions = userId => api.get(`/guidata/visibility-options/meme/`, { params: { userId } });
export const getTemplateVisibilityOptions = userId => api.get(`/guidata/visibility-options/template/`, { params: { userId } });
// DRAFT
export const getAllDrafts = (userId) => api.get(`/drafts/`, { params: { userId } });
export const insertDraft = (draftData) => api.post(`/drafts/`, draftData);
export const deleteDraft = (draftId) => api.delete(`/drafts/${draftId}`);
export const fetchWebImage = url => api.get(`/webcontent/image/${url}`);
export const fetchWebSnapshot = url => api.get(`/webcontent/snapshot/${url}`);
// COMMENTS
export const getCommentsByMemeId = id => api.get(`/meme/comments/${id}`);
export const postComment = (userId, memeId, message) => api.post(`/meme/comments/${userId}`, { memeId, message });

/**
 * Use credentials to login
 * creds must contain email/pw or username/pw
 * @param {*} cred 
 */
export const login = cred => api.post('/user/login', cred).catch(() => {
    const res = { status: 401}
    return res
})

/**
 * Use credentials to signup
 * creds must contain email, username and password
 * @param {*} cred 
 */
export const signup = cred => api.post('/user/signup', cred).catch(() => {
    const res = { status: 409}
    return res
})

/**
 * Use userId and token to delete user from db
 * config must contain jwt token
 * @param {number} userId 
 * @param {*} config 
 */
export const deleteUser = (userId, config) => api.delete(`/user/${userId}`, config)


const apis = {
    insertMeme,
    viewMeme,
    toggleUpvoteMeme,
    toggleDownvoteMeme,
    toggleUpvoteTemplate,
    toggleDownvoteTemplate,
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
    getCommentsByMemeId,
    login,
    signup,
    deleteUser,
    postComment
}

export default apis