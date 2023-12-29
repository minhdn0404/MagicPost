import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Point Schema
const pointSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    address: {
        type: String,
        required: [true, 'Address is required']
    },
    type: {
        // Điểm tập kết: gather
        // Điểm giao dịch: trans
        type: String,
        enum: ['gather', 'trans'],
        required: [true, 'Type is required']
    },
    managed: {
        type: Boolean,
        default: false
    },
    // For trans point
    gatherPointID: {
        type: String,
        required: function() {
            return this.type === "trans";
        },
        message: 'gatherPointID is required for type "trans"'
    },
    statistic: {
        type: [{
            date: Date,
            shipmentID: String,
            move: {
                type: String,
                enum: ["IN", "OUT"]
            }
        }]
    }
}, {timestamps: true}); // Automatically generate timestamp properties on the document

// Point model
const Point = mongoose.model('Point', pointSchema)
// var p = Point({name: 'p1', address: '43 Co Nhue', type: 'gather', managed: true}).save()
// var p = Point({name: 'p2', address: '23 Nguyen Hue', type: 'trans', managed: false}).save()
// var p = Point({name: 'p3', address: '142 Nguyen Trai', type: 'gather', managed: false}).save()
// var p = Point({name: 'p10', address: '124 CG', type: 'trans', managed: false, gatherPointID: "658a7a3659eecab826cfb60a"}).save()
// var p = Point({name: 'p11', address: '747 XT', type: 'trans', managed: false, gatherPointID: "658a7a3659eecab826cfb60c"}).save()
// var p = Point({name: 'p12', address: '745 PH', type: 'trans', managed: false, gatherPointID: "658a7a3659eecab826cfb606"}).save()
// var p = Point({name: 'p13', address: '121 NX', type: 'trans', managed: false, gatherPointID: "658a7a3659eecab826cfb608"}).save()
// var p = Point({name: 'p14', address: '22 PVĐ', type: 'trans', managed: false, gatherPointID: "658a7c0ced2c0acbf3f5cf8f"}).save()

export default Point;
