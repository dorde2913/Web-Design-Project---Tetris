var grid = [];
const columns = 10;
const rows = 20;
const initialCol = 5;
const initialRow = 0;
var currentShape = null;
var currentColor = "aqua";
var emptyColor;
var speed = 500;
var score = 0;
var next_shape = -1;
var blocks;
var difficulty;
//5,2;5,2;5,2;5,2; -> 5,2;5,3;5,4;5
var count =0;

const I_Shape_rotations = [
    //I-shape, ima samo 2 
    [
        [0,0],[0,1],[0,2],[0,3]//0
    ],
    [
        [0,0],[1,0],[2,0],[3,0]//90
    ],
    [
        [0,0],[0,-1],[0,-2],[0,-3]//0
    ],
    [
        [0,0],[-1,0],[-2,0],[-3,0]//90
    ]
]
const T_Shape_rotations = [
    [
        [0,0],[0,1],[0,2],[1,1] // T
    ],
    [
        [0,1],[1,1],[2,1],[1,0]// T+90
    ],
    [
        [0,1],[1,0],[1,1],[1,2]//T+180
    ],
    [
        [0,1],[1,1],[1,2],[2,1]//T+270
    ]
]
const L_Shape_rotations = [
    [
        [0,0],[1,0],[2,0],[2,1] // L
    ],
    [
        [0,0],[0,1],[0,2],[1,0]// L+90
    ],
    [
        [0,0],[0,1],[1,1],[2,1]//L+180
    ],
    [
        [1,0],[1,1],[1,2],[0,2]//L+270
    ]
]
const J_Shape_rotations = [
    [
        [0,1],[1,1],[2,1],[2,0] // J
    ],
    [
        [0,0],[1,0],[1,1],[1,2]// J+90
    ],
    [
        [0,0],[1,0],[2,0],[0,1]//J+180
    ],
    [
        [0,0],[0,1],[0,2],[1,2]//J+270
    ]
]
const O_Shape_rotations = [
    [[0,0],[0,1],[1,0],[1,1]]
]
const Z_Shape_rotations = [
    [
        [0,0],[0,1],[1,1],[1,2] 
    ],
    [
        [0,1],[1,1],[1,0],[2,0]
    ]
]
const S_Shape_rotations = [
    [
        [0,1],[0,2],[1,0],[1,1] 
    ],
    [
        [0,0],[1,0],[1,1],[2,1]
    ]
]


$(document).ready(function(){

    emptyColor = $(".tetris-cell").css("background-color");

    var used_blocks = JSON.parse(localStorage.getItem("blocks"));
    
    blocks = new Set(used_blocks);
    

    difficulty = localStorage.getItem("difficulty");
    localStorage.removeItem("difficulty");
    localStorage.removeItem("blocks");
    let dif_int = 0;
    switch(difficulty){
        case "easy":
            break;
        case "med":
            dif_int = 1;
            break;
        case "hard":
            dif_int = 2;
            break;
        default:
            break;
    }
    speed = 1000 - dif_int*300;
    $(document).keydown(function(event){
        let key = (event.keyCode? event.keyCode : event.which);

        switch(key){
            case 37:
                currentShape.tryMoveLeft();
                break;
            case 39:
                currentShape.tryMoveRight();
                break;
            case 81:
                currentShape.rotateLeft();
                break;
            case 87:
                currentShape.moveDown();
                
                break;
            case 69:
                currentShape.rotateRight();
                break;
            default:
                break;
        }


    })
    $("#start").click(function(){
        $(document).html("buh");
        //spawnTetromino();
        //$(this).attr("disabled",true);
    })
    $("#results").click(function(){
        localStorage.setItem("currentScore",score);
        let user = $("#usernameinput").val();
        if (user == "") {
            alert("Morate uneti ime");
            return;
        }
        localStorage.setItem("currentUser",user);
        window.location.href = "tetris-rezultati.html";
    })

})
function checkTetris(){
    let tetrisCount = 0;
    let lines = new Set();
    let tetris = true;
    for (let row = rows-1;row>=0;row--){
        for (let col = 0;col<columns;col++){
            if ($(".tetris-cell").eq(row*columns + col).css("background-color") == emptyColor){
                tetris = false;
                break;
            }
        }
        if (tetris){
            lines.add(row);
            tetrisCount++;
        }
        else{
            tetris = true;
        }
    }
    for (let row = rows-1;row>=0;row--){
        if (lines.has(row)){
            for (let col = 0;col<columns;col++){
                $(".tetris-cell").eq(row*columns + col).css("background-color",emptyColor);
            }
        }
    }
    score+=tetrisCount;
    count+=tetrisCount;
    if (tetrisCount>0)shiftDown();
    $("#score-value").text(score);
    if (count >=5 && speed>50){
        speed-=50;
        count = 0;
    }
    // svaki red koji je iznad najnizeg reda koji smo izbrisali treba da se pomeri za tetrisCount na dole
}

