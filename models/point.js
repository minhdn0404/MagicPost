import mongoose from 'mongoose';

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
// var p = Point({name: 'p1', address: '43 Co Nhue', type: 'gather'}).save()
// var p = Point({name: 'p2', address: '23 Nguyen Hue', type: 'trans'}).save()
// var p = Point({name: 'p3', address: '142 Nguyen Trai', type: 'gather'}).save()
// var p = Point({name: 'p4', address: '45 LTV', type: 'trans'}).save()
// var p = Point({name: 'p5', address: '424 Duong Uanh', type: 'gather'}).save()
// var p = Point({name: 'p6', address: '425 Le Thuy', type: 'trans'}).save()
// var p = Point({name: 'p7', address: '141 TĐN', type: 'gather'}).save()
// var p = Point({name: 'p8', address: '222 Pho N', type: 'trans'}).save()

export default Point;
