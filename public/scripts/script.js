/**
 * Created by tuxzo on 03-04-2017.
 */
let currentSelectedProduct;
let tmpDates = [];
let tempCollExp;
let counterForIdDeleteGlyph = 0;

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

function populateProductsToRegister(targetContainer) {
    $.get('/api/productsToday', (req,res) => {
        $(targetContainer).empty();
        for (let i in req) {
            $(targetContainer).append('<li class="list-group-item">'
                + '<label>'+req[i]._id + ' - ' + req[i].name+'</label>'
                + '<div class="pull-right action-buttons">'
                + '<a href="#" data-barcode="' + req[i]._id + '"><span class="glyphicon glyphicon-plus" id="glyphRegisterExp' + req[i]._id + '"></span></a>'
                + '</div></li>');

            $('#glyphRegisterExp' + req[i]._id).on('click', () => {
                showAddExpirationsToProduct(req[i]);
            });
        }
    });
}

function populateProductsToRegisterDryGoods(targetContainer, isDryGoods) {
    $.get('/api/productsToday/' + isDryGoods, (req,res) => {
        $(targetContainer).empty();
        for (let i in req) {
            $(targetContainer).append('<li class="list-group-item">'
                + '<label>'+req[i]._id + ' - ' + req[i].name+'</label>'
                + '<div class="pull-right action-buttons">'
                + '<a href="#" data-barcode="' + req[i]._id + '"><span class="glyphicon glyphicon-plus" id="glyphRegisterExp' + isDryGoods + req[i]._id + '"></span></a>'
                + '</div></li>');

            $('#glyphRegisterExp' + isDryGoods + req[i]._id).on('click', () => {
                showAddExpirationsToProduct(req[i]);
            });
        }
    });
}

function populateSortimentList() {
    $('#stockList').empty();

    $.get('/api/products', (req, res) => {
        for (let i in req) {
            $('#stockList').append('<li class="list-group-item">'
                + '<div class="list-group-item list-group-item-action flex-column align-items-start">'
                + ' <div class="d-flex w-100 justify-content-between">'
                + '<h5 class="mb-1">'
                + '<strong>Stregkode - Navn:</strong> <br>'
                + req[i]._id + ' - ' + req[i].name
                + '</h5>'
                + '<small class="text-muted pull-right action-buttons">'
                + '<a href="#" data-barcode="' + req[i]._id + '"><span class="glyphicon glyphicon-pencil" id="glyphEdit' + req[i]._id + '"></span></a>'
                + '<a href="#" data-barcode="' + req[i]._id + '"><span  class="glyphicon glyphicon-trash" id="glyphDelete' + req[i]._id + '"></span></a>'
                + '</small>'
                + '</div>'
                + '<p>'
                + '<strong>Bestillingsnummer:</strong> <br>'
                + req[i].orderNumber
                + '</p>'
                + '</div></li>');

            $('#glyphEdit' + req[i]._id).on('click', () => {
                editProduct(req[i]._id, req[i].name, req[i].isDryGoods);
            });

            $('#glyphDelete' + req[i]._id).on('click', () => {
                deleteGoods(req[i]._id);
            });
        }
    });
}

// FUNCTIONS GETTING & POSTING FROM SERVER
// =============================================================================

