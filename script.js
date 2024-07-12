class Quadtree {
    constructor(boundBox, lvl = 0) {
        this.boundBox = boundBox;
        this.level = lvl;
        this.maxLevel = 5;
        this.maxObjects = 10;
        this.objects = [];
        this.nodes = [];
    }

    split() {
        const subWidth = this.boundBox.width / 2;
        const subHeight = this.boundBox.height / 2;
        const x = this.boundBox.x;
        const y = this.boundBox.y;

        this.nodes[0] = new Quadtree({x: x + subWidth, y: y, width: subWidth, height: subHeight}, this.level + 1);
        this.nodes[1] = new Quadtree({x: x, y: y, width: subWidth, height: subHeight}, this.level + 1);
        this.nodes[2] = new Quadtree({x: x, y: y + subHeight, width: subWidth, height: subHeight}, this.level + 1);
        this.nodes[3] = new Quadtree({x: x + subWidth, y: y + subHeight, width: subWidth, height: subHeight}, this.level + 1);
    }

    getIndex(rect) {
        const verticalMidpoint = this.boundBox.x + (this.boundBox.width / 2);
        const horizontalMidpoint = this.boundBox.y + (this.boundBox.height / 2);
        const topQuadrant = (rect.y < horizontalMidpoint && rect.y + rect.height < horizontalMidpoint);
        const bottomQuadrant = (rect.y > horizontalMidpoint);

        if (rect.x < verticalMidpoint && rect.x + rect.width < verticalMidpoint) {
            if (topQuadrant) {
                return 1;
            } else if (bottomQuadrant) {
                return 2;
            }
        } else if (rect.x > verticalMidpoint) {
            if (topQuadrant) {
                return 0;
            } else if (bottomQuadrant) {
                return 3;
            }
        }
        return -1;
    }

    insert(rect) {
        if (this.nodes[0] != null) {
            const index = this.getIndex(rect);

            if (index !== -1) {
                this.nodes[index].insert(rect);
                return;
            }
        }

        this.objects.push(rect);

        if (this.objects.length > this.maxObjects && this.level < this.maxLevel) {
            if (this.nodes[0] == null) {
                this.split();
            }

            let i = 0;
            while (i < this.objects.length) {
                const index = this.getIndex(this.objects[i]);
                if (index !== -1) {
                    this.nodes[index].insert(this.objects.splice(i, 1)[0]);
                } else {
                    i++;
                }
            }
        }
    }

    retrieve(returnObjects, rect) {
        const index = this.getIndex(rect);
        if (index !== -1 && this.nodes[0] != null) {
            this.nodes[index].retrieve(returnObjects, rect);
        }

        returnObjects.push(...this.objects);
    }

    clear() {
        this.objects = [];

        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i] != null) {
                this.nodes[i].clear();
                this.nodes[i] = null;
            }
        }
    }
}

const squares = [];
const tree = new Quadtree({ x: 0, y: 0, width: window.innerWidth, height: window.innerHeight });


document.addEventListener('DOMContentLoaded', function() {
    createInitialSquares();
    moveSquares();
});

color_switch_rate = 5;
curr_color = {
    r: 255,
    g: 0,
    b: 0
}
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

async function createInitialSquares() {
    num_squares = 100000;
    speed_pix = 6;
    spawn_delay = 5;
    rotation_speed = 0.05;
    for (let i = 0; i < num_squares; i++) {
        angle = rotation_speed * i * Math.PI;
        dx = Math.cos(angle) * speed_pix;
        dy = Math.sin(angle) * speed_pix;
        createSquare(window.innerWidth / 2, window.innerHeight / 2, dx, dy, 50, 50, next_color());
        await new Promise(r => setTimeout(r, spawn_delay));
    }       
}

function createSquare(x=100, y=100, dx=2, dy=2, width=50, height=50, color='red') {

    const square = document.createElement('div');

	square.classList.add('bouncy');

	square.style.width = width + 'px';
	square.style.height = height + 'px';
	
	square.style.left = x + 'px';
	square.style.top = y + 'px';
    console.log(`gradient (radial circle, ${color}0.8) 0%, ${color}0.4) 50%, ${color}0.1) 75%, ${color}0) 100%)`)

    square.style.background = `radial-gradient(circle, ${color}0.8) 0%, ${color}0.4) 50%, ${color}0.1) 75%, ${color}0) 100%)`;

    document.body.appendChild(square);
    squares.push({ element: square, x: x, y: y, dx: dx, dy: dy, width: width, height: height });
}

function moveSquares() {
    tree.clear();
    squares.forEach(square => {
        tree.insert(square);
    });

    squares.forEach(square => {
        let possibleCollisions = [];
        // tree.retrieve(possibleCollisions, square);

        square.x += square.dx;
        square.y += square.dy;

        // COLLISIONS WITH WALLS
        if (square.x <= 0 || square.x + square.width >= window.innerWidth) {
            // change_square_class(square);
            square.dx = -square.dx;
        }
        if (square.y <= 0 || square.y + square.height >= window.innerHeight) {
            // change_square_class(square);
            square.dy = -square.dy;
        }

        square.element.style.left = square.x + 'px';
        square.element.style.top = square.y + 'px';
    });

    requestAnimationFrame(moveSquares);
}

// function isColliding(rect1, rect2) {
//     return !(rect1.x + rect1.width < rect2.x || 
//              rect1.x > rect2.x + rect2.width || 
//              rect1.y + rect1.height < rect2.y || 
//              rect1.y > rect2.y + rect2.height);
// }
