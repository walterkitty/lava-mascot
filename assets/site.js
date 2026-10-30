const kit = document.body.dataset.kit || 'Assistant';
const Mascot = window.LavaMascot[kit];
const tuned = { Lava: { round: 20.5, pupil: 1.05, eyeSize: 1.2, brows: 'hidden' } }[kit] || {};
const h = React.createElement;

const mounts = [...document.querySelectorAll('[data-mascot]')].map((el) => ({ el, root: ReactDOM.createRoot(el) }));

let flat = new URLSearchParams(location.search).has('2d');
let shading = flat ? 'flat' : 'fabric';

function render() {
  for (const { el, root } of mounts) {
    const box = el.getBoundingClientRect();
    const eyesOnly = document.body.dataset.body === 'hidden';
    const size = Math.round(Math.min(box.width, box.height) * (el.dataset.mascot === 'phone' ? 1.3 : 0.72) * (eyesOnly ? 1.7 : 1));
    root.render(h(Mascot, {
      ...tuned,
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

render();
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


const sections = [...document.querySelectorAll('main section')];
for (const a of document.querySelectorAll('.pages a')) {
  a.addEventListener('click', () => {
    const here = sections.find((s) => s.getBoundingClientRect().bottom > window.innerHeight * 0.4);
    if (here) a.hash = here.id;
  });
}

const pageLinks = [...document.querySelectorAll('.pages a')];
const modes = [...document.querySelectorAll('.switch button')];
function setFlat(next) {
  flat = next;
  shading = flat ? 'flat' : 'fabric';
  for (const b of modes) b.setAttribute('aria-pressed', String(b.dataset.d === (flat ? '2d' : '3d')));
  for (const a of pageLinks) a.search = flat ? '?2d' : '';
  history.replaceState(null, '', (flat ? '?2d' : location.pathname) + location.hash);
  render();
}
for (const a of pageLinks) if (a.dataset.page === document.body.dataset.page) a.setAttribute('aria-current', 'page');
for (const b of modes) b.addEventListener('click', () => setFlat(b.dataset.d === '2d'));
setFlat(flat);
