const User = require('../db/models/user-model');
const constants = require('../utils/constants');

const getMemeVisibilityOptions = async (req, res) => {
    let userId = parseInt(req.params.userId);
    if(isNaN(userId)) userId = -1;
    await User.findOne({_id: userId}, (err, user)=>{
        if(err){
            return res.status(400).json({ success: false, error: err });
        }
        
        //if userID exists = user is logged in return all options, otherwise just public
        let options = user ? [
            {name: 'private', value: constants.VISIBILITY.PRIVATE},
            {name: 'unlisted', value: constants.VISIBILITY.UNLISTED},
            {name: 'public', value: constants.VISIBILITY.PUBLIC}
        ] : [
            {name: 'public', value: constants.VISIBILITY.PUBLIC}
        ];
        return res.status(200).json({success: true, data: options});
    })
}

const getTemplateVisibilityOptions = async (req, res) => {
    let userId = parseInt(req.params.userId);
    if(isNaN(userId)) userId = -1;
    await User.findOne({_id: userId}, (err, user)=>{
        if(err){
            return res.status(400).json({ success: false, error: err });
        }
        
        //if userID exists = user is logged in return all options (unlisted does not make sense for templates), otherwise just public
        let options = user ? [
            {name: 'private', value: constants.VISIBILITY.PRIVATE},
            {name: 'public', value: constants.VISIBILITY.PUBLIC}
        ] : [
            {name: 'public', value: constants.VISIBILITY.PUBLIC}
        ];
        return res.status(200).json({success: true, data: options});
    })
}

module.exports = {
    getMemeVisibilityOptions,
    getTemplateVisibilityOptions
}