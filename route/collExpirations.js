/**
 * Created by tuxzo on 08-05-2017.
 */
var controller = require('../controllers/controller');

module.exports = function (express) {
    var router = express.Router();

    router.route('/api/collExpirations')
        .get((req, res) => {
            //get collexp from values by find
            //    res.json(controller.getCollExpiration(req.body.barcode, req.body.date, req.body.quantity));
            var items = controller.getAllCollExpirations();
            items.then(function (doc) {
                items = doc;
                if (items) {
                    res.status(200).json(doc);
                } else res.status(418).json('Iam a teapot');
            });


        })
        .post((req, res) => {
            //creates new coll exp
            const BARCODE_REGEX = /^\d{8}|\d{13}|\d{15}$/;
            let inputBarcode = req.body.barcode;
            let inputDate = req.body.date;
            let inputQuantity = req.body.quantity;

            if (BARCODE_REGEX.test(inputBarcode)) {
                // if (inputDate instanceof Date) {
                if (inputQuantity >= 0) {
                    controller.createCollExpiration(req.body.barcode, req.body.date, req.body.quantity);
                    res.status(200).json({message: "Objekt blev oprettet"});
                }
                // }
            }
            else res.status(500).json({message: "Der gik noget galt"});

        });

    router.route('/api/collExpirations/:id')
        .get((req, res) => {
            //gets specific collexp by id
            let tmp = controller.getCollExpirationById(req.params.id);
            if (tmp.length == 0) res.status(500).json({message: "Blev ikke fundet"});
            else res.status(200).json(tmp);
        })
        .put((req, res) => {
            //updates specific collexp by id
            const BARCODE_REGEX = /^\d{8}|\d{13}|\d{15}$/;
            let inputId = req.params.id;
            let inputBarcode = req.body.barcode;
            let inputDate = req.body.date;
            let inputQuantity = req.body.quantity;

            if (!inputBarcode) {
                controller.updateQuantityCollExpiration(inputId, inputQuantity);
                res.status(200).json({message: "Objekt blev opdateret"});
            } else if (BARCODE_REGEX.test(inputBarcode)) {
                if (inputDate instanceof Date) {
                    if (inputQuantity >= 0) {
                        controller.updateCollExpiration(inputId, inputBarcode, inputDate, inputQuantity);
                        res.status(200).json({message: "Objekt blev opdateret"});
                    }
                }
            }
            else res.status(500).json({message: "Der gik noget galt"});

        })
        .delete((req, res) => {
            //deletes specific collexp by id
            let tmp = controller.deleteCollExpiration(req.params.id);
            if (tmp == Error) {
                res.status(500).json({message: "Der gik noget galt"})
            } else {
                res.status(200).json({message: "Objekt blev slettet"})
            }
        });

    router.route('/api/collExpToday')
        .get((req, res) => {
            //gets expirations from today
            let inputDate = new Date();
            inputDate.setUTCHours(0, 0, 0, 0);

            controller.getExpToday(inputDate).then(function (doc) {
                if (doc) {
                    res.status(200).json(doc);
                } else res.status(418).json('Iam a teapot');
            })
        });

    router.route('/api/collExpToday/:barcode')
        .get((req, res) => {
            //gets expirations from today
            let inputDate = new Date();
            inputDate.setUTCHours(0, 0, 0, 0);

            controller.getExpToday(inputDate).then(function (docs) {

                // if (doc) {
                //     res.status(200).json(doc);
                // } else res.status(418).json('Iam a teapot');
            })
        });


    return router;
};