/**
 * Created by PWM on 09-05-2017.
 */

const controller = require('../controllers/controller');
const collProduc = require('../models/product');

module.exports = (express) => {
    const router = express.Router();

    router.route('/api/expirations')
        .get((req, res) => {
            //get collexp from json element
            res.json(controller.getCollExpiration(req.body.barcode, req.body.date, req.body.quantity));
        })
        .post((req, res) => {
            controller.createCollExpiration(req.body.barcode, req.body.date, req.body.quantity);
        });

    router.route('/api/expirations/:id')
        .get((req, res) => {

        })
        .post((req, res) => {

        })
        .delete((req, res) => {
            controller.deleteCollExpiration(req.params.id);
        });
    return router;
};
