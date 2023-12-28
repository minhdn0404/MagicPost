const Account = require('../models/account');
const Point = require('../models/point');
const Shipment = require('../models/shipment');

// Gather staff function
const gatherstaff_index = (req, res) => {
    const thisID = req.body.id;
    // Staff ID
    req.session.gatherstaffID = thisID

    Account.findOne({$and: [{_id: thisID}, {role: "gather_staff"}]})
    .then((staff) => {
        // CaptainID that manage this staff
        req.session.captainID = staff.captainID
        Account.findOne({_id: req.session.captainID})
        .then((captain) => {
            // PointID that this captainID manage
            req.session.capPointID = captain.capPointID;
            Point.findOne({_id: req.session.capPointID})
            .then((thisPoint) => {
                res.json({staff, captain, thisPoint})
            })
            .catch((error) => {
                res.status(404).json({error: "No gather point found"})
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

const gatherstaff_shipment_verify_from_trans = (req, res) => {
    
}

module.exports = {
    gatherstaff_index,
    gatherstaff_shipment_verify_from_trans
}