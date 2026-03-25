// Initialize Lenis for Smooth Scrolling
const lenis = new Lenis({
    duration: 1.8,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    smooth: true,
    smoothTouch: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Initial states for HTML elements
gsap.set('.hero-content', { opacity: 0, y: 50 });
gsap.set('.canvas-container', { opacity: 0 });
gsap.set('.content-block', { opacity: 0, y: 100 });

// Page Load Animation
window.addEventListener('load', () => {
    const tl = gsap.timeline();
    tl.to('.hero-content', {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'power4.out',
        delay: 0.2
    })
    .to('.canvas-container', {
        opacity: 1,
        duration: 2,
        ease: 'power3.out'
    }, "-=1");
});

// Image Sequence Canvas Logic
const canvas = document.getElementById("hero-lightpass");
const context = canvas.getContext("2d", { alpha: false });
const frameCount = 134;

const currentFrame = index => (
  `Public/Images/Herosection/${(index + 1).toString().padStart(3, '0')}.png`
);

const images = [];
const imageSequence = {
  frame: 0
};

// Preload images
for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}

// Draw to canvas with "cover" aspect-filling to stretch the video to fill the screen
function renderCanvas() {
  const img = images[imageSequence.frame];
  if(!img || !img.complete) return;
  
  const container = canvas.parentElement;
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  
  const hRatio = canvas.width / img.width;
  const vRatio = canvas.height / img.height;
  const ratio = Math.max(hRatio, vRatio); // object-fit: cover equivalent
  const centerShift_x = (canvas.width - img.width * ratio) / 2;
  const centerShift_y = (canvas.height - img.height * ratio) / 2;  
  
  // Clear the canvas to ensure a clean frame
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(img, 0, 0, img.width, img.height,
                      centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);  
}

images[0].onload = renderCanvas;
window.addEventListener('resize', renderCanvas);

// Scroll scrub timeline for the canvas
gsap.to(imageSequence, {
  frame: frameCount - 1,
  snap: "frame",
  ease: "none",
  scrollTrigger: {
    trigger: '.smooth-scroll-wrapper',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1 // smooth scrubbing
  },
  onUpdate: renderCanvas 
});


// Reveal animations for text content blocks
gsap.utils.toArray('.content-block').forEach((block) => {
    gsap.to(block, {
        scrollTrigger: {
            trigger: block,
            start: 'top 80%',
            once: false // allow reposition/reanimation if desired
        },
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out'
    });
});

// Staggered reveal animation for gallery cards
gsap.utils.toArray('.gallery-card').forEach((card, i) => {
    gsap.to(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            once: true
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: (i % 4) * 0.1 // stagger effect
    });
});
