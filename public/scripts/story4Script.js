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
        })
};

$(document).ready(function () {
    populateExpList();
    let barcode = $('#selectedProductBarcode').val();
    let date = $('#expDate').val();

    $('#btnCreateExpiration').click(function () {
        registerExp(barcode, date, 0);
        $('#selectedProductBarcode').val('');
        $('#expDate')._clearDate(this);
    })
});