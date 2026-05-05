// === Stars Background===
const starCanvas = document.getElementById("stars");
const starCtx = starCanvas.getContext("2d");

function resizeStars() {
  starCanvas.width = window.innerWidth;
  starCanvas.height = window.innerHeight;
}
resizeStars();
window.addEventListener("resize", resizeStars);

const stars = [];
const STAR_COUNT = 200;

for (let i = 0; i < STAR_COUNT; i++) {
  stars.push({
    x: Math.random() * starCanvas.width,
    y: Math.random() * starCanvas.height,
    r: Math.random() * 1.5 + 0.2,
    s: Math.random() * 0.3 + 0.1,
  });
}

function animateStars() {
  starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
  starCtx.fillStyle = "#ffffff";

  for (const s of stars) {
    starCtx.globalAlpha =
      0.3 + 0.7 * Math.abs(Math.sin(performance.now() * 0.001 * s.s));
    starCtx.beginPath();
    starCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    starCtx.fill();
  }

  requestAnimationFrame(animateStars);
}
animateStars();

// === Phone menu ===
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

if (navToggle && navMenu) {
  navToggle.onclick = () => {
    navMenu.classList.toggle("open");
  };
}

// === Two languages translation ===
const translations = {
  fa: {
    title: "‌Apsis Technology",
    menuHome: "خانه",
    menuAbout: "درباره",
    menuProjects: "پروژه‌ها",
    menuContact: "تماس",
    hero_title: "هدایت، ناوبری و کنترل",
    hero_text:
      " انجام پروژه های مدل سازی و شبیه سازی هدایت، ناوبری و کنترل وسیله های پروازی و شناوری",
    about_title: "درباره",
    about_text:
      " یک گروه حرفه ای از فارغ التحصیلان دانشگاه های متعبر کشور برای انجام هر گونه پروژه مهندسی و تکنولوژی",
    projects_title: "پروژه‌ها",
    pr1_title: "شبیه‌ساز مداری",
    pr1_text: "محاسبه و نمایش مدار ماهواره با استفاده از RK4.",
    pr2_title: "بصری‌سازی 2D",
    pr2_text: "نمایش مدار روی صفحه 2بعدی همراه با زمین در مرکز.",
    pr3_title: "ابزار آموزشی",
    pr3_text: "آموزش مفاهیم مداری برای دانشجویان مهندسی هوافضا.",
    contact_title: "تماس",
    contact_text:
      "برای همکاری یا پیشنهاد، می‌توانید از طریق ایمیل فرضی info@apsistech.ir در تماس باشید.",
    footer_text: "تمام حقوق این نمونه پروژه محفوظ است.",
    orbit_title: "شبیه‌سازی  مدار ",
    btnSim: "رسم مدار",
    period_label: "دوره مداری:",
    energy_label: "انرژی ویژه:",
  },
  en: {
    title: "Apsis Technology",
    menuHome: "Home",
    menuAbout: "About",
    menuProjects: "Projects",
    menuContact: "Contact",
    hero_title: "Guidance, Navigation & Control",
    hero_text:
      "This site demonstrates  simulation based and numerical integration.",
    about_title: "About",
    about_text:
      "This project shows how to convert orbital elements to r,v vectors and solve the two-body problem numerically.",
    projects_title: "Projects",
    pr1_title: "Orbit Simulator",
    pr1_text: "Compute and visualize satellite orbits using RK4.",
    pr2_title: "2D Visualization",
    pr2_text: "Render the orbit on a 2D plane with Earth at the center.",
    pr3_title: "Educational Tool",
    pr3_text: "Teach orbital mechanics to aerospace engineering students.",
    contact_title: "Contact",
    contact_text:
      "For collaboration or suggestions, reach out via the mock email info@apsistech.ir.",
    footer_text: "All rights reserved for this sample project.",
    orbit_title: "Two-Body Orbit Simulator (RK4)",
    btnSim: "Draw Orbit",
    period_label: "Orbital period:",
    energy_label: "Specific energy:",
  },
};

