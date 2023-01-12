const User = require('../models/user')

module.exports = async function(req, res, next) {
    try{
        const user = await User.findOne({token: req.body.token})
    if(!user) {
        return res.status(403)
    }

    next()
    }catch(e){
        return res.status(500)
    }
}