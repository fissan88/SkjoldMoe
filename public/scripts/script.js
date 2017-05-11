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
            var currentDate = new Date;
            currentDate.setHours(0,0,0,0);
            var month = currentDate.getMonth();
            month = monthConverter(month);
            var currentDateString = currentDate.getFullYear() + '-' + month + '-' + currentDate.getDate();

            var productDate = req[i].date;
            var productDateString = productDate.slice(0,10);

            if(productDateString === currentDateString){
                $.get('/api/products/' + req[i].barcode, (req2, res2) =>{
                    var onSale = '';
                    if(req[i].isOnSale){
                        onSale=  '<span class="glyphicon glyphicon-ok"></span>';
                    }else onSale=  '<span class="glyphicon glyphicon-remove"></span>';

                    if(req2.isDryGoods){
                        $('#dryGoods').append('<tr><td>'+req2.name+'</td><td>'+req[i].quantity+'</td><td>'+onSale+'</td></tr>')
                    }else{
                        $('#freshGoods').append('<tr><td>'+req2.name+'</td><td>'+req[i].quantity+'</td><td>'+onSale+'</td></tr>')
                    }

                });
            }
        }
    });

    function monthConverter(month) {
        month = month +1;
        if(month<10){
            month = '0' + month;
        }
        return month
    }

}