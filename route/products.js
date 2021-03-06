/**
 * Created by PWM on 09-05-2017.
 */

const controller = require('../controllers/controller');
const collProduct = require('../models/product');

module.exports = (express) => {
    const router = express.Router();

    router.route('/api/products')
        .get((req, res) => {
            collProduct.find({}, (err, docs) => {
                res.json(docs);
            });
        })
        .post((req, res) => {
            controller.createProduct(req.body._id, req.body.name, req.body.isDryGoods, req.body.orderNumber)
                .then(function() {
                    res.json({message: 'Product saved!'});
                })
                .catch(function(err) {
                    console.error("Error: " + err);
                    if (err.stack) console.error(err.stack);
                    res.status(500).send(err);
                });
        })
        .put((req,res) => {
            const BARCODE_REGEX = /^\d{8}|\d{13}|\d{15}$/;
            let id = req.body._id;
            let name = req.body.name;
            let isDryGoods = req.body.isDryGoods;
            console.log(isDryGoods.constructor.name);

            if (BARCODE_REGEX.test(id)) {
                  if (name !== null) {
                          console.log("Kalder controller funktionen updateProduct");
                          controller.updateProduct(id, name, isDryGoods);
                          res.status(200).json({message: "Produktet blev opdateret"});
                }
            }
            else res.status(500).json({message: "Der gik noget galt ..."});

        });

    router.route('/api/products/:id')
        .get((req, res) => {
            if(req.params.id.length === 6) {
                var item = controller.getProductByOrderNumber(req.params.id);
            } else {
                var item = controller.getProductById(req.params.id);
            }
            item.then(function (doc) {
                if (doc) {
                    res.status(200).json(doc);
                } else res.status(418).json("I'm a teapot");
            })

        })
        .delete((req, res) => {
            if(controller.deleteProduct(req.params.id)) {
                res.status(500);
            } else {
                res.status(200).json({message: "Varen blev slettet succesfuldt."});
            }
        });

    return router;
};
