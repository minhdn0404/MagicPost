import Account from '../models/account.js';
import Point from '../models/point.js';

// Manager function
const manager_index = (req, res, next) => {
    Account.find({ role: "manager" })
    .then((result) => {
        if (result.length === 0) {
            res.status(404).json({error: "No manager accounts found"})
        } else {
            res.json(result);
        }
    })
    .catch((error) => {
        console.error('Error fetching manager accounts:', error);
        res.status(500).json({error: "Internal Server Error"})
    })
}

const manager_points_get = (req, res) => {
    Point.find().sort({createdAt: -1})
    .then((result) => {
        if (result.length === 0) {
            res.status(404).json({error: "No points found"})
        } else {
            res.json(result);
        }
    })
    .catch((error) => {
        console.error('Error fetching points:', error);
        res.status(500).json({error: "Internal Server Error"})
    })
}

const manager_point_create = (req, res) => {
    Point.findOne({ address: req.body.address })
    .then(point => {
        // Check if a document with the same address was found
        const addressExists = !!point;

        // `addressExists` = true if a document with the same address was found
        if (addressExists == true) {
            res.status(409).json({ error: 'Conflict - Address already existed' });
        } else {
            // Create new point and save it
            Point.create(req.body)
            .then((data) => {
                res.status(201).json(data)
            })
            .catch((err) => {
                res.status(422).json({error: err.message})
            })
        }
    })
    .catch(err => {
        console.error('Error creating point:', err);
        res.status(500).json({error: "Internal Server Error"})
    });
}

const manager_point_update = (req, res) => {
    const id = req.params.id
    Point.findByIdAndUpdate(id, req.body)
    .then((old_obj) => {
        Point.findOne({_id: id}).then((new_obj) => {
            res.status(200).json({ old_obj, new_obj });
        })
    })
    .catch((error) => {
        console.error("Error updating point", error);
        res.status(500).json({error: "Internal Server Error"})
    })
}

const manager_point_details = (req, res) => {
    const id = req.params.id;
    Point.findById(id)
    .then((result) => {
        res.json(result)
    })
    .catch((error) => {
        res.status(404).json({error: "Not found"})
    })
}

const manager_point_delete = (req, res) => {
    const id = req.params.id;
    // Delete point by ID
    Point.findByIdAndDelete(id)
    .then((data_removed) => {
        res.json(data_removed)
    })
    .catch((error) => {
        res.status(404).json({error: "Not found"})
    })
}

const manager_captain_get = (req, res) => {
    Account.find({ role: { $in: ['trans_cap', 'gather_cap'] } }).sort({createdAt: -1})
    .then((result) => {
        res.json(result)
    })
    .catch((err) => {
        res.status(404).json({error: "No captain found"});
    })
}

const manager_captain_get_points = (req, res) => {
    // res.json(req.body)
    Account.findOne({ username: req.body.username})
    .then(acc_u => {
        const acc_u_Ext = !!acc_u;

        if (acc_u_Ext == true) {
            res.status(409).json({ error: 'Conflict - Username already existed' });
        } else {
            Account.findOne({ password: req.body.password})
            .then(acc_p => {
                const acc_p_Ext = !!acc_p;

                if (acc_p_Ext == true) {
                    res.status(409).json({ error: 'Conflict - Password already existed' })
                } else {
                    // res.json(req.body)
                    if (req.body.role == "gather_cap") {
                        Point.find({$and: [{type: "gather"}, {managed: false}] })
                        .then(points => {
                            res.json(points)
                        })
                        .catch(error => {
                            console.error("Error fetching gather points:", error);
                            res.status(500).json({ error: "Internal Server Error" });
                        })
                    } else if (req.body.role == "trans_cap") {
                        Point.find({$and: [{type: "trans"}, {managed: false}] })
                        .then(points => {
                            res.json(points)
                        })
                        .catch(error => {
                            console.error("Error fetching trans points:", error);
                            res.status(500).json({ error: "Internal Server Error" });
                        })
                    } else {
                        res.status(400).json({error: "Invalid role"})
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

const manager_captain_create = (req, res) => {
    Account.create(req.body)
    .then(newAcc => {
        // Update point managed
        Point.findByIdAndUpdate(req.body.capPointID, {managed: true}, {new: true})
        .then(updatedPoint => {
            console.log(updatedPoint);

            res.status(201).json(newAcc);
        })
        .catch(error => {
            console.error("Error updating Point:", error);
            res.status(500).json({ error: "Internal Server Error" });
        });
    })
    .catch((err) => {
        // Handle errors during the Account creation
        res.status(422).json({ error: err.message });
    });
}

const manager_captain_details = (req, res) => {
    const id = req.params.id;
    Account.findById(id)
    .then((result) => {
        res.json(result)
    })
    .catch((error) => {
        res.status(404).json({error: "Not found"})
    })
}

const manager_captain_update = (req, res) => {
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

const manager_captain_delete = (req, res) => {
    const id = req.params.id;
    Account.findByIdAndDelete(id)
    .then((data_removed) => {
        // Update point managed
        Point.findByIdAndUpdate(data_removed.capPointID, {managed: false}, {new: true})
        .then(updatedPoint => {
            console.log(updatedPoint);
            res.json(data_removed)
        })
        .catch(error => {
            console.error("Error updating Point:", error);
            res.status(500).json({ error: "Internal Server Error" });
        });
    })
    .catch((error) => {
        res.status(404).json({error: "Not found"})
    })
}

export default {
    manager_index,
    manager_points_get,
    manager_point_create,
    manager_point_update,
    manager_point_details,
    manager_point_delete,
    manager_captain_get,
    manager_captain_get_points,
    manager_captain_create,
    manager_captain_update,
    manager_captain_details,
    manager_captain_delete
}