function shiftDown(){
    for (let row = 0;row<rows;row++){
        if (rowEmpty(row)){ //sada SVE IZNAD OVOGA treba za 1 na dole
            if (row != 0){
                for (let r = row; r>0;r--){
                    
                    for (let col = 0;col<columns;col++){
                        let color = $(".tetris-cell").eq((r-1)*columns+col).css("background-color");
                        $(".tetris-cell").eq(r*columns + col).css("background-color",color);
                    }
                    
                    
                }
            }
        }
    }
}
function rowEmpty(row){
    for (let col = 0;col<columns;col++){
        if ($(".tetris-cell").eq(row*columns + col).css("background-color") != emptyColor) return false;
    }
    return true;
}

function spawnTetromino(){
    if (currentShape == null){
        //prvo generisanje
        while (!blocks.has(next_shape)){
            next_shape = Math.floor(Math.random()*7);
        }
        currentShape = generateShape(next_shape);
        next_shape = Math.floor(Math.random()*7);
        while (!blocks.has(next_shape)){
            next_shape = Math.floor(Math.random()*7);
        }
    }
    else{
        currentShape = generateShape(next_shape);
        next_shape = Math.floor(Math.random()*7);
        while (!blocks.has(next_shape)){
            next_shape = Math.floor(Math.random()*7);
        }
    }
    let canDraw = checkDraw(currentShape);
    if (canDraw){
        drawNextShape(next_shape);
        currentShape.drawShape();
        currentShape.start();
    }
    else{
        endGame();
    }
    
    
}
function checkDraw(currentShape){
    for (let i=0;i<currentShape.cells.length;i++){
        let row = currentShape.cells[i][0];
        let col = currentShape.cells[i][1];
        if ($(".tetris-cell").eq(row*columns + col).css("background-color") != emptyColor){
            drawPartially(currentShape);
            return false;
        }
    }
    return true;
}
function endGame(){
    alert("Kraj igre, unesite ime kako biste upisali svoj rezultat na stranicu sa rezultatima");
    $("#username").removeAttr("hidden");
}
function drawPartially(currentShape){
    for (let i=0;i<currentShape.cells.length;i++){
        let row = currentShape.cells[i][0] -1;
        let col = currentShape.cells[i][1];
        if (row>=0){
            if ($(".tetris-cell").eq(row*columns + col).css("background-color") == emptyColor){
                $(".tetris-cell").eq(row*columns + col).css("background-color",currentColor);
            }
        }
        
    }
}
function drawNextShape(next){
    $("#next").attr("src","tetris-dodatno/Shape"+next+".png");
}
function generateShape(num){
    
    switch(num){
        case 0:
            return new I_Shape();
        case 1:
            return new T_Shape();
        case 2:
            return new L_Shape()
        case 3:
            return new J_Shape();
        case 4:
            return new O_Shape();
        case 5:
            return new S_Shape();
        case 6:
            return new Z_Shape();
        default:
            break;
    }
    
}

function mod(n, m) {
    return ((n % m) + m) % m;
}


