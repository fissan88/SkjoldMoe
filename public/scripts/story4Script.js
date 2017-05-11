/**
 * Created by Kes Williams on 10-05-2017.
 */
var expList = [];

var populateExpList = () => {
    $.get('./api/collExpirations/')
        .done(function (data) {
            expList.empty;
            forEach(data).push(expList);
        })
        .fail(console.log("populateExpList .get failed!"));
};

var registerExp = (barcode, date, quantity) => {
    $.post('./api/collExpirations/', {'barcode': barcode, 'date': date, 'quantity': quantity})
        .done(function (data) {
            console.log(data);
        }
            ).fail(alert("Kunne ikke oprette datoregisteringen"))
};

$(document).ready(function () {
    // populateExpList();
    $(document).on('click', '#btnCreateExpiration',function () {

        let barcode = $('#selectedProductBarcode').val();
        console.log("testStory4 script: selected barcode val: " + barcode);
        let date = $('#expDate').val();
        console.log("testStory4 script: selected barcode val: " + date);

        registerExp(barcode, date, 0);
        $('#selectedProductBarcode').reset();
        $('#expDate').reset();
    })
});