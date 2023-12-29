import Account from "../models/account.js";
import Point from "../models/point.js";
import Shipment from "../models/shipment.js";

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
    const shipmentID = req.body.id;

    Shipment.findOne({ _id: shipmentID })
        .then((shipment) => {
            if (
                shipment &&
                shipment.status.length > 0 &&
                shipment.status[shipment.status.length - 1] === "Pre-Transit" &&
                shipment.progress.length > 0 &&
                shipment.progress[shipment.progress.length - 1].from === "Trans" &&
                shipment.progress[shipment.progress.length - 1].toID === req.session.capPointID
            ) {
                Point.findOne({ _id: req.session.capPointID })
                    .then((point) => {
                        var stat_date = new Date();
                        const stat = { date: stat_date, shipmentID: req.session.capPointID, move: "IN" };
                        point.statistic.push(stat);

                        // Use return to pass the promise to the next `.then()`
                        return point.save();
                    })
                    .then(() => {
                        shipment.status.push("Gather-From");
                        return shipment.save();
                    })
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
};

const gatherstaff_shipment_send_to_gather = async (req, res) => {
    const shipmentID = req.params.id;
    const gatherTargetID = req.body.id;

    try {
        const shipment = await Shipment.findOne({ _id: shipmentID });

        if (shipment.status[shipment.status.length - 1] === "Gather-From") {
            const point = await Point.findOne({ _id: req.session.capPointID });

            if (point) {
                var stat_date = new Date();
                const stat = { date: stat_date, shipmentID: req.session.capPointID, move: "OUT" };
                point.statistic.push(stat);
                await point.save();
            } else {
                return res.status(404).json({ error: "Point not found" });
            }

            shipment.status.push("In-Transit");
            await shipment.save();

            const newProgress = {
                from: "Gather",
                pointID: req.session.capPointID,
                fromID: req.session.capPointID,
                toID: gatherTargetID,
                date: new Date(),
                staffID: req.session.gatherstaffID
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
        console.error("Error sending shipment to gather:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const gatherstaff_shipment_verify_from_gather = async (req, res) => {
    try {
        const shipmentID = req.params.id;
        const shipment = await Shipment.findOne({ _id: shipmentID });

        if (
            shipment &&
            shipment.status.length > 0 &&
            shipment.status[shipment.status.length - 1] === "In-Transit" &&
            shipment.progress.length > 0 &&
            shipment.progress[shipment.progress.length - 1].from === "Gather" &&
            shipment.progress[shipment.progress.length - 1].toID === req.session.capPointID
        ) {
            const point = await Point.findOne({ _id: req.session.capPointID });

            if (point) {
                var stat_date = new Date();
                const stat = { date: stat_date, shipmentID: req.session.capPointID, move: "IN" };
                point.statistic.push(stat);
                await point.save();
            } else {
                return res.status(404).json({ error: "Point not found" });
            }

            shipment.status.push("Gather-To");
            await shipment.save();
            res.status(200).json(shipment.status);
        } else {
            res.json({ msg: "Failed" });
        }
    } catch (error) {
        console.error("Error verifying shipment from gather:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const gatherstaff_shipment_send_to_trans = async (req, res) => {
    try {
        const shipmentID = req.params.id;
        const transTargetID = req.body.id;

        const shipment = await Shipment.findOne({ _id: shipmentID });

        if (shipment.status[shipment.status.length - 1] === "Gather-To") {
            const point = await Point.findOne({ _id: req.session.capPointID });

            if (point) {
                var stat_date = new Date();
                const stat = { date: stat_date, shipmentID: req.session.capPointID, move: "OUT" };
                point.statistic.push(stat);
                await point.save();
            } else {
                return res.status(404).json({ error: "Point not found" });
            }

            shipment.status.push("Post-Transit");
            await shipment.save();

            const newProgress = {
                from: "Gather",
                pointID: req.session.capPointID,
                fromID: req.session.capPointID,
                toID: transTargetID,
                date: new Date(),
                staffID: req.session.gatherstaffID
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
};

export default {
    gatherstaff_index,
    gatherstaff_shipment_verify_from_trans,
    gatherstaff_shipment_send_to_gather,
    gatherstaff_shipment_verify_from_gather,
    gatherstaff_shipment_send_to_trans
}