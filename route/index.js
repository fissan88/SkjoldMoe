/**
 * Created by eaajejen54 on 20-04-2017.
 */
arrVarer =  [
    {vareNavn: "vare1", udløbsDato: "i morgen", antal: "10"},
    {vareNavn: "vare2", udløbsDato: "i morgen", antal: "10"},
    {vareNavn: "vare3", udløbsDato: "i morgen", antal: "10"},
    {vareNavn: "vare4", udløbsDato: "i morgen", antal: "10"},
    {vareNavn: "vare5", udløbsDato: "i morgen", antal: "10"}
];

module.exports = function (express) {
    var router = express.Router();

    router.route('/')
        .get(function (req, res) {
            // res.send("Herro");
            res.render('layout', {
                vareListe: arrVarer
            });
        });
    return router;
};