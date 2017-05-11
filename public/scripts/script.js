/**
 * Created by tuxzo on 03-04-2017.
 */

$(document).ready(function () {

// FUNCTIONS GETTING FROM SERVER
// =============================================================================

    function registerExp(barcode, date, quantity) {
        return new Promise((resolve, reject) => {
            $.post('./api/collExpirations/', {'barcode': barcode, 'date': date, 'quantity': quantity})
                .done(function (data) {
                        console.log(data);
                        resolve();
                    }
                ).fail(() => {
                alert("Kunne ikke oprette datoregisteringen");
                reject();
            })
        });
    }

// RENDERING OF PAGES
// =============================================================================
    function compileNewBody(templateName) {
        $.get('../views/' + templateName, function (template) {
            $('#container').empty();
            let compiled = Handlebars.compile(template);
            let html = compiled({});
            $('#container').append(html);
        });
    }

    function renderRegistrer() {
        compileNewBody("registrer.hbs");
        $.get('/api/products', (req, res) => {
            for (let i in req) {
                $('#wareList').append('<li  id="listItem">'
                    + '<a href="#" data-barcode="' + req[i]._id + '">'
                    + req[i]._id + ' - '
                    + req[i].name + ''
                    + '</a>'
                    + '</li>');
            }
        });
    }

// BUTTON ACTIONS
// =============================================================================

    $('#btnDatoliste').click(function () {
        compileNewBody("index.hbs");
    });

    $('#btnRegistrer').click(function () {
        renderRegistrer();
    });

    $('#btnKasseret').click(function () {
        compileNewBody("kasseret.hbs");
    });

    $('#btnStatistik').click(function () {
        compileNewBody("statistik.hbs");
    });

    $(document).on('click', '#btnCreateProduct', function () {
        console.log("I'm alive");

        let newProduct = {
            _id: $('#newProductBarcode').val(),
            name: $('#newProductName').val(),
            isDryGoods: $('#isDryGoods').is(':checked')
        };

        $.post("/api/products", newProduct, function (data) {
            alert(data);
        });

        renderRegistrer();
    });

    $(document).on('click', 'li', (event) => {
        console.log($(event.target).data('barcode'));
        $('#selectedProductBarcode').val($(event.target).data('barcode'));

    });

    $(document).on('click', '#btnCreateExpiration', function () {
        let barcode = $('#selectedProductBarcode').val();
        console.log("testStory4 script: selected barcode val: " + barcode);
        let date = $('#expDate').val();
        console.log("testStory4 script: selected barcode val: " + date);

        registerExp(barcode, date, 0).then(() => {
            $('#selectedProductBarcode').val('');
            $('#expDate').val('');
        });
    })

});