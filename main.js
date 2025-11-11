const n = 19;
const rots = [
  { ry: 270, a: 0.5 },
  { ry: 0,   a: 0.85 },
  { ry: 90,  a: 0.4 },
  { ry: 180, a: 0.0 }
];

const allTimelines = [];  // Store all timelines

// Set faces rotation
gsap.set(".face", {
  z: 200,
  rotateY: i => rots[i].ry,
  transformOrigin: "50% 50% -201px"
});

// Create cube animations
for (let i = 0; i < n; i++) {
  let die = document.querySelector('.die');
  let cube = die.querySelector('.cube');

  if (i > 0) {
    let clone = die.cloneNode(true);
    document.querySelector('.tray').appendChild(clone);
    cube = clone.querySelector('.cube');
  }

  const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'power3.inOut', duration: 1 } })
    .fromTo(cube, { rotateY: -90 }, { rotateY: 90, ease: 'power1.inOut', duration: 2 })
    .fromTo(cube.querySelectorAll('.face'), {
      color: (j) => 'hsl(' + (i / n * 75 + 130) + ', 67%,' + (100 * [rots[3].a, rots[0].a, rots[1].a][j]) + '%)' },
      { color: (j) => 'hsl(' + (i / n * 75 + 130) + ', 67%,' + (100 * [rots[0].a, rots[1].a, rots[2].a][j]) + '%)' },
      0
    )
    .to(cube.querySelectorAll('.face'), {
      color: (j) => 'hsl(' + (i / n * 75 + 130) + ', 67%,' + (100 * [rots[1].a, rots[2].a, rots[3].a][j]) + '%)' },
      1
    )
    .progress(i / n);

  allTimelines.push(tl);
}

// Tray move animations
const trayTL = gsap.timeline({ repeat: -1, yoyo: true });
trayTL
  .from('.tray', { yPercent: -3, duration: 2, ease: 'power1.inOut' }, 0)
  .fromTo('.tray', { rotate: -15 }, { rotate: 15, duration: 4, ease: 'power1.inOut' }, 0)
  .from('.die', { duration: 0.01, opacity: 0, stagger: { each: -0.05, ease: 'power1.in' } }, 0)
  .to('.tray', { scale: 1.2, duration: 2, ease: 'power3.inOut' }, 0);

allTimelines.push(trayTL);

// Size adjustment
window.onload = window.onresize = () => {
  const h = n*56;
  gsap.set('.tray', { height:h });
  gsap.set('.pov', { scale:innerHeight/h });
};

// Run everything for 3 seconds, then stop and show content
window.onload = () => {
  setTimeout(() => {
    // Stop all timelines
    allTimelines.forEach(tl => tl.pause());

    // **Hide the animated elements** (if you want to hide them)
    document.querySelector('.loader').style.display = 'none';

    // **Show your main content or replace with your content**
    const mainContent = document.querySelector('.main-content');
    mainContent.style.display = 'block';
  }, 3000);  // 3 seconds
};



console.clear();

const cardsContainer = document.querySelector(".cards");
const cardsContainerInner = document.querySelector(".cards__inner");
const cards = Array.from(document.querySelectorAll(".card"));
const overlay = document.querySelector(".overlay");

const applyOverlayMask = (e) => {
  const overlayEl = e.currentTarget;
  const x = e.pageX - cardsContainer.offsetLeft;
  const y = e.pageY - cardsContainer.offsetTop;

  overlayEl.style = `--opacity: 1; --x: ${x}px; --y:${y}px;`;
};

const createOverlayCta = (overlayCard, ctaEl) => {
  const overlayCta = document.createElement("div");
  overlayCta.classList.add("cta");
  overlayCta.textContent = ctaEl.textContent;
  overlayCta.setAttribute("aria-hidden", true);
  overlayCard.append(overlayCta);
};

const observer = new ResizeObserver((entries) => {
  entries.forEach((entry) => {
    const cardIndex = cards.indexOf(entry.target);
    let width = entry.borderBoxSize[0].inlineSize;
    let height = entry.borderBoxSize[0].blockSize;

    if (cardIndex >= 0) {
      overlay.children[cardIndex].style.width = `${width}px`;
      overlay.children[cardIndex].style.height = `${height}px`;
    }
  });
});

const initOverlayCard = (cardEl) => {
  const overlayCard = document.createElement("div");
  overlayCard.classList.add("card");
  createOverlayCta(overlayCard, cardEl.lastElementChild);
  overlay.append(overlayCard);
  observer.observe(cardEl);
};

cards.forEach(initOverlayCard);
document.body.addEventListener("pointermove", applyOverlayMask);

// --- SIZING AND LOADER LOGIC ---

// Function to handle the loader hide/content show
const initLoaderSequence = () => {
    const loader = document.querySelector('#loader');
    const mainContent = document.querySelector('.main-content');

    setTimeout(() => {
        // 1. Stop all GSAP loader animations
        allTimelines.forEach(tl => tl.pause());
        
        // 2. Reveal main content 
        // We set display: block *before* the opacity fade-in starts
        mainContent.style.display = 'block';

        // 3. Fade out the loader and hide it completely
        gsap.to(loader, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.in',
            onComplete: () => {
                loader.style.display = 'none';
            }
        });
        
        // 4. Fade in the main content
        gsap.to(mainContent, { 
            opacity: 1, 
            duration: 1.5,
            ease: 'power2.out'
        });

    }, 3000); // 3 seconds delay
};

// Function to handle sizing (needs to run on load AND resize)
const handleSizing = () => {
    const h = n * 56;
    gsap.set('.tray', { height: h });
    gsap.set('.pov', { scale: innerHeight / h });
};

// **MERGED HANDLERS**: Use DOMContentLoaded for the loader, and onresize for sizing.
document.addEventListener('DOMContentLoaded', () => {
    // Run the sizing once on load
    handleSizing();
    // Start the loader timer
    initLoaderSequence();
});

// Re-assign the resize handler separately
window.onresize = handleSizing; 

// --- END SIZING AND LOADER LOGIC ---