let currentLang = "fa";

function setLanguage(lang) {
  currentLang = lang;
  const t = translations[lang];

  // Contents
  document.getElementById("title").textContent = t.title;
  document.getElementById("menuHome").textContent = t.menuHome;
  document.getElementById("menuAbout").textContent = t.menuAbout;
  document.getElementById("menuProjects").textContent = t.menuProjects;
  document.getElementById("menuContact").textContent = t.menuContact;

  document.getElementById("hero_title").textContent = t.hero_title;
  document.getElementById("hero_text").textContent = t.hero_text;

  document.getElementById("about_title").textContent = t.about_title;
  document.getElementById("about_text").textContent = t.about_text;

  document.getElementById("projects_title").textContent = t.projects_title;
  document.getElementById("pr1_title").textContent = t.pr1_title;
  document.getElementById("pr1_text").textContent = t.pr1_text;
  document.getElementById("pr2_title").textContent = t.pr2_title;
  document.getElementById("pr2_text").textContent = t.pr2_text;
  document.getElementById("pr3_title").textContent = t.pr3_title;
  document.getElementById("pr3_text").textContent = t.pr3_text;

  document.getElementById("contact_title").textContent = t.contact_title;
  document.getElementById("contact_text").textContent = t.contact_text;

  document.getElementById("footer_text").textContent = t.footer_text;

  document.getElementById("orbit_title").textContent = t.orbit_title;
  document.getElementById("btnSim").textContent = t.btnSim;

  const periodText = document.getElementById("periodText");
  const energyText = document.getElementById("energyText");
  if (periodText.dataset.value) {
    periodText.textContent = `${t.period_label} ${periodText.dataset.value}`;
  }
  if (energyText.dataset.value) {
    energyText.textContent = `${t.energy_label} ${energyText.dataset.value}`;
  }

  // Direction of page
  if (lang === "fa") {
    document.documentElement.lang = "fa";
    document.documentElement.dir = "rtl";
    document.getElementById("langBtn").textContent = "EN";
  } else {
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
    document.getElementById("langBtn").textContent = "FA";
  }
}

const langBtn = document.getElementById("langBtn");
if (langBtn) {
  langBtn.onclick = () => {
    setLanguage(currentLang === "fa" ? "en" : "fa");
  };
}
setLanguage("fa");

// === Orbit simulation  Section===

// Gravitational constant (km^3/s^2)
const MU = 398600.4418;

// const orbitCanvas = document.getElementById("orbitCanvas");
// const octx = orbitCanvas.getContext("2d");
const orbitStatus = document.getElementById("orbitStatus");
const periodText = document.getElementById("periodText");
const energyText = document.getElementById("energyText");

// Convert
const deg2rad = (d) => (d * Math.PI) / 180;

function elementsToRV(a, ecc, incDeg, raanDeg, argpDeg, taDeg) {
  const i = deg2rad(incDeg);
  const raan = deg2rad(raanDeg);
  const argp = deg2rad(argpDeg);
  const ta = deg2rad(taDeg);

  const p = a * (1 - ecc * ecc);
  const r_pf = p / (1 + ecc * Math.cos(ta));
  const x_pf = r_pf * Math.cos(ta);
  const y_pf = r_pf * Math.sin(ta);

  const h = Math.sqrt(MU * p);
  const vx_pf = (-MU / h) * Math.sin(ta);
  const vy_pf = (MU / h) * (ecc + Math.cos(ta));

  const cosO = Math.cos(raan);
  const sinO = Math.sin(raan);
  const cosi = Math.cos(i);
  const sini = Math.sin(i);
  const cosw = Math.cos(argp);
  const sinw = Math.sin(argp);

  const R11 = cosO * cosw - sinO * sinw * cosi;
  const R12 = -cosO * sinw - sinO * cosw * cosi;
  const R21 = sinO * cosw + cosO * sinw * cosi;
  const R22 = -sinO * sinw + cosO * cosw * cosi;
  const R31 = sinw * sini;
  const R32 = cosw * sini;

  const r = [
    R11 * x_pf + R12 * y_pf,
    R21 * x_pf + R22 * y_pf,
    R31 * x_pf + R32 * y_pf,
  ];

  const v = [
    R11 * vx_pf + R12 * vy_pf,
    R21 * vx_pf + R22 * vy_pf,
    R31 * vx_pf + R32 * vy_pf,
  ];

  return { r, v };
}

