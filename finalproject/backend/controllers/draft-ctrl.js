const User = require('../db/models/user-model');
const Draft = require('../db/models/draft-model');
const dbUtils = require('../db/dbUtils');

const getDrafts = async (req, res) => {
    let userID = req.params.userID;
    await User.findOne({ _id: userID }, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        if (!user) {
            return res
                .status(404)
                .json({ success: false, error: `User with ID ${userID} not found!` });
        }
        Draft.find({ _id: { $in: user.draft_ids } }, (draftErr, draftArray) => {
            if (draftErr) {
                return res.status(400).json({ success: false, error: err });
            }
            return res.status(200).json({ success: true, data: draftArray });
        });
    }).catch(err => console.log(err))
}

const insertDraft = async (req, res) => {
    let userID = req.params.userID;
    let body = req.body;
    let draftID = await dbUtils.getNewEmptyDraftID();

    const draft = new Draft({
        _id: draftID,
        template_src: body.template_src,
        title: body.title,
        captions: body.captions
    });

    if (!draft) {
        return res.status(400).json({
            success: false,
            error: "Draft data could not be parsed for storing!"
        });
    }

    draft
        .save()
        .then(() => {
            User.updateOne({ _id: userID }, { $push: {draft_ids: draft._id}}, (err, user)=>{
                if (err) {
                    return res.status(400).json({ success: false, error: err });
                }
                
                return res.status(201).json({
                    success: true,
                    id: draft._id
                });
            });
        })
        .catch(dbError => {
            return res.status(500).json({
                success: false,
                error: 'Draft could not be stored! You should find additional error info in the detailedError property of this JSON.',
                detailedError: dbError
            })
        })
}

const deleteDraft = async (req, res) => {
    let userID = req.params.userID;
    let draftID = req.params.draftID;

    User.findOneAndUpdate(
        {
            _id: userID,
            draft_ids: draftID
        }, { $pull: {draft_ids: draftID} }, (err, user)=>{
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        if (!user) {
            return res
                .status(404)
                .json({ success: false, error: `No User with userID ${userID} and draftID ${draftID} found!` });
        }
        return res.status(200).json({ success: true, data: draftID });

        // Draft.findOneAndDelete({ _id: draftID }, (err, draft) => {
        //     if (err) {
        //         return res.status(400).json({ success: false, error: err });
        //     }
    
        //     if (!draft) {
        //         return res
        //             .status(404)
        //             .json({ success: false, error: `Draft with ID ${draftID} not found!` });
        //     }
    
        //     return res.status(200).json({ success: true, data: draft });
        // })
    });
}

module.exports = {
    getDrafts,
    insertDraft,
    deleteDraft
}