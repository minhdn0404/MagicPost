import Account from "../models/account.js";
import Point from "../models/point.js";

// Gathercap function

const gathercap_index = (req, res, next) => {
    const thisID = req.body.id;
    // Store the ID in the session
    req.session.gathercapID = thisID

    Account.find({$and: [{_id: thisID}, {role: "gather_cap"}]})
    .then((result) => {
        res.json(result)
    })
    .catch((error) => {
        res.status(404).json({error: "Not found"})
    })
}

const gathercap_staffs_get = (req, res) => {
    const thisID = req.session.gathercapID;
    Account.find({$and: [{captainID: thisID}, {role: "gather_staff"}]}).sort({createdAt: -1})
    .then((result) => {
        if (result.length === 0) {
            res.status(404).json({error: "No staff found"})
        } else {
            res.json(result);
        }
    })
    .catch((error) => {
        console.error('Error fetching staffs:', error);
        res.status(500).json({error: "Internal Server Error"})
    })
}

const gathercap_staff_create = (req, res) => {
    const thisID = req.session.gathercapID;
    
    Account.findOne({ username: req.body.username})
    .then(acc_u => {
        const acc_u_Ext =!! acc_u;
        
        if (acc_u_Ext == true) {
            res.status(409).json({ error: 'Conflict - Username already existed' });
        } else {
            Account.findOne({ password: req.body.password})
            .then(acc_p => {
                const acc_p_Ext = !!acc_p;

                if (acc_p_Ext == true) {
                    res.status(409).json({ error: 'Conflict - Password already existed' })
                } else {
                    if (req.body.role == "gather_staff") {
                        Account.create(req.body)
                        .then(newAcc => {
                            res.status(201).json(newAcc);
                        })
                        .catch((err) => {
                            // Handle errors during the Account creation
                            res.status(422).json({ error: err.message });
                        });
                    } else {
                        console.error("Invalid role")
                    }
                }
            })
            .catch(err => {
                console.error('Error validate password:', err);
                res.status(500).json({error: "Internal Server Error"})
            })
        }
    })
    .catch(err => {
        console.error('Error validate username:', err);
        res.status(500).json({error: "Internal Server Error"})
    })
}

const gathercap_staff_update = (req, res) => {
    const id = req.params.id
    Account.findByIdAndUpdate(id, req.body, {new: true})
    .then(updatedAcc => {
        if (!updatedAcc) {
            return res.status(404).json({error: "Account not found"})
        }
        res.json(updatedAcc);
    })
    .catch(error => {
        console.error("Error updating account: ", error);
        res.status(500).json({error: "Internal Server Error"})
    })
}

const gathercap_staff_delete = (req, res) => {
    const id = req.params.id;
    Account.findByIdAndDelete(id)
    .then((data_removed) => {
        res.json(data_removed)
    })
    .catch((error) => {
        res.status(404).json({error: "Not found"})
    })
}

const gathercap_shipment_statistic = async (req, res) => {
    try {
        const captain = await Account.findOne({ _id: req.session.gathercapID });

        if (!captain) {
            return res.status(404).json({ error: "Captain not found" });
        }

        const point = await Point.findOne({ _id: captain.capPointID });

        if (!point) {
            return res.status(404).json({ error: "Point not found" });
        }

        res.json(point.statistic);
    } catch (error) {
        console.error("Error in gathercap_shipment_statistic:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const gathercapController = {
    gathercap_index,
    gathercap_staffs_get,
    gathercap_staff_create,
    gathercap_staff_update,
    gathercap_staff_delete,
    gathercap_shipment_statistic
}

export default gathercapController