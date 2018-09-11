const User = require('../models/user');
const Token = require('../models/token');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validate = require('../validation/validate');
const emailConfirmation = require('../confirmation/confirmation');

exports.user_signup = (req, res, next) => {
    let valid = validate.validatePassword(req.body.password);
    if (!valid) { return res.status(400).json({ error: "Contraseña no válida"}) };

    User.findOne({ email: req.body.email }, function (err, user) {
 
        // Make sure user doesn't already exist
        if (user) return res.status(400).send({ msg: 'The email address you have entered is already associated with another account.' });
     
        // Create and save the user
        bcrypt.hash(req.body.password, 10, (err, hash)=> {
            if(err) {
                return res.status(500).json({
                    error: err
                });
            } else {
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    password: hash,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName
                    });
                    user
                    .save()
                    .then(result => {
                        //send confirmation email. It may fail but the user can ask for a new confirmation email
                        emailConfirmation.emailConfirmation(result._id, result.email);
                        return res.status(201).json({
                            message: "Usuario creado y correo de confirmación enviado"
                        });
                    })
                    .catch(err => {
                        return res.status(500).json({
                            error: err
                        });
                    });
            }
        });
    });
}

exports.user_login = (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if (user.length < 1) {
            return res.status(401).json({
                message: "La autentificación falló"
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: 'La autentificación falló'
                });
            }
            if (result) {
                let token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                }, process.env.JWT_KEY,
                {
                    expiresIn: "12h"
                })
                return res.status(200).header('x-auth', token).json({
                    message: 'Autentificación exitosa'
                });
            }
            res.status(401).json({
                message: 'La autentifación falló'
            });
        });
    })
    .catch(err => {
        return res.status(500).json({
            message: 'Algo ha fallado',
            error: err
        })
    });
}

exports.user_delete = (req, res, next) => {
    User.remove({ _id : req.params.userId})
    .exec()
    .then(result=> {
        return res.status(200).json({
            message: "Usuario eliminado"
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}

exports.emailConfirmation = (req, res, next) => {
    Token.findOne({ token: req.params.token }, function (err, token) {
        if (!token) return res.status(400).json({ type: 'not-verified', msg: 'El token no es válido. Puede haber expirado' });
 
        // If we found a token, find a matching user
        User.findOne({ _id: token._userId }, function (err, user) {
            if (!user) return res.status(400).json({ msg: 'No se ha encontrado un token para este usuario' });
            if (user.isVerified) return res.status(400).json({ type: 'already-verified', msg: 'Este usuario ya se encuentra verificado' });
 
            // Verify and save the user
            user.isVerified = true;
            user.save(function (err) {
                if (err) { return res.status(500).json({ msg: err.message }); }
                return res.status(200).json({
                    message: "Usuario verificado"
                });
            });
        });
    });
    }