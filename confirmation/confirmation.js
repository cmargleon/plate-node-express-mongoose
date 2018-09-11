const nodeMailer = require('nodemailer');
const Token = require('../models/token');
const crypto = require('crypto');

//transporter
let transporter = nodeMailer.createTransport({
    host: '',
    port: 465,
    secure: true,
    auth: {
        user: '',
        pass: ''
    }
});

function newToken (userId) {
    const token = new Token({ _userId: userId, token: crypto.randomBytes(16).toString('hex') });
    token.save( (err) => {
        if (err) { return res.status(500).send({ msg: err.message });
        }
    });
    return token.token
}

module.exports = {

    emailConfirmation: async (userId, email) => {
        try {
            const token = await newToken(userId);
            if (token) {
                let mailOptions = {
                    from: '', // sender address
                    to: "", // list of receivers
                    subject: "", // Subject line
                    text: "", // plain text body
                    html: '' // html body
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        throw error;
                    }
                    console.log('Message %s sent: %s', info.messageId, info.response);
                    return true;
                    });
            }
        } catch(error) {
            throw error;
        }
    }
}