function registerExp(barcode, date, quantity) {
    return new Promise((resolve, reject) => {
        $.post('./api/expirations/', {
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

function editProduct(barcode, name, isDryGoods) {
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

function deleteGoods(barcode) {
    if (window.confirm("Vil du virkelig slette " + barcode + "?")) {
        $.ajax({
            type: "DELETE",
            url: "/api/products/" + barcode,
        }).done(() => {
            alert("Varen blev slettet.");
            populateSortimentList();
        });
    }
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

function showAddExpirationsToProduct(product) {
    $('#dateRegModal').modal("show");
    $('#dateRegModalBody').empty();
    currentSelectedProduct = product;

    if(product.expirations.length > 0) {
        let req = product.expirations;
        for (let i in req) {
            $('#dateRegModalBody').append('<li id="liInitialExpiration" class="list-group-item">'
                + '<label>'+req[i].date.slice(0,10) + '</label>'
                + '<div class="pull-right action-buttons">'
                + '<a href="#" data-barcode="' + req[i].barcode + '"><span  class="glyphicon glyphicon-trash" id="modalGlyphDelete' + req[i].barcode + '"></span></a>'
                + '</div></li>');
            $('#modalGlyphDelete' + req[i].barcode).click(() => {
                $('#liInitialExpiration').remove();
                $.ajax({
                    url: '/api/expirations/' + req[i]._id,
                    type: 'DELETE'
                });
            });
        }
    }

};

function addItemsToExpirationLists(){
    $.get('/api/expirations', (req, res) =>{
        for(let i in req){
            let currentDate = new Date;
            let month = currentDate.getMonth();
            month = monthConverter(month);
            let currentDateString = currentDate.getFullYear() + '-' + month + '-' + currentDate.getDate();
            let weekAhead = new Date;
            weekAhead.setDate(weekAhead.getDate() + 7);
            month = weekAhead.getMonth();
            month = monthConverter(month);
            let weekAheadDateString = weekAhead.getFullYear() + '-' + month + '-' + weekAhead.getDate();
            let productDate = req[i].date;
            let productDateString = productDate.slice(0, 10);
            if (productDateString >= currentDateString && productDateString <= weekAheadDateString) {
                $.get('/api/products/' + req[i].barcode, (product, res2) => {
                    if(product.isDryGoods || productDateString === currentDateString) {
                        let listLocation = 'fresh';
                        if (product.isDryGoods) {
                            listLocation = 'dry';
                        }
                        let quantity = req[i].quantity;
                        let okGlyphicon = '';

                        if (req[i].isChecked) {
                            okGlyphicon = '<span id="saveBtn" class="glyphicon glyphicon-ok"></span>';
                        }
                        quantity = 'value =' + quantity;
                        $('#' + listLocation + 'Goods').append('<tr  data-barcode="' + product._id + '" data-id="' + req[i]._id + '"><td>' + product.name + '</td><td><input id="numSelect" type="number" ' + quantity + '></td><td><span id="saveBtn" class="glyphicon glyphicon-floppy-disk"></span>' + okGlyphicon + '</td></tr>')
                    }
                });
            }
        }
    });
    function monthConverter(month) {
        month = month + 1;
        if (month < 10) {
            month = '0' + month;
        }
        return month
    }
}

function createProduct() {
    let newProduct = {
        _id: $('#newProductBarcode').val(),
        name: $('#newProductName').val(),
        orderNumber: $('#newProductOrderNumber').val(),
        isDryGoods: $('#isDryGoods').is(':checked')
    };

    $.post("/api/products", newProduct, function (data) {
        alert("Varen blev oprettet succesfuldt!");
    }).done(() => {
        $('#newProductBarcode').val("");
        $('#newProductName').val("");
        $('#newProductOrderNumber').val("");
        $('#isDryGoods').prop('checked', false);
        populateSortimentList();
    });
}

function createUser(userName, password) {
    $.get('/api/user/' + userName, (req, res) =>{
        if(req){
            var user = {
                name: userName,
                password: password
            };
            $.post('/api/users', user, () =>{
                $('#createUserFeedback').removeClass('redText');
                $('#createUserFeedback').addClass('greenText');
                $('#createUserFeedback').text('Bruger oprettet');
                $('#createUserUserName').val('');
                $('#createUserPassword').val('');
            });
        } else{
            $('#createUserFeedback').text('Brugernavn i brug');
            return;
        }
    });
}

// OTHER FUNCTIONS
// =============================================================================

// søge function, som sorterer automatisk i et given list-group område. Funktionelt er det instant-results.
$(document).on('keyup', '#search', function () {
    var current_query = $('#search').val();
    if (current_query !== "") {
        $(".list-group li").hide();
        $(".list-group li").each(function () {
            var current_keyword = $(this).text().toUpperCase();
            if (current_keyword.indexOf(current_query.toUpperCase()) >= 0) {
                $(this).show();
            }
        });
    } else {
        $(".list-group li").show();
    }
});

function removeTempDate(numberOfListitem) {
    tmpDates.splice(tmpDates.indexOf(tempCollExp), 1);
    $('#tmpDateListItem' + numberOfListitem).remove();
};

// TOGGLING AND LOADING THINGS
// =============================================================================

$(document).ready(function () {
    addItemsToExpirationLists();
    compileNewBody("index.hbs");
    toggleButtons();
    $('#btnDatoliste').addClass('active');

// BUTTON ACTIONS
// =============================================================================

    function toggleButtons() {
        $('#btnDatoliste').removeClass('active');
        $('#btnRegistrer').removeClass('active');
        $('#btnSortiment').removeClass('active');
        $('#btnOpretBruger').removeClass('active');
    }

    $('#btnDatoliste').click(function () {
        compileNewBody("index.hbs");
        toggleButtons();
        $('#btnDatoliste').addClass('active');
        addItemsToExpirationLists();
        document.getElementById("subtitle").innerHTML = "Liste over nærtudløbende varer";
    });

    $('#btnRegistrer').click(function () {
        compileNewBody("registrer.hbs");
        populateProductsToRegister('#tabRegAllContent');
        toggleButtons();
        $('#btnRegistrer').addClass('active');
        document.getElementById("subtitle").innerHTML = "Liste over varer med manglende datoregistring, samt datoregistring af varer";
    });

    $('#btnSortiment').click(function () {
        compileNewBody("sortiment.hbs");
        populateSortimentList();
        toggleButtons();
        $('#btnSortiment').addClass('active');
        document.getElementById("subtitle").innerHTML = "Liste over sortimentet, samt tilføjelse til sortiment";
    });

    $('#btnOpretBruger').click(function () {
        compileNewBody("opretBruger.hbs");
        toggleButtons();
        $('#btnOpretBruger').addClass('active');
        document.getElementById("subtitle").innerHTML = "Opret ny bruger";
    });

    $('#jumbo').click(function () {
        compileNewBody("index.hbs");
        toggleButtons();
        $('#btnDatoliste').addClass('active');
        addItemsToExpirationLists();
        document.getElementById("subtitle").innerHTML = "Liste over nærtudløbende varer";
    });

    $(document).on('click', '#saveBtn', (event)=> {
        const id = $(event.target.parentNode.parentNode).data('id');
        let quantity = $(event.target.parentNode.previousSibling.firstChild).val();

        $.ajax({
            type: "PUT",
            url: "/api/expirations/" + id,
            contentType: "application/json",
            data: JSON.stringify({quantity: quantity, isChecked: true})
        }).done(() => {
            if (!$(event.target.parentNode.lastChild).hasClass("glyphicon glyphicon-ok")) {
                $(event.target.parentNode).append('<span id="saveBtn" class="glyphicon glyphicon-ok"></span>');
            }
            $(event.target.parentNode.parentNode).fadeTo('slow', 0.5).fadeTo('slow', 1.0);
        });
    });

    $(document).on('click', '#btnCreateProduct', function () {
        createProduct()
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
    });

    $(document).on('click', '#btnCreateUser', ()=>{
        $('#createUserFeedback').addClass('redText');
        let userName = $('#createUserUserName').val();
        if(userName.length == 0){
            $('#createUserFeedback').text('Indtast brugernavn');
            return;
        }

        let password = $('#createUserPassword').val();
        if(password.length <5){
            $('#createUserFeedback').text('Password skal være mindst 5 karakterer');
            return;
        }
        createUser(userName, password)
    });

    $(document).on('click', '#tabRegAll', (event) => {
        populateProductsToRegister('#tabRegAllContent');
    });

    $(document).on('click', '#tabRegFresh', (event) => {
        populateProductsToRegisterDryGoods('#tabRegFreshContent', "true");
    });

    $(document).on('click', '#tabRegDried', (event) => {
        populateProductsToRegisterDryGoods('#tabRegDriedContent', "false");
    });

    $(document).on('click', '#btnDateRegModalGodkend', (event) => {
        let promises = [];

        for(let i = 0; i < tmpDates.length; i++) {
            promises.push(registerExp(tmpDates[i].barcode, tmpDates[i].date, tmpDates[i].quantity));
        }

        Promise.all(promises).then(() => {
            populateProductsToRegister('#tabRegAllContent');
        })
    });

    $(document).on('click', '#btnDateRegModalTilfoej', (event) => {
        tempCollExp = {
            barcode: currentSelectedProduct._id,
            date: $('#dateRegDatePickerModal').val(),
            quantity: 0
        };

        if(tempCollExp.barcode.length > 0)
            if(tempCollExp.date != '') {
                tmpDates.push(tempCollExp);

                $('#dateRegModalBody').append('<li id="tmpDateListItem' + counterForIdDeleteGlyph + '" class="list-group-item">'
                    + '<label>'+tempCollExp.date.slice(0,10) + '</label>'
                    + '<div class="pull-right action-buttons">'
                    + '<a href="#" data-barcode="' + tempCollExp.date + '">'
                    + '<span  class="glyphicon glyphicon-trash" id="glyphDeleteDateModal' + counterForIdDeleteGlyph + '" onclick="removeTempDate(' + counterForIdDeleteGlyph + ')" ></span></a>'
                    + '</div></li>');

                counterForIdDeleteGlyph++;

                tempCollExp = '';
                $('#dateRegDatePickerModal').val('');
            }

    })
});