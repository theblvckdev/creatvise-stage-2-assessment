const canvas = document.getElementById('shapeCanvas'); 
const ctx = canvas.getContext('2d'); // grab 2d context to draw

const shapeSelect = document.getElementById('shapeSelect'); 
const borderRadiusInput = document.getElementById('borderRadius'); 
const radiusValue = document.getElementById('radiusValue'); 
const fillColorInput = document.getElementById('fillColor'); 
const borderColorInput = document.getElementById('borderColor'); 
const borderWidthInput = document.getElementById('borderWidth'); 
const borderWidthValue = document.getElementById('borderWidthValue'); 

let isDrawing = false; 
let startX, startY, currentX, currentY; 

// change the radius number when user adjust the slider
borderRadiusInput.addEventListener('input', function() { 
    radiusValue.textContent = this.value; 
});

// same thing as above for border width
borderWidthInput.addEventListener('input', function() { 
    borderWidthValue.textContent = this.value; 
});

// press mouse down to start drawing 
canvas.addEventListener('mousedown', function(e) { 
    startX = e.offsetX; 
    startY = e.offsetY; 
    isDrawing = true; 
});

// track movement while drawing
canvas.addEventListener('mousemove', function(e) { 
    if (isDrawing) { 
        currentX = e.offsetX; 
        currentY = e.offsetY; 
        draw(); 
    }
});

// stop the drawing mouse is released
canvas.addEventListener('mouseup', function() { 
    isDrawing = false; 
});

// clear canvas on double-click
canvas.addEventListener('dblclick', function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
})

// main drawing function depending on what shape was picked
function draw() { 
    const shape = shapeSelect.value; 
    const fillColor = fillColorInput.value; 
    const borderColor = borderColorInput.value; 
    const borderWidth = parseInt(borderWidthInput.value); 
    const borderRadius = parseInt(borderRadiusInput.value); 

    const width = currentX - startX; 
    const height = currentY - startY; 

    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas to avoid overlap 

    ctx.fillStyle = fillColor; 
    ctx.strokeStyle = borderColor; 
    ctx.lineWidth = borderWidth; 

    // check what shape and call its function
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

// draw a rectangle but rounded if user sets radius
function drawRoundedRect(x, y, width, height, radius) { 
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
}

// draw a circle
function drawCircle(x, y, width, height) { 
    const radius = Math.min(Math.abs(width), Math.abs(height)) / 2; 
    ctx.beginPath(); 
    ctx.arc(x + radius, y + radius, radius, 0, 2 * Math.PI); 
    ctx.closePath(); 

    ctx.fill(); 
    ctx.stroke(); 
}

// draw an ellipse
function drawEllipse(x, y, width, height) { 
    ctx.beginPath(); 
    ctx.ellipse(x + width / 2, y + height / 2, Math.abs(width) / 2, Math.abs(height) / 2, 0, 0, 2 * Math.PI); 
    ctx.closePath(); 

    ctx.fill(); 
    ctx.stroke(); 
}
