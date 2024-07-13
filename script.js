let x_min, x_max, y_min, y_max;
let apples, width_apple = 50, height_apple = 50;
let snake, snake_speed = 10, x_snake = 0, y_snake = 0, dx_snake, dy_snake, width_snake = 50, height_snake = 50;
let distances;

// multiple apples
// snake grows
// slow turn snake
// apples move

// classes: apple, snake, game

document.addEventListener('DOMContentLoaded', function () {
    x_max = window.innerWidth * 0.95;
    y_max = window.innerHeight * 0.95;
    x_min = window.innerWidth * 0.05;
    y_min = window.innerHeight * 0.05;

    apples = [];
    new Apple();
    new Apple();
    new Apple();
    new Apple();
    new Apple();
    initialiseSnake();
    recurseGame();
});

class Apple {
    constructor() {
        this._= document.createElement('div');
        this.x = 0;
        this.y = 0;
        this.respawn();
        this._.classList.add('apple');

        this._.style.width = width_apple + 'px';
        this._.style.height = height_apple + 'px';

        document.body.appendChild(this._);

        apples.push(this);

    }
    
    respawn() {
        this.y = (y_snake > y_max / 2) ? (y_max / 2 - Math.random() * (y_max / 2 - y_min)) : (y_max / 2 + Math.random() * (y_max / 2 - y_min));
        this.x = (x_snake > x_max / 2) ? (x_max / 2 - Math.random() * (x_max / 2 - x_min)) : (x_max / 2 + Math.random() * (x_max / 2 - x_min));
        
        this._.style.top = this.y + 'px';
        this._.style.left = this.x + 'px';
        
    }
}




function initialiseSnake() {
    snake = document.createElement('div');
    snake.classList.add('snake_head');
    snake.style.position = 'absolute';
    snake.style.width = '50px'; 
    snake.style.height = '50px';
    snake.style.backgroundColor = 'green';
    snake.style.left = x_snake + 'px';
    snake.style.top = y_snake + 'px';
    document.body.appendChild(snake);
}

function recurseGame() {
    // find the closest apple
    distances = [];
    for (let i = 0; i < apples.length; i++) {
        distances.push(Math.sqrt(Math.pow(x_snake - apples[i].x, 2) + Math.pow(y_snake - apples[i].y, 2)));
    }
    closest_apple = distances.indexOf(Math.min(...distances));

    // let apple_relative_angle = Math.atan2(y_apple - y_snake, x_apple - x_snake);
    let apple_relative_angle = Math.atan2(apples[closest_apple].y - y_snake, apples[closest_apple].x - x_snake);
    
    dx_snake = snake_speed * Math.cos(apple_relative_angle);
    dy_snake = snake_speed * Math.sin(apple_relative_angle);

    x_snake += dx_snake;
    y_snake += dy_snake;

    snake.style.left = x_snake + 'px';
    snake.style.top = y_snake + 'px';

    for (let i = 0; i < apples.length; i++) {
        if (Math.abs(x_snake - apples[i].x) <= 5 && Math.abs(y_snake - apples[i].y) <= 5) {
            apples[i].respawn();
        }
    }

    requestAnimationFrame(recurseGame);
}
