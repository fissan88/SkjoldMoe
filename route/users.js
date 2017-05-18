/**
 * Created by PWM on 17-May-17.
 */

const controller = require('../controllers/controller');
const collUsers = require('../models/user');

module.exports = (express) => {
    const router = express.Router();

    router.route('/api/users')
        .get((req, res) => {
            collUsers.find({}, (err, docs) => {
                res.json(docs);
            });
        })
        .post((req, res) => {
            console.log(req.body.name + " " +  req.body.password);
            controller.createUser(req.body.name, req.body.password)
                .then(function() {
                    res.json({message: 'User saved!'});
                })
                .catch(function(err) {
                    console.error("Error: " + err);
                    if (err.stack) console.error(err.stack);
                    res.status(500).send(err);
                });
        });

    router.route('/api/user/:username')
        .get((req, res) =>{
            controller.hasUsername(req.params.username).then((doc) =>{
                res.status(200).json(doc[0] == undefined);
            });



        });
    return router;
};