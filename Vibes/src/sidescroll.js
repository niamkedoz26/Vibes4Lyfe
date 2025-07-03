// Car Animation
const canvas = document.getElementById('stickman-canvas');
const ctx = canvas.getContext('2d');

let frame = 0;
const speed = 4; // pixels per frame
let carX = canvas.width * 0.5 - 40;
let sunAngle = 0;
let cloudOffset = 0;
let birdX = canvas.width + 60;
let birdY = 120;
let birdFlap = 0;
let bird2X = canvas.width + 60 - 80; // Start slightly behind the first bird
let bird2Y = 140; // Slightly different height
let bird2Flap = 0;
let carAutoMove = false;
let carAutoMoveDir = 1;
let isNight = false;

function drawStreet() {
    // Road Y position
    const roadY = canvas.height - 80; // Move street closer to bottom
    ctx.save();
    // Draw road base
    ctx.fillStyle = '#444';
    ctx.fillRect(0, roadY, canvas.width, 40);
    // Add road texture (subtle noise effect)
    for (let i = 0; i < canvas.width; i += 16) {
        ctx.globalAlpha = 0.08;
        ctx.fillStyle = i % 32 === 0 ? '#555' : '#333';
        ctx.fillRect(i, roadY, 8, 40);
    }
    ctx.globalAlpha = 1;
    // Draw dashed center line
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.setLineDash([30, 20]);
    ctx.beginPath();
    ctx.moveTo(0, roadY + 20);
    ctx.lineTo(canvas.width, roadY + 20);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineWidth = 1;
    // Draw road edge lines
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, roadY + 2);
    ctx.lineTo(canvas.width, roadY + 2);
    ctx.moveTo(0, roadY + 38);
    ctx.lineTo(canvas.width, roadY + 38);
    ctx.stroke();
    ctx.lineWidth = 1;
    // Add random small cracks
    for (let i = 0; i < 18; i++) {
        const crackX = Math.random() * canvas.width;
        const crackY = roadY + 5 + Math.random() * 30;
        ctx.strokeStyle = 'rgba(80,80,80,0.7)';
        ctx.beginPath();
        ctx.moveTo(crackX, crackY);
        ctx.lineTo(crackX + 8 + Math.random() * 8, crackY + Math.random() * 2 - 1);
        ctx.stroke();
    }
    ctx.restore();
}

