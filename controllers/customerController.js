const Shipment = require('../models/shipment');

// Customer function
const customer_tracking = (req, res) => {
    const guide = req.body.guide;
    Shipment.findOne({guide: guide})
    .then((result) => {
        res.json(result);
    })
    .catch((err) => {
        res.status(404).json({error: "Not Found"})
    })
}

module.exports = {
    customer_tracking
}