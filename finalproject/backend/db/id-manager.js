// for our ID system, we couldn't use MongoDB's usual ObjectIDs and because of possible entry deletions, we can't just go by the number of *current* DB entries for new safe IDs, so we built our own basic ID managing system. IDs of deleted entries will never be reassigned, deletions have no influence on new IDs.
let dbEntryCount;

const reset = ()=>{
    dbEntryCount = {
        memes: 0,
        templates: 0,
        drafts: 0,
        comments: 0,
        users: 0
    }
}

reset();

module.exports = {
    reset,
    registerNewMemeEntry: ()=>{
        dbEntryCount.memes++;
    },
    registerNewTemplateEntry: ()=>{
        dbEntryCount.templates++;
    },
    registerNewDraftEntry: ()=>{
        dbEntryCount.drafts++;
    },
    registerNewCommentEntry: ()=>{
        dbEntryCount.comments++;
    },
    registerNewUserEntry: ()=>{
        dbEntryCount.users++;
    },
    getNewEmptyMemeID: ()=>{
        return dbEntryCount.memes;
    },
    getNewEmptyTemplateID: ()=>{
        return dbEntryCount.templates;
    },
    getNewEmptyDraftID: ()=>{
        return dbEntryCount.drafts;
    },
    getNewEmptyCommentID: ()=>{
        return dbEntryCount.comments;
    },
    getNewEmptyUserID: ()=>{
        return dbEntryCount.users;
    }
}