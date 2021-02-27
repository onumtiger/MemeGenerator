const Draft = require('../db/models/draft-model');
const IDManager = require('../db/id-manager');

const getDrafts = async (req, res) => {
    let userId = req.query.userId;
    await Draft.find({ user_id: userId }, (err, draftArray) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        
        return res.status(200).json({ success: true, data: draftArray });
    }).catch(err => console.log(err))
}

const insertDraft = async (req, res) => {
    let body = req.body;
    let draftId = IDManager.getNewEmptyDraftID();

    const draft = new Draft({
        _id: draftId,
        template_id: body.template_id,
        user_id: body.user_id,
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
            IDManager.registerNewDraftEntry();
            return res.status(201).json({
                success: true,
                id: draft._id
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
    let draftId = req.params.draftId;

    Draft.findOneAndDelete({ _id: draftId }, (err, draft) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!draft) {
            return res
                .status(404)
                .json({ success: false, error: `Draft with ID ${draftId} not found!` });
        }

        return res.status(200).json({ success: true, data: draft });
    })
}

module.exports = {
    getDrafts,
    insertDraft,
    deleteDraft
}