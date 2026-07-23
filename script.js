/* ============ NAV ============ */
const header = document.getElementById('siteHeader');
const nav = document.getElementById('siteNav');
const menuToggle = document.getElementById('menuToggle');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
  backToTop.classList.toggle('show', window.scrollY > 600);
}, { passive:true });

menuToggle.addEventListener('click', () => {
  nav.classList.toggle('open');
  menuToggle.classList.toggle('active');
});
document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.classList.remove('active');
}));
backToTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

/* ============ HOVER/TOUCH DETECTION ============ */
/* Only devices with a real mouse get the 3D tilt effects. On touch,
   mousemove can fire once (on tap) without a matching mouseleave,
   which used to leave cards/panels permanently rotated/shifted. */
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ============ HERO CODE WINDOW TILT (subtle) ============ */
const codeWindow = document.getElementById('codeWindow');
const heroEl = document.querySelector('.hero-3d');
if (heroEl && codeWindow && canHover){
  heroEl.addEventListener('mousemove', e => {
    const r = heroEl.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    codeWindow.style.transform = `rotateY(${-8 + px*6}deg) rotateX(${4 - py*6}deg)`;
  });
  heroEl.addEventListener('mouseleave', () => {
    codeWindow.style.transform = 'rotateY(-8deg) rotateX(4deg)';
  });
}

/* ============ TYPING EFFECT ============ */
const typeTarget = document.getElementById('typeTarget');
if (typeTarget){
  const codeHTML =
`<span class="cmt">// hello, I'm</span>
<span class="kw">const</span> developer = {
  <span class="prop">name</span>: <span class="str">"Ramya Vengadesan"</span>,
  <span class="prop">role</span>: <span class="str">"Full Stack Developer"</span>,
  <span class="prop">stack</span>: [<span class="str">"Python"</span>, <span class="str">"React"</span>, <span class="str">"FastAPI"</span>, <span class="str">"MySQL"</span>],
  <span class="prop">mentoring</span>: <span class="bool">true</span>,
  <span class="prop">freelance</span>: <span class="str">"available"</span>
};`;
  // type out as plain text first (for accurate timing), then swap to the highlighted HTML
  const plain = codeHTML.replace(/<[^>]+>/g,'');
  let i = 0;
  const speed = 18;
  function typeStep(){
    if (i <= plain.length){
      typeTarget.textContent = plain.slice(0, i);
      i++;
      setTimeout(typeStep, speed);
    } else {
      typeTarget.innerHTML = codeHTML;
    }
  }
  const codeIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        typeStep();
        codeIO.disconnect();
      }
    });
  }, { threshold:0.3 });
  codeIO.observe(typeTarget);
}

/* ============ PROJECT CARD TILT ============ */
if (canHover){
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rx = (py - 0.5) * -10;
      const ry = (px - 0.5) * 10;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
      card.style.setProperty('--mx', `${px*100}%`);
      card.style.setProperty('--my', `${py*100}%`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

/* ============ SCROLL REVEAL ============ */
const revealEls = document.querySelectorAll('.reveal, .reveal-scale');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold:0.15, rootMargin:'0px 0px -60px 0px' });
revealEls.forEach(el => io.observe(el));

/* ============ SKILL TABS ============ */
const tabs = document.querySelectorAll('.skill-tab');
const panels = document.querySelectorAll('.skill-panel');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.querySelector(`.skill-panel[data-panel="${tab.dataset.tab}"]`).classList.add('active');
  });
});


/* ============ ACTIVE NAV LINK ON SCROLL ============ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const navIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (entry.isIntersecting && link){
      navLinks.forEach(l => l.style.color = '');
      link.style.color = 'var(--text-1)';
    }
  });
}, { threshold:0.4 });
sections.forEach(s => navIO.observe(s));