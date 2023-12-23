const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Account Schema
const accountSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
}, {timestamps: true}); // Automatically generate timestamp properties on the document

// Account model
const Account = mongoose.model('Account', accountSchema)
// var mng1 = Account({username: 'peter', password: 'nu4i3bt4i3', role: 'manager'}).save()

module.exports = Account;
