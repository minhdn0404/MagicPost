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

module.exports = {
    manager_index,
    manager_points
}