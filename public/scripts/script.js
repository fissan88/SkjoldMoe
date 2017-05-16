/**
 * Created by tuxzo on 03-04-2017.
 */
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

function populateSortimentList() {
    $('#stockList').empty();

    $.get('/api/products', (req, res) => {
        for (let i in req) {
            $('#stockList').append('<li class="list-group-item">'
                + '<label>'+req[i]._id + ' - ' + req[i].name+'</label>'
                + '<div class="pull-right action-buttons">'
                + '<a href="#" data-barcode="' + req[i]._id + '"><span class="glyphicon glyphicon-pencil" id="glyph' + req[i]._id + '"></span></a>'
                + '<a href="#" class="trash"><span class="glyphicon glyphicon-trash"></span></a>'
                + '</div></li>');

            $('#glyph' + req[i]._id).on('click', () => {
                editGoods(req[i]._id, req[i].name, req[i].isDryGoods);
            });
        }
    });
}

// FUNCTIONS GETTING FROM SERVER
// =============================================================================

function registerExp(barcode, date, quantity) {
    return new Promise((resolve, reject) => {
        $.post('./api/collExpirations/', {
            'barcode': barcode,
            'date': date,
            'quantity': quantity
        })
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

function editGoods(barcode, name, isDryGoods) {
    $('#editGoodsModal').modal("show");
    $('#nameModal').val(name);
    $('#barcodeModal').val(barcode);

    if (isDryGoods) {
        $('#chbIsDryGoodsModal').prop('checked', true);
    } else {
        $('#chbIsDryGoodsModal').prop('checked', false);
    }

    $('#btnOpdaterModal').click(() => {
        if ($('#nameModal').val() != name || $('#chbIsDryGoodsModal').is(':checked') != isDryGoods) {
            updateProduct($('#barcodeModal').val(), $('#nameModal').val(), $('#chbIsDryGoodsModal').is(':checked'));
        }
    })
}

function updateProduct(barcode, name, isDryGoods) {
    let updatedProduct = {'_id': barcode, 'name': name, 'isDryGoods': isDryGoods};
    $.ajax({
        type: "PUT",
        url: "/api/products/",
        contentType: "application/json",
        data: JSON.stringify(updatedProduct)
    }).done(() => {
        alert("Varen blev opdateret succesfuldt.");
        populateSortimentList();
    });
}

function addItemsToExpirationLists(){
    $.get('/api/collExpirations', (req, res) =>{
        for(let i in req){
            var currentDate = new Date;
            var month = currentDate.getMonth();
            month = monthConverter(month);
            var currentDateString = currentDate.getFullYear() + '-' + month + '-' + currentDate.getDate();

            var productDate = req[i].date;
            var productDateString = productDate.slice(0,10);

            if(productDateString === currentDateString){
                $.get('/api/products/' + req[i].barcode, (product, res2) =>{
                    var listLocation = 'fresh';
                    if(product.isDryGoods){
                        listLocation = 'dry';
                    }
                    $('#' + listLocation + 'Goods').append('<tr  data-barcode="'+product._id+'" data-id="'+req[i]._id+'"><td>'+product.name+'</td><td><input id="numSelect" type="number"></td><td><span id="saveBtn" class="glyphicon glyphicon-floppy-disk"></span></td></tr>')
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

$(document).ready(function () {

// BUTTON ACTIONS
// =============================================================================

    function toggleButtons() {
        $('#btnDatoliste').removeClass('active');
        $('#btnRegistrer').removeClass('active');
        $('#btnSortiment').removeClass('active');
    }

    $('#btnDatoliste').click(function () {
        compileNewBody("index.hbs");
        toggleButtons();
        $('#btnDatoliste').addClass('active');
    });

    $('#btnRegistrer').click(function () {
        compileNewBody("registrer.hbs");
        populateSortimentList();
        toggleButtons();
        $('#btnRegistrer').addClass('active');
    });

    $('#btnSortiment').click(function () {
        compileNewBody("sortiment.hbs");
        populateSortimentList();
        toggleButtons();
        $('#btnSortiment').addClass('active');
    });

    // Markerer en række på vores liste
    $(document).on('click', 'table tr', (event)=> {
        $('tr.active').removeClass('active');
        $(event.target.parentNode).addClass('active');
        console.log($(event.target.parentNode).data('id'));

    });

    // TODO skal have opdateret vores varer på listen med en ny glyphicon og antal
    // gemmer det nye antal af varer
    $(document).on('click', '#saveBtn', (event)=> {
        alert("CLICKED");
        // let numberOfGoodsOnDiscount = $('#numberInput').val();
        //
        // $.put("/api/collExpirations/" + id, newProduct, function(data) {
        //     alert(data);
        // });
    });
});

    $(document).on('click', '#btnCreateProduct', function () {

        let newProduct = {
            _id: $('#newProductBarcode').val(),
            name: $('#newProductName').val(),
            isDryGoods: $('#isDryGoods').is(':checked')
        };

        $.post("/api/products", newProduct, function (data) {
            alert("Varen blev oprettet succesfuldt!");
        }).done(() => {
            $('#newProductBarcode').val("");
            $('#newProductName').val("");
            $('#isDryGoods').prop('checked', false);
            populateSortimentList();
        });
    });

    $(document).on('click', 'li', (event) => {
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