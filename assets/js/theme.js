// Theme controller: light/dark mode + accent color, persisted in localStorage.
// The initial html[data-theme]/[data-accent] attributes are set by an inline
// script in <head> (before CSS loads) to avoid a flash of the wrong theme;
// this file wires up the interactive controls once the DOM is ready.
const Theme = (() => {
    const THEME_KEY = 'theme';
    const ACCENT_KEY = 'accent';
    const DEFAULT_ACCENT = 'orange';

    function getTheme() {
        return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
        syncToggleButton();
    }

    function getAccent() {
        return document.documentElement.getAttribute('data-accent') || DEFAULT_ACCENT;
    }

    function setAccent(accent) {
        document.documentElement.setAttribute('data-accent', accent);
        localStorage.setItem(ACCENT_KEY, accent);
        syncAccentDots();
    }

    function syncToggleButton() {
        const btn = document.querySelector('[data-theme-toggle]');
        if (!btn) return;
        const isDark = getTheme() === 'dark';
        btn.setAttribute('aria-pressed', String(isDark));
        btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        const icon = btn.querySelector('i');
        if (icon) icon.className = isDark ? 'lni lni-sun-1' : 'lni lni-moon-half-right-5';
    }

    function syncAccentDots() {
        const accent = getAccent();
        document.querySelectorAll('.theme-dot').forEach(dot => {
            dot.setAttribute('aria-pressed', String(dot.dataset.accent === accent));
        });
    }

    function init() {
        syncToggleButton();
        syncAccentDots();

        const toggle = document.querySelector('[data-theme-toggle]');
        if (toggle) {
            toggle.addEventListener('click', () => {
                setTheme(getTheme() === 'dark' ? 'light' : 'dark');
            });
        }

        document.querySelectorAll('.theme-dot').forEach(dot => {
            dot.addEventListener('click', () => setAccent(dot.dataset.accent));
        });
    }

    return { init, getTheme, setTheme, getAccent, setAccent };
})();

document.addEventListener('DOMContentLoaded', Theme.init);
