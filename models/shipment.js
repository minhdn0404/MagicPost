import mongoose from "mongoose";
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
    content: {
        quantity: Number,
        value: Number,
        currency: String,
        document: Boolean
    },
    weight: {
        value: Number,
        unit: String
    },
    charge: {
        base: Number,
        extra: Number,
        gtgt: Number,
        vat: Number,
        other: Number,
        total: Number
    },
    

    progress: {
        type: [{
            from: {
                type: String,
                enum: ['Trans', 'Gather'],
                required: [true, 'From is required'],
            },
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
            enum: ['Pending', 'Pre-Transit', 'Gather-From', 'In-Transit', 'Gather-To', 'Post-Transit', 'Received', 'Out for delivery', 'Success' , 'Failed', 'Returned'],
        }],
        required: [true, 'status is required']
    },

    guide: {
        type: String,
    },

    receiverPay: {
        cod: Number,
        extra: Number,
        total: Number
    }
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

export default Shipment;