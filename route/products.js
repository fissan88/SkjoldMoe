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
            console.log(req.body._id + " " +  req.body.name + " " + req.body.isDryGoods);
            controller.createProduct(req.body._id, req.body.name, req.body.isDryGoods)
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
                          console.log("Kalder controller funktionen updateCollProducts");
                          controller.updateCollProducts(id, name, isDryGoods);
                          res.status(200).json({message: "Produktet blev opdateret"});
                }
            }
            else res.status(500).json({message: "Der gik noget galt ..."});

        });

    router.route('/api/products/:id')
        .get((req, res) => {
            var item = controller.getCollProductById(req.params.id);
            item.then(function (doc) {
                if (doc) {
                    res.status(200).json(doc);
                } else res.status(418).json('I am a teapot');
            })

        })
        .post((req, res) => {

        })
        .delete((req, res) => {
            if(controller.deleteProduct(req.params.id)) {
                res.status(500);
            } else {
                res.status(200).json({message: "Varen blev slettet succesfuldt."});
            }
        });

    router.route('/api/productsToday')
        .get((req, res) => {
            let getPro = controller.getProductsToday();
            getPro.then((docs) => {
                if(docs) {
                    res.status(200).json(docs);
                } else {
                    res.status(418).json('I am a teapot');
                }
            });



        });
    return router;
};