// Motion in two body system
function accelTwoBody(r) {
  const rx = r[0];
  const ry = r[1];
  const rz = r[2];
  const rnorm = Math.sqrt(rx * rx + ry * ry + rz * rz);
  const factor = -MU / (rnorm * rnorm * rnorm);
  return [factor * rx, factor * ry, factor * rz];
}

// RK4
function rk4Step(state, dt) {
  // state = [rx, ry, rz, vx, vy, vz]
  const f = (s) => {
    const r = [s[0], s[1], s[2]];
    const v = [s[3], s[4], s[5]];
    const a = accelTwoBody(r);
    return [v[0], v[1], v[2], a[0], a[1], a[2]];
  };

  const k1 = f(state);
  const s2 = state.map((val, i) => val + 0.5 * dt * k1[i]);
  const k2 = f(s2);
  const s3 = state.map((val, i) => val + 0.5 * dt * k2[i]);
  const k3 = f(s3);
  const s4 = state.map((val, i) => val + dt * k3[i]);
  const k4 = f(s4);

  const newState = state.map(
    (val, i) => val + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]),
  );

  return newState;
}

// Orbit Simulation
function simulateOrbit(a, ecc, inc, raan, argp, ta0, simTime, steps) {
  const { r, v } = elementsToRV(a, ecc, inc, raan, argp, ta0);

  // const step = 500;
  let dt = simTime / steps;

  let state = [r[0], r[1], r[2], v[0], v[1], v[2]];
  const path = [];
  const times = [];

  for (let k = 0; k <= steps; k++) {
    path.push([state[0], state[1], state[2]]);
    times.push(k * dt);
    state = rk4Step(state, dt);
  }

  return { path, times };
}

// Draw orbits on 2D canvas
function drawOrbit(path) {
  const w = orbitCanvas.width;
  const h = orbitCanvas.height;
  octx.clearRect(0, 0, w, h);

  // Find max radius for scaling
  let rmax = 0;
  for (const p of path) {
    const r = Math.sqrt(p[0] * p[0] + p[1] * p[1]);
    if (r > rmax) rmax = r;
  }
  if (rmax === 0) return;

  const margin = 20;
  const scale = (Math.min(w, h) / 2 - margin) / rmax;
  const cx = w / 2;
  const cy = h / 2;

  // Orbit
  octx.beginPath();
  for (let i = 0; i < path.length; i++) {
    const x = cx + path[i][0] * scale;
    const y = cy - path[i][1] * scale;
    if (i === 0) octx.moveTo(x, y);
    else octx.lineTo(x, y);
  }
  octx.strokeStyle = "#38bdf8";
  octx.lineWidth = 1.2;
  octx.stroke();

  // Earth on center
  octx.beginPath();
  octx.arc(cx, cy, 6, 0, Math.PI * 2);
  octx.fillStyle = "#22c55e";
  octx.fill();
}

