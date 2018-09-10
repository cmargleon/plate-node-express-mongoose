const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

passwordSchema
.is().min(8)                                    
.is().max(15)                                  
.has().uppercase()                              
.has().lowercase()                              
.has().digits()
.has().symbols()                                 
.has().not().spaces()                           
.is().not().oneOf(['Passw0rd', 'Password123']); 

module.exports = {

    validatePassword: (password) => {
        return passwordSchema.validate(password)
    }

}