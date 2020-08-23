const mongoose = require('mongoose');
const Schema  = mongoose.Schema;


const UserSchema = new Schema({


    firstName:{

        type: String,
        required: true,
        minlength: 4,
        trim: true,


    },

    lastName:{

        type: String,
        required: true

    },




    email:{

        type: String,
        required: true

    },


    password:{

        type: String,
        required: true

    },





});



UserSchema.methods.testMethod = function(){

    console.log("from schema method")


};



module.exports = mongoose.model('users', UserSchema);
