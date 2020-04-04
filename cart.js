$(document).ready(function(){
    localStorage.removeItem("shopCart");

    console.log("Cart.js");
    var allProducts;
    var row = 0;

    $.ajax({
        url: "data.json",
        method: "get",
        dataType: "json",
        success: function(data){
            allProducts = data;
        },
        error: function(data){
            console.log(data);
        }
    })

    $(".btn-add").click(function(){
        console.log("btn add");

        row++;

        html = "";

        html += `<tr>`;
        html += "<td>";
        html += `<select class='drop-down-products w-100 dd-${row}' data='${row}'  name='products'>`;
        html += "<option value='0'>Choose product</option>"

        for(p of allProducts){
            if(localStorage.getItem("shopCart")){
                var listOfProducts = JSON.parse(localStorage.getItem("shopCart"));
                var alredyInUse = false;
                for(l of listOfProducts){
                    if(p.id == l.id){
                        alredyInUse = true;
                        break;
                    }
                }
                if(!alredyInUse){
                    html += `<option value='${p.id}'>${p.name}</option>`;        
                }
            }
            else{
                html += `<option value='${p.id}'>${p.name}</option>`;
            }
        }

        html += "</select>";
        html += "</td>";

        html += `<td><input class='w-100 q-${row} quantity' data='${row}' type='number' min='1' max='20' value='1'></td>`;

        html += `<td class='price-${row} text-center'>  </td>`;

        html += `<td> <button class='btn btn-danger m-3' data='${row}'> Remove </button> </td>`;

        html += "</tr>";
        
        $("#products").append(html);

        /* Save data in local storage */
        var obj = {
            row: row,
            id: 0,
            quantity: 1
        }

        console.log(obj);

        if(localStorage.getItem("shopCart")){
            var listOfProduct = JSON.parse(localStorage.getItem("shopCart"));
            listOfProduct.push(obj);
            localStorage.setItem("shopCart", JSON.stringify(listOfProduct));
        }
        else{
            console.log("Creating first item...");
            var arr = [];
            arr.push(obj);
            localStorage.setItem("shopCart", JSON.stringify(arr));
        }

        events(allProducts);

        console.log(JSON.parse(localStorage.getItem("shopCart")));
    });
});

function GetPriceOfId(id, quantity, allProducts){
    var price; 
    for(p of allProducts){
        if(p.id == id){
            if(quantity < 10){
                price = p.priceUnderTen * quantity;
            }
            else{
                price = p.priceAboveTen * quantity;
            }
            break;
        }
    }
    return price;
}

function EditLocalStorage(row, id, quantity){
    var getItems = JSON.parse(localStorage.getItem("shopCart"));
    for(l of getItems){
        if(l.row == row){
            console.log("Changing data!");
            l.id = id;
            l.quantity = quantity;
            break;
        }
        
    }

    localStorage.setItem("shopCart", JSON.stringify(getItems));
}

function RemoveItemFromStorage(row, allProducts){
    var getItems = JSON.parse(localStorage.getItem("shopCart"));
    var newListofItems = [];
    for(l of getItems){
        if(l.row != row){
            newListofItems.push(l);
        }
    }
    localStorage.setItem("shopCart", JSON.stringify(newListofItems));
    
    RefreshListOfItems(newListofItems, allProducts);
}

function RefreshListOfItems(list, allProducts){

    /* Show data */
    var html = "";
    for(l of list){
        html += `<tr>`;
        html += "<td>";
        html += `<select class='drop-down-products w-100 dd-${l.row}' data='${l.row}'  name='products'>`;
        html += "<option value='0'>Choose product</option>";

        for(p of allProducts){
            if(l.id == p.id){
                html += `<option selected="selected" value='${p.id}'>${p.name}</option>`;
            }
            else{
                var exists = false;
                for(x of list){
                    if(x.id == p.id){
                        exists = true;
                    }
                }
                if(!exists){
                    html += `<option value='${p.id}'>${p.name}</option>`;
                }
            }
        }

        html += "</select>";
        html += "</td>";
        html += `<td><input class='w-100 q-${l.row} quantity' data='${l.row}' type='number' min='1' max='20' value='${l.quantity}'></td>`;
        html += `<td class='price-${l.row} text-center'>`;  
        
        var totalPrice;
        for(p of allProducts){
            if(l.id == p.id){
                if(l.quantity < 10){
                    totalPrice = l.quantity * p.priceUnderTen;
                }
                else{
                    totalPrice = l.quantity * p.priceAboveTen;
                }
                html += totalPrice;
                break;
            }
        }

        html += `</td>`;
        html += `<td> <button class='btn btn-danger m-3' data='${l.row}'> Remove </button> </td>`;
        html += "</tr>";
    }
    $("#products").html(html);

    events(allProducts);
}

function events(allProducts){
    /* On selecting specific product */
    $(".drop-down-products").change(function(){
        var id = $(this).find(":selected").val();
        var row = $(this).attr("data");
        var quantity = $(`.q-${row}`).val();

        var price = GetPriceOfId(id, quantity, allProducts);
        $(`.price-${row}`).text(price);

        /* Edit local storage */
        EditLocalStorage(row, id, quantity);

        $('.drop-down-products').each(function(i, obj) {
            //Select all elements that are not current one
            if($(this).attr("data") != row){
                var selectedID = $(this).find(":selected").val();
                
                //Remove all options that are alredy selected
                var listOfProducts = JSON.parse(localStorage.getItem("shopCart"));

                html = "<option value='0'>Choose product</option>";

                for(ap of allProducts){
                    var alredyInUse = false;
                    for(l of listOfProducts){
                        if(ap.id == l.id){
                            alredyInUse = true;
                            break;
                        }
                    }
                    if(!alredyInUse){
                        html += `<option value='${ap.id}'>${ap.name}</option>`;
                        
                    }
                    if(ap.id == selectedID){
                        html += `<option selected="selected" value='${ap.id}'>${ap.name}</option>`;
                    } 
                }
            
                $(this).html(html);
            }
        });
    });

    /* On selecting quantity of product */
    $(".quantity").change(function(){
        var row = $(this).attr("data");
        var id = $(`.dd-${row}`).find(":selected").val();
        var quantity = $(this).val();

        var price = GetPriceOfId(id, quantity, allProducts);
        $(`.price-${row}`).text(price);

        /* Edit local storage */
        EditLocalStorage(row, id, quantity);
    });

    $(".btn-danger").click(function(){
        var row = $(this).attr("data");
        RemoveItemFromStorage(row, allProducts);
    });
}