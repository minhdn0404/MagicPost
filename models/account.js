const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Account Schema
const accountSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Usernam is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    role: {
        type: String,
        required: [true, 'Role is required']
    },
    capPointID: {
        type: String,
        required: function() {
            return this.role === "trans_cap" || this.role === "gather_cap";
        },
        message: 'capPointID is required for role "trans_cap" or "gather_cap"'
    }
}, {timestamps: true}); // Automatically generate timestamp properties on the document

// Account model
const Account = mongoose.model('Account', accountSchema)

// var mng1 = Account({username: 'peter', password: 'nu4i3bt4i3', role: 'manager'}).save()

// var mng1 = Account({username: 'tunganh45', password: 'congietwu', role: 'trans_cap'}).save()
// var mng1 = Account({username: 'vuienahea', password: '2b6ui54b', role: 'gather_cap'}).save()
// var mng1 = Account({username: 'thanhcong', password: '4n3iub6i33', role: 'trans_cap'}).save()
// var mng1 = Account({username: 'vinhlord', password: '5n867ijbi57', role: 'gather_cap'}).save()


module.exports = Account;
