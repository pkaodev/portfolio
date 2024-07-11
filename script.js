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
const square_class_styles = ['sqr_1', 'sqr_2', 'sqr_3', 'sqr_4', 'sqr_5', 'sqr_6', 'sqr_7', 'sqr_8', 'sqr_9', 'sqr_10', 'sqr_11', 'sqr_12', 'sqr_13', 'sqr_14', 'sqr_15']; 
document.addEventListener('click', function(e) {
    if (e.button === 0) {
        createSquare(e.clientX, e.clientY);
    }
});
function change_square_class(square) {
    const currentClass = square.element.classList.value.split(' ').find(cls => square_class_styles.includes(cls));
    const currentIndex = square_class_styles.indexOf(currentClass);
    const nextIndex = (currentIndex + 1) % square_class_styles.length;
    const nextClass = square_class_styles[nextIndex];

    // Update the class on the square
    square.element.classList.remove(currentClass);
    square.element.classList.add(nextClass);
}

function createSquare(x, y) {

    const square = document.createElement('div');

	square.classList.add('sqr_1');

	const width = 50;
	const height = 50;
	square.style.width = width + 'px';
	square.style.height = height + 'px';

	const dx = 2;
	const dy = 2;

	
	square.style.left = x + 'px';
	square.style.top = y + 'px';

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
        tree.retrieve(possibleCollisions, square);

        for (let other of possibleCollisions) {
            if (other !== square && isColliding(square, other)) {
                square.dx = -square.dx;
                square.dy = -square.dy;
                other.dx = -other.dx;
                other.dy = -other.dy;
                change_square_class(square);
            }
        }

        square.x += square.dx;
        square.y += square.dy;

        if (square.x <= 0 || square.x + square.width >= window.innerWidth) {
            change_square_class(square);
            square.dx = -square.dx;
        }
        if (square.y <= 0 || square.y + square.height >= window.innerHeight) {
            change_square_class(square);
            square.dy = -square.dy;
        }

        square.element.style.left = square.x + 'px';
        square.element.style.top = square.y + 'px';
    });

    requestAnimationFrame(moveSquares);
}

function isColliding(rect1, rect2) {
    return !(rect1.x + rect1.width < rect2.x || 
             rect1.x > rect2.x + rect2.width || 
             rect1.y + rect1.height < rect2.y || 
             rect1.y > rect2.y + rect2.height);
}

moveSquares();
