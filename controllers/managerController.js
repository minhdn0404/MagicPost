const Account = require('../models/account');
const Point = require('../models/point')

// Manager function

const manager_index = (req, res) => {
    Account.find({role: "manager"})
    .then((result) => {
        res.render('manager', {title: 'Manager Home page', manager: result})
    })
    .catch((err) => {
        res.status(404).render('404', {title: "Account not found"});
    })
}

const manager_points = (req, res) => {
    Point.find().sort({createdAt: -1})
    .then((result) => {
        res.render('points', {title: 'Points page', points: result})
    })
    .catch((err) => {
        res.status(404).render('404', {title: "No point found"});
    })
}

const manager_create_point = (req, res) => {
    console.log(req.body);
    Point.findOne({ address: req.body.address })
    .then(point => {
        // Check if a document with the same address was found
        const addressExists = !!point;

        // `addressExists` will be true if a document with the same address was found
        if (addressExists == true) {
            console.error("Already existed address")
            
            res.status(409).json({ error: 'Conflict - Object with the same property value already exists' });
        } else {
            // Create new point and save it
            const point = new Point(req.body);
            point.save()
            .then((data) => {
                // Send the data back to frontend
                res.json(data)
            })
            .catch((err) => {
                console.log(err);
            })
        }
    })
    .catch(err => {
        // Handle the error
        console.error(err);
    });
}

module.exports = {
    manager_index,
    manager_points,
    manager_create_point
}