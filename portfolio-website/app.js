const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const menuToggle = $('.menu-toggle');
const mobileNav = $('.mobile-nav');
menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  menuToggle.setAttribute('aria-label', expanded ? 'Open menu' : 'Close menu');
  mobileNav.hidden = expanded;
});
$$('.mobile-nav a, .mobile-nav button').forEach(link => link.addEventListener('click', () => {
  mobileNav.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open menu');
}));
const dialog = $('#demo-dialog');
const stateContainer = $('#demo-state');
let state = 0;
let proofAttached = false;
let opener = null;
const arrow = '<svg class="icon"><use href="#i-arrow"/></svg>';
const check = '<svg class="icon"><use href="#i-check"/></svg>';
const camera = '<svg class="icon"><use href="#i-camera"/></svg>';
const activity = [];
function log(time, message) {
  activity.push({ time, message });
  $('#demo-log-list').replaceChildren(...activity.map(item => {
    const li = document.createElement('li');
    const time = document.createElement('span');
    time.textContent = item.time;
    li.append(time, document.createTextNode(item.message));
    return li;
  }));
}
function renderDemo(focusAction = false) {
  $$('.demo-stepper li').forEach((li, i) => {
    li.classList.toggle('current', i === state);
    li.classList.toggle('done', i < state);
    if (i === state) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
  });
  const pressure = state === 1 || state === 2 ? '1.2' : '3.8';
  $('#demo-pressure').innerHTML = pressure + ' <small>bar</small>';
  $('#demo-clock').textContent = ['02:13 AM · Normal range', '02:14 AM · Pressure anomaly', '02:15 AM · Repair assigned', '02:42 AM · Pressure restored'][state];
  $('#demo-map-status').textContent = ['Network monitoring active', 'Anomaly flagged · Sector 07', 'Team 03 assigned · 1.2 km away', 'Ticket resolved · Network restored'][state];
  $('#demo-chart-line').setAttribute('d', state === 1 || state === 2 ? 'M0 10H25l7-4 7 8 8-6h45l6-4 6 7 9-3h27l9 2 9 24 9-5 10 7 10-5h35l7 3h21' : 'M0 20h25l7-4 7 8 8-6h45l6-4 6 7 9-3h27l9 2h35l7-4 9 5h42');
  const screens = [
    '<span class="small-pill">01 / NETWORK ONLINE</span><h3>A quiet night in Gampaha.</h3><p>248 virtual meters are reporting healthy pressure. Introduce a simulated burst to see how the workflow responds.</p><div class="detail-row"><span>Detection window</span><strong>01:00–04:00 AM</strong></div><div class="detail-row"><span>Sector 07 pressure</span><strong>3.8 bar · Healthy</strong></div><button class="button button-primary" data-action="leak">Simulate a pipe leak ' + arrow + '</button>',
    '<span class="small-pill">02 / ANOMALY DETECTED</span><h3>A signal worth acting on.</h3><p>Pressure fell from 3.8 to 1.2 bar. The demo flags an anomaly and creates a repair ticket for investigation.</p><div class="detail-row"><span>Repair ticket</span><strong>#AG-0248 · High priority</strong></div><div class="detail-row"><span>Nearest available crew</span><strong>Team 03 · 1.2 km</strong></div><button class="button button-primary" data-action="dispatch">Dispatch Team 03 ' + arrow + '</button>',
    '<span class="small-pill">03 / CREW DISPATCHED</span><h3>The right team is assigned.</h3><p>Team 03 has the example repair location in Gampaha. Preview the route, then attach sample evidence to finish this simulated repair.</p><a class="demo-link" href="https://www.google.com/maps/dir/?api=1&destination=7.0929905%2C80.0038965&travelmode=driving" target="_blank" rel="noopener noreferrer">Open example route in Google Maps <svg class="icon"><use href="#i-up"/></svg></a>' + (proofAttached ? '<div class="proof-box">' + camera + '<div>Sample evidence attached<small>Illustrative attachment · no real repair photo</small></div></div>' : '<button class="button proof-button" data-action="proof">' + camera + ' Attach sample repair evidence</button>') + '<button class="button button-primary" data-action="resolve" ' + (proofAttached ? '' : 'disabled') + '>Mark repair complete ' + check + '</button>',
    '<span class="small-pill">04 / LOOP CLOSED</span><h3>Flow restored.<br>Everyone in the loop.</h3><p>The simulated ticket is closed, sample repair evidence is recorded, and the engineer dashboard has the latest status.</p><div class="detail-row"><span>Ticket #AG-0248</span><strong>Completed by Team 03</strong></div><div class="detail-row"><span>Sector 07 pressure</span><strong>3.8 bar · Restored</strong></div><div class="demo-success">' + check + ' One connected workflow. From alert to repair.</div><button class="button button-primary" data-action="restart">Run the demo again ↻</button>'
  ];
  stateContainer.innerHTML = screens[state];
  if (focusAction) $('[data-action]:not(:disabled)', stateContainer)?.focus({ preventScroll: true });
}
function resetDemo(focusAction = false) {
  state = 0;
  proofAttached = false;
  activity.length = 0;
  log('02:13', '248 simulated meters connected.');
  renderDemo(focusAction);
}
$$('[data-open-demo]').forEach(button => button.addEventListener('click', () => {
  opener = button;
  resetDemo();
  dialog.showModal();
  document.body.style.overflow = 'hidden';
}));
$('#close-demo').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const bounds = dialog.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close(); } });
dialog.addEventListener('close', () => {
  document.body.style.overflow = '';
  opener?.focus({ preventScroll: true });
});
$('#reset-demo').addEventListener('click', () => resetDemo(true));
stateContainer.addEventListener('click', event => {
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (action === 'leak' && state === 0) { state = 1; log('02:14', 'Pressure anomaly flagged. Ticket #AG-0248 created.'); }
  else if (action === 'dispatch' && state === 1) { state = 2; log('02:15', 'Team 03 assigned to Sector 07.'); }
  else if (action === 'proof' && state === 2) { proofAttached = true; log('02:41', 'Sample repair evidence attached.'); }
  else if (action === 'resolve' && state === 2 && proofAttached) { state = 3; log('02:42', 'Repair complete. Pressure restored to 3.8 bar.'); }
  else if (action === 'restart') { resetDemo(true); return; }
  else return;
  renderDemo(true);
});
resetDemo();