// handler forms submission
let date;
const orbitForm = document.getElementById("orbitForm");
if (orbitForm) {
  orbitForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (orbitStatus) {
      orbitStatus.textContent =
        currentLang === "fa" ? "در حال محاسبه..." : "Computing...";
    }

    const a = parseFloat(document.getElementById("a").value);
    const ecc = parseFloat(document.getElementById("e").value);
    const inc = parseFloat(document.getElementById("inc").value);
    const raan = parseFloat(document.getElementById("raan").value);
    const argp = parseFloat(document.getElementById("argp").value);
    const ta = parseFloat(document.getElementById("ta").value);

    const year = parseFloat(document.getElementById("year").value);
    const month = parseFloat(document.getElementById("month").value);
    const day = parseFloat(document.getElementById("day").value);
    const hour = parseFloat(document.getElementById("hour").value);
    const minute = parseFloat(document.getElementById("minute").value);
    const second = parseFloat(document.getElementById("second").value);
    date = new Date(year, month, day, hour, minute, second);

    try {
      const simTime = parseFloat(document.getElementById("simTime").value);
      let steps = parseInt(document.getElementById("stepTime").value);
      const result = simulateOrbit(a, ecc, inc, raan, argp, ta, simTime, steps);
      drawOrbit3D(result.path, result.times);

      if (orbitStatus) {
        orbitStatus.textContent =
          currentLang === "fa" ? "مدار رسم شد." : "Orbit drawn.";
      }
    } catch (err) {
      console.error(err);
      if (orbitStatus) {
        orbitStatus.textContent =
          currentLang === "fa" ? "خطا در محاسبه." : "Error in computation.";
      }
    }
  });
}

// ================================
// ✅ FIXED 3D ORBIT VISUALIZATION
// ================================
let scene, camera, renderer, animationId;
let orbitCurve,
  satellite,
  t = 0;
let controls;

function init3D() {
  const container = document.getElementById("threeContainer");
  if (!container) return;

  // Stop previous animation (important)
  if (animationId) cancelAnimationFrame(animationId);

  container.innerHTML = "";

  const width = container.clientWidth || 600;
  const height = 400;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100000);
  camera.position.set(20000, 20000, 20000);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);

  // Smooth interaction
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // Limits (important for usability)
  controls.minDistance = 500;
  controls.maxDistance = 50000;

  // Keep camera above some angle (optional but nice)
  controls.maxPolarAngle = Math.PI;

  // Load Earth texture (replace 'earth_texture.jpg' with your image path or URL)
  const textureLoader = new THREE.TextureLoader();
  const earthTexture = textureLoader.load("images/earth_texture.jpg"); // Ensure the file is in the same directory or provide full path

  // Earth with texture
  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(6371, 32, 32),
    new THREE.MeshLambertMaterial({ map: earthTexture }), // Use Lambert for lighting response
    new THREE.MeshPhongMaterial({ color: 0x2266ff }),
  );
  scene.add(earth);

  ////=== Light ===
  // Sun light (directional = realistic)
  const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);

  const sunDir = getSunDirection(date);
  // place sun far away in that direction
  sunLight.position.copy(sunDir.multiplyScalar(100000));
  scene.add(sunLight);

  // soft ambient (space is not pitch black in visualization)
  const ambient = new THREE.AmbientLight(0x222222);
  scene.add(ambient);

  // Axes helper (debug visibility)
  const axes = new THREE.AxesHelper(10000);
  scene.add(axes);
}

let orbitTimes = [];
let orbitPoints = [];
let startTime = null;

function drawOrbit3D(path, times) {
  if (!path || path.length === 0) return;

  orbitTimes = times;
  orbitPoints = points;

  startTime = null;

  init3D();

  const SCALE = 1;

  const points = path.map(
    (p) => new THREE.Vector3(p[0] * SCALE, p[1] * SCALE, p[2] * SCALE),
  );

  // ✅ Store curve globally (important)
  orbitCurve = new THREE.CatmullRomCurve3(points);

  // ===== Orbit Tube =====
  const tubeGeometry = new THREE.TubeGeometry(orbitCurve, 120, 80, 12, true);

  const tubeMaterial = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
  });

  const orbitTube = new THREE.Mesh(tubeGeometry, tubeMaterial);
  scene.add(orbitTube);

  // ===== Satellite =====
  const satGeometry = new THREE.SphereGeometry(120, 16, 16);
  const satMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

  satellite = new THREE.Mesh(satGeometry, satMaterial);
  scene.add(satellite);

  // reset animation parameter
  t = 0;

  animate3D();
}

