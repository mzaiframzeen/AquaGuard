(() => {
  const storageKey = 'aqua-guard-theme';
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const page = document.documentElement;
  const themeColor = document.querySelector('meta[name="theme-color"]');
  let preferredTheme;

  try {
    const savedTheme = localStorage.getItem(storageKey);
    if (savedTheme === 'light' || savedTheme === 'dark') preferredTheme = savedTheme;
  } catch {}

  function applyTheme() {
    const theme = preferredTheme ?? (systemTheme.matches ? 'dark' : 'light');
    const dark = theme === 'dark';
    page.dataset.theme = theme;
    themeColor.content = dark ? '#0a1824' : '#ffffff';

    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(dark));
      toggle.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
    }
  }

  applyTheme();
  systemTheme.addEventListener('change', applyTheme);
  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('theme-toggle');
    applyTheme();
    toggle.hidden = false;
    toggle.addEventListener('click', () => {
      preferredTheme = page.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme();
      try { localStorage.setItem(storageKey, preferredTheme); } catch {}
    });
  }, { once: true });
})();
