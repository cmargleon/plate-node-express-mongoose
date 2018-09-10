const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: 
           { type: String,
             required: true,
             unique: true,
             match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
            },
    password: 
            { type: String,
              required: true
            },
    firstName:
            { type: String,
              required: true,
              minlength: 2,
              maxlength: 50
            },
    lastName:
            { type: String,
              required: true,
              minlength: 2,
              maxlength: 50
            }
});

module.exports = mongoose.model('User', userSchema);