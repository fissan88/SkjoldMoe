/**
 * Created by eaajejen54 on 20-04-2017.
 */

module.exports = function (express) {
    var router = express.Router();

    var arrVarer =  [
        {vareNavn: "vare1", udløbsDato: "i morgen", antal: "10"},
        {vareNavn: "vare2", udløbsDato: "i morgen", antal: "10"},
        {vareNavn: "vare3", udløbsDato: "i morgen", antal: "10"},
        {vareNavn: "vare4", udløbsDato: "i morgen", antal: "10"},
        {vareNavn: "vare5", udløbsDato: "i morgen", antal: "10"}
    ];

    router.route('/')
        .get(function (req, res) {
            res.render('index', {
                vareListe: arrVarer
            });
        })
        .post(function (req,res) {
            
        });

    return router;
};