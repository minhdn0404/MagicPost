const Account = require('../models/account');
const Point = require('../models/point')

// Transcap function

const transcap_index = (req, res, next) => {
    const id = req.params.id;
    Account.find({$and: [{_id: id}, {role: "trans_cap"}]})
    .then((result) => {
        res.json(result)
    })
    .catch((error) => {
        res.status(404).json({error: "Not found"})
    })
}

module.exports = {
    transcap_index
}