// Photography, scroll storytelling and motion controls.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = $('#motion-toggle');
let motionPaused = reducedMotion.matches;
try { const saved = localStorage.getItem('aqua-guard-motion'); if (saved !== null) motionPaused = saved === 'paused'; } catch {}
function applyMotionPreference() {
  document.body.classList.toggle('motion-paused', motionPaused);
  motionButton.setAttribute('aria-pressed', String(motionPaused));
  motionButton.setAttribute('aria-label', motionPaused ? 'Enable animations' : 'Pause animations');
  $('.motion-symbol', motionButton).textContent = motionPaused ? '▷' : 'Ⅱ';
  $('.motion-label', motionButton).textContent = motionPaused ? 'Motion off' : 'Motion on';
}
applyMotionPreference();
motionButton.addEventListener('click', () => {
  motionPaused = !motionPaused;
  applyMotionPreference();
  try { localStorage.setItem('aqua-guard-motion', motionPaused ? 'paused' : 'on'); } catch {}
  requestFrame();
});
reducedMotion.addEventListener('change', event => { motionPaused = event.matches; applyMotionPreference(); requestFrame(); });
if ('IntersectionObserver' in window) {
  document.documentElement.classList.add('js');
  const reveals = new IntersectionObserver(entries => {
    entries.forEach(entry => { if(entry.isIntersecting) { entry.target.classList.add('is-visible'); reveals.unobserve(entry.target); } });
  }, { threshold: 0.07, rootMargin: '0px 0px -15px 0px' });
  $$('.reveal').forEach(element => reveals.observe(element));
}
const journeySteps = $$('[data-journey]');
const stage = $('.network-stage');
const stageCopy = [
  {time:'01:30 AM',title:'The network is listening.',sub:'248 virtual meters · All systems normal',pressure:'3.8',label:'Within normal range',icon:'#i-wave'},
  {time:'02:14 AM',title:'An unusual drop. A clear alert.',sub:'Sector 07 · Ticket #AG-0248 created',pressure:'1.2',label:'Pressure anomaly detected',icon:'#i-wave'},
  {time:'02:15 AM',title:'The right crew is on the way.',sub:'Team 03 · Example route assigned',pressure:'1.2',label:'Repair crew dispatched',icon:'#i-route'},
  {time:'02:42 AM',title:'Back in the flow.',sub:'Repair complete · Evidence recorded',pressure:'3.8',label:'Pressure restored',icon:'#i-check'}
];
let journeyActive = -1;
function setJourney(index) {
  if(index === journeyActive) return;
  journeyActive = index;
  stage.dataset.state = String(index);
  journeySteps.forEach((step,i) => step.classList.toggle('active',i===index));
  $$('.journey-dots a').forEach((dot,i) => { dot.classList.toggle('active',i===index); if(i===index)dot.setAttribute('aria-current','step');else dot.removeAttribute('aria-current'); });
  const copy = stageCopy[index];
  $('#stage-clock').textContent = copy.time;
  $('#stage-title').textContent = copy.title;
  $('#stage-subtitle').textContent = copy.sub;
  $('#stage-pressure').textContent = copy.pressure;
  $('#stage-reading-label').textContent = copy.label;
  $('#stage-icon').setAttribute('href',copy.icon);
  $('#stage-chart').setAttribute('d',index===1||index===2?'M0 8 20 7 30 11 45 6 58 9 72 5 89 8 100 35 115 38 125 34 140 38 158 35 178 37 200 35':'M0 24 20 23 30 27 45 20 58 23 72 19 89 24 106 20 125 23 140 19 158 24 178 20 200 23');
}
const hero = $('.hero');
const citySection = $('.city-section');
let framePending = false;
function updateScroll() {
  framePending = false;
  const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
  $('.scroll-progress').style.transform = `scaleX(${pageHeight > 0 ? window.scrollY/pageHeight : 0})`;
  const mobile = window.innerWidth <= 700;
  const target = window.innerHeight * (mobile ? .75 : .52);
  let closest = 0, distance = Infinity;
  journeySteps.forEach((step,index) => {
    const rect = step.getBoundingClientRect();
    const delta = Math.abs(rect.top + rect.height/2 - target);
    if(delta < distance) { distance = delta; closest = index; }
  });
  setJourney(closest);
  if(!motionPaused && !reducedMotion.matches) {
    const heroRect = hero.getBoundingClientRect();
    if(heroRect.bottom>0) {
      const travelled = Math.max(0,-heroRect.top);
      hero.style.setProperty('--hero-y',`${travelled*.2}px`);
      if(!mobile) {hero.style.setProperty('--hero-text-y',`${travelled*.12}px`);hero.style.setProperty('--hero-opacity',String(Math.max(0,1-travelled/hero.offsetHeight*.85)));}
    }
    const cityRect = citySection.getBoundingClientRect();
    if(cityRect.top<window.innerHeight && cityRect.bottom>0) citySection.style.setProperty('--city-y',`${Math.max(-60,Math.min(60,(window.innerHeight/2-cityRect.top-cityRect.height/2)*.12))}px`);
  }
}
function requestFrame() { if(!framePending) {framePending=true;requestAnimationFrame(updateScroll);} }
window.addEventListener('scroll',requestFrame,{passive:true});
window.addEventListener('resize',requestFrame);
requestFrame();

