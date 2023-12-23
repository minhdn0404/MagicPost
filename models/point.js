const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Point Schema
const pointSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    type: {
        // Điểm tập kết: gather
        // Điểm giao dịch: trans
        type: String,
        required: true
    }
}, {timestamps: true}); // Automatically generate timestamp properties on the document

// Point model
const Point = mongoose.model('Point', pointSchema)
// var p1 = Point({name: 'p1', address: '43 Co Nhue', type: 'gather'}).save()
// var p2 = Point({name: 'p2', address: '23 Nguyen Hue', type: 'trans'}).save()

module.exports = Point;
