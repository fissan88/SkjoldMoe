/**
 * Created by tuxzo on 08-05-2017.
 */
var controller = require('../controllers/controller');
var collExp = require('../models/collExpirations');

module.exports = function (express) {
    var router = express.Router();

    router.route('/api/collExpirations')
        .get((req, res) => {
        //get collexp from json element
           res.json(controller.getCollExpiration(req.body.barcode, req.body.date, req.body.quantity));
        })
        .post((req, res) => {
            controller.createCollExpiration(req.body.barcode, req.body.date, req.body.quantity);
        });

    router.route('/api/collExpirations/:id')
        .get((req, res) => {

        })
        .post((req, res) => {

        })
        .delete((req, res) => {
            controller.deleteCollExpiration(req.params.id);
        });
    return router;
};