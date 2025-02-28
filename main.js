const canvas = document.getElementById("nbodyCanvas");
const ctx = canvas.getContext("2d");

const socket = new WebSocket("ws://localhost:8080/simulation");

socket.onopen = function(event) {
    console.log("WebSocket connection established.");
    socket.send("Hello, Server!"); // Sending a message to the backend
};

socket.onmessage = (event) => {
    let bodies = JSON.parse(event.data);
    draw(bodies);
};

socket.onerror = function(error) {
    console.error("WebSocket Error: " + error);
};

socket.onclose = function(event) {
    console.log("WebSocket connection closed.");
};

// Define a smaller scale factor to make bodies fit within canvas size
const SCALE_FACTOR = 1e-11;  // Smaller scale for better visibility
const CENTER_X = canvas.width / 2;
const CENTER_Y = canvas.height / 2;

function draw(bodies) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bodies.forEach(body => {
        // Transform the position using a smaller scale factor
        const x = CENTER_X + body.position.x * SCALE_FACTOR;
        const y = CENTER_Y + body.position.y * SCALE_FACTOR;

        // Log the transformed positions for debugging
        console.log("Transformed X:", x, "Transformed Y:", y);

        // Clamp the coordinates inside the canvas bounds
        const clampedX = Math.max(0, Math.min(canvas.width, x));
        const clampedY = Math.max(0, Math.min(canvas.height, y));

        // Draw the body on the canvas
        ctx.beginPath();
        ctx.arc(clampedX, clampedY, 5, 0, Math.PI * 2);
        ctx.fillStyle = "black";
        ctx.fill();
    });
}
