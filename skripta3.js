$(document).ready(function(){
    let username = localStorage.getItem("currentUser");
    let score = localStorage.getItem("currentScore");
    var list;
    $("#ime").text("Username: " +username );
    $("#rezultat").text("Score: " +score );

    $("#dugme").click(function(){
        window.location.href = "tetris-uputstvo.html";
    })

    loadScoreboard();
    
    function loadScoreboard(){
        if (!localStorage.scoreboard){
            //upisi trenutnog i leave
            let map = new Map();
            map.set(username,score);
            localStorage.scoreboard = JSON.stringify(Array.from(map.entries())
            .sort((a,b)=>a[1].localeCompare(b[1])).reverse());
            list = JSON.parse(localStorage.scoreboard);

        }
        else{
            list = JSON.parse(localStorage.scoreboard);
            if (list.length<5){
                list.push([username,score]);
                list.sort((a,b)=>a[1].localeCompare(b[1]));
                list.reverse();
            }
            else{
                for (let i=0;i<list.length;i++){
                    if (parseInt(list[i][1]) < parseInt(score)){
                        list[i] = [username,score];
                        break;
                    } 
                }
            }
            list.sort((a,b)=>a[1].localeCompare(b[1]));
            list.reverse();
            localStorage.scoreboard = JSON.stringify(list);

        }
        for (let i=0;i<list.length;i++){
            $(".name").eq(i).text(list[i][0]);
            $(".score").eq(i).text(list[i][1]);
        }

    }


    

    let topFive = new Map(JSON.parse(localStorage.scoreboard));

    if (!topFive){
        alert("buh");
    }

})