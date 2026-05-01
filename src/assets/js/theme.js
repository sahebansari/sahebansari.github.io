// Dark mode toggle functionality with Fluent 2
const themeToggle = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');
const bodyElement = document.querySelector('[data-theme]');

// Check for saved theme preference or default to system preference
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    bodyElement.setAttribute('data-theme', 'dark');
    updateIcons(true);
} else {
    bodyElement.setAttribute('data-theme', 'light');
    updateIcons(false);
}

// Theme toggle event listener
themeToggle.addEventListener('click', () => {
    const currentTheme = bodyElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    bodyElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateIcons(newTheme === 'dark');
});

function updateIcons(isDark) {
    if (isDark) {
        sunIcon.classList.remove('fluent-icon-hidden');
        moonIcon.classList.add('fluent-icon-hidden');
    } else {
        sunIcon.classList.add('fluent-icon-hidden');
        moonIcon.classList.remove('fluent-icon-hidden');
    }
}
