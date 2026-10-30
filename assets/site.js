const { Assistant } = window.LavaMascot;
const h = React.createElement;

const mounts = [...document.querySelectorAll('[data-mascot]')].map((el) => ({ el, root: ReactDOM.createRoot(el) }));

let shading = 'fabric';
try { if (localStorage.getItem('shading') === 'flat') shading = 'flat'; } catch {}

function render() {
  for (const { el, root } of mounts) {
    const box = el.getBoundingClientRect();
    const eyesOnly = document.body.dataset.body === 'hidden';
    const size = Math.round(Math.min(box.width, box.height) * (el.dataset.mascot === 'phone' ? 1.3 : 0.72) * (eyesOnly ? 1.7 : 1));
    root.render(h(Assistant, {
      size,
      state: el.dataset.state || 'default',
      mood: el.dataset.mood || 'angry',
      shading,
      body: document.body.dataset.body || 'shown',
      theme: el.dataset.theme || 'light',
      resolution: 3,
      style: { width: size, height: size },
    }));
  }
}

const switches = [...document.querySelectorAll('[data-shading]')];
function setShading(next) {
  shading = next;
  for (const b of switches) b.setAttribute('aria-pressed', String(b.dataset.shading === shading));
  try { localStorage.setItem('shading', shading); } catch {}
  render();
}
for (const b of switches) b.addEventListener('click', () => setShading(b.dataset.shading));
setShading(shading);
new ResizeObserver(render).observe(document.querySelector('main'));

const side = document.querySelector('.side');
const burger = document.querySelector('.burger');
function toggleMenu(open) {
  side.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
}
burger.addEventListener('click', () => toggleMenu(!side.classList.contains('open')));
for (const a of side.querySelectorAll('a')) a.addEventListener('click', () => toggleMenu(false));

const links = [...document.querySelectorAll('.links a')];
const spy = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    for (const a of links) a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + e.target.id));
  }
}, { rootMargin: '-45% 0px -50% 0px' });
for (const s of document.querySelectorAll('main section')) spy.observe(s);

for (const a of document.querySelectorAll('.pages a')) {
  if (a.dataset.page === document.body.dataset.page) a.setAttribute('aria-current', 'page');
}
