// ===== Scroll Reveal =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        entry.target.classList.toggle("show", entry.isIntersecting);
    });
});

document.querySelectorAll(".fade-in-up, .pop-in").forEach((el) =>
    observer.observe(el)
);


// ===== Smooth Scroll =====
document.querySelectorAll("nav a").forEach((link) => {
    link.onclick = (e) => {
        e.preventDefault();
        document.querySelector(link.getAttribute("href")).scrollIntoView({
            behavior: "smooth",
        });
    };
});


// ===== Parallax Hero Images =====
document.addEventListener("scroll", () => {
    const imgs = document.querySelectorAll(".parallax-img");
    let value = window.scrollY * 0.05;

    imgs.forEach((img) => {
        img.style.transform = `translateY(${value}px)`;
    });
});


// ===== GSAP Intro Animation =====
gsap.from(".hero-text h1", { duration: 1, y: 40, opacity: 0 });
gsap.from(".hero-text p", { duration: 1.2, y: 40, opacity: 0 });
gsap.from(".cta-button", { duration: 1.3, scale: 0.8, opacity: 0 });

gsap.from(".img-left", { duration: 1.5, x: -80, opacity: 0 });
gsap.from(".img-right", { duration: 1.5, x: 80, opacity: 0 });

window.onload = () => {
    setTimeout(() => {
        document.querySelector(".preloader").style.opacity = "0";
        setTimeout(() => {
            document.querySelector(".preloader").style.display = "none";
        }, 400);
    }, 800);
};

// ===== GOLD PARTICLES =====
const particleContainer = document.getElementById("gold-particles");

for (let i = 0; i < 40; i++) {
    let p = document.createElement("span");
    p.classList.add("particle");

    p.style.left = Math.random() * 100 + "%";
    p.style.top = Math.random() * 100 + "%";
    p.style.animationDuration = 4 + Math.random() * 6 + "s";
    p.style.animationDelay = Math.random() * 4 + "s";

    particleContainer.appendChild(p);
}

// ==== SCROLL REVEAL ====
function reveal() {
  const reveals = document.querySelectorAll(".reveal");

  for (let i = 0; i < reveals.length; i++) {
    let windowHeight = window.innerHeight;
    let elementTop = reveals[i].getBoundingClientRect().top;

    if (elementTop < windowHeight - 80) {
      reveals[i].classList.add("active");
    }
  }
}
window.addEventListener("scroll", reveal);
reveal();

/* ================== WE - ADVANCED JS FEATURES (append to script.js) ================== */

/* UTILS */
function we_q(sel){return document.querySelector(sel)}
function we_qa(sel){return Array.from(document.querySelectorAll(sel))}

