document.addEventListener('DOMContentLoaded', () => {
    const background = document.querySelector('.background');
    const colors = ['--color-1', '--color-2', '--color-3', '--color-4', '--color-5', '--color-4', '--color-3', '--color-2'];
    const I = 40, J = 30;

    for (let j = 0; j < J; j++) {
        for (let i = 0; i < I; i++) {
            let scale = (Math.random() * 0.4 + 0.8) * 0.9;
            let span = document.createElement('span');
            let color = colors[i % colors.length];
            let delay = `${scale * (-Math.pow(i, 1 + j / 10))}s`;
            let originX = `${scale * (Math.pow(i, 1 + j / 20)) - 15}vw`;
            let originY = `${scale * (Math.pow(i, 1 + j / 30)) - 15}vh`;

            span.style.color = `var(${color})`;
            span.style.animationDelay = delay;
            span.style.transformOrigin = `${originX} ${originY}`;
            background.appendChild(span);
        }
    }
});
