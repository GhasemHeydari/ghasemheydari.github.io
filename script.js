/* --- سیستم یکپارچه پس‌زمینه (Canvas) --- */
if (!window.isCanvasInitialized) {
    const canvas = document.getElementById("spaceCanvas");
    if (canvas) {
        window.isCanvasInitialized = true;
        const ctx = canvas.getContext("2d");
        let stars = [];
        let meteors = [];
        const STAR_COUNT = 1200;
        const METEOR_MAX = 2;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener("resize", resize);
        resize();

        class Star {
            constructor() { this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height; this.size = Math.random() * 1.2; this.alpha = Math.random() * 0.8 + 0.2; this.twinkle = Math.random() * 0.01; }
            update() { this.alpha += this.twinkle; if (this.alpha > 1 || this.alpha < 0.2) this.twinkle *= -1; }
            draw() { ctx.fillStyle = `rgba(255,255,255,${this.alpha})`; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); }
        }

        class Meteor {
            constructor() { this.reset(); }
            reset() { this.active = false; this.x = Math.random() * canvas.width; this.y = -100; const angle = (Math.random() * 30 + 30) * Math.PI / 180; this.speed = Math.random() * 4 + 4; this.vx = Math.cos(angle) * this.speed; this.vy = Math.sin(angle) * this.speed; this.opacity = 1; }
            update() { if (!this.active) { if (Math.random() < 0.0006) this.active = true; return; } this.x += this.vx; this.y += this.vy; this.opacity -= 0.003; if (this.opacity <= 0 || this.x > canvas.width + 200 || this.y > canvas.height + 200) this.reset(); }
            draw() { if (!this.active) return; const tailX = this.x - this.vx * 25; const tailY = this.y - this.vy * 25; const grad = ctx.createLinearGradient(this.x, this.y, tailX, tailY); grad.addColorStop(0, `rgba(255,255,255,${this.opacity})`); grad.addColorStop(1, "rgba(255,255,255,0)"); ctx.strokeStyle = grad; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(this.x, this.y); ctx.lineTo(tailX, tailY); ctx.stroke(); }
        }

        for (let i = 0; i < STAR_COUNT; i++) stars.push(new Star());
        for (let i = 0; i < METEOR_MAX; i++) meteors.push(new Meteor());

        function animate() {
            ctx.fillStyle = "rgba(2,6,23,0.35)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            stars.forEach(s => { s.update(); s.draw(); });
            meteors.forEach(m => { m.update(); m.draw(); });
            requestAnimationFrame(animate);
        }
        animate();
    }
}

/* --- انیمیشن درباره ما --- */

/* --- سیستم انتقال صفحات (Transition) --- */
document.addEventListener("DOMContentLoaded", () => {

    const cache = new Map();

    async function getPage(url) {
        if (cache.has(url)) return cache.get(url);
        const res = await fetch(url);
        const html = await res.text();
        cache.set(url, html);
        return html;
    }

    function animateLogo() {
        const config = { targetTop: 15, targetLeft: -10, targetWidth: 230 };
        if (!document.body.classList.contains("home-page")) return null;
        const logo = document.querySelector(".apsis-unified-logo");
        if (!logo) return null;
        const rect = logo.getBoundingClientRect();
        const clone = logo.cloneNode(true);
        clone.classList.add("logo-clone");
        Object.assign(clone.style, { position: "fixed", top: rect.top + "px", left: rect.left + "px", width: rect.width + "px", margin: "0", zIndex: "9999", transformOrigin: "top left" });
        const finalScale = config.targetWidth / rect.width;
        clone.style.setProperty("--moveX", (config.targetLeft - rect.left) + "px");
        clone.style.setProperty("--moveY", (config.targetTop - rect.top) + "px");
        clone.style.setProperty("--targetScale", finalScale);
        clone.style.animation = "apsisLogoMotion 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards";
        document.body.appendChild(clone);
        logo.style.visibility = "hidden";
        return clone;
    }

    async function render(url, push = true) {
    const clone = animateLogo();
    document.body.classList.add("page-fade-out");

    const html = await getPage(url);
    const doc = new DOMParser().parseFromString(html, "text/html");
    const newContent = doc.querySelector("#pageContent");
    const current = document.querySelector("#pageContent");

    if (!current) {
        window.location.href = url;
        return;
    }

    if (!newContent) {
        window.location.href = url;
        return;
    }

    const swapPage = () => {
        current.innerHTML = newContent.innerHTML;
        document.title = doc.title;
        document.body.className = doc.body.className;

        if (push) {
            history.pushState({}, "", url);
        }

        window.scrollTo(0, 0);

        document.body.classList.remove("page-fade-out");
        document.querySelectorAll(".logo-clone").forEach(el => el.remove());

        if (doc.body.classList.contains("home-page")) {
            const logo = document.querySelector(".apsis-unified-logo");
            if (logo) logo.style.visibility = "visible";
        }

        initProjectsCircleCarousel();
        initProjectGlow();

        // اجرای موتور مدار فقط بعد از تعویض کامل محتوای صفحه
       if (url.includes("madar.html")) {
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            waitAndInitOrbit();
        });
    });
}

    };

    if (clone) {
        clone.addEventListener("animationend", swapPage, { once: true });
    } else {
        swapPage();
    }
}


    document.addEventListener("click", e => {
        const link = e.target.closest("a");
        if (!link || !link.href || link.href.startsWith("#") || link.href.includes("mailto:")) return;
        if (link.hostname !== window.location.hostname) return;
        e.preventDefault();
        render(link.href, true);
    });

    window.addEventListener("popstate", () => render(location.pathname, false));
    
    // اجرای اولیه اگر مستقیماً در صفحه مدار لود شود
    if (window.location.pathname.includes("madar.html")) waitAndInitOrbit();
});

