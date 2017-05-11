/**
 * Created by tuxzo on 03-04-2017.
 */

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

    function editGoods(barcode, name, isDriedGoods) {
        $('#editGoodsModal').modal("show");
        $('#nameModal').val(name);
        $('#barcodeModal').val(barcode);

        if(isDriedGoods) {
            $('#chbIsDriedGoodsModal').prop('checked', true);
        }

        $('#btnOpdaterModal').click(() => {
            if($('#nameModal').val(name) != name || $('#chbIsDriedGoodsModal').is('checked') != isDriedGoods) {
                updateProduct($('#nameModal').val(name), $('#barcodeModal').val(barcode), $('#chbIsDriedGoodsModal').is('checked'));
            }
        })
    }

    function updateProduct(barcode, name, isDriedGoods) {
            let updatedProduct = {'_id': barcode, 'name': name, 'isDryGoods': isDriedGoods.toString()};

            $.ajax({
                type: "PUT",
                url: "/api/products/",
                contentType: "json",
                data: JSON.stringify(updatedProduct)
            }).done((data) => {
                alert("Varen blev opdateret");
                console.log(data);
            });


            // $.put('./api/products/', {'_id': barcode, 'name': name, 'isDryGoods': isDriedGoods})
            //     .done(function (data) {
            //             console.log(data);
            //             resolve();
            //         }
            //     ).fail(() => {
            //     alert("Kunne ikke oprette datoregisteringen");
            //     reject();
            // })
        // });
    }

$(document).ready(function () {

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
                $('#wareList').append('<li id="listItem">'
                    + '<a href="#" data-barcode="' + req[i]._id + '">'
                    + req[i]._id + ' - ' + req[i].name
                    + '</a> <div class="glyphicon glyphicon-pencil" id="glyph' + req[i]._id + '"></div>'
                    + '</li>');
                $('#glyph' + req[i]._id).on('click', () => {
                    editGoods(req[i]._id, req[i].name)
                });
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