// Accessible engineer / crew concept switcher.
const platformTabs = $$('[data-platform]');
const descriptions = {
 engineer:'<h3>Your city.<br>At a glance.</h3><p>Monitor sectors, review pressure alerts, and follow repair progress from one central dashboard.</p><ul class="check-list"><li>'+check+'Interactive network overview</li><li>'+check+'Prioritised alerts and repair tickets</li><li>'+check+'Crew assignments and completion updates</li></ul>',
 crew:'<h3>The next repair.<br>Right in your hands.</h3><p>Get the location, follow the route, and record the repair. A field app designed for the people who keep the network moving.</p><ul class="check-list"><li>'+check+'GPS directions to assigned jobs</li><li>'+check+'Photo evidence and job completion</li><li>'+check+'Planned offline storage and later sync</li></ul>'
};
function setPlatform(button) {
 const crew = button.dataset.platform==='crew';
 platformTabs.forEach(tab=>{const active=tab===button;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;});
 $('#platform-description').innerHTML=descriptions[button.dataset.platform];
 $('#platform-preview').setAttribute('aria-labelledby',button.id);
 $('.laptop-preview').hidden=crew;
 $('.phone-preview').hidden=!crew;
 $('#floating-text').textContent=crew?'From the control room to your pocket.':'Connected from alert to resolution.';
}
platformTabs.forEach((button,i)=>{
 button.addEventListener('click',()=>setPlatform(button));
 button.addEventListener('keydown',event=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  event.preventDefault();
  const index=event.key==='Home'?0:event.key==='End'?1:(i+1)%2;
  setPlatform(platformTabs[index]);platformTabs[index].focus();
 });
});
const credits = $('#credits-dialog');
$('#open-credits').addEventListener('click',()=>{credits.showModal();document.body.style.overflow='hidden';});
$('#close-credits').addEventListener('click',()=>credits.close());
credits.addEventListener('close',()=>{document.body.style.overflow='';$('#open-credits').focus({preventScroll:true});});
credits.addEventListener('click',event=>{if(event.target===credits){const r=credits.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)credits.close();}});
