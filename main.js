const canvas = document.getElementById('simulationCanvas');

const ctx = canvas.getContext('2d');

const socket = new WebSocket("ws://localhost:8080/simulation");

socket.onopen = function(event) {
    console.log("WebSocket connection established.");
};

socket.onmessage = (event) => {
    bodies = JSON.parse(event.data);
    draw(bodies);
};

socket.onerror = function(error) {
    console.error("WebSocket Error: " + error);
};

socket.onclose = function(event) {
    console.log("WebSocket connection closed.");
};

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bodies.forEach(body =>
        {
            console.log(body);
            drawBody(body);
        }
    );
}

function drawBody(body) {
    ctx.beginPath();
    ctx.arc(body.x, body.y, Math.max(3, Math.log(body.mass)), 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
}

function addBody() {
    const mass = parseFloat(document.getElementById('mass').value);
    const x = parseFloat(document.getElementById('x').value);
    const y = parseFloat(document.getElementById('y').value);
    const vx = parseFloat(document.getElementById('vx').value);
    const vy = parseFloat(document.getElementById('vy').value);

    if (!isNaN(mass) && !isNaN(x) && !isNaN(y) && !isNaN(vx) && !isNaN(vy)) {
        socket.send(JSON.stringify({
            mass: mass,
            x: x,
            y: y,
            vx: vx,
            vy: vy,
        }));
    }
}

function removeBody(x, y) {
    bodies = bodies.filter(body => {
        const dx = body.x - x;
        const dy = body.y - y;
        return Math.sqrt(dx * dx + dy * dy) > 10; // Remove if clicked near body
    });
}

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    removeBody(mouseX, mouseY);
});