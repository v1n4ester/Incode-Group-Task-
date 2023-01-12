const { Router } = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { validationResult } = require('express-validator')
const { registerValidators, loginValidators } = require('../utils/validators')

const router = Router()

router.post('/login', loginValidators, async (req, res) => {
    try {
        const { email } = req.body

        const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: "validation problems"
                })
            }

        const candidate = await User.findOne({ email })

        if(candidate) {
            res.status(200).json(
                {
                    email: candidate.email,
                    name: candidate.name,
                    isAdmin: candidate.isAdmin,
                    isBoss: candidate.isBoss,
                    subordinates: candidate.subordinates,
                    token: candidate.token
            })
        }
    } catch (e) {
        return res.status(500)
    }
})

router.post('/register', registerValidators, async (req, res) => {
        try {
            crypto.randomBytes(32, async (err, buffer) => { 
                if (err) {
                    return res.status(500)
                }
            const token = buffer.toString('hex') 
                
            const { email, password, name, isBoss } = req.body

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: errors
                })
            }
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({
                email,
                name,
                password: hashPassword,
                token,
                isBoss: isBoss,
                subordinates: { users: [] }
            })
            await user.save()
            res.status(200).json(
                {
                    email: user.email,
                    name: user.name,
                    isAdmin: user.isAdmin,
                    isBoss: user.isBoss,
                    subordinates: user.subordinates,
                    token: user.token
            })
            })
        } catch (e) {
            return res.status(500)
        }
    })

module.exports = router