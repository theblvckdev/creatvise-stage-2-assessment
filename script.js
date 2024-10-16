const canvas = document.getElementById('shapeCanvas'); 
const ctx = canvas.getContext('2d'); // grab 2D context to draw

let cornerDots = [
    { x: 0, y: 0, radius: 5 },  // top-left corner
    { x: 0, y: 0, radius: 5 },  // top-right corner
    { x: 0, y: 0, radius: 5 },  // bottom-right corner
    { x: 0, y: 0, radius: 5 }   // bottom-left corner
];
let draggingDot = -1; // Which dot is being dragged (-1 means none)

const shapeSelect = document.getElementById('shapeSelect'); 
const borderRadiusInput = document.getElementById('borderRadius'); 
const radiusValue = document.getElementById('radiusValue'); 
const fillColorInput = document.getElementById('fillColor'); 
const borderColorInput = document.getElementById('borderColor'); 
const borderWidthInput = document.getElementById('borderWidth'); 
const borderWidthValue = document.getElementById('borderWidthValue'); 

let isDrawing = false; 
let startX, startY, currentX, currentY; 

// Change the radius number when user adjusts the slider
borderRadiusInput.addEventListener('input', function() { 
    if (this.value > 100) {
        this.value = 100;  // Set max limit to 100
    }
    radiusValue.textContent = this.value; 
});

// Same thing as above for border width
borderWidthInput.addEventListener('input', function() { 
    borderWidthValue.textContent = this.value; 
});

// Press mouse down to start drawing 
canvas.addEventListener('mousedown', function(e) { 
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;
    
    // Reset border radius to 0 when starting a new shape
    borderRadiusInput.value = 0;
    radiusValue.textContent = 0;

    // Check if a corner dot is clicked
    cornerDots.forEach((dot, index) => {
        if (Math.hypot(mouseX - dot.x, mouseY - dot.y) < dot.radius) {
            draggingDot = index;
        }
    });
    
    if (draggingDot === -1) {
        startX = mouseX;
        startY = mouseY;
        isDrawing = true;
    }
});

// Track movement while drawing
canvas.addEventListener('mousemove', function(e) { 
    if (isDrawing) { 
        currentX = e.offsetX; 
        currentY = e.offsetY; 
        draw(); 
    } else if (draggingDot !== -1) {
        const dot = cornerDots[draggingDot];
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;
        
        // Update the radius based on mouse movement (simplified)
        const dx = Math.abs(mouseX - startX);
        const dy = Math.abs(mouseY - startY);
        let newRadius = Math.min(dx, dy);
        
        // Set max limit for newRadius to 100
        if (newRadius > 100) {
            newRadius = 100;
        }

        borderRadiusInput.value = newRadius;
        radiusValue.textContent = newRadius;
        draw();  // Redraw the shape with the new border radius
    }
});

// Stop the drawing when mouse is released
canvas.addEventListener('mouseup', function() { 
    isDrawing = false; 
    draggingDot = -1;  // Reset dragging state
});

// Clear canvas on double-click
canvas.addEventListener('dblclick', function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Main drawing function depending on what shape was picked
function draw() { 
    const shape = shapeSelect.value; 
    const fillColor = fillColorInput.value; 
    const borderColor = borderColorInput.value; 
    const borderWidth = parseInt(borderWidthInput.value); 
    const borderRadius = Math.min(100, parseInt(borderRadiusInput.value));  // Cap radius at 100

    const width = currentX - startX; 
    const height = currentY - startY; 

    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas to avoid overlap 

    ctx.fillStyle = fillColor; 
    ctx.strokeStyle = borderColor; 
    ctx.lineWidth = borderWidth; 

    // Check what shape and call its function
    switch (shape) { 
        case 'rectangle': 
            drawRoundedRect(startX, startY, width, height, borderRadius); 
            break; 
        case 'circle': 
            drawCircle(startX, startY, width, height); 
            break; 
        case 'ellipse': 
            drawEllipse(startX, startY, width, height); 
            break; 
    }
}

// Draw a rectangle but rounded if user sets radius
function drawRoundedRect(x, y, width, height, radius) { 
    // Ensure the radius doesn't exceed 100px
    if (radius > 100) {
        radius = 100;
    }

    ctx.beginPath(); 
    ctx.moveTo(x + radius, y); 
    ctx.lineTo(x + width - radius, y); 
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius); 
    ctx.lineTo(x + width, y + height - radius); 
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height); 
    ctx.lineTo(x + radius, y + height); 
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius); 
    ctx.lineTo(x, y + radius); 
    ctx.quadraticCurveTo(x, y, x + radius, y); 
    ctx.closePath(); 

    ctx.fill(); 
    ctx.stroke(); 

    // Draw corner dots
    drawCornerDots(x, y, width, height, radius);
}

// Draw a dot
function drawDot(x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.stroke();
}

// Draw the corner dots inside the shape
function drawCornerDots(x, y, width, height, borderRadius) {
    const dotPadding = 10; // Add some padding to move the dots inside the shape
    const corners = [
        { x: x + borderRadius + dotPadding, y: y + borderRadius + dotPadding },  // top-left
        { x: x + width - borderRadius - dotPadding, y: y + borderRadius + dotPadding },  // top-right
        { x: x + width - borderRadius - dotPadding, y: y + height - borderRadius - dotPadding },  // bottom-right
        { x: x + borderRadius + dotPadding, y: y + height - borderRadius - dotPadding }  // bottom-left
    ];
    
    cornerDots.forEach((dot, i) => {
        dot.x = corners[i].x;
        dot.y = corners[i].y;
        drawDot(dot.x, dot.y, dot.radius);
    });
}

// Draw a circle
function drawCircle(x, y, width, height) { 
    const radius = Math.min(Math.abs(width), Math.abs(height)) / 2; 
    ctx.beginPath(); 
    ctx.arc(x + radius, y + radius, radius, 0, 2 * Math.PI); 
    ctx.closePath(); 

    ctx.fill(); 
    ctx.stroke(); 
}

// Draw an ellipse
function drawEllipse(x, y, width, height) { 
    ctx.beginPath(); 
    ctx.ellipse(x + width / 2, y + height / 2, Math.abs(width) / 2, Math.abs(height) / 2, 0, 0, 2 * Math.PI); 
    ctx.closePath(); 

    ctx.fill(); 
    ctx.stroke(); 
}
