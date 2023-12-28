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
            // PointID that this captainID manage
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

const transstaff_shipment_create = (req, res) => {
    const senderInfo = req.body.senderInfo;
    const receiverInfo = req.body.receiverInfo;
 
    const shipmentObject = {
        senderInfo,
        receiverInfo,
        progress: [
            {
                // Prepare to go out
                action: "Send",
                pointID: req.session.capPointID,
                fromID: req.session.capPointID,
                toID: req.session.gatherPointID,
                date: new Date(),
                staffID: req.session.transstaffID
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
    res.json(shipmentObject)
}

const transstaff_shipment_update_info = (req, res) => {
    const id = req.params.id
    Shipment.findByIdAndUpdate(id, req.body, {new: true})
    .then(updatedShipment => {
        if (!updatedShipment) {
            return res.status(404).json({error: "Shipment not found"})
        }
        res.json(updatedShipment);
    })
    .catch(error => {
        console.error("Error updating shipment: ", error);
        res.status(500).json({error: "Internal Server Error"})
    })
}

const transstaff_shipment_delete = (req, res) => {
    const id = req.params.id;
    Shipment.findByIdAndDelete(id)
    .then((data_removed) => {
        res.json(data_removed)
    })
    .catch((error) => {
        res.status(404).json({error: "Not found"})
    })
}

module.exports = {
    transstaff_index,
    transstaff_shipment_create,
    transstaff_shipment_update_info,
    transstaff_shipment_delete
}