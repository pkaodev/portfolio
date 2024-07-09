document.addEventListener('DOMContentLoaded', () => {
	const animated_div = document.querySelector('.animated_div');
	const globalStyle = document.createElement('style');
	document.head.appendChild(globalStyle);

	const CSS_COLORS = ['4a', '5a', '6a', '7a', '8a', '9a', '10a', '4b', '5b', '6b', '7b', '8b', '9b', '10b', '4c', '5c', '6c', '7c', '8c', '9c', '10c', '4z', '5z', '6z', '7z', '8z', '9z', '10z'];
	const LETTERS = "UVWXYZabcdefg%^&*()ABCDEFcdefg%^&*()_+{GHIJKLMNOPQ23456789!@#$%^&*()_RSTUVWXYZabcdefg%^&*()_+{}|:<>?~`-ABCDEFGHIJKLMNOPQ23456789!@#=[]\;',./hijklmnopqHIJKLMNOPQRSTUrstuvwxyz0123456789!@#$%^&*()_+{}|:bcdefg%^&*()_+{<>?~`-=[]\;',./";

	const NUM_FALLING_ITEMS = 25;

	

	function createFallingContainer() {
		const fallingContainer = document.createElement('div');
		animated_div.appendChild(fallingContainer);
		const textContainer = document.createElement('div');
		fallingContainer.appendChild(textContainer);

		const { width: WIDTH_NUM, height: HEIGHT_NUM } = _TEXTBOX_CHAR_SIZE();
		const { width: WIDTH_CHAR, height: HEIGHT_CHAR, fontSize: FONT_SIZE, lineHeight: LINE_HEIGHT } = _CHAR_PIXEL_SIZE();
		const { BOX_WIDTH, BOX_HEIGHT } = _TEXTBOX_PIXEL_SIZE(WIDTH_NUM, HEIGHT_NUM, WIDTH_CHAR, HEIGHT_CHAR);

		console.log(BOX_WIDTH, BOX_HEIGHT);
		console.log(WIDTH_NUM, HEIGHT_NUM, WIDTH_CHAR, HEIGHT_CHAR, FONT_SIZE, LINE_HEIGHT);
		
		const HORIZONTAL_SPEED = _HORIZONTAL_SPEED();

		fallingContainer.style.position = 'absolute';
		fallingContainer.style.left =  _LEFT();

		const fadeAnimationKeyframes = [
			{ opacity: 0.8, offset: 0 },
			{ opacity: 0.8, offset: 0.5 },
			{ opacity: 0.2, offset: 0.8 },
			{ opacity: 0, offset: 0.9 },
			{ opacity: 0, offset: 1 }
		];
		const fadeAnimationOptions = {
			duration: _VERTICAL_DURATION(),
			iterations: Infinity,
			easing: 'linear'
		};

		const fallingAnimationKeyframes = [
			{ top: `${BOX_HEIGHT / 4}px`, offset: 0 },
			{ top: `calc(100vh + ${BOX_HEIGHT}px)`, offset: 0.9 },
			{ top: `calc(100vh + ${BOX_HEIGHT}px)`, offset: 1 }
		];
		const fallingAnimationOptions = {
			duration: _VERTICAL_DURATION(),
			iterations: Infinity,
			easing: 'linear'
		};
		fallingContainer.animate(fallingAnimationKeyframes, fallingAnimationOptions);

		for (let j = 0; j < HEIGHT_NUM; j++) {
			const singleLetter = document.createElement('div');
			textContainer.appendChild(singleLetter);
			singleLetter.animate(fadeAnimationKeyframes, fadeAnimationOptions);

			singleLetter.style.position = 'absolute';
			singleLetter.style.left = '0';

			singleLetter.style.fontSize =  FONT_SIZE + 'px';
			singleLetter.style.lineHeight = LINE_HEIGHT;
			singleLetter.style.top = `-${(j * HEIGHT_CHAR)}px`;
			singleLetter.style.color = `var(--color-${CSS_COLORS[Math.floor(Math.random() * CSS_COLORS.length)]})`;
			singleLetter.style.width = `${WIDTH_NUM * WIDTH_CHAR}px`;

			let i_letters = Math.floor(Math.random() * LETTERS.length);
			setInterval(() => {
				i_letters = (i_letters + 1) % LETTERS.length;
				singleLetter.innerHTML = LETTERS.slice(i_letters, i_letters + WIDTH_NUM);
				singleLetter.left = _LEFT();
			}, HORIZONTAL_SPEED);
		}

	}

	for (let i = 0; i < NUM_FALLING_ITEMS; i++) {
		setTimeout(createFallingContainer, 150 * i);
	}
});

function _TEXTBOX_CHAR_SIZE() {
	let height = Math.floor(Math.random() * 80) + 15;
	let width = Math.floor(Math.random() * height / 3) + 1;
	return { height, width };
}
function _CHAR_PIXEL_SIZE() {
	let width = Math.floor(Math.random() * 20) + 10;
	let fontSize = Math.floor(Math.random() * 20) + 10;
	let lineHeight = 1.2;
	let height = fontSize * lineHeight;
	return { width, height, fontSize, lineHeight };
}
function _TEXTBOX_PIXEL_SIZE(WIDTH_NUM, HEIGHT_NUM, WIDTH_CHAR, HEIGHT_CHAR) {
	BOX_WIDTH = WIDTH_NUM * WIDTH_CHAR;
	BOX_HEIGHT = HEIGHT_NUM * HEIGHT_CHAR;
	return { BOX_WIDTH, BOX_HEIGHT };
}

function _VERTICAL_DURATION() {
	return Math.floor(Math.random() * 25000) + 10000;
}
function _HORIZONTAL_SPEED() {
	return Math.floor(Math.random() * 150) + 150;
}

function _LEFT() {
	return Math.floor(Math.random() * 100) + '%';
}