function createFallingThing() {
	const newItem = document.createElement('div');
	background.appendChild(newItem);

	newItem.style.position = 'absolute';
	newItem.style.top = '-10%';
	
	LEFT = Math.floor(Math.random() * 100);
	DURATION = Math.floor(Math.random() * 10000) + 5000;
	HEIGHT = Math.floor(Math.random() * 100) + 50;
	WIDTH = Math.floor(Math.random() * 100) + 50;
	
	newItem.style.height = `${HEIGHT}px`;
	newItem.style.width = `${WIDTH}px`;
	newItem.style.left = `${LEFT}%`;
	
	newItem.animate([
		{ 
			top: '-20%',
			backgroundColor: 'var(--color-1)'
		}, 
		{
			top: '0%',
			backgroundColor: 'var(--color-2)'
		},
		{
			top: '20%',
			backgroundColor: 'var(--color-3)'
		},
		{
			top: '40%',
			backgroundColor: 'var(--color-3)'
		 }, 
		{
			top: '60%',
			backgroundColor: 'var(--color-2)'
		},
		{
			top: '80%',
			backgroundColor: 'var(--color-1)'
		},
		{
			top: '100%',
			backgroundColor: 'var(--color-2)'
		},
		{
			top: '120%',
			backgroundColor: 'var(--color-3)'
		},
		{
			top: '121%',
			backgroundColor: 'transparent'
		},
		{
			top: '-20%', 
			backgroundColor: 'transparent'
		}
	], {
		duration: DURATION,
		iterations: Infinity,
		easing: 'linear'
	});
}