var used_blocks = new Set([0,1,2,3,4,5,6]);

$(document).ready(function(){


    $(".clickable-image").on({
        mouseenter: function(){
            $(this).css("border","3px solid white");
        },
        mouseleave: function(){
            $(this).css("border","3px solid #121824");
        },
        click: function(){
            let index = $(this).index(".clickable-image");
            if ($(this).attr("selected")){
                $(this).attr("src","./tetris-dodatno/greyedShape"+index +".png");
                $(this).attr("selected",null);
                used_blocks.delete(index);
                
            }
            else{
                $(this).attr("src","./tetris-dodatno/Shape"+index+".png");
                $(this).attr("selected","true");
                used_blocks.add(index);
            }
            
        }

    })
    
    
    $("#start").click(function(){
        if (used_blocks.size == 0){
            alert("Morate izabrati bar jedan blok");
            return;
        }

        localStorage.setItem("blocks",JSON.stringify(Array.from(used_blocks)));
        let difficulty =$('#tezina').find(":selected").val();
        localStorage.setItem("difficulty",difficulty);
        window.location.href = "tetris-igra.html";
    })

    
})