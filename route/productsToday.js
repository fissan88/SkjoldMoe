/**
 * Created by eaajejen54 on 21-05-2017.
 */
const controller = require('../controllers/controller');

module.exports = (express) => {
    const router = express.Router();

    router.route('/api/productsToday')
        .get((req, res) => {
            let getPro = controller.getProductsToday();
            getPro.then((docs) => {
                if(docs) {
                    res.status(200).json(docs);
                } else {
                    res.status(418).json("I am a teapot");
                }
            });
        });

    router.route('/api/productsToday/:isDryGoods')
        .get((req, res) => {
            let getPro = controller.filterGetProductsTodayByIsDryGoods(req.params.isDryGoods);
            getPro.then((docs) => {
                if(docs) {
                    res.status(200).json(docs);
                } else {
                    res.status(418).json("I am a teapot");
                }
            });
        });

    return router;
};