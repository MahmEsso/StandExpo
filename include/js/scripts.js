

$(document).ready(function(){
	$('.clients-carousel').owlCarousel({
		loop: true,
		margin: 30,
		nav: false,
		dots: true,
		rtl: true,
		autoplay: true,
		autoplayHoverPause: true,
		responsive: { 0: { items: 2 }, 768: { items: 4 }, 1024: { items: 6 } }
	});
	$('.about-carousel').owlCarousel({
		loop: true,
		margin: 30,
		nav: false,
		dots: true,
		rtl: true,
		autoplay: true,
		autoplayHoverPause: true,
		responsive: { 0: { items: 1 }, 768: { items: 1 }, 1024: { items: 1 } }
	});
});

$(document).ready(function(){
	function animateCounter(el) {
		const target = parseInt(el.getAttribute('data-target'));
		const duration = 2000;
		const step = target / (duration / 16);
		let current = 0;
		const timer = setInterval(() => {
			current += step;
			if (current >= target) { current = target; clearInterval(timer); }
			el.textContent = Math.floor(current);
		}, 16);
	}

	const counters = document.querySelectorAll('.counter');
	let counted = false;
	const statsSection = document.querySelector('.stats');

	const observer = new IntersectionObserver((entries) => {
		if (entries[0].isIntersecting && !counted) {
			counted = true;
			counters.forEach(c => animateCounter(c));
		}
	}, { threshold: 0.4 });
	if (statsSection) observer.observe(statsSection);

});

(function () {
	// Only run on devices with a real mouse
	var canUseCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
	if (!canUseCursor) return;

	var cursor = document.querySelector('.cursor');
	var label = cursor.querySelector('.cursor__label');
	var icon = cursor.querySelector('.cursor__icon');
	var targetSelector = 'a, button, [data-cursor-text], [data-cursor-icon]';

	var mouseX = window.innerWidth / 2;
	var mouseY = window.innerHeight / 2;
	var currentX = mouseX;
	var currentY = mouseY;

	document.documentElement.classList.add('has-custom-cursor');

	// Track the mouse
	document.addEventListener('mousemove', function (e) {
		mouseX = e.clientX;
		mouseY = e.clientY;
		cursor.classList.add('is-visible');
	});

	// Hide when the mouse leaves the window
	document.addEventListener('mouseleave', function () {
		cursor.classList.remove('is-visible');
	});

	// Enter a link / button / element with data attributes
	document.addEventListener('mouseover', function (e) {
		var el = e.target.closest(targetSelector);
		if (!el) return;

		var text = el.getAttribute('data-cursor-text') || '';
		var iconClasses = el.getAttribute('data-cursor-icon') || '';

		label.textContent = text;
		icon.className = 'cursor__icon ' + iconClasses;

		cursor.classList.add('is-active');
		cursor.classList.toggle('has-text', text !== '');
		cursor.classList.toggle('has-icon', iconClasses !== '');
		cursor.classList.toggle('has-content', text !== '' || iconClasses !== '');
	});

	// Leave it (ignore moves between children of the same element)
	document.addEventListener('mouseout', function (e) {
		var el = e.target.closest(targetSelector);
		if (!el || el.contains(e.relatedTarget)) return;

		cursor.classList.remove('is-active', 'has-text', 'has-icon', 'has-content');
	});

	// Smooth following (higher number = snappier, lower = floatier)
	function render() {
		currentX += (mouseX - currentX) * 0.2;
		currentY += (mouseY - currentY) * 0.2;
		cursor.style.transform = 'translate3d(' + currentX + 'px,' + currentY + 'px,0)';
		requestAnimationFrame(render);
	}
	render();
})();




