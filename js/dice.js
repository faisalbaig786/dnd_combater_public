function randomNumber(range) {
    return Math.round( Math.random() * range ); 
}

// --- d4 --- //
function d4Roll(){
    var d4Result = Math.floor(Math.random()*4+1);
    document.getElementById('display').innerHTML = d4Result;
}

// --- d6 --- //
function d6Roll(){
    var d6Result = Math.floor(Math.random()*6+1);
    document.getElementById('display').innerHTML = d6Result;
}

// --- d8 --- //
function d8Roll(){
    var d8Result = Math.floor(Math.random()*8+1);
    document.getElementById('display').innerHTML = d8Result;
}

// --- d10 --- //
function d10Roll(){
    var d10Result = Math.floor(Math.random()*10+1);
    document.getElementById('display').innerHTML = d10Result;
}

// --- d12 --- //
function d12Roll(){
    var d12Result = Math.floor(Math.random()*12+1);
    document.getElementById('display').innerHTML = d12Result;
}

// --- d20 --- //
function d20Roll(){
    var d20Result = Math.floor(Math.random()*20+1);
    document.getElementById('display').innerHTML = d20Result;
    if (d20Result == 20){
        
    }
}

// --- d100 --- //
function d100Roll(){
    var d100Result = Math.floor(Math.random()*100+1);
    document.getElementById('display').innerHTML = d100Result;
}
  