const Template = require('../db/models/template-model');
const Stats = require('../db/models/stats-model');
const globalHelpers = require('../globalHelpers');

const createTemplate = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'No template data received!'
        })
    }

    if(req.files && req.files.image){ //check if we actually received a file
        let img = req.files.image;
        let id = globalHelpers.getNewEmptyTemplateID();
        let filename = id+"_"+img.name; //ID in addition to name in order to prevent unwanted overrides
        img.mv('public/templates/'+filename, async function(err){ //this overwrites an existing image at that filepath if there is one!
            if(err){
                res.status(500).send(err);
            }else{
                let url = '/templates/'+filename;

                let statsID = globalHelpers.getNewFullStatsID();
                
                const template = new Template({
                    _id: id,
                    url: url,
                    name: img.name,
                    user_id: body.userID,
                    visibility: body.visibility,
                    stats_id: statsID
                });


                if (!template) {
                    return res.status(400).json({
                        success: false,
                        error: "Template data could not be parsed for storing!"
                    });
                }
            
                template
                    .save()
                    .then(() => {
                        return res.status(201).json({
                            success: true,
                            id: template._id,
                            error: 'Template successfully stored!'
                        })
                    })
                    .catch(dbError => {
                        return res.status(500).json({
                            success: false,
                            error: 'Template could not be stored! You should find additional error info in the detailedError property of this JSON.',
                            detailedError: dbError
                        })
                    })
            }
        });
    }else{
        res.status(400).json({
            success: false,
            error: 'No valid file received!'
        });
    }
}

const deleteTemplate = async (req, res) => {
    await Template.findOneAndDelete({ _id: req.params.id }, (err, template) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!template) {
            return res
                .status(404)
                .json({ success: false, error: `Template not found` })
        }

        return res.status(200).json({ success: true, data: template })
    }).catch(err => console.log(err))
}

const getTemplateById = async (req, res) => {
    await Template.findOne({ id: req.params.id }, (err, template) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!template) {
            return res
                .status(404)
                .json({ success: false, error: `Template not found` })
        }
        return res.status(200).json({ success: true, data: template })
    }).catch(err => console.log(err))
}

const getTemplates = async (req, res) => { //TODO filter by visibility to current user
    await Template.find({}, (err, templateArray) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!templateArray.length) {
            return res
                .status(204)
                .json({ success: false, error: `No templates found` })
        }
        return res.status(200).json({ success: true, data: templateArray })
    }).catch(err => console.log(err))
}

module.exports = {
    createTemplate,
    deleteTemplate,
    getTemplates,
    getTemplateById
}