/* (function () {
	const cards = gsap.utils.toArray(".c-card");
	const lastCardIndex = cards.length - 1;

	const firstCardST = ScrollTrigger.create({
		trigger: cards[1],
		start: "center center"
	});

	const lastCardST = ScrollTrigger.create({
		trigger: cards[cards.length - 1],
		start: "center center"
	});

	// Iterar sobre cada tarjeta
	cards.forEach((card, index) => {
		const scale = index === lastCardIndex ? 1 : 0.5;
		const scaleDown = gsap.to(card, {
			scale: scale,
		});

		ScrollTrigger.create({
			trigger: card,
			start: "top 85px",
			end: () => lastCardST.start,
			pin: true,
			pinSpacing: false,
			scrub: 0.5,
			ease: "none",
			animation: scaleDown,
			toggleActions: "restart none none reverse"
		});
	});
})(); */


(function () {
	var slider = document.querySelector('.l-cards');
	var slides = Array.prototype.slice.call(slider.querySelectorAll('.c-card'));
	var current = 0;
	var busy = false;
	var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

	function go(target, direction) {
	if (busy || target === current) return;
	busy = true;

	var outgoing = slides[current];
	var incoming = slides[target];

	// direction: 1 = next, -1 = prev
	slider.classList.toggle('is-prev', direction < 0);
	void slider.offsetWidth; // flush styles so the incoming image starts from the right side

	outgoing.classList.remove('is-active');
	outgoing.classList.add('is-leaving');
	incoming.classList.add('is-active');

	slides.forEach(function (s, i) {
		s.setAttribute('aria-hidden', i === target ? 'false' : 'true');
	});

	setTimeout(function () {
		outgoing.classList.remove('is-leaving');
		current = target;
		busy = false;
	}, reduceMotion.matches ? 50 : 1100);
	}

	function next() { go((current + 1) % slides.length, 1); }
	function prev() { go((current - 1 + slides.length) % slides.length, -1); }

	// ---------- Autoplay ----------
	var AUTOPLAY_DELAY = 5000; // ms between slides
	var timer = null;

	function stop() {
	clearInterval(timer);
	timer = null;
	}

	function start() {
	stop();
	if (reduceMotion.matches) return;
	timer = setInterval(next, AUTOPLAY_DELAY);
	}

	// Pause while the user hovers or focuses inside the slider
	slider.addEventListener('mouseenter', stop);
	slider.addEventListener('mouseleave', start);
	slider.addEventListener('focusin', stop);
	slider.addEventListener('focusout', start);

	// Pause when the browser tab is hidden
	document.addEventListener('visibilitychange', function () {
	document.hidden ? stop() : start();
	});

	// Manual navigation restarts the timer so it never fires right after a click
	slider.querySelector('.js-slider-next').addEventListener('click', function () { next(); start(); });
	slider.querySelector('.js-slider-prev').addEventListener('click', function () { prev(); start(); });

	// Swipe support (RTL: swipe right = next)
	var startX = null;
	slider.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
	slider.addEventListener('touchend', function (e) {
	if (startX === null) return;
	var dx = e.changedTouches[0].clientX - startX;
	if (Math.abs(dx) > 50) { dx > 0 ? next() : prev(); start(); }
	startX = null;
	}, { passive: true });

	slides.forEach(function (s, i) {
	s.setAttribute('role', 'group');
	s.setAttribute('aria-roledescription', 'slide');
	s.setAttribute('aria-label', (i + 1) + ' / ' + slides.length);
	s.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
	});

	start();
})();









(function () {



document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray(".mask-revealed").forEach((element) => {
    const content = element.children;

    gsap.set(element, { "--mask-scale": 0 });
    gsap.set(content, { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });

    // 1. White layer expands from left to right
    tl.to(element, {
      "--mask-scale": 1,
      duration: 0.4,
      ease: "power2.inOut"
    });

    // 2. Reveal content behind the white layer
    tl.set(content, { opacity: 1 });

    // 3. Change origin so the layer disappears from left to right
    tl.set(element, {
      "--mask-scale": 1,
      onComplete: () => {
        element.style.setProperty("--mask-origin", "right center");
      }
    });

    tl.to(element, {
      "--mask-scale": 0,
      duration: 0.4,
      ease: "power2.inOut"
    });
  });
});



})();

$(document).ready(function(){
	$(".project").hover3d({
		selector: ".project__card",
		shine: false,
		perspective: 500,
		sensitivity: 40,
		invert: true,
	});
});