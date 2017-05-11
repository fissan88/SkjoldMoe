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

            if (BARCODE_REGEX.test(id)) {
                  if (name != null) {
                      //toDo: HJÆLP MIG, jeg virker ikke
                      // if(typeof isDryGoods === "boolean")
                      // {
                          console.log("Kalder controller funktionen updateCollProducts");
                          controller.updateCollProducts(id, name, isDryGoods);
                          res.status(200).json({message: "Objekt blev opdateret"});
                      // }

                }
            }
            else res.status(500).json({message: "Der gik noget galt"});

        });

    router.route('/api/products/:id')
        .get((req, res) => {

        })
        .post((req, res) => {

        })
        .delete((req, res) => {
            controller.deleteCollExpiration(req.params.id);
        });
    return router;
};
