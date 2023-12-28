const Account = require('../models/account');
const Point = require('../models/point');
const Shipment = require('../models/shipment');

// Transstaff function

const transstaff_index = (req, res, next) => {
    const thisID = req.body.id;
    // Staff ID
    req.session.transstaffID = thisID

    Account.findOne({$and: [{_id: thisID}, {role: "trans_staff"}]})
    .then((staff) => {
        // CaptainID that manage this staff
        req.session.captainID = staff.captainID
        Account.findOne({_id: req.session.captainID})
        .then((captain) => { 
            // PointID thatr this captainID manage
            req.session.capPointID = captain.capPointID;
            Point.findOne({_id: req.session.capPointID})
            .then((thisPoint) => {
                // GatherPointID that this trans point refer to
                req.session.gatherPointID = thisPoint.gatherPointID;
                Point.findOne({_id: req.session.gatherPointID})
                .then((gatherPoint) => {
                    res.json({staff, captain, thisPoint, gatherPoint})
                })
                .catch((error) => {
                    res.status(404).json({error: "No gather point found"})
                })
            })
            .catch((error) => {
                res.status(404).json({error: "No trans point found"})
            })
        })
        .catch((error) => {
            res.status(404).json({error: "No captain found"})
        })
    })
    .catch((error) => {
        res.status(404).json({error: "No staff found"})
    })

}

const transstaff_create_shipment = (req, res) => {
    const senderInfo = req.body.senderInfo;
    const receiverInfo = req.body.receiverInfo;
 
    const shipmentObject = {
        senderInfo,
        receiverInfo,
        progress: [
            {
                action: "Out",
                pointID: req.session.capPointID,
                fromID: req.session.capPointID,
                toID: req.session.gatherPointID,
                date: new Date(),
                staffID: req.session.staffID
            },
            // Add more progress items as needed
        ],
        shipmentDate: new Date(),
        receivedDate: null, // Set to an actual date when received
        status: "Pending" // Set to the desired initial status
    };

    // res.status(200).json({senderInfo, receiverInfo});
    // console.log(req.session.transstaffID, req.session.captainID, req.session.capPointID, req.session.gatherPointID)
    var newShipment = Shipment(shipmentObject).save();
    res.json(newShipment)
}

module.exports = {
    transstaff_index,
    transstaff_create_shipment
}