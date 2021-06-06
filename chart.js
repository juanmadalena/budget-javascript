const chart = document.querySelector(".chart");

const canvas = document.createElement("canvas");
canvas.width=screen.width > 700 ? screen.width * 0.6 : screen.width * 0.6;
canvas.height=screen.height > 800 ? screen.height * 0.5 : screen.height * 0.5;

chart.appendChild(canvas);

const ctx = canvas.getContext("2d");

ctx.lineWidth=screen.width >= 700 ? 35 : 10;

const R = screen.width * 0.6 / 5;

function drawCircle( color, ratio, anticlockwise){
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc ( canvas.width/2, canvas.height/2, R, 0, ratio * 2 * Math.PI, anticlockwise)
    ctx.stroke();
    
}

function updateChart(income, outcome){

    ctx.clearRect(0,0,canvas.width,canvas.height);
    
    let ratio = income / (income+outcome)
    drawCircle("#9368FE",  - ratio, true)
    drawCircle("#E266C2", 1 - ratio, false)
}