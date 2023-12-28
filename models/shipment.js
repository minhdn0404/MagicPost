const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Shipment Schema
const shipmentSchema = new Schema({
    senderInfo: {
        name: {
            type: String,
            required: [true, 'Sender name is required'],
        },
        address: {
            type: String,
            required: [true, 'Sender address is required'],
        },
        phone: {
            type: String,
            required: [true, 'Sender phone is required'],
        }
    },
    receiverInfo: {
        name: {
            type: String,
            required: [true, 'Receiver name is required'],
        },
        address: {
            type: String,
            required: [true, 'Receiver address is required'],
        },
        phone: {
            type: String,
            required: [true, 'Receiver phone is required'],
        }
    },
    
    progress: {
        type: [{
                action: String,
                pointID: String,
                fromID: String,
                toID: String,
                date: Date,
                staffID: String
        }],
        required: [true, "Progress is required"]
    },
    
    // create date
    shipmentDate: {
        type: Date,
        required: [true, 'shipmentDate is required']
    },

    receivedDate: {
        type: Date,
    },

    status: {
        type: [{
            type: String,
            enum: ['Pending', 'Pre-Transit', 'Gather-From', 'In-Transit', 'Gather-To', 'Post-Transit', 'Received', 'Out for delivery', 'Success' , 'Failed', 'Returned"'],
        }],
        required: [true, 'status is required']
    },

    // content: {
    //     quantity: {
    //         type: Number,
    //         required: [true, 'content quantity is required']
    //     },
    //     value: {
    //         type: Number,
    //         required: [true, 'content value is required']
    //     },
    //     currency: {
    //         type: String,
    //         required: [true, 'content currency is required']
    //     },
    //     document: {
    //         type: Boolean,
    //         required: [true, 'content document is required']
    //     },
    // },
    // guide: {
    //     type: Number,
    //     required: [true, 'guide is required']
    // },
    // weight: {
    //     value: {
    //         type: Number,
    //         required: [true, 'weight value is required']
    //     },
    //     unit: {
    //         type: String,
    //         required: [true, 'weight unit is required']
    //     },
    // },
    // charge: {
    //     base: {
    //         type: Number,
    //         required: [true, 'charge base is required']
    //     },
    //     extra: {
    //         type: Number,
    //         required: [true, 'charge extra is required']
    //     },
    //     gtgt: {
    //         type: Number,
    //         required: [true, 'charge gtgt is required']
    //     },
    //     vat: {
    //         type: Number,
    //         required: [true, 'charge vat is required']
    //     },
    //     other: {
    //         type: Number,
    //         required: [true, 'charge other is required']
    //     },
    //     total: {
    //         type: Number,
    //         required: [true, 'charge total is required']
    //     }
    // },
    // isReceiverPay: {
    //     type: Boolean,
    //     required: [true, 'isReceiverPay is required']
    // },
    // receiverPay: {
    //     cod: {
    //         type: Number,
    //         required: [true, 'receiverPay cod is required']
    //     },
    //     extra: {
    //         type: Number,
    //         required: [true, 'receiverPay extra is required']
    //     },
    //     total: {
    //         type: Number,
    //         required: [true, 'receiverPay total is required']
    //     }
    // },
}, {timestamps: true});

// Validation function for receivedDate
shipmentSchema.path('receivedDate').validate(function(value) {
    // Check if the last element in the status array is "Success"
    const isLastStatusSuccess = this.status.length > 0 && this.status[this.status.length - 1] === 'Success';

    // Check if receivedDate is required based on the status
    if (isLastStatusSuccess) {
        return value !== undefined && value !== null;
    }

    // If status is not "Success," receivedDate is not required
    return true;
}, 'Received date is required when the last status is "Success"');

const Shipment = mongoose.model('Shipment', shipmentSchema)

module.exports = Shipment;