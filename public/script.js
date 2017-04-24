/**
 * Created by tuxzo on 03-04-2017.
 */
// import Quagga from 'quagga'; // ES6
const Quagga = require('quagga').default; // Common JS (important: default)

Quagga.init({
    inputStream : {
        name : "Live",
        type : "LiveStream",
        target: document.querySelector('#scanPic')    // Or '#yourElement' (optional)
    },
    decoder : {
        readers : ["code_128_reader"]
    }
}, function(err) {
    if (err) {
        console.log(err);
        return
    }
    console.log("Initialization finished. Ready to start");
    Quagga.start();
});

$("#scanBtn").click(Quagga.start());