function animate3D(timestamp) {
  animationId = requestAnimationFrame(animate3D);

  // اگر داده نداریم، رندر ساده
  if (!orbitPoints.length || !orbitTimes.length || !satellite) {
    renderer.render(scene, camera);
    return;
  }

  if (!startTime) startTime = timestamp;

  const elapsed = (timestamp - startTime) / 1000;

  const totalTime = orbitTimes[orbitTimes.length - 1];

  if (totalTime <= 0) return;

  // نرمال‌سازی زمان
  const u = (elapsed % totalTime) / totalTime;

  // تبدیل به ایندکس
  const index = u * (orbitPoints.length - 1);

  const i = Math.floor(index);
  const alpha = index - i;

  const p0 = orbitPoints[i];
  const p1 = orbitPoints[Math.min(i + 1, orbitPoints.length - 1)];

  // اینترپولیشن نرم
  const pos = new THREE.Vector3().lerpVectors(p0, p1, alpha);
  satellite.position.copy(pos);

  // کنترل دوربین
  if (controls) controls.update();
  renderer.render(scene, camera);
}

// Approximate Sun direction using time
function getSunDirection(date = new Date()) {
  const dayMs = 86400000;

  // Days since J2000
  const J2000 = new Date("2000-01-01T12:00:00Z");
  const d = (date - J2000) / dayMs;

  // Mean longitude
  const L = (280.46 + 0.9856474 * d) % 360;

  // Mean anomaly
  const g = (357.528 + 0.9856003 * d) % 360;

  // Ecliptic longitude
  const lambda =
    L +
    1.915 * Math.sin((g * Math.PI) / 180) +
    0.02 * Math.sin((2 * g * Math.PI) / 180);

  // Obliquity of Earth
  const epsilon = (23.439 * Math.PI) / 180;

  const lambdaRad = (lambda * Math.PI) / 180;

  // Sun vector (unit)
  const x = Math.cos(lambdaRad);
  const y = Math.cos(epsilon) * Math.sin(lambdaRad);
  const z = Math.sin(epsilon) * Math.sin(lambdaRad);

  return new THREE.Vector3(x, y, z).normalize();
}

// for using Cesium JS Lib
function addSatellite(path) {
  const property = new Cesium.SampledPositionProperty();

  let time = Cesium.JulianDate.now();

  path.forEach((p, i) => {
    const t = Cesium.JulianDate.addSeconds(
      time,
      i * 10,
      new Cesium.JulianDate(),
    );
    const pos = Cesium.Cartesian3.fromElements(
      p[0] * 1000,
      p[1] * 1000,
      p[2] * 1000,
    );
    property.addSample(t, pos);
  });

  viewer.entities.add({
    position: property,
    point: { pixelSize: 10, color: Cesium.Color.RED },
  });

  viewer.clock.startTime = time.clone();
  viewer.clock.stopTime = Cesium.JulianDate.addSeconds(
    time,
    path.length * 10,
    new Cesium.JulianDate(),
  );
  viewer.clock.currentTime = time.clone();
  viewer.clock.multiplier = 10;
}

function drawOrbitCesium(path) {
  if (!window.viewer) {
    window.viewer = new Cesium.Viewer("cesiumContainer", {
      shouldAnimate: true,
    });
  }

  const positions = path.map((p) =>
    Cesium.Cartesian3.fromElements(p[0] * 1000, p[1] * 1000, p[2] * 1000),
  );

  viewer.entities.add({
    polyline: {
      positions: positions,
      width: 3,
      material: Cesium.Color.CYAN,
    },
  });

  viewer.zoomTo(viewer.entities);
}