/* 1) SCROLL PROGRESS */
(function(){
  const bar = we_q('#we-scrollProgress');
  if (!bar) return;
  function onScroll(){
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const sc = (window.scrollY / (docH || 1)) * 100;
    bar.style.width = Math.min(100, Math.max(0, sc)) + '%';
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
})();

/* 2) PAGE TRANSITION SIMPLE (fade on unload) */
(function(){
  const overlay = we_q('#we-pageTransition');
  // fade out before unload (useful when linking other pages)
  document.addEventListener('click', (e)=>{
    const a = e.target.closest && e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href')||'';
    if (href.startsWith('#') || a.target === '_blank' ) return; // ignore anchors & new tabs
    if (overlay){
      overlay.style.opacity = 1;
      document.documentElement.classList.add('we-page-fadeout');
      setTimeout(()=> window.location = href, 420);
      e.preventDefault();
    }
  });
})();

/* 3) PARALLAX (mouse + scroll) */
(function(){
  const wrap = we_q('#we-parallaxWrap');
  if (!wrap) return;
  const layers = we_qa('.we-parallax-layer');
  // mouse parallax
  document.addEventListener('mousemove', (e)=>{
    const cx = window.innerWidth/2, cy = window.innerHeight/2;
    const dx = (e.clientX - cx)/cx;
    const dy = (e.clientY - cy)/cy;
    layers.forEach(layer=>{
      const depth = parseFloat(layer.getAttribute('data-depth')||0.2);
      const x = dx * depth * 18;
      const y = dy * depth * 12;
      layer.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) scale(${1 + depth*0.02})`;
    });
  });
  // gentle scroll parallax
  window.addEventListener('scroll', ()=>{
    const s = window.scrollY;
    layers.forEach(layer=>{
      const depth = parseFloat(layer.getAttribute('data-depth')||0.2);
      layer.style.transform += ` translateY(${s*depth*0.02}px)`;
    });
  }, {passive:true});
})();

/* 4) PREMIUM PARTICLES - canvas (small, soft gold dots) */
(function(){
  const canvas = we_q('#we-particlesPremium');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w=canvas.width=canvas.offsetWidth, h=canvas.height=canvas.offsetHeight;
  const particles = [];
  const max = Math.round((w*h)/140000); // density scale
  for (let i=0;i<max;i++){
    particles.push({
      x: Math.random()*w, y: Math.random()*h,
      r: 0.6 + Math.random()*2.2,
      vx: (Math.random()-0.5)/50, vy: (Math.random()-0.5)/50,
      a: 0.05 + Math.random()*0.45
    });
  }
  function resize(){ w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; }
  window.addEventListener('resize', resize);
  function draw(){
    ctx.clearRect(0,0,w,h);
    particles.forEach(p=>{
      p.x += p.vx; p.y += p.vy;
      if (p.x < -10) p.x = w+10;
      if (p.x > w+10) p.x = -10;
      if (p.y < -10) p.y = h+10;
      if (p.y > h+10) p.y = -10;
      ctx.beginPath();
      ctx.globalAlpha = p.a;
      ctx.fillStyle = 'rgba(197,150,82,1)';
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
})();

/* 5) BUTTON RIPPLE */
(function(){
  document.addEventListener('click', (e)=>{
    const b = e.target.closest('.we-btn-ripple');
    if (!b) return;
    const rect = b.getBoundingClientRect();
    const ripple = b.querySelector('.we-ripple-temp');
    // create temporary effect by toggling pseudo via inline style on ::after isn't directly possible,
    // instead toggle transform by adding a class; simplest: animate scale via inline style on pseudo replacement
    // We'll implement by creating a span inside (cleaner for older CSS)
    const span = document.createElement('span');
    span.className = 'we-ripple-temp';
    span.style.position = 'absolute';
    span.style.left = (e.clientX - rect.left - 60) + 'px';
    span.style.top = (e.clientY - rect.top - 60) + 'px';
    span.style.width = span.style.height = '120px';
    span.style.borderRadius = '50%';
    span.style.background = 'radial-gradient(circle, rgba(200,155,74,0.65) 0%, rgba(200,155,74,0.12) 40%, transparent 60%)';
    span.style.transform = 'scale(0)';
    span.style.opacity = '0.85';
    span.style.pointerEvents = 'none';
    span.style.transition = 'transform .65s cubic-bezier(.2,.9,.3,1), opacity .65s ease';
    b.style.position = 'relative';
    b.appendChild(span);
    requestAnimationFrame(()=> { span.style.transform = 'scale(1)'; span.style.opacity = '0'; });
    setTimeout(()=> span.remove(), 700);
  });
})();

/* 6) TILT CARD (mouse move) */
(function(){
  we_qa('.we-tilt-card').forEach(card=>{
    const inner = card.querySelector('.we-tilt-inner');
    if (!inner) return;
    card.addEventListener('mousemove', (e)=>{
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width/2;
      const cy = rect.top + rect.height/2;
      const dx = (e.clientX - cx) / (rect.width/2);
      const dy = (e.clientY - cy) / (rect.height/2);
      const rotY = dx * 8; // degrees
      const rotX = -dy * 6;
      inner.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(12px)`;
    });
    card.addEventListener('mouseleave', ()=> { inner.style.transform = 'rotateX(0) rotateY(0) translateZ(0)'; });
  });
})();

/* 7) IMAGE REVEAL ON SCROLL (clip-path) + GENERIC IN-VIEW HANDLER */
(function(){
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(ent=>{
      if (ent.isIntersecting){
        ent.target.classList.add('we-in-view');
      }
    });
  }, {threshold: 0.2});
  we_qa('.we-img-reveal').forEach(img => io.observe(img));
})();

/* 8) STATS COUNTER (count up when in view) */
(function(){
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(ent=>{
      if (ent.isIntersecting){
        const el = ent.target;
        const target = +el.getAttribute('data-target') || 0;
        const duration = 1600;
        const start = performance.now();
        const from = 0;
        function step(now){
          const t = Math.min(1, (now - start)/duration);
          el.textContent = Math.floor(from + (target - from) * (1 - Math.pow(1 - t, 3)));
          if (t < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      }
    });
  }, {threshold: 0.35});
  we_qa('.we-count').forEach(el => io.observe(el));
})();

/* 9) IMAGE + CLIP reveal alternative for other elements (already handled by .we-img-reveal) */

/* 10) SAFE INIT: ensure no errors if elements missing */
console.log('WE: advanced features init complete');

/* =================== WE - RIPPLE TRIGGER =================== */
document.addEventListener("click", function(e) {
  const btn = e.target.closest(".we-btn-ripple");
  if (!btn) return;

  const rect = btn.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  btn.style.setProperty("--ripple-x", x + "px");
  btn.style.setProperty("--ripple-y", y + "px");

  btn.classList.remove("ripple-active");
  void btn.offsetWidth; // restart animation
  btn.classList.add("ripple-active");

  setTimeout(() => btn.classList.remove("ripple-active"), 600);
});
