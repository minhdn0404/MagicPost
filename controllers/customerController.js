const Shipment = require('../models/shipment');

// Customer function
const customer_tracking = (req, res) => {
    const id = req.body.id;
    Shipment.findById(id)
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