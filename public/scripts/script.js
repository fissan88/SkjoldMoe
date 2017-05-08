/**
 * Created by tuxzo on 03-04-2017.
 */
$(document).ready(function() {

    function compileNewBody(templateName) {
        $.get('../views/' + templateName, function (template) {
            $('#container').empty();
            var compiled = Handlebars.compile(template);
            var html = compiled({

            });
            $('#container').append(html);
        });
    }

    $('#btnDatoliste').click(function() {
        compileNewBody("index.hbs");
    });

    $('#btnRegistrer').click(function() {
         compileNewBody("registrer.hbs");
    });

    $('#btnKasseret').click(function() {
        compileNewBody("kasseret.hbs");
    });

    $('#btnStatistik').click(function() {
        compileNewBody("statistik.hbs");
    });

    $(document).on('click','#btnCreateProduct', function() {
        console.log("I'm alive");
        var productName = $('#newProductName').val();
        var productBarcode = $('#newProductBarcode').val();
        var isDriedGoods = $('#isDriedGoods').val();

        createProduct(productBarcode, productName, isDriedGoods);

    });
});