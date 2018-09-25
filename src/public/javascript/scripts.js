$(document).ready(function(){
    //INICIO BUSCAR
    $("#nbuscar").keyup(function(e){
        var key = $("#nbuscar").val();
        if(key.length > 0)
        var params = { "prod" : key};        
        $.ajax({
            type:"post",
            url:"/producto/buscar",
            dataType: "json",
            data: params,   
            success: function(data){
                $(".prod-container").empty();
                for(var i = 0; i < data.length; i++){
                    $(".prod-container").append(
                        "<li class='list-group-item' style='background-color:#C4C4C4' name="+ data[i]._id +"><strong>"+ data[i].codigo +"</strong> - "+ data[i].detalle +"</li>"
                    );
                };
            },
            error : function(err){
                console.log(err);
            }
        });
    });
    //FIN BUSCAR
    
 //Agrega Producto a Venta   
$("body").on( "click", ".prod-container li", function(){
    var key = $(this).attr("name");
    if(key.length > 0)
    var params = { "prod" : key};     
    
    $.ajax({
        type:"post",
        url:"/producto/buscar/pid",
        dataType: "json",
        data: params,   
        success: function(data){
            var stock = getStock(data.codigo);             
            $(".tablaProductos").append('<tr class="dato">'+
                                        '<td>'+data.codigo+'</td>'+
                                        '<td>'+data.detalle+'</td>'+
                                        '<td>'+stock+'</td>'+
                                        '<td><input id="dCant" name="cantidad" class="cantidad form-control" type="number" min="1" max="99" value="1"/></td>'+
                                        '<td><input name="precio" class="costo form-control" type="number" min="0" max="99999" step="0.01" data-number-to-fixed="2" value="'+data.precioOsaina+'"/></td>'+
                                        '<td><input type="hidden" name="codigo" value="'+data.codigo+'"><a href="#" class="btn">'+
                                        '<span class="glyphicon glyphicon-minus-sign"></span></a></td></tr>');                
                                    
                                        getTotal();
        },
        error : function(err){
            console.log(err);
        }
    });
    visible();
    $(".prod-container").empty();
    $("#nbuscar").val('');
  }); 
 //Fin Agrega Producto a Venta

  //Elimina Producto de lista
  $("body").on( "click", ".tablaProductos a", function(){
    $(this).parent('td').parent('tr').remove();
    getTotal();
    if($(".tablaProductos tr").length <= 1)
        inVisible();
    });

    $("body").keyup(".tablaProductos .costo", function(){
        if (!validaStock()) return;
        if($("#creacion").val() != '')
        getTotal();
    });

    function validaStock(){
        if(!$("#dCant").length > 0 || $("#dCant").val() =='') return false;

        if(parseInt($("#dCant").val()) <= parseInt($("#dTalle").val().substring($("#dTalle").val().indexOf("-")+1)))
            return true;
        else
            alert ("No hay suficiente stock, quedan "+ $("#dTalle").val().substring($("#dTalle").val().indexOf("-")+1) +" unidades.")
            $("#dCant").val(1);
            return false;
    }

    $("#nbuscar").on("click",function(e){
        $(".prod-container").empty();
    });

    //Pinta li de producto a agregar  
    $("body").on( "mouseenter", ".prod-container li", function(){
        $(this).css('background-color', '#E1E2E6');
    }); 
    $("body").on( "mouseleave", ".prod-container li", function(){
        $(this).css('background-color', '#C4C4C4');
    });
    //Fin Pinta li de producto a agregar  

    function visible(){
        $("#dTabla").show();
        $("#dFinalizar").show();
        $("#dTotal").show();
    }

    function inVisible(){
        $("#dTabla").hide();
        $("#dFinalizar").hide();
        $("#dTotal").hide();
    }

    function getTotal(){    
        var total = 0;
        $('.tablaProductos tr.dato').each(function(){ //filas con clase 'dato', especifica una clase, asi no tomas el nombre de las columnas
            var cant = Number($(this).find("td:eq(3) > input").val());
            var costo = Number($(this).find("td:eq(4) > input").val());
            total = total + (cant * costo);   
        })
        $('#total').val(total);
    };

    function getStock(codigo){
        var params = { "cod" : codigo};     
        var res = '';
        $.ajax({
        async: false,
        type:"post",
        url:"/stock/buscar/pid",
        dataType: "json",
        data: params,   
        success: function(data){   
            if (data.length > 0){
                res = '<select class="form-control input-sm" name="talle" id="dTalle">';
                for(var i = 0; i < data.length; i++){
                    res+= '<option value="'+data[i].talle+"-"+data[i].cantidad+'">'+data[i].talle+'</option>';                
                }
                res+='</select>'; 
            }else{           
                res+= '<span class="glyphicon glyphicon-minus-sign sm" style="color:red;"></span>  Sin Stock'
            }       
        },   
        error : function(err){
            console.log(err);
        }
    });
    return res;
};
});

