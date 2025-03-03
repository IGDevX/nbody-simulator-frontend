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
            id: generateUniqueId(),
            mass: mass,
            x: x,
            y: y,
            vx: vx,
            vy: vy,
        }));
    }
}

function generateUniqueId() {
    return 'body-' + Math.random().toString(36).substr(2, 9); // Generate a random ID
}

function removeBody(id) {
    bodies = bodies.filter(body => body.id !== id);
    socket.send(JSON.stringify({ remove: id }));
}

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    bodies.forEach(body => {
        const dx = body.x - mouseX;
        const dy = body.y - mouseY;
        if (Math.sqrt(dx * dx + dy * dy) < Math.max(3, Math.log(body.mass))) {
            removeBody(body.id);
        }
    });
});