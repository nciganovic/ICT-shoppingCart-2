$(document).ready(function(){
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
            html += `<option value='${p.id}'>${p.name}</option>`;
        }

        html += "</select>";
        html += "</td>";

        html += `<td><input class='w-100 q-${row} quantity' data='${row}' type='number' min='1' max='20' value='1'></td>`;

        html += `<td class='price-${row} text-center'>  </td>`;

        html += `<td> <button class='btn btn-danger m-3' data='${row}'> Remove </button> </td>`;

        html += "</tr>";
        
        $("#products").append(html);


        /* On selecting specific product */
        $(".drop-down-products").change(function(){
            var id = $(this).find(":selected").val();
            var row = $(this).attr("data");
            var quantity = $(`.q-${row}`).val();

            var price = GetPriceOfId(id, quantity, allProducts);
            $(`.price-${row}`).text(price);
        });

        /* On selecting quantity of product */
        $(".quantity").change(function(){
            var row = $(this).attr("data");
            var id = $(`.dd-${row}`).find(":selected").val();
            var quantity = $(this).val();
            console.log(id, quantity);
            var price = GetPriceOfId(id, quantity, allProducts);
            console.log(price);
            $(`.price-${row}`).text(price);
        });


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