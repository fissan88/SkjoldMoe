/**
 * Created by PWM on 17-May-17.
 */

const controller = require('../controllers/controller');
const collUsers = require('../models/user');

module.exports = (express) => {
    const router = express.Router();

    router.route('/api/users')
        .get((req, res) => {
            collProduct.find({}, (err, docs) => {
                res.json(docs);
            });
        })
        .post((req, res) => {
            console.log(req.body.name + " " +  req.body.password);
            controller.createProduct(req.body.name, req.body.password)
                .then(function() {
                    res.json({message: 'User saved!'});
                })
                .catch(function(err) {
                    console.error("Error: " + err);
                    if (err.stack) console.error(err.stack);
                    res.status(500).send(err);
                });
        });
    return router;
};