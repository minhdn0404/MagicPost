const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Shipment Schema
const shipmentSchema = new Schema({
    senderID: {
        type: String,
        required: [true, 'senderID is required'] 
    },
    receiverID: {
        type: String,
        required: [true, 'receiverID is required']
    },
    type: {
        type: String,
        default: "Any"
    },
    content: {
        quantity: {
            type: Number,
            required: [true, 'content quantity is required']
        },
        value: {
            type: Number,
            required: [true, 'content value is required']
        },
        currency: {
            type: String,
            required: [true, 'content currency is required']
        },
        document: {
            type: Boolean,
            required: [true, 'content document is required']
        },
    },
    special: {
        type: String,
        required: [true, 'special is required']
    },
    guide: {
        type: Number,
        required: [true, 'guide is required']
    },
    weight: {
        value: {
            type: Number,
            required: [true, 'weight value is required']
        },
        unit: {
            type: String,
            required: [true, 'weight unit is required']
        },
    },
    shipmentDate: {
        type: Date,
        required: [true, 'shipmentDate is required']
    },
    charge: {
        base: {
            type: Number,
            required: [true, 'charge base is required']
        },
        extra: {
            type: Number,
            required: [true, 'charge extra is required']
        },
        gtgt: {
            type: Number,
            required: [true, 'charge gtgt is required']
        },
        vat: {
            type: Number,
            required: [true, 'charge vat is required']
        },
        other: {
            type: Number,
            required: [true, 'charge other is required']
        },
        total: {
            type: Number,
            required: [true, 'charge total is required']
        }
    },
    isReceiverPay: {
        type: Boolean,
        required: [true, 'isReceiverPay is required']
    },
    receiverPay: {
        cod: {
            type: Number,
            required: [true, 'receiverPay cod is required']
        },
        extra: {
            type: Number,
            required: [true, 'receiverPay extra is required']
        },
        total: {
            type: Number,
            required: [true, 'receiverPay total is required']
        }
    },
    receivedDate: {
        type: Date,
        required: [true, 'receivedDate total is required']
    },
    isSuccessful: boolean,
}, {timestamps: true});