const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const canvas = createCanvas(800, 1000);
const ctx = canvas.getContext('2d');

// Set up the dark alleyway background
function drawBackground() {
    // Dark gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0a0a0a');
    gradient.addColorStop(1, '#1a1a1a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add some subtle neon lighting effects
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ff2a6d';
    
    // Draw distant neon signs
    ctx.fillStyle = '#ff2a6d33';
    ctx.fillRect(100, 100, 30, 60);
    ctx.fillStyle = '#05d9e833';
    ctx.fillRect(600, 150, 40, 40);
}

// Draw the character
function drawCharacter() {
    ctx.save();
    
    // Draw hoodie
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.moveTo(350, 300);  // Hood top
    ctx.quadraticCurveTo(400, 280, 450, 300);  // Hood right curve
    ctx.lineTo(480, 600);  // Right side
    ctx.lineTo(320, 600);  // Bottom
    ctx.lineTo(350, 300);  // Back to top
    ctx.fill();

    // Draw hood shadow
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.moveTo(350, 300);
    ctx.quadraticCurveTo(400, 290, 450, 300);
    ctx.quadraticCurveTo(400, 310, 350, 300);
    ctx.fill();

    // Draw "Diddy Did It!!" text
    ctx.font = 'bold 30px Arial';  // Fallback to Arial since we can't load custom fonts easily
    ctx.fillStyle = '#ff2a6d';
    ctx.textAlign = 'center';
    ctx.fillText('Diddy', 400, 400);
    ctx.fillText('Did It!!', 400, 440);

    // Draw face
    ctx.fillStyle = '#f5d0c5';
    ctx.beginPath();
    ctx.arc(400, 320, 30, 0, Math.PI * 2);
    ctx.fill();

    // Draw black hair
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(370, 320);
    ctx.quadraticCurveTo(400, 280, 430, 320);
    ctx.quadraticCurveTo(400, 330, 370, 320);
    ctx.fill();

    // Draw starfire eyes
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#05d9e8';
    ctx.fillStyle = '#05d9e8';
    ctx.beginPath();
    ctx.arc(390, 320, 5, 0, Math.PI * 2);
    ctx.arc(410, 320, 5, 0, Math.PI * 2);
    ctx.fill();

    // Add glow to eyes
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(390, 320, 3, 0, Math.PI * 2);
    ctx.arc(410, 320, 3, 0, Math.PI * 2);
    ctx.fill();

    // Draw bat
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#444';
    ctx.beginPath();
    ctx.moveTo(480, 450);  // Bat handle
    ctx.lineTo(500, 350);  // Bat body
    ctx.lineTo(520, 330);  // Bat top
    ctx.lineTo(490, 460);  // Back to handle
    ctx.fill();
}

// Add cyberpunk effects
function addEffects() {
    // Add scan lines
    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    for(let i = 0; i < canvas.height; i += 2) {
        ctx.fillRect(0, i, canvas.width, 1);
    }

    // Add noise
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for(let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 20 - 10;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i+1] = Math.min(255, Math.max(0, data[i+1] + noise));
        data[i+2] = Math.min(255, Math.max(0, data[i+2] + noise));
    }
    ctx.putImageData(imageData, 0, 0);

    // Add vignette effect
    const gradient = ctx.createRadialGradient(
        canvas.width/2, canvas.height/2, 0,
        canvas.width/2, canvas.height/2, canvas.width/2
    );
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.7)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Generate and save the image
function generateCharacterImage() {
    drawBackground();
    drawCharacter();
    addEffects();
    
    // Save the image
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(__dirname, '../images/character.png'), buffer);
    console.log('Character image generated successfully!');
}

generateCharacterImage();
