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
        });

    router.route('/api/products/:id')
        .get((req, res) => {

        })
        .post((req, res) => {

        })
        .put((req,res) => {
            var id = req.param(id);
            var name = req.body.name;
            var isDryGoods = req.body.isDryGoods;



        })
        .delete((req, res) => {
            controller.deleteCollExpiration(req.params.id);
        });
    return router;
};
