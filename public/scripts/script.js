/**
 * Created by tuxzo on 03-04-2017.
 */
$(document).ready(function() {
// RENDERING OF PAGES
// =============================================================================
    function compileNewBody(templateName) {
        $.get('../views/' + templateName, function (template) {
            $('#container').empty();
            var compiled = Handlebars.compile(template);
            var html = compiled({});
            $('#container').append(html);
        });
    }

    $('#btnDatoliste').click(function() {
        compileNewBody("index.hbs");
        addItemsToExpirationLists();
    });

    $('#btnRegistrer').click(function() {
        renderRegistrer();
    });

    $('#btnKasseret').click(function() {
        compileNewBody("kasseret.hbs");
    });

    $('#btnStatistik').click(function() {
        compileNewBody("statistik.hbs");
    });

    function renderRegistrer(){
        compileNewBody("registrer.hbs");
        $.get('/api/products', (req, res) =>{
            for(let i in req){
                $('#wareList').append('<li  id="listItem">' + '<a href="#" data-barcode="'+req[i]._id+'">' + req[i]._id + ' - ' + req[i].name +'' + '</a>' + '</li>');
            }
        });


    };

// BUTTON ACTIONS
// =============================================================================
    $(document).on('click','#btnCreateProduct', function() {
        console.log("I'm alive");

        var newProduct = {
            _id : $('#newProductBarcode').val(),
            name : $('#newProductName').val(),
            isDryGoods : $('#isDryGoods').is(':checked')
        };

        $.post("/api/products", newProduct, function(data) {
            alert(data);
        });

        renderRegistrer();
    });

    $(document).on('click', 'li',(event)=>{
        console.log($(event.target).data('barcode'));
        $('#selectedProductBarcode').val($(event.target).data('barcode'));

    });
});

function addItemsToExpirationLists(){
    $.get('/api/collExpirations', (req, res) =>{
        for(let i in req){
            var date = new Date;
            date.setHours(0,0,0,0);
            var date2 = date.getFullYear() + '' +date.getMonth() + date.getDate();
            console.log(req[i]);
            console.log(req[i].date);
            console.log(date2);
            console.log(req[i].date < new Date().getDate());
            if(req[i].date < new Date()){
            }
        }
    });
}