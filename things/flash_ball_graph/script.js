
color_switch_rate = 5;
curr_color = {
    r: 255,
    g: 0,
    b: 0
}


const bouncys = [];
let xScale = 1;
let yScale = 1;
let dyScale = 1;
const x = [0];
const y = [0];
const dy = [];
let t0 = Date.now();

function recursiveDrawLinePlot(ctx, canvas) {
    const _x = (Date.now() - t0) / 1000; // time in seconds
    const _y = bouncys.length;

    x.push(_x);
    y.push(_y);
    dy.push(_y - y[y.length - 2]);

    const yScale = canvas.height / Math.max(...y); 
    const xScale = canvas.width / Math.max(...x);
    const dyScale = canvas.height / Math.max(...dy);


    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(x[0] * xScale, canvas.height - y[0] * yScale);

    for (let i = 1; i < x.length; i++) {
        ctx.lineTo(x[i] * xScale, canvas.height - y[i] * yScale);
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x[0] * xScale, canvas.height - dy[0] * dyScale);

    for (let i = 1; i < x.length; i++) {
        ctx.lineTo(x[i] * xScale, canvas.height - dy[i] * dyScale);
    }
    ctx.stroke();

    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    

    setTimeout(() => {
        recursiveDrawLinePlot(ctx, canvas);
    }, 1000);
}
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('lineChart');
    const ctx = canvas.getContext('2d');
    
    createInitialBouncys();
    moveBouncys();
    
    t0 = Date.now()
    recursiveDrawLinePlot(ctx, canvas);
});
function next_color() {
    if (curr_color.r == 255 && curr_color.g < 255 && curr_color.b == 0) {
        curr_color.g += color_switch_rate;
        if (curr_color.g > 255) {
            curr_color.g = 255;
        }
    }
    if (curr_color.g == 255 && curr_color.r > 0 && curr_color.b == 0) {
        curr_color.r -= color_switch_rate;
        if (curr_color.r < 0) {
            curr_color.r = 0;
        }
    }
    if (curr_color.g == 255 && curr_color.b < 255 && curr_color.r == 0) {
        curr_color.b += color_switch_rate;
        if (curr_color.b > 255) {
            curr_color.b = 255;
        }
    }
    if (curr_color.b == 255 && curr_color.g > 0 && curr_color.r == 0) {
        curr_color.g -= color_switch_rate;
        if (curr_color.g < 0) {
            curr_color.g = 0;
        }
    }
    if (curr_color.b == 255 && curr_color.r < 255 && curr_color.g == 0) {
        curr_color.r += color_switch_rate;
        if (curr_color.r > 255) {
            curr_color.r = 255;
        }
    }
    if (curr_color.r == 255 && curr_color.b > 0 && curr_color.g == 0) {
        curr_color.b -= color_switch_rate;
        if (curr_color.b < 0) {
            curr_color.b = 0;
        }
    }
    return `rgba(${curr_color.r}, ${curr_color.g}, ${curr_color.b}, `;
}

async function createInitialBouncys() {
    num_bouncys = 100000;
    speed_pix = 6;
    spawn_delay = 5;
    rotation_speed = 0.05;
    for (let i = 0; i < num_bouncys; i++) {
        angle = rotation_speed * i * Math.PI;
        _dx = Math.cos(angle) * speed_pix;
        _dy = Math.sin(angle) * speed_pix;
        createBouncy(window.innerWidth / 2, window.innerHeight / 2, _dx, _dy, 50, 50, next_color());
        await new Promise(r => setTimeout(r, spawn_delay));
    }       
}

function createBouncy(x=100, y=100, dx=2, dy=2, width=50, height=50, color='red') {

    const bouncy = document.createElement('div');
	bouncy.classList.add('bouncy');

	bouncy.style.width = width + 'px';
	bouncy.style.height = height + 'px';
	bouncy.style.left = x + 'px';
	bouncy.style.top = y + 'px';
    bouncy.style.background = `radial-gradient(circle, ${color}0.8) 0%, ${color}0.4) 50%, ${color}0.1) 75%, ${color}0) 100%)`;

    document.body.appendChild(bouncy);
    bouncys.push({ element: bouncy, x: x, y: y, dx: dx, dy: dy, width: width, height: height });
}

function moveBouncys() {
    bouncys.forEach(bouncy => {
        // Move bouncy
        bouncy.x += bouncy.dx;
        bouncy.y += bouncy.dy;

        // Wall collision
        if (bouncy.x <= 0 || bouncy.x + bouncy.width >= window.innerWidth) {
            bouncy.dx = -bouncy.dx;
        }
        if (bouncy.y <= 0 || bouncy.y + bouncy.height >= window.innerHeight) {
            bouncy.dy = -bouncy.dy;
        }

        // Update bouncy position
        bouncy.element.style.left = bouncy.x + 'px';
        bouncy.element.style.top = bouncy.y + 'px';
    });

    requestAnimationFrame(moveBouncys);
}
