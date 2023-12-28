const Account = require('../models/account');
const Point = require('../models/point');
const Shipment = require('../models/shipment');
const qr = require('qrcode');

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
    const shipmentInfo = req.body;
 
    const shipmentObject = {
        shipmentInfo,
        progress: [
            {
                // Prepare to go out
                from: "Trans",
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

const transstaff_generate_guide = async (req, res) => {
    try {
        const shipmentID = req.body.id;

        // Check if the document with the given shipmentID exists in the database
        const shipment = await Shipment.findOne({ _id: shipmentID });

        if (!shipment) {
            console.error('Shipment not found');
            return res.status(404).json({ error: 'Shipment not found' });
        }

        // Generate QR code data URL
        const qrCodeUrl = await qr.toDataURL(shipmentID);

        // Update the guide field in the Shipment document
        shipment.guide = qrCodeUrl;

        // Save the updated Shipment document
        await shipment.save();

        res.json({ guide: qrCodeUrl });
    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

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

const transstaff_shipment_send_to_gather = (req, res) => {
    const id = req.params.id
    Shipment.findOne({ _id: id })
        .then(updatingShipment => {
            if (!updatingShipment) {
                return res.status(404).json({ error: "Shipment not found" });
            }

            // Add the new status to the status array
            updatingShipment.status.push("Pre-Transit");

            // Save the updated shipment to the database
            return updatingShipment.save();
        })
        .then(updatedShipment => {
            // Respond with the entire updated shipment object
            res.json(updatedShipment.status);
        })
        .catch(error => {
            console.error("Error updating shipment: ", error);
            res.status(500).json({ error: "Internal Server Error" });
        });

}

const transstaff_shipment_verify_from_gather = (req, res) => {
    const shipmentID = req.params.id;
    Shipment.findOne({ _id: shipmentID })
        .then((shipment) => {
            if (
                shipment &&
                shipment.status.length > 0 &&
                shipment.status[shipment.status.length - 1] === "Post-Transit" &&
                shipment.progress.length > 0 &&
                shipment.progress[shipment.progress.length - 1].from === "Gather" &&
                shipment.progress[shipment.progress.length - 1].toID === req.session.capPointID
            ) {
                shipment.status.push("Received");
                shipment.save()
                    .then(updatedShipment => {
                        res.status(200).json(updatedShipment.status);
                    })
                    .catch((saveError) => {
                        res.status(500).json({ error: "Failed to save shipment status" });
                    });
            } else {
                res.json({ msg: "Failed" });
            }
        })
        .catch((error) => {
            res.status(404).json({ error: "Not found" });
        });
}

const transstaff_shipment_send_to_receiver = async (req, res) => {
    const shipmentID = req.params.id;

    try {
        const shipment = await Shipment.findOne({ _id: shipmentID });

        if (shipment.status[shipment.status.length - 1] === "Received") {
            shipment.status.push("Out for delivery");
            await shipment.save();

            const newProgress = {
                from: "Trans",
                pointID: req.session.capPointID,
                fromID: req.session.capPointID,
                toID: shipment.receiverInfo.address,
                date: new Date(),
                staffID: req.session.transstaffID
            };

            shipment.progress.push(newProgress);
            await shipment.save();

            res.status(200).json({
                progress: shipment.progress,
                status: shipment.status
            });
        } else {
            res.status(400).json({ msg: "Failed" });
        }
    } catch (error) {
        console.error("Error sending shipment to trans:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const transstaff_shipment_verify_to_receiver = (req, res) => {
    const shipmentID = req.params.id;

    Shipment.findOne({ _id: shipmentID })
        .then((shipment) => {
            if (
                shipment.status[shipment.status.length - 1] === "Out for delivery" &&
                shipment.progress[shipment.progress.length - 1].from === "Trans"
            ) {
                shipment.status.push("Success");
                shipment.receivedDate = new Date()
                shipment.save()
                    .then(updatedShipment => {
                        res.status(200).json(updatedShipment.status); // Updated response status code
                    })
                    .catch((saveError) => {
                        console.error("Error saving shipment status:", saveError);
                        res.status(500).json({ error: "Failed to save shipment status" });
                    });
            } else {
                res.status(400).json({ msg: "Failed" }); // Updated response status code
            }
        })
        .catch((error) => {
            res.status(404).json({ error: "Not found" });
        });
}

const transstaff_shipment_verify_returned = (req, res) => {
    const shipmentID = req.params.id;

    Shipment.findOne({ _id: shipmentID })
        .then((shipment) => {
            if (
                shipment.status[shipment.status.length - 1] === "Out for delivery" &&
                shipment.progress[shipment.progress.length - 1].from === "Trans"
            ) {
                shipment.status.push("Returned");
                shipment.save()
                    .then(updatedShipment => {
                        res.status(200).json(updatedShipment.status); // Updated response status code
                    })
                    .catch((saveError) => {
                        console.error("Error saving shipment status:", saveError);
                        res.status(500).json({ error: "Failed to save shipment status" });
                    });
            } else {
                res.status(400).json({ msg: "Failed" }); // Updated response status code
            }
        })
        .catch((error) => {
            res.status(404).json({ error: "Not found" });
        });
}

module.exports = {
    transstaff_index,
    transstaff_shipment_create,
    transstaff_generate_guide,
    transstaff_shipment_update_info,
    transstaff_shipment_delete,
    transstaff_shipment_send_to_gather,
    transstaff_shipment_verify_from_gather,
    transstaff_shipment_send_to_receiver,
    transstaff_shipment_verify_to_receiver,
    transstaff_shipment_verify_returned
}