/* --- موتور محاسبات کپلری (برای مدار کاملاً بسته) --- */
const MU = 398600.4418;
function calculateKeplerOrbit(a, ecc, incDeg, raanDeg, argpDeg) {
    const points = [];
    const i = (incDeg * Math.PI) / 180;
    const node = (raanDeg * Math.PI) / 180;
    const peri = (argpDeg * Math.PI) / 180;
    const steps = 500;

    for (let step = 0; step <= steps; step++) {
        const E = (step / steps) * Math.PI * 2;
        const x_orb = a * (Math.cos(E) - ecc);
        const y_orb = a * Math.sqrt(1 - ecc * ecc) * Math.sin(E);

        const cosN = Math.cos(node), sinN = Math.sin(node);
        const cosP = Math.cos(peri), sinP = Math.sin(peri);
        const cosI = Math.cos(i),    sinI = Math.sin(i);

        const x = (cosN * cosP - sinN * sinP * cosI) * x_orb + (-cosN * sinP - sinN * cosP * cosI) * y_orb;
        const y = (sinN * cosP + cosN * sinP * cosI) * x_orb + (-sinN * sinP + cosN * cosP * cosI) * y_orb;
        const z = (sinP * sinI) * x_orb + (cosP * sinI) * y_orb;

        points.push([x, y, z]);
    }
    return points;
}

/* --- سیستم رندر سه‌بعدی ارتقایافته --- */
let renderer, scene, camera, orbitLine, satellite, controls, earthGroup;
let orbitPoints = [];
let animIndex = 0;

function init3D() {
    const container = document.getElementById("threeContainer");
    if (!container) return;

    container.innerHTML = "";
      const width = container.clientWidth || 800; // مقدار پیشفرض اگر صفر بود
    const height = container.clientHeight || 600;

   scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(45, width / height, 100, 2000000);
camera.position.set(35000, 20000, 35000);
camera.lookAt(0, 0, 0);

renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

container.appendChild(renderer.domElement);

    // ۲. تنظیم دقیق OrbitControls برای جلوگیری از انحراف دوربین
    // در تابع init3D جایی که کنترلر را تعریف کردیم:
if (THREE.OrbitControls) {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
} else if (window.OrbitControls) {
    controls = new window.OrbitControls(camera, renderer.domElement);
}

if (controls) {
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 10000; // اجازه ندهیم خیلی داخل زمین برود
    controls.maxDistance = 500000; // اجازه ندهیم خیلی دور شود
    controls.target.set(0, 0, 0);
    controls.update();
}


    // ۳. زمین واقعی با تکسچر
    earthGroup = new THREE.Group();
    const textureLoader = new THREE.TextureLoader();
    // استفاده از تکسچر مستقیم برای اطمینان از لود سریع
    const earthTex = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg');
    
    const earthMesh = new THREE.Mesh(
        new THREE.SphereGeometry(6371, 64, 64),
        new THREE.MeshPhongMaterial({ map: earthTex, shininess: 5 })
    );
    const earthCore = new THREE.Mesh(
        new THREE.SphereGeometry(6360, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0x020617 })
    );
    
    earthGroup.add(earthCore);
    earthGroup.add(earthMesh);
    scene.add(earthGroup);