class Shape{
    constructor(){
        this.cells = new Array(4);
        this.rotation = 0;
        this.rotations = null;
        for (let i=0;i<4;i++){
            this.cells[i] = [0,0]
        }
        this.color = "aqua";//placeholder
    }
    start(){
        setTimeout(() => {
            this.fall()
        }, speed);
    }
    //METODA ZA CRTANJE JEDNOG OBLIKA
    drawShape(){
        for (let i=0;i<this.cells.length;i++){
            let col = this.cells[i][1];
            let row = this.cells[i][0];
    
            $(".tetris-cell").eq(row*columns + col).css("background-color",this.color);
        }
    }
    //METODA ZA BRISANJE OBLIKA
    eraseShape(){
        for (let i=0;i<this.cells.length;i++){
            let col = this.cells[i][1];
            let row = this.cells[i][0];
    
            $(".tetris-cell").eq(row*columns + col).css("background-color",emptyColor);
        }
    }
    //METODA KOJA PROVERAVA DA LI CE OBLIK UDARITI U DRUGI OBLIK ILI IVICU GRID-A
    checkVerticalCollision(){
        for (let i=0;i<this.cells.length;i++){
            let row = this.cells[i][0];
            let col = this.cells[i][1];
            if (row+1 < rows){
                if ($(".tetris-cell").eq((row+1)*columns + col).css("background-color") != emptyColor && !this.inCurrentShape(row+1,col)){
                    
                    return false;
                }
            }
            else{
                return false;
            }
        }
        return true;
    
    }
    //METODA ZA POMERANJE OBLIKA 1 POLJE NA DOLE
    fall(){
        let canFall = this.checkVerticalCollision();
        if (canFall){
            this.eraseShape();
            for (let i=0;i<this.cells.length;i++){
                this.cells[i][0]++;
            }
            this.drawShape();
            
            setTimeout(() => {
                this.fall()
            }, speed);
        }
        else {
            checkTetris();
            spawnTetromino();
        }
    }
    
    
    //METODA KOJA PROVERAVA DA LI SE ZADATA CELIJA NALAZI U OKVIRU OBLIKA KOJI TRENUTNO PADA
    inCurrentShape(row,column){
        for (let i=0;i<this.cells.length;i++){
            if (this.cells[i][0] ==row && this.cells[i][1] == column) return true;
        }
        return false;
    }
    //METODA KOJA POMERA ZA 1 MESTO NA DOLE BEZ TOGA DA SPAWNUJE NOVI OBLIK, KORISTI SE KAD KORISNIK ZELI DA UBRZA PAD
    moveDown(){
        let canFall = this.checkVerticalCollision();
        if (canFall){
            this.eraseShape();
            for (let i=0;i<this.cells.length;i++){
                this.cells[i][0]++;
            }
            this.drawShape();
        }
    }


    checkRotation(offset){
        for (let i=0;i<this.cells.length;i++){
            let row = this.cells[i][0]-this.rotations[this.rotation][i][0] + this.rotations[mod(this.rotation+offset,this.rotations.length)][i][0];
            let col = this.cells[i][1]-this.rotations[this.rotation][i][1] + this.rotations[mod(this.rotation+offset,this.rotations.length)][i][1];
    
            if (row<0 || row>=rows || col<0 || col >=columns) return false;
    
            if ($(".tetris-cell").eq(row*columns+col).css("background-color") != emptyColor && !this.inCurrentShape(row,col)) return false;
        }
        return true;
    }

    rotateRight(){
        let canRotate = this.checkRotation(1);
        if (canRotate){
            this.eraseShape();
            for (let i=0;i<this.cells.length;i++){
                this.cells[i][0] = this.cells[i][0]-this.rotations[this.rotation][i][0] + this.rotations[mod(this.rotation+1,this.rotations.length)][i][0];
                this.cells[i][1] = this.cells[i][1]-this.rotations[this.rotation][i][1] + this.rotations[mod(this.rotation+1,this.rotations.length)][i][1];
            }
            this.rotation = mod(this.rotation+1,this.rotations.length)
            this.drawShape();
        }
    }

