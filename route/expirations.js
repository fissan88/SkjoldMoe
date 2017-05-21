/**
 * Created by tuxzo on 08-05-2017.
 */
const controller = require('../controllers/controller');

module.exports = function (express) {
    const router = express.Router();

    router.route('/api/expirations')
        .get((req, res) => {
            //get all expirations
            let items = controller.getAllExpirations();
            items.then(function (doc){
                items = doc;
                if (items) {
                    res.status(200).json(doc);
                } else res.status(418).json('Iam a teapot');
            });


        })
        .post((req, res) => {
            //creates new expiration
            const BARCODE_REGEX = /^\d{8}|\d{13}|\d{15}$/;
            let inputBarcode = req.body.barcode;
            let inputDate = req.body.date;
            let inputQuantity = req.body.quantity;

            if (BARCODE_REGEX.test(inputBarcode)) {
                    if (inputQuantity >= 0) {
                        controller.createExpiration(req.body.barcode, req.body.date, req.body.quantity);
                        res.status(200).json({message: "Udløbsdatoen blev oprettet"});
                    }
            }

            else res.status(500).json({message: "Der gik noget galt"});

        });

    router.route('/api/expirations/:id')
        .get((req, res) => {
            //gets specific collexp by id
            let tmp = controller.getExpirationById(req.params.id);
            if (tmp.length == 0) res.status(500).json({message: "Udløbsdatoen blev ikke fundet"});
            else res.status(200).json(tmp);
        })
        .put((req, res) => {
            //updates specific exp by id
            const BARCODE_REGEX = /^\d{8}|\d{13}|\d{15}$/;
            let inputId = req.params.id;
            let inputBarcode = req.body.barcode;
            let inputDate = req.body.date;
            let inputQuantity = req.body.quantity;
            let inputIsChecked = req.body.isChecked;

            if(!inputBarcode){
                controller.updateQuantityOfExpiration(inputId, inputQuantity, inputIsChecked);
                res.status(200).json({message: "Udløbsdato blev opdateret"});
            }else if (BARCODE_REGEX.test(inputBarcode)) {
                if (inputDate instanceof Date) {
                    if (inputQuantity >= 0) {
                        controller.updateExpiration(inputId, inputBarcode, inputDate, inputQuantity);
                        res.status(200).json({message: "Udløbsdato blev opdateret"});
                    }
                }
            }
            else res.status(500).json({message: "Der gik noget galt"});

        })
        .delete((req, res) => {
            //deletes specific collexp by id
            let tmp = controller.deleteExpiration(req.params.id);
            if (tmp == Error) {
                res.status(500).json({message: "Der gik noget galt"})
            } else {
                res.status(200).json({message: "Udløbsdato blev slettet"})
            }
        });

    router.route('/api/expirationsToday')
        .get((req, res) => {
            //gets expirations from today
            let inputDate = new Date();
            inputDate.setUTCHours(0, 0, 0, 0);

            controller.getExpToday(inputDate).then(function (doc) {
                if (doc) {
                    res.status(200).json(doc);
                } else res.status(418).json("I am a teapot");
            })
        });

    return router;
};