function drawCar(x, y) {
    const scale = 1.7;
    const roadY = canvas.height - 80; // Match street position
    ctx.save();
    ctx.translate(x, roadY - 51);
    ctx.scale(scale, scale);
    // Body
    ctx.beginPath();
    ctx.moveTo(0, 24);
    ctx.quadraticCurveTo(5, 5, 30, 5); // front slope
    ctx.lineTo(55, 5);
    ctx.quadraticCurveTo(78, 5, 80, 18); // rear slope
    ctx.lineTo(80, 30);
    ctx.lineTo(0, 30);
    ctx.closePath();
    ctx.fillStyle = '#1a1a1a'; // black
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.lineWidth = 1;
    // Front grille
    ctx.beginPath();
    ctx.rect(2, 18, 18, 6);
    ctx.fillStyle = '#222';
    ctx.fill();
    ctx.stroke();
    // Emblem
    ctx.beginPath();
    ctx.ellipse(11, 21, 2.5, 1.2, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.stroke();
    // Hood scoop
    ctx.beginPath();
    ctx.ellipse(30, 10, 7, 2, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#444';
    ctx.fill();
    ctx.stroke();
    // Roof
    ctx.beginPath();
    ctx.moveTo(20, 18);
    ctx.lineTo(32, 7);
    ctx.lineTo(55, 7);
    ctx.lineTo(65, 18);
    ctx.closePath();
    ctx.fillStyle = '#bdbdbd';
    ctx.fill();
    ctx.stroke();
    // Racing stripes
    ctx.beginPath();
    ctx.moveTo(36, 5);
    ctx.lineTo(36, 30);
    ctx.moveTo(49, 5);
    ctx.lineTo(49, 30);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.lineWidth = 1;
    // Wheels
    ctx.beginPath();
    ctx.arc(18, 32, 5, 0, Math.PI * 2);
    ctx.arc(62, 32, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#222';
    ctx.fill();
    ctx.stroke();
    // Wheel rims
    ctx.beginPath();
    ctx.arc(18, 32, 2, 0, Math.PI * 2);
    ctx.arc(62, 32, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#bbb';
    ctx.fill();
    ctx.stroke();
    // Add more car details
    // Door outline
    ctx.beginPath();
    ctx.moveTo(48, 18);
    ctx.lineTo(48, 30);
    ctx.strokeStyle = '#888';
    ctx.stroke();
    // Side mirror
    ctx.beginPath();
    ctx.ellipse(18, 12, 1.5, 3, Math.PI / 4, 0, Math.PI * 2);
    ctx.fillStyle = '#bdbdbd';
    ctx.fill();
    ctx.stroke();
    // Hood pins
    ctx.beginPath();
    ctx.arc(25, 8, 1, 0, Math.PI * 2);
    ctx.arc(60, 8, 1, 0, Math.PI * 2);
    ctx.fillStyle = '#ffd700';
    ctx.fill();
    ctx.stroke();
    // Front splitter
    ctx.beginPath();
    ctx.moveTo(-6, 30);
    ctx.lineTo(86, 30);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#444';
    ctx.stroke();
    ctx.lineWidth = 1;
    // Chrome window trim
    ctx.beginPath();
    ctx.moveTo(25, 18);
    ctx.lineTo(32, 9);
    ctx.lineTo(55, 9);
    ctx.lineTo(62, 18);
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.lineWidth = 1;
    // Windshield reflection
    ctx.beginPath();
    ctx.moveTo(34, 10);
    ctx.bezierCurveTo(38, 12, 50, 10, 54, 14);
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.lineWidth = 1;
    // Tire treads
    ctx.save();
    ctx.strokeStyle = '#444';
    for (let i = -6; i <= 6; i += 3) {
        ctx.beginPath();
        ctx.moveTo(20 + i, 32 - 8);
        ctx.lineTo(20 + i, 32 + 8);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(60 + i, 32 - 8);
        ctx.lineTo(60 + i, 32 + 8);
        ctx.stroke();
    }
    ctx.restore();
    // Exhaust pipes
    ctx.beginPath();
    ctx.ellipse(78, 33, 2, 0.7, 0, 0, Math.PI * 2);
    ctx.ellipse(82, 33, 2, 0.7, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#bbb';
    ctx.fill();
    ctx.stroke();
    // Rear window defroster lines
    ctx.save();
    ctx.strokeStyle = '#ffb347';
    for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.moveTo(34, 11 + i * 2);
        ctx.lineTo(53, 11 + i * 2);
        ctx.stroke();
    }
    ctx.restore();
    // Door handle
    ctx.beginPath();
    ctx.ellipse(52, 22, 1.5, 0.7, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#ccc';
    ctx.fill();
    ctx.stroke();
    // Antenna
    ctx.beginPath();
    ctx.moveTo(60, 7);
    ctx.lineTo(60, -8);
    ctx.strokeStyle = '#888';
    ctx.stroke();
    ctx.restore();
    ctx.restore();
}

// Add global car movement handler
window.moveCar = function(direction) {
    // Move car by 20px per click
    carX += direction * 20;
    // Wrap around
    if (carX > canvas.width - 80 * 1.7) {
        carX = 0;
    } else if (carX < 0) {
        carX = canvas.width - 80 * 1.7;
    }
};

window.toggleCarAutoMove = function() {
    carAutoMove = !carAutoMove;
};

window.toggleNight = function() {
    isNight = !isNight;
};

function drawSun() {
    const sunX = canvas.width - 80;
    const sunY = 80;
    const sunRadius = 40;
    // Sun body with gradient
    ctx.save();
    const grad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, sunRadius);
    grad.addColorStop(0, '#fffde4');
    grad.addColorStop(0.5, '#FFD700');
    grad.addColorStop(1, '#ff9900');
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 30;
    ctx.fill();
    ctx.shadowBlur = 0;
    // Sun rays
    for (let i = 0; i < 12; i++) {
        const angle = sunAngle + (i * Math.PI / 6);
        const x1 = sunX + Math.cos(angle) * (sunRadius + 8);
        const y1 = sunY + Math.sin(angle) * (sunRadius + 8);
        const x2 = sunX + Math.cos(angle) * (sunRadius + 24);
        const y2 = sunY + Math.sin(angle) * (sunRadius + 24);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = i % 2 === 0 ? '#FFD700' : '#ffb347';
        ctx.lineWidth = i % 2 === 0 ? 4 : 2;
        ctx.globalAlpha = 0.85;
        ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // Add more sun detail: inner glow ring
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius - 10, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 8;
    ctx.shadowColor = '#fffde4';
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.shadowBlur = 0;
    // Add subtle sunspots
    ctx.beginPath();
    ctx.arc(sunX + 12, sunY - 10, 4, 0, Math.PI * 2);
    ctx.arc(sunX - 10, sunY + 8, 2.5, 0, Math.PI * 2);
    ctx.arc(sunX + 6, sunY + 14, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,200,80,0.35)';
    ctx.fill();
    ctx.restore();
}

function drawTrees() {
    // Draw a row of trees in the background
    const baseY = canvas.height - 130; // Move trees closer to bottom
    for (let i = 0; i < canvas.width; i += 120) {
        // Trunk (make taller and more visible)
        ctx.save();
        ctx.beginPath();
        ctx.rect(i + 66, baseY + 10, 12, 60); // taller trunk, narrower, starts higher
        ctx.fillStyle = '#8B5A2B';
        ctx.fill();
        // Add trunk texture (lines)
        ctx.strokeStyle = 'rgba(110, 70, 30, 0.4)';
        ctx.lineWidth = 2;
        for (let t = 0; t < 2; t++) {
            ctx.beginPath();
            ctx.moveTo(i + 70 + t * 4, baseY + 12);
            ctx.lineTo(i + 70 + t * 4, baseY + 68);
            ctx.stroke();
        }
        // Foliage (move up to sit on taller trunk)
        ctx.beginPath();
        ctx.arc(i + 72, baseY + 10, 32, 0, Math.PI * 2);
        ctx.arc(i + 58, baseY + 18, 26, 0, Math.PI * 2);
        ctx.arc(i + 86, baseY + 18, 24, 0, Math.PI * 2);
        ctx.arc(i + 72, baseY - 10, 22, 0, Math.PI * 2);
        ctx.fillStyle = '#2e8b57';
        ctx.globalAlpha = 0.85;
        ctx.fill();
        ctx.globalAlpha = 1;
        // Add foliage highlights
        ctx.beginPath();
        ctx.arc(i + 60, baseY, 10, 0, Math.PI * 2);
        ctx.arc(i + 80, baseY + 8, 7, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(180,255,255,0.18)';
        ctx.fill();
        // Add shadowed areas for depth
        ctx.beginPath();
        ctx.arc(i + 72, baseY + 30, 20, 0, Math.PI * 2);
        ctx.arc(i + 58, baseY + 18, 12, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(30,60,30,0.13)';
        ctx.fill();
        // Add subtle leaf clusters
        for (let l = 0; l < 5; l++) {
            ctx.beginPath();
            const angle = Math.random() * Math.PI * 2;
            const r = 18 + Math.random() * 14;
            ctx.arc(i + 72 + Math.cos(angle) * r, baseY + 10 + Math.sin(angle) * r, 4 + Math.random() * 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(60, 160, 90, 0.22)';
            ctx.fill();
        }
        ctx.restore();
    }
}

function drawClouds(passInFront = false) {
    // Draw a few clouds at different positions
    const clouds = [
        { x: 180, y: 70, scale: 1.1, z: 'back' },
        { x: 400, y: 50, scale: 1.4, z: 'front' },
        { x: 700, y: 90, scale: 1.2, z: 'back' },
        { x: 1000, y: 60, scale: 1.0, z: 'front' }
    ];
    ctx.save();
    ctx.globalAlpha = 0.7;
    clouds.forEach(cloud => {
        // Only draw clouds for the correct layer
        if ((passInFront && cloud.z === 'front') || (!passInFront && cloud.z === 'back')) {
            ctx.save();
            let cloudX = (cloud.x + cloudOffset) % (canvas.width + 120);
            if (cloudX < -120) cloudX += canvas.width + 120;
            ctx.translate(cloudX, cloud.y);
            ctx.scale(cloud.scale, cloud.scale);
            ctx.beginPath();
            ctx.arc(0, 0, 32, Math.PI * 0.5, Math.PI * 1.5);
            ctx.arc(40, -10, 28, Math.PI * 1, Math.PI * 1.85);
            ctx.arc(70, 10, 22, Math.PI * 1.37, Math.PI * 0.37, true);
            ctx.arc(40, 20, 26, Math.PI * 1.5, Math.PI * 0.5);
            ctx.closePath();
            ctx.fillStyle = '#d1d5db';
            ctx.shadowColor = '#b0b8c1';
            ctx.shadowBlur = 16;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.restore();
        }
    });
    ctx.globalAlpha = 1;
    ctx.restore();
}

function drawBird(x, y, flap) {
    // Bird position and animation
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1.2, 1.2);
    // Body
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 8, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#444';
    ctx.fill();
    // Head
    ctx.beginPath();
    ctx.arc(14, -2, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#555';
    ctx.fill();
    // Beak
    ctx.beginPath();
    ctx.moveTo(20, -2);
    ctx.lineTo(27, 0);
    ctx.lineTo(20, 2);
    ctx.closePath();
    ctx.fillStyle = '#e2a200';
    ctx.fill();
    // Eye
    ctx.beginPath();
    ctx.arc(16, -4, 1.2, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(16, -4, 0.5, 0, Math.PI * 2);
    ctx.fillStyle = '#222';
    ctx.fill();
    // Wing (flapping)
    ctx.save();
    ctx.rotate(Math.sin(flap) * 0.5);
    ctx.beginPath();
    ctx.ellipse(-2, -6, 12, 5, Math.PI / 6, 0, Math.PI * 2);
    ctx.fillStyle = '#666';
    ctx.globalAlpha = 0.8;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
    ctx.restore();
}

function drawBuildingBelowSun() {
    const sunX = canvas.width - 80;
    const buildingWidth = 150; // Wider
    const buildingHeight = 200; // Taller
    const buildingX = sunX - buildingWidth / 2;
    // Make building touch the street
    const roadY = canvas.height - 80;
    const buildingY = roadY - buildingHeight;
    ctx.save();
    // Main building
    ctx.fillStyle = '#b0b6c1';
    ctx.fillRect(buildingX, buildingY, buildingWidth, buildingHeight);
    // Add vertical lines for panels
    ctx.strokeStyle = '#a0a6b1';
    ctx.lineWidth = 2;
    for (let i = 1; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(buildingX + i * (buildingWidth / 5), buildingY);
        ctx.lineTo(buildingX + i * (buildingWidth / 5), buildingY + buildingHeight);
        ctx.stroke();
    }
    // Add horizontal lines for floors
    ctx.strokeStyle = '#c0c6d1';
    ctx.lineWidth = 1.2;
    for (let i = 1; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(buildingX, buildingY + i * (buildingHeight / 8));
        ctx.lineTo(buildingX + buildingWidth, buildingY + i * (buildingHeight / 8));
        ctx.stroke();
    }
    // Windows
    ctx.fillStyle = '#e6eaf0';
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 5; col++) {
            ctx.fillRect(
                buildingX + 16 + col * 24,
                buildingY + 18 + row * 22,
                16, 16
            );
        }
    }
    // Add window reflections
    ctx.strokeStyle = 'rgba(180,220,255,0.3)';
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 5; col++) {
            ctx.beginPath();
            ctx.moveTo(buildingX + 18 + col * 24, buildingY + 20 + row * 22);
            ctx.lineTo(buildingX + 28 + col * 24, buildingY + 28 + row * 22);
            ctx.stroke();
        }
    }
    // Roof
    ctx.fillStyle = '#888';
    ctx.fillRect(buildingX - 8, buildingY - 16, buildingWidth + 16, 16);
    // Add roof details (antenna)
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(sunX, buildingY - 16);
    ctx.lineTo(sunX, buildingY - 40);
    ctx.stroke();
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(sunX, buildingY - 40, 4, 0, Math.PI * 2);
    ctx.stroke();
    // Door
    ctx.fillStyle = '#7a5c3e';
    ctx.fillRect(buildingX + buildingWidth / 2 - 16, buildingY + buildingHeight - 36, 32, 36);
    // Door knob
    ctx.beginPath();
    ctx.arc(buildingX + buildingWidth / 2 + 10, buildingY + buildingHeight - 18, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#e2c48e';
    ctx.fill();
    ctx.restore();

    // Draw a second building to the left with space between
    const spaceBetween = 60;
    const leftBuildingWidth = 120;
    const leftBuildingHeight = 170;
    const leftBuildingX = buildingX - spaceBetween - leftBuildingWidth;
    const leftBuildingY = roadY - leftBuildingHeight;
    ctx.save();
    // Main left building
    ctx.fillStyle = '#a3b7c7';
    ctx.fillRect(leftBuildingX, leftBuildingY, leftBuildingWidth, leftBuildingHeight);
    // Vertical lines for panels
    ctx.strokeStyle = '#8fa1b1';
    ctx.lineWidth = 2;
    for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(leftBuildingX + i * (leftBuildingWidth / 4), leftBuildingY);
        ctx.lineTo(leftBuildingX + i * (leftBuildingWidth / 4), leftBuildingY + leftBuildingHeight);
        ctx.stroke();
    }
    // Horizontal lines for floors
    ctx.strokeStyle = '#b0c0d1';
    ctx.lineWidth = 1.1;
    for (let i = 1; i < 7; i++) {
        ctx.beginPath();
        ctx.moveTo(leftBuildingX, leftBuildingY + i * (leftBuildingHeight / 7));
        ctx.lineTo(leftBuildingX + leftBuildingWidth, leftBuildingY + i * (leftBuildingHeight / 7));
        ctx.stroke();
    }
    // Windows
    ctx.fillStyle = '#e0eaf0';
    for (let row = 0; row < 7; row++) {
        for (let col = 0; col < 4; col++) {
            ctx.fillRect(
                leftBuildingX + 12 + col * 22,
                leftBuildingY + 14 + row * 20,
                14, 14
            );
        }
    }
    // Window reflections
    ctx.strokeStyle = 'rgba(180,220,255,0.22)';
    for (let row = 0; row < 7; row++) {
        for (let col = 0; col < 4; col++) {
            ctx.beginPath();
            ctx.moveTo(leftBuildingX + 14 + col * 22, leftBuildingY + 16 + row * 20);
            ctx.lineTo(leftBuildingX + 22 + col * 22, leftBuildingY + 24 + row * 20);
            ctx.stroke();
        }
    }
    // Roof
    ctx.fillStyle = '#7a8a99';
    ctx.fillRect(leftBuildingX - 6, leftBuildingY - 12, leftBuildingWidth + 12, 12);
    // Door
    ctx.fillStyle = '#6a4c2e';
    ctx.fillRect(leftBuildingX + leftBuildingWidth / 2 - 12, leftBuildingY + leftBuildingHeight - 28, 24, 28);
    // Door knob
    ctx.beginPath();
    ctx.arc(leftBuildingX + leftBuildingWidth / 2 + 7, leftBuildingY + leftBuildingHeight - 14, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#e2c48e';
    ctx.fill();
    ctx.restore();

    // Add a taller building further left
    const tallSpaceBetween = 50;
    const tallBuildingWidth = 100;
    const tallBuildingHeight = 260; // Taller than others
    const tallBuildingX = leftBuildingX - tallSpaceBetween - tallBuildingWidth;
    const tallBuildingY = roadY - tallBuildingHeight;
    ctx.save();
    // Main tall building
    ctx.fillStyle = '#3a4253'; // Darker color
    ctx.fillRect(tallBuildingX, tallBuildingY, tallBuildingWidth, tallBuildingHeight);
    // Add side shadow for depth
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = '#000';
    ctx.fillRect(tallBuildingX + tallBuildingWidth - 18, tallBuildingY, 18, tallBuildingHeight);
    ctx.restore();
    // Vertical lines for panels
    ctx.strokeStyle = '#232733';
    ctx.lineWidth = 2;
    for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(tallBuildingX + i * (tallBuildingWidth / 3), tallBuildingY);
        ctx.lineTo(tallBuildingX + i * (tallBuildingWidth / 3), tallBuildingY + tallBuildingHeight);
        ctx.stroke();
    }
    // Horizontal lines for floors
    ctx.strokeStyle = '#5a6a7a';
    ctx.lineWidth = 1.1;
    for (let i = 1; i < 13; i++) {
        ctx.beginPath();
        ctx.moveTo(tallBuildingX, tallBuildingY + i * (tallBuildingHeight / 13));
        ctx.lineTo(tallBuildingX + tallBuildingWidth, tallBuildingY + i * (tallBuildingWidth / 13));
        ctx.stroke();
    }
    // Windows
    ctx.fillStyle = '#b0c4de';
    for (let row = 0; row < 12; row++) {
        for (let col = 0; col < 3; col++) {
            ctx.fillRect(
                tallBuildingX + 14 + col * 26,
                tallBuildingY + 12 + row * 20,
                16, 14
            );
        }
    }
    // Window reflections
    ctx.strokeStyle = 'rgba(180,220,255,0.10)';
    for (let row = 0; row < 12; row++) {
        for (let col = 0; col < 3; col++) {
            ctx.beginPath();
            ctx.moveTo(tallBuildingX + 16 + col * 26, tallBuildingY + 14 + row * 20);
            ctx.lineTo(tallBuildingX + 26 + col * 26, tallBuildingY + 22 + row * 20);
            ctx.stroke();
        }
    }
    // Roof
    ctx.fillStyle = '#232733';
    ctx.fillRect(tallBuildingX - 5, tallBuildingY - 16, tallBuildingWidth + 10, 16);
    // Add rooftop details: antenna and vents
    ctx.save();
    ctx.strokeStyle = '#b0c4de';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(tallBuildingX + tallBuildingWidth / 2, tallBuildingY - 16);
    ctx.lineTo(tallBuildingX + tallBuildingWidth / 2, tallBuildingY - 40);
    ctx.stroke();
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(tallBuildingX + tallBuildingWidth / 2, tallBuildingY - 40, 3, 0, Math.PI * 2);
    ctx.stroke();
    // Vents
    ctx.lineWidth = 1;
    for (let v = 0; v < 3; v++) {
        ctx.beginPath();
        ctx.moveTo(tallBuildingX + 18 + v * 22, tallBuildingY - 8);
        ctx.lineTo(tallBuildingX + 18 + v * 22, tallBuildingY - 2);
        ctx.stroke();
    }
    ctx.restore();
    // Door
    ctx.fillStyle = '#2a1c1a';
    ctx.fillRect(tallBuildingX + tallBuildingWidth / 2 - 10, tallBuildingY + tallBuildingHeight - 32, 20, 32);
    // Door knob
    ctx.beginPath();
    ctx.arc(tallBuildingX + tallBuildingWidth / 2 + 6, tallBuildingY + tallBuildingHeight - 16, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#e2c48e';
    ctx.fill();
    ctx.restore();
}

function drawGrassAndNature() {
    const grassY = canvas.height - 40; // Just below the street
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, grassY, canvas.width, 40);
    ctx.fillStyle = '#4caf50';
    ctx.fill();
    // Draw two bottles at fixed positions
    const bottles = [
        { x: 60, y: grassY + 18, angle: -0.15 },
        { x: 180, y: grassY + 26, angle: 0.22 }
    ];
    bottles.forEach(bottle => {
        ctx.save();
        ctx.translate(bottle.x, bottle.y);
        ctx.rotate(bottle.angle);
        // Bottle body
        ctx.beginPath();
        ctx.ellipse(0, 0, 3, 10, Math.PI / 8, 0, Math.PI * 2);
        ctx.fillStyle = '#90caf9';
        ctx.globalAlpha = 0.7;
        ctx.fill();
        ctx.globalAlpha = 1;
        // Bottle cap
        ctx.beginPath();
        ctx.arc(0, -8, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#1976d2';
        ctx.fill();
        ctx.restore();
    });
    ctx.restore();
}

function drawStreetLights() {
    const roadY = canvas.height - 80;
    const lightSpacing = 220;
    for (let i = 0; i < canvas.width; i += lightSpacing) {
        ctx.save();
        // Pole
        ctx.beginPath();
        ctx.moveTo(i + 60, roadY - 60);
        ctx.lineTo(i + 60, roadY);
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#888';
        ctx.stroke();
        // Light arm
        ctx.beginPath();
        ctx.moveTo(i + 60, roadY - 60);
        ctx.lineTo(i + 80, roadY - 80);
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#aaa';
        ctx.stroke();
        // Lamp head
        ctx.beginPath();
        ctx.arc(i + 80, roadY - 80, 10, Math.PI * 0.2, Math.PI * 1.8);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#bbb';
        ctx.stroke();
        ctx.fillStyle = '#ffe066';
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(i + 80, roadY - 80, 7, 0, Math.PI * 2);
        ctx.fill();
        // Light glow
        ctx.globalAlpha = 0.18;
        ctx.beginPath();
        ctx.arc(i + 80, roadY - 70, 28, 0, Math.PI * 2);
        ctx.fillStyle = '#fffde4';
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();
    }
}

function drawSky() {
    ctx.save();
    if (isNight) {
        // Night sky gradient
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, '#0a1026');
        grad.addColorStop(1, '#1a223a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Draw stars
        for (let i = 0; i < 80; i++) {
            ctx.globalAlpha = Math.random() * 0.7 + 0.3;
            ctx.beginPath();
            ctx.arc(Math.random() * canvas.width, Math.random() * 220, Math.random() * 1.2 + 0.3, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    } else {
        // Day sky
        ctx.fillStyle = '#b3e0ff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.restore();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSky();
    drawClouds(false); // clouds behind sun
    drawTrees();
    drawStreet();
    drawGrassAndNature();
    drawSun();
    drawBuildingBelowSun(); // Draw building below the sun
    drawCar(carX, 0); // Move car draw after buildings
    drawClouds(true); // clouds in front of sun
    drawBird(birdX, birdY, birdFlap); // First bird
    drawBird(bird2X, bird2Y, bird2Flap); // Second bird
    // Animate birds
    birdX += 1.0;
    birdFlap += 0.18;
    if (birdX > canvas.width + 60) {
        birdX = -60;
        birdY = 80 + Math.random() * 100;
    }
    bird2X += 1.0;
    bird2Flap += 0.16; // Slightly different flap speed
    if (bird2X > canvas.width + 60) {
        bird2X = -60;
        bird2Y = 100 + Math.random() * 100;
    }
    // Car auto-move logic
    if (carAutoMove) {
        carX += carAutoMoveDir * 2;
        // Wrap around right to left
        if (carX > canvas.width - 80 * 1.7) {
            carX = 0;
        } else if (carX < 0) {
            carX = canvas.width - 80 * 1.7;
        }
    }
    sunAngle += 0.01;
    cloudOffset += 0.3;
    frame++;
    requestAnimationFrame(animate);
}

animate();