// اضافه کردن محورهای مختصات (X, Y, Z)
// عدد 15000 طول خطوط محور است که بزرگتر از شعاع زمین در نظر گرفته شده تا از زمین بیرون بزند
const axesHelper = new THREE.AxesHelper(15000); 
scene.add(axesHelper);



    // ۴. نورپردازی قوی برای دیده شدن زمین
       // نور محیطی را زیاد می‌کنیم تا بخش‌های سایه هم کمی دیده شوند
    scene.add(new THREE.AmbientLight(0xffffff, 1.2)); 
    
    // نور مستقیم (خورشید) را قوی‌تر می‌کنیم
    const sun = new THREE.DirectionalLight(0xffffff, 2.0);
    sun.position.set(50000, 30000, 50000);
    scene.add(sun);


    // اضافه کردن محورها برای تست (می‌توانید بعدا حذف کنید)
    // scene.add(new THREE.AxesHelper(10000));

    function animate() {
        if (!document.getElementById("threeContainer")) return;
        requestAnimationFrame(animate);
        
        if (earthGroup) earthGroup.rotation.y += 0.001;
        if (controls) controls.update();
        
        if (satellite && orbitPoints.length > 0) {
            animIndex = (animIndex + 1) % orbitPoints.length;
            const p = orbitPoints[animIndex];
            satellite.position.set(p[0], p[2], -p[1]);
        }
        renderer.render(scene, camera);
    }
    animate();
    

    window.addEventListener('resize', () => {
    if (!container.clientWidth || !container.clientHeight) return;

    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

renderer.render(scene, camera);
}

function drawOrbit(path) {
    if (!scene) return;
    orbitPoints = path;
    if (orbitLine) scene.remove(orbitLine);
    if (satellite) scene.remove(satellite);

    // تبدیل نقاط به سیستم مختصات Three.js
    // در اینجا p[0] میشه X، p[2] میشه ارتفاع (Y) و -p[1] میشه عمق (Z)
    const points = path.map(p => new THREE.Vector3(p[0], p[2], -p[1]));
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    orbitLine = new THREE.Line(geometry, new THREE.LineBasicMaterial({ 
        color: 0x00f2ff, 
        transparent: true, 
        opacity: 0.8, 
        blending: THREE.AdditiveBlending 
    }));
    scene.add(orbitLine);

    // ماهواره دقیقاً روی همان مسیر
    satellite = new THREE.Mesh(
        new THREE.SphereGeometry(350, 16, 16), 
        new THREE.MeshBasicMaterial({ color: 0xff3333 })
    );
    scene.add(satellite);
    
    // ریست کردن ایندکس انیمیشن برای شروع از نقطه اول مدار جدید
    animIndex = 0;
}



function waitAndInitOrbit() {
    const container = document.getElementById("threeContainer");

    if (container && container.offsetWidth > 0 && container.offsetHeight > 0) {
        if (container.children.length === 0) {
            init3D();

            const initialPath = calculateKeplerOrbit(18000, 0.2, 45, 30, 0);
            drawOrbit(initialPath);
        }

        setupOrbitLogic();
    } else {
        setTimeout(waitAndInitOrbit, 120);
    }
}


function setupOrbitLogic() {
    const btn = document.getElementById("btnSim");
    if (!btn) return;
    btn.onclick = (e) => {
        e.preventDefault();
        const a = parseFloat(document.getElementById("a").value);
        const ecc = parseFloat(document.getElementById("e").value);
        const inc = parseFloat(document.getElementById("inc").value);
        const raan = parseFloat(document.getElementById("raan").value);
        const argp = parseFloat(document.getElementById("argp").value);
        
        const path = calculateKeplerOrbit(a, ecc, inc, raan, argp);
        drawOrbit(path);
        document.getElementById("orbitStatus").innerText = "شبیه‌سازی با دقت کپلری انجام شد.";
    };
}
/* =================================
   Hover Light Effect for cards
================================= */


function initProjectsCircleCarousel() {
    const slider = document.querySelector('.projects-grid');
    if (!slider) {
        console.warn("Element .projects-grid not found!");
        return;
    }

    if (slider.dataset.circleReady === 'true') {
        return;
    }

    const cards = Array.from(slider.querySelectorAll('.project-card'));
if (cards.length === 0) {
    console.warn("No cards found inside .projects-grid!");
    return;
}

slider.dataset.circleReady = 'true';

let activeIndex = 0;

    let isDragging = false;
    let dragStartX = 0;
    let dragDeltaX = 0;
    let wheelLocked = false;

    const SIDE_ANGLE = 0.62;   // زاویه کارت‌های کناری ~ 35deg
    const RADIUS = 450;        // شعاع کوچک
    const LIFT_Y = 18;         // افت عمودی خیلی کم
    const SIDE_SCALE = 0.84;   // کوچکتر شدن کارت کناری
    const SIDE_BLUR = 1.8;     // بلور کم، محتوا هنوز دیده شود
    const SIDE_OPACITY = 0.72; // شفافیت مناسب
    const FAR_OPACITY = 0;     // بقیه عملاً ناپدید
    const FAR_SCALE = 0.55;
    const FAR_BLUR = 8;

    function circularDiff(index, center, length) {
        let diff = index - center;
        if (diff > length / 2) diff -= length;
        if (diff < -length / 2) diff += length;
        return diff;
    }

    function normalizeIndex(index) {
        const len = cards.length;
        return ((index % len) + len) % len;
    }

  function render() {
        cards.forEach((card, i) => {
            const rel = circularDiff(i, activeIndex, cards.length);
            const abs = Math.abs(rel);

            card.classList.remove('is-center');

            // فقط مرکز و دو همسایه دیده شوند
            if (abs > 1) {
                card.style.opacity = FAR_OPACITY;
                card.style.filter = `blur(${FAR_BLUR}px)`;
                card.style.zIndex = '1';
                card.style.pointerEvents = 'none';
                card.style.transform = `
                    translate3d(-50%, -50%, -180px)
                    scale(${FAR_SCALE})
                `;
                return;
            }

            // مرکز
            if (rel === 0) {
                card.classList.add('is-center');
                card.style.opacity = '1';
                card.style.filter = 'blur(0px)';
                card.style.zIndex = '30';
                card.style.pointerEvents = 'auto';
                card.style.transform = `
                    translate3d(-50%, -50%, 0px)
                    rotateY(0deg)
                    scale(1)
                `;
                return;
            }

            // چپ / راست روی قوس دایره
            const theta = rel * SIDE_ANGLE;

            const x = Math.sin(theta) * RADIUS;
            const z = (Math.cos(theta) * RADIUS) - RADIUS; 
            const y = (1 - Math.cos(theta)) * LIFT_Y;

            const rotateY = -Math.sin(theta) * 18;

            card.style.opacity = String(SIDE_OPACITY);
            card.style.filter = `blur(${SIDE_BLUR}px)`;
            card.style.zIndex = '20';
            card.style.pointerEvents = 'auto';
            card.style.transform = `
                translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${z}px)
                rotateY(${rotateY}deg)
                scale(${SIDE_SCALE})
            `;
        });
    }


    function next() {
        activeIndex = normalizeIndex(activeIndex + 1);
        render();
    }

    function prev() {
        activeIndex = normalizeIndex(activeIndex - 1);
        render();
    }

    slider.addEventListener('wheel', (e) => {
        e.preventDefault();

        if (wheelLocked) return;
        wheelLocked = true;

        if (e.deltaY > 0 || e.deltaX > 0) {
            next();
        } else {
            prev();
        }

        setTimeout(() => {
            wheelLocked = false;
        }, 280);
    }, { passive: false });

    slider.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragStartX = e.clientX;
        dragDeltaX = 0;
        slider.classList.add('is-dragging');
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        dragDeltaX = e.clientX - dragStartX;
    });

    window.addEventListener('mouseup', () => {
        if (!isDragging) return;

        slider.classList.remove('is-dragging');

        if (dragDeltaX > 60) {
            prev();
        } else if (dragDeltaX < -60) {
            next();
        }

        isDragging = false;
        dragDeltaX = 0;
    });

    // تاچ موبایل
    let touchStartX = 0;
    let touchDeltaX = 0;

    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchDeltaX = 0;
    }, { passive: true });

    slider.addEventListener('touchmove', (e) => {
        touchDeltaX = e.touches[0].clientX - touchStartX;
    }, { passive: true });

    slider.addEventListener('touchend', () => {
        if (touchDeltaX > 50) prev();
        else if (touchDeltaX < -50) next();
        touchDeltaX = 0;
    });

    // اگر بخوای پروژه 1 اول وسط باشد
  activeIndex = 0;

slider.classList.remove('is-ready');
render();

requestAnimationFrame(() => {
    slider.classList.add('is-ready');
});

}
function initProjectGlow() {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        if (card.dataset.glowReady === 'true') {
            return;
        }

        card.dataset.glowReady = 'true';

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();

            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            card.style.setProperty('--x', `${x}%`);
            card.style.setProperty('--y', `${y}%`);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initProjectsCircleCarousel();
    initProjectGlow();
});

const projectsObserver = new MutationObserver(() => {
    const slider = document.querySelector('.projects-grid');

    if (slider && slider.dataset.circleReady !== 'true') {
        initProjectsCircleCarousel();
    }

    initProjectGlow();
});

projectsObserver.observe(document.body, {
    childList: true,
    subtree: true
});


