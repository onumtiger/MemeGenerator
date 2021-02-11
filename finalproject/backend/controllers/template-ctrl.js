const Template = require('../db/models/template-model')

const createTemplate = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'No template data received!',
        })
    }

    if(req.files && req.files.image){ //check if we actually received a file
        let img = req.files.image;
        let filename = img.name; //TODO we probably should pass an additional ID to the filename in order to prevent unwanted overrides.
        img.mv('public/templates/'+filename, function(err){ //this overwrites an existing image at that filepath if there is one!
            if(err){
                res.status(500).send(err);
            }else{
                url = 'templates/'+filename;
                
                const template = new Template(body) //TODO change to actual properties, add the url, and store the data as we need it.


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
                            id: template._id, //TODO maybe change depending on what a stored Template looks like and which ID we will work with
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

const getTemplates = async (req, res) => {
    await Template.find({}, (err, template) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!template.length) {
            return res
                .status(404)
                .json({ success: false, error: `No templates found` })
        }
        return res.status(200).json({ success: true, data: template })
    }).catch(err => console.log(err))
}

module.exports = {
    createTemplate,
    deleteTemplate,
    getTemplates,
    getTemplateById
}