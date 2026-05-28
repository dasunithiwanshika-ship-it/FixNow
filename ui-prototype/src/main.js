import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createIcons, Home, Briefcase, PlusCircle, MessageSquare, User, Search, MapPin, Star } from 'lucide'

gsap.registerPlugin(ScrollTrigger);

// Initialize Lucide icons
createIcons({
  icons: {
    Home,
    Briefcase,
    PlusCircle,
    MessageSquare,
    User,
    Search,
    MapPin,
    Star
  }
});

// Enhanced Floating Tools Animation with Depth of Field
const floatingTools = document.querySelectorAll('.floating-tool');
floatingTools.forEach((tool, index) => {
  // Assign layers for depth of field effect
  const layerClass = index % 3 === 0 ? 'tool-layer-1' : (index % 3 === 1 ? 'tool-layer-2' : 'tool-layer-3');
  tool.classList.add(layerClass);

  gsap.to(tool, {
    y: 'random(-40, 40)',
    x: 'random(-30, 30)',
    rotation: 'random(-25, 25)',
    duration: 'random(4, 7)',
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    delay: index * 0.4
  });
});

// Interactive Parallax & 3D Tilt
window.addEventListener('mousemove', (e) => {
  const { clientX, clientY } = e;
  const xPos = (clientX / window.innerWidth - 0.5);
  const yPos = (clientY / window.innerHeight - 0.5);

  // Parallax Background
  floatingTools.forEach((tool, index) => {
    const depth = (index + 1) * 20;
    gsap.to(tool, {
      x: xPos * depth,
      y: yPos * depth,
      duration: 1.5,
      ease: "power2.out"
    });
  });

  // Hero Card 3D Tilt
  gsap.to('.hero-content', {
    rotateY: xPos * 15,
    rotateX: -yPos * 15,
    duration: 1.2,
    ease: "power3.out",
    transformPerspective: 1000
  });
});

// App Experience Timeline
const mainTl = gsap.timeline({ delay: 0.5 });

// 1. Splash Sequence
mainTl.to('.loading-bar', {
  width: '100%',
  duration: 2.5,
  ease: "power4.inOut"
})
.to('.splash', {
  y: '-100%',
  duration: 1.2,
  ease: "expo.inOut",
  onComplete: () => {
    document.querySelector('.splash').style.display = 'none';
  }
});

// 2. Dashboard Entrance
mainTl.from('.app-header', {
  y: -50,
  opacity: 0,
  duration: 0.8,
  ease: "back.out(1.7)"
}, "-=0.4")
.from('.search-bar-3d', {
  scale: 0.8,
  opacity: 0,
  duration: 0.6,
  ease: "back.out(2)"
}, "-=0.6")
.from('.category-card', {
  y: 40,
  opacity: 0,
  rotationX: -45,
  stagger: 0.1,
  duration: 1,
  ease: "power4.out"
}, "-=0.4")
.from('.bottom-nav', {
  y: 100,
  duration: 0.8,
  ease: "power4.out"
}, "-=0.8");

// Magnetic Button Interaction
const magneticButtons = document.querySelectorAll('.btn-primary');
magneticButtons.forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    gsap.to(btn, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.4,
      ease: "power2.out"
    });
  });

  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.3)"
    });
  });
});

// Add Mock Content for Scroller
const workers = [
  { name: 'Alex Rivera', service: 'Master Plumber', rating: 4.9, avatar: 'AR' },
  { name: 'Elena Chen', service: 'Electrician', rating: 4.8, avatar: 'EC' },
  { name: 'Marcus Thorne', service: 'HVAC Expert', rating: 5.0, avatar: 'MT' }
];

const workerScroll = document.querySelector('.worker-scroll');
if (workerScroll) {
  workers.forEach(worker => {
    const card = document.createElement('div');
    card.className = 'worker-card';
    card.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
        <div class="avatar-small">${worker.avatar}</div>
        <div>
          <h5 style="margin: 0; color: white;">${worker.name}</h5>
          <span style="font-size: 0.8rem; color: #64748b;">${worker.service}</span>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="color: #fbbf24; font-size: 0.9rem;">★ ${worker.rating}</div>
        <button class="btn-micro">Hire</button>
      </div>
    `;
    workerScroll.appendChild(card);
  });
}

// Logo Flicker Effect
const logo = document.querySelector('.logo');
if (logo) {
  gsap.to(logo, {
    opacity: 0.8,
    duration: 0.1,
    repeat: 3,
    yoyo: true,
    delay: 2,
    ease: "power1.inOut"
  });
}
