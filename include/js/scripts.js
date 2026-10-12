

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