    rotateLeft(){
        let canRotate = this.checkRotation(-1);
        if (canRotate){
            this.eraseShape();
            for (let i=0;i<this.cells.length;i++){
                this.cells[i][0] = this.cells[i][0]-this.rotations[this.rotation][i][0] + this.rotations[mod(this.rotation-1,this.rotations.length)][i][0];
                this.cells[i][1] = this.cells[i][1]-this.rotations[this.rotation][i][1] + this.rotations[mod(this.rotation-1,this.rotations.length)][i][1];
            }
            this.rotation = mod(this.rotation-1,this.rotations.length)
            this.drawShape();
        }
    }
    
    tryMoveLeft(){
        let canMove = this.checkHorizontalCollision(-1);
    
        if (canMove){
            this.eraseShape();
            for (let i=0;i<this.cells.length;i++){
                this.cells[i][1] --;
            }
            this.drawShape();
        }
    }
    tryMoveRight(){
        let canMove = this.checkHorizontalCollision(1);
    
        if (canMove){
            this.eraseShape();
            for (let i=0;i<this.cells.length;i++){
                this.cells[i][1] ++;
            }
            this.drawShape();
        }
    }
    
    checkHorizontalCollision(direction){
        for (let i=0;i<this.cells.length;i++){
            let row = this.cells[i][0];
            let col = this.cells[i][1] +direction;
            if (col >= columns || col < 0) return false;
    
            let cellColor = $(".tetris-cell").eq(row*columns + col).css("background-color");
            
            if (cellColor!=emptyColor && !this.inCurrentShape(row,col)) return false;
        }
        return true;
    }
}
class I_Shape extends Shape{
    constructor(){
        super();
        this.color = "aqua";
        this.rotations = I_Shape_rotations;
        for (let i=0;i<this.cells.length;i++){
            this.cells[i][0] = this.rotations[this.rotation][i][0] + initialRow;
            this.cells[i][1] = this.rotations[this.rotation][i][1] + initialCol;
        }
    }

}
class T_Shape extends Shape{
    constructor(){
        super();
        this.rotations = T_Shape_rotations;
        this.color = "purple";
        for (let i=0;i<this.cells.length;i++){
            this.cells[i][0] = this.rotations[this.rotation][i][0] + initialRow;
            this.cells[i][1] = this.rotations[this.rotation][i][1] + initialCol;
        }
    }

}
class L_Shape extends Shape{
    constructor(){
        super();
        this.rotations = L_Shape_rotations;
        this.color = "orange";
        for (let i=0;i<this.cells.length;i++){
            this.cells[i][0] = this.rotations[this.rotation][i][0] + initialRow;
            this.cells[i][1] = this.rotations[this.rotation][i][1] + initialCol;
        }
    }
}
class J_Shape extends Shape{
    constructor(){
        super();
        this.rotations = J_Shape_rotations;
        this.color = "blue";
        for (let i=0;i<this.cells.length;i++){
            this.cells[i][0] = this.rotations[this.rotation][i][0] + initialRow;
            this.cells[i][1] = this.rotations[this.rotation][i][1] + initialCol;
        }
    }
}
class O_Shape extends Shape{
    constructor(){
        super();
        this.rotations = O_Shape_rotations;
        this.color = "yellow";
        for (let i=0;i<this.cells.length;i++){
            this.cells[i][0] = this.rotations[this.rotation][i][0] + initialRow;
            this.cells[i][1] = this.rotations[this.rotation][i][1] + initialCol;
        }
    }
}
class S_Shape extends Shape{
    constructor(){
        super();
        this.rotations = S_Shape_rotations;
        this.color = "green";
        for (let i=0;i<this.cells.length;i++){
            this.cells[i][0] = this.rotations[this.rotation][i][0] + initialRow;
            this.cells[i][1] = this.rotations[this.rotation][i][1] + initialCol;
        }
    }
}
class Z_Shape extends Shape{
    constructor(){
        super();
        this.rotations = Z_Shape_rotations;
        this.color = "red";
        for (let i=0;i<this.cells.length;i++){
            this.cells[i][0] = this.rotations[this.rotation][i][0] + initialRow;
            this.cells[i][1] = this.rotations[this.rotation][i][1] + initialCol;
        }
    }
}