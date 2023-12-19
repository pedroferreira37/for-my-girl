<script>
	import { onMount } from 'svelte';
	import { compose } from '../lib/index';

	export let data = null;
	const pics = data.pics;

	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

	let actions = ['prelude', 'name', 'date', 'date2', 'birth', 'memory', 'love', 'carousel'];
	let act = null;

	let startX = 0;
	let movePosition = 0;

	function onStart(e) {
		e.preventDefault();
		startX = getClientX(e);
		window.addEventListener('mousemove', onMove);
		window.addEventListener('touchmove', onMove);
		window.addEventListener('mouseup', onEnd);
		window.addEventListener('touchend', onEnd);
	}

	function onMove(e) {
		console.log(movePosition);
		if (movePosition >= 16000) {
			movePosition = 15500;
		}

		if (movePosition <= -16200) {
			movePosition = -15800;
		}
		const currentX = getClientX(e);
		const deltaX = currentX - startX;
		movePosition += deltaX;
		setTransform(movePosition);
		startX = currentX;
	}

	function onEnd() {
		window.removeEventListener('mousemove', onMove);
		window.removeEventListener('touchmove', onMove);
		window.removeEventListener('mouseup', onEnd);
		window.removeEventListener('touchend', onEnd);
	}

	function getClientX(e) {
		return e.touches ? e.touches[0].clientX : e.clientX;
	}

	function setTransform(finalPos) {
		const slide = document.getElementById('slide');
		slide.style.transform = `translate3d(${finalPos}px, 0, 0)`;
	}

	onMount(async () => {
		while (actions.length) {
			act = actions.shift();
			if (act === 'carousel') break;
			const el = document.querySelector(`[data-${act}]`);
			await animate(el, act);
			actions = actions;
			await delay(700);
		}
	});

	function delay(ms) {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	}

	async function animate(text, action) {
		let iter = 0;
		let interval = null;

		const defineWord = (_, i) => {
			const r_ix = Math.floor(Math.random() * letters.length);

			if (i < iter) {
				const original = text.dataset[action];
				return original[i];
			}
			return letters[r_ix];
		};

		const setWord = compose(
			(t) => t.split(''),
			(t) => t.map(defineWord),
			(t) => t.join('')
		);

		return new Promise((resolve) => {
			interval = setInterval(() => {
				text.innerText = setWord(text.dataset[action]);
				if (iter >= text.dataset[action].length) {
					clearInterval(interval);
					resolve();
				}
				iter += 1 / 2;
			}, 30);
		});
	}

	$: prelude = act === 'prelude' ? 'block' : 'hidden';
	$: name = act === 'name' ? 'block' : 'hidden';
	$: date = act === 'date' ? 'block' : 'hidden';
	$: date2 = act === 'date2' ? 'block' : 'hidden';
	$: birth = act === 'birth' ? 'block' : 'hidden';
	$: love = act === 'love' ? 'block' : 'hidden';
	$: carousel = act === 'carousel' ? 'block' : 'hidden';
	$: memory = act === 'memory' ? 'block' : 'hidden';
</script>

<div class="w-full min-h-screen flex justify-center items-center">
	<h1 data-prelude="Para meu grande amor" class={prelude}>a</h1>
	<h1 data-name="Carolina Dal Col Viana" class={name}>a</h1>
	<h1 data-date="18/12/2022" class={date}>a</h1>
	<h1 data-date2="18/12/2023" class={date2}>a</h1>
	<h1 data-birth="Feliz 1 ano de namoro" class={birth}>a</h1>
	<h1 data-memory="Apenas algumas memórias" class={memory}>a</h1>
	<h1 data-love="EU TE AMO" class={love}>a</h1>

	<div role="slider" class="w-full {carousel}" on:mousedown={onStart} on:touchstart={onStart}>
		<div class="flex gap-4 flex-1 justify-center items-center flex-nowrap w-[400px]" id="slide">
			{#each pics as pic (pic.id)}
				<img
					alt={pic.path}
					src={pic.path}
					id={pic.id}
					class="w-full h-full max-w-full rounded-md object-fit"
				/>
			{/each}
		</div>
	</div>
</div>

<style>
	h1 {
		font-size: 24px;
	}

	#slide {
		transition: transform 0.3s;
	}
</style>
