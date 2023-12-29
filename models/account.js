import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Account Schema
const accountSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    role: {
        type: String,
        enum: ['manager', 'trans_cap', 'trans_staff', 'gather_cap', 'gather_staff'],
        required: [true, 'Role is required']
    },
    capPointID: {
        type: String,
        required: function() {
            return this.role === "trans_cap" || this.role === "gather_cap";
        },
        message: 'capPointID is required for role "trans_cap" or "gather_cap"'
    },
    captainID: {
        type: String,
        required: function() {
            return this.role === "trans_staff" || this.role === "gather_staff";
        },
        message: 'captainID is required for role "trans_staff" or "gather_staff"'
    }
}, {timestamps: true}); // Automatically generate timestamp properties on the document

// Account model
const Account = mongoose.model('Account', accountSchema)

// var mng1 = Account({username: 'peter', password: 'nu4i3bt4i3', role: 'manager'}).save()
// var mng1 = Account({username: 'tunganh45', password: 'congietwu', role: 'trans_cap'}).save()
// var mng1 = Account({username: 'vuienahea', password: '2b6ui54b', role: 'gather_cap'}).save()
// var mng1 = Account({username: 'thanhcong', password: '4n3iub6i33', role: 'trans_cap'}).save()
// var mng1 = Account({username: 'vinhlord', password: '5n867ijbi57', role: 'gather_cap'}).save()

// var mng1 = Account({username: 'staff1', password: '6bh542u6iv', role: 'trans_staff', captainID: '658a89faa3ae804d7f5a98e8'}).save()
// var mng1 = Account({username: 'staff2', password: 'h9th78rt', role: 'gather_staff', captainID: '658a88fb6b32ae1da4a86d05'}).save()
// var mng1 = Account({username: 'staff3', password: 'n786yh', role: 'trans_staff', captainID: '65880c32c54a658ddb910e07'}).save()
// var mng1 = Account({username: 'staff4', password: 'rb47368trg298', role: 'gather_staff', captainID: '65880c32c54a658ddb910e08'}).save()

export default Account;
