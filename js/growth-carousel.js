(() => {
  // --- CONFIG ---------------------------------------------------------------
  // If your folder has a space, either rename to "SunflowerLevels" OR
  // keep the space but encode it below as %20.
  const FOLDER = "sunflower levels"; // using the actual folder name
  const COUNT  = 10;
  const SPEED_PX_PER_SEC = 80;   // auto-scroll speed
  const RESUME_DELAY_MS   = 200; // after user releases

  // Build source list Level 1..10
  const IMAGES = Array.from({ length: COUNT }, (_, i) =>
    `${FOLDER}/Level ${i + 1}.png`
  );

  // --- DOM ------------------------------------------------------------------
  const marquee = document.getElementById("growthMarquee");
  const track   = document.getElementById("growthTrack");

  if (!marquee || !track) return;

  // --- STATE ----------------------------------------------------------------
  let logicalSetWidth = 0;  // width of a single 1..10 set in px
  let pos = 0;              // current translateX
  let lastTs = performance.now();
  let auto = true;
  let dragging = false;
  let dragStartX = 0;
  let dragStartPos = 0;
  let gapPx = 0;            // computed gap between items

  // --- HELPERS --------------------------------------------------------------
  function createCard(src, index) {
    const card = document.createElement("div");
    card.className = "growth-card";
    const img = document.createElement("img");
    img.loading = "lazy";
    img.decoding = "async";
    img.alt = `Sunflower Level ${((index % COUNT) + 1)}`;
    img.src = src;
    card.appendChild(img);
    return card;
  }

  function loadSet() {
    track.innerHTML = "";
    IMAGES.forEach((src, i) => track.appendChild(createCard(src, i)));
  }

  function getGapPx() {
    const styles = getComputedStyle(track);
    const gap = styles.columnGap || styles.gap || "0px";
    return parseFloat(gap);
  }

  function measureLogicalSet() {
    // sum widths of the first 10 items + gaps
    let w = 0;
    const firstTen = Array.from(track.children).slice(0, COUNT);
    firstTen.forEach((el, idx) => {
      const rect = el.getBoundingClientRect();
      w += rect.width;
      if (idx < firstTen.length - 1) w += gapPx;
    });
    logicalSetWidth = Math.round(w);
  }

  function ensureClones() {
    // Clone until track width exceeds 2× container width (for seamless wrap)
    const minWidth = marquee.clientWidth * 2;
    while (track.scrollWidth < minWidth) {
      IMAGES.forEach((src, i) => track.appendChild(createCard(src, i)));
    }
  }

  function wrapWithinSet(x) {
    if (!logicalSetWidth) return x;
    // keep pos in [-logicalSetWidth, 0)
    while (x <= -logicalSetWidth) x += logicalSetWidth;
    while (x > 0)               x -= logicalSetWidth;
    return x;
  }

  // --- RAF LOOP -------------------------------------------------------------
  function frame(ts) {
    const dt = Math.min(64, ts - lastTs) / 1000; // clamp delta for safety
    lastTs = ts;

    if (auto && !dragging && logicalSetWidth > 0) {
      pos -= SPEED_PX_PER_SEC * dt;
      pos = wrapWithinSet(pos);
      track.style.transform = `translate3d(${pos}px,0,0)`;
    }
    requestAnimationFrame(frame);
  }

  // --- DRAG HANDLERS --------------------------------------------------------
  function onPointerDown(e) {
    dragging = true;
    auto = false;
    marquee.classList.add("dragging");
    dragStartX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
    dragStartPos = pos;

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp, { once: true });
  }

  function onPointerMove(e) {
    const x = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
    const dx = x - dragStartX;
    pos = wrapWithinSet(dragStartPos + dx);
    track.style.transform = `translate3d(${pos}px,0,0)`;
  }

  function onPointerUp() {
    dragging = false;
    marquee.classList.remove("dragging");

    // Respect reduced motion: don't resume if user prefers no motion
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!rm.matches) {
      setTimeout(() => (auto = true), RESUME_DELAY_MS);
    }

    window.removeEventListener("pointermove", onPointerMove);
  }

  // --- INIT -----------------------------------------------------------------
  function init() {
    loadSet();

    // Wait for images to settle, then measure & clone
    const imgs = Array.from(track.querySelectorAll("img"));
    let loaded = 0;
    const done = () => {
      gapPx = getGapPx();
      measureLogicalSet();
      ensureClones();
      // reset position safely after building
      pos = wrapWithinSet(pos);
      track.style.transform = `translate3d(${pos}px,0,0)`;
    };

    if (imgs.length === 0) {
      done();
    } else {
      imgs.forEach((img) => {
        if (img.complete) {
          if (++loaded === imgs.length) done();
        } else {
          img.addEventListener("load", () => {
            if (++loaded === imgs.length) done();
          });
          img.addEventListener("error", () => {
            if (++loaded === imgs.length) done();
          });
        }
      });
    }

    marquee.addEventListener("pointerdown", onPointerDown);
    marquee.addEventListener("touchstart", (e) => onPointerDown(e.touches[0]), { passive: true });

    // Pause motion for reduced-motion users
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    auto = !rm.matches;

    requestAnimationFrame((t) => {
      lastTs = t;
      requestAnimationFrame(frame);
    });

    // Rebuild on resize (debounced)
    let to;
    window.addEventListener("resize", () => {
      clearTimeout(to);
      to = setTimeout(() => {
        loadSet();
        init(); // rebuild safely
      }, 150);
    }, { passive: true });
  }

  // kick off
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
