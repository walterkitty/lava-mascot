const kit = document.body.dataset.kit || 'Assistant';
const Mascot = window.LavaMascot[kit];
const tunings = {
  lava: { round: 20.5, pupil: 1.05, eyeSize: 1.2, brows: 'hidden' },
  drop: { type: 'drop', eyes: 'cartoon', color: '#ffc23a', gradient: ['#F2A231', '#FBDA49', '#FFF9F1'], finish: 'frosted', solid: 'smooth' },
  icon: { type: 'cloud', eyes: 'cartoon', brows: 'hidden', cheeks: 'hidden', faceY: 50, color: '#3a3e46', saturation: 1, brightness: 1, solid: 'smooth', box: true },
  flame: { path: 'M50 90C27 90 13 77 13 58C13 45 18 35 22 24C27 31 31 35 35 37C38 24 44 14 52 6C58 16 63 26 64 36C70 33 75 28 80 22C85 34 87 46 87 58C87 77 73 90 50 90Z', partsPath: 'M36 82H46A4 4 0 0 1 50 86V94A4 4 0 0 1 46 98H36A4 4 0 0 1 32 94V86A4 4 0 0 1 36 82ZM54 82H64A4 4 0 0 1 68 86V94A4 4 0 0 1 64 98H54A4 4 0 0 1 50 94V86A4 4 0 0 1 54 82Z', color: '#ff5a36', eyes: 'solid', ink: '#1d1a2e', faceScale: 0.42, faceY: 54 },
};
const { solid = 'fabric', scale = 1, box: boxed = false, ...tuned } = tunings[document.body.dataset.page] || {};
const h = React.createElement;

const mounts = [...document.querySelectorAll('[data-mascot]')].map((el) => ({ el, root: ReactDOM.createRoot(el), seen: false }));

let flat = new URLSearchParams(location.search).has('2d');
let shading = flat ? 'flat' : solid;

function render() {
  for (const { el, root, seen } of mounts) {
    const rect = el.getBoundingClientRect();
    const eyesOnly = document.body.dataset.body === 'hidden';
    const size = Math.round(Math.min(rect.width, rect.height) * (el.dataset.mascot === 'phone' ? (boxed ? 0.95 : 1.3) : 0.72 * scale) * (eyesOnly ? 1.7 : 1));
    const props = {
      ...tuned,
      size,
      state: el.dataset.state || 'default',
      mood: el.dataset.mood || 'angry',
      shading,
      body: document.body.dataset.body || 'shown',
      theme: el.dataset.theme || 'light',
      resolution: 2,
      paused: !seen,
      jumpEvery: el.dataset.mascot === 'phone' ? undefined : 0,
      style: { width: size, height: size },
    };
    root.render(boxed
      ? h('div', { className: 'icon-box', style: { width: size, height: size } }, h(Mascot, { ...props, size: Math.round(size * 1.9), style: { width: Math.round(size * 1.9), height: Math.round(size * 1.9) } }))
      : h(Mascot, props));
  }
}

render();
new ResizeObserver(render).observe(document.querySelector('main'));




const pageLinks = [...document.querySelectorAll('.pages a')];
const modes = [...document.querySelectorAll('.switch button')];
function setFlat(next) {
  flat = next;
  shading = flat ? 'flat' : solid;
  for (const b of modes) b.setAttribute('aria-pressed', String(b.dataset.d === (flat ? '2d' : '3d')));
  history.replaceState(null, '', (flat ? '?2d' : location.pathname) + location.hash);
  render();
}
for (const a of pageLinks) if (a.dataset.page === document.body.dataset.page) a.setAttribute('aria-current', 'page');
for (const b of modes) b.addEventListener('click', () => setFlat(b.dataset.d === '2d'));
setFlat(flat);

const watch = new IntersectionObserver((entries) => {
  for (const e of entries) {
    const m = mounts.find((x) => x.el === e.target);
    if (m) m.seen = e.isIntersecting;
  }
  render();
}, { rootMargin: '200px 0px' });
for (const { el } of mounts) watch.observe(el);

const order = [...document.querySelectorAll('nav.pages a')];
const here = order.findIndex((a) => a.dataset.page === document.body.dataset.page);
if (here >= 0) {
  const next = order[(here + 1) % order.length];
  const section = document.createElement('section');
  section.className = 'next';
  section.innerHTML = `<div class="wrap"><a class="next-link" href="${next.getAttribute('href')}"><span>Следующий вариант</span><b>${next.textContent} →</b></a></div>`;
  document.querySelector('main').append(section);
}

const strip = document.querySelector('nav.pages');
function edges() {
  strip.classList.toggle('more-left', strip.scrollLeft > 2);
  strip.classList.toggle('more-right', strip.scrollLeft + strip.clientWidth < strip.scrollWidth - 2);
}
const current = strip.querySelector('[aria-current="page"]');
if (current) strip.scrollLeft = current.offsetLeft - (strip.clientWidth - current.offsetWidth) / 2;
strip.addEventListener('scroll', edges, { passive: true });
window.addEventListener('resize', edges);
edges();
