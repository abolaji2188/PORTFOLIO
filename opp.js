// Section reveal
const sections = document.querySelectorAll("section");
const carouselItems = document.querySelectorAll(".carousel-item");
const researchCards = document.querySelectorAll(".research-card");

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.id === "about") {
                carouselItems.forEach((c, i) => setTimeout(() => c.classList.add('visible'), i * 200));
            }
        }
    });
}, { threshold: 0.3 });

sections.forEach(s => observer.observe(s));
researchCards.forEach(c => observer.observe(c));

// Bottom Nav Active Highlight
const bottomNavItems = document.querySelectorAll('.bottom-nav .nav-item');

function setActiveNav() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    bottomNavItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
}

window.addEventListener('scroll', setActiveNav);
setActiveNav();

// Light/Dark Mode Toggle
const themeToggle = document.getElementById('themeToggle');
const currentTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', currentTheme);
if (currentTheme === 'light') themeToggle.innerHTML = '<i class="fas fa-sun"></i>';

themeToggle.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'dark');
    }
});

// Typewriter
const roles = ["Medical Student","Researcher","Bioinformatics Specialist in Training","AI Enthusiast","Future Precision Medicine Innovator"];
const typewriter = document.getElementById('typewriter');
let roleIndex = 0, charIndex = 0, isDeleting = false;

function typeWriter() {
    const currentRole = roles[roleIndex];
    if (!isDeleting && charIndex <= currentRole.length) {
        typewriter.textContent = currentRole.substring(0, charIndex);
        charIndex++;
        setTimeout(typeWriter, 100);
    } else if (isDeleting && charIndex >= 0) {
        typewriter.textContent = currentRole.substring(0, charIndex);
        charIndex--;
        setTimeout(typeWriter, 50);
    } else if (!isDeleting && charIndex > currentRole.length) {
        setTimeout(() => { isDeleting = true; typeWriter(); }, 1500);
    } else if (isDeleting && charIndex < 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeWriter, 500);
    }
}

const homeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !typewriter.classList.contains('started')) {
            typewriter.classList.add('started');
            typeWriter();
        }
    });
}, { threshold: 0.5 });
homeObserver.observe(document.getElementById('home'));

// Carousel
const track = document.getElementById('carouselTrack');
const prevBtn = document.getElementById('about-prev');
const nextBtn = document.getElementById('about-next');
const items = Array.from(track.children);

function updateButtons() {
    const scrollLeft = track.scrollLeft;
    const maxScroll = track.scrollWidth - track.clientWidth;
    prevBtn.disabled = scrollLeft <= 10;
    nextBtn.disabled = scrollLeft >= maxScroll - 10;
}

prevBtn.addEventListener('click', () => {
    const gap = parseFloat(getComputedStyle(track).gap);
    const scrollAmount = items[0].offsetWidth + gap;
    track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
});

nextBtn.addEventListener('click', () => {
    const gap = parseFloat(getComputedStyle(track).gap);
    const scrollAmount = items[0].offsetWidth + gap;
    track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
});

track.addEventListener('scroll', updateButtons);
window.addEventListener('resize', updateButtons);
updateButtons();

let autoPlay = setInterval(() => {
    if (nextBtn.disabled) track.scrollTo({ left: 0, behavior: 'smooth' });
    else nextBtn.click();
}, 4000);

track.addEventListener('mouseenter', () => clearInterval(autoPlay));
track.addEventListener('mouseleave', () => {
    autoPlay = setInterval(() => {
        if (nextBtn.disabled) track.scrollTo({ left: 0, behavior: 'smooth' });
        else nextBtn.click();
    }, 4000);
});
track.addEventListener('touchstart', () => clearInterval(autoPlay));

// Contact Form
const form = document.getElementById('contactForm');
const statusMessage = document.getElementById('status-message');
const submitButton = form.querySelector('button');

form.addEventListener('submit', () => {
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    statusMessage.textContent = '';
});

if (window.location.search.includes('success')) {
    statusMessage.textContent = 'Thank you! Your message has been sent successfully.';
    statusMessage.className = 'success';
    form.reset();
    submitButton.disabled = false;
    submitButton.textContent = 'Send Message';
    history.replaceState({}, '', window.location.pathname);
} else if (window.location.search.includes('error')) {
    statusMessage.textContent = 'Oops! Something went wrong. Please try again.';
    statusMessage.className = 'error';
    submitButton.disabled = false;
    submitButton.textContent = 'Send Message';
    history.replaceState({}, '', window.location.pathname);
}