(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var stage       = document.getElementById("stage");
  var hit         = document.getElementById("hit");
  var reset       = document.getElementById("reset");
  var screenEl    = document.getElementById("screen");
  var video       = document.getElementById("giftVideo");
  var burst       = document.querySelector(".gift__burst");
  var driftHost   = document.getElementById("driftPetals");

  var isOpen = false;

  /* ---------- ambient drifting petals ---------- */
  function seedDrift() {
    if (reduce || !driftHost) return;
    var count = 14;
    for (var i = 0; i < count; i++) {
      var p = document.createElement("span");
      p.className = "petal-drift";
      var size = 10 + Math.random() * 12;
      p.style.left = (Math.random() * 100) + "%";
      p.style.setProperty("--sz", size + "px");
      p.style.setProperty("--dx", (Math.random() * 120 - 60) + "px");
      p.style.setProperty("--dr", (Math.random() * 540 - 180) + "deg");
      p.style.animationDuration = (11 + Math.random() * 12) + "s";
      p.style.animationDelay = (-Math.random() * 20) + "s";
      p.style.opacity = 0.35 + Math.random() * 0.4;
      driftHost.appendChild(p);
    }
  }

  /* ---------- burst of petals when the box opens ---------- */
  function burstPetals() {
    if (reduce || !burst) return;
    var count = 18;
    for (var i = 0; i < count; i++) {
      var p = document.createElement("span");
      p.className = "burst-petal";
      var angle = Math.random() * Math.PI * 2;
      var dist = 120 + Math.random() * 220;
      var size = 12 + Math.random() * 12;
      p.style.setProperty("--sz", size + "px");
      p.style.setProperty("--bx", Math.cos(angle) * dist + "px");
      p.style.setProperty("--by", (Math.sin(angle) * dist - 120) + "px");
      p.style.setProperty("--br", (Math.random() * 720 - 360) + "deg");
      p.style.animationDelay = (Math.random() * 0.12) + "s";
      burst.appendChild(p);
      /* force reflow so the animation class always fires */
      void p.offsetWidth;
      p.classList.add("go");
    }
    window.setTimeout(function () {
      while (burst.firstChild) burst.removeChild(burst.firstChild);
    }, 1600);
  }

  /* ---------- video wiring ---------- */
  if (video) {
    video.addEventListener("loadeddata", function () {
      screenEl.classList.add("has-video");
    });
    video.addEventListener("loadedmetadata", function () {
      if (video.videoWidth && video.videoHeight) {
        screenEl.querySelector(".screen__frame").style.setProperty(
          "--vid-ar", video.videoWidth + " / " + video.videoHeight
        );
      }
    });
    /* missing file -> keep the friendly placeholder, no console noise */
    video.addEventListener("error", function () {}, true);
  }

  /* ---------- open / close ---------- */
  function openGift() {
    if (isOpen) return;
    isOpen = true;
    stage.classList.add("is-open");
    reset.hidden = false;
    burstPetals();

    if (video) {
      video.currentTime = 0;
      video.muted = false;
      var pr = video.play();
      if (pr && pr.catch) {
        pr.catch(function () {
          /* autoplay-with-sound blocked: fall back to muted playback */
          video.muted = true;
          video.play().catch(function () {});
        });
      }
    }

    /* let the screen finish rising, then hand it native controls */
    window.setTimeout(function () {
      if (!isOpen) return;
      screenEl.style.pointerEvents = "auto";
      if (video) video.setAttribute("controls", "");
    }, reduce ? 0 : 950);
  }

  function closeGift() {
    if (!isOpen) return;
    isOpen = false;
    stage.classList.remove("is-open");
    reset.hidden = true;
    screenEl.style.pointerEvents = "none";
    if (video) {
      video.removeAttribute("controls");
      video.pause();
      video.currentTime = 0;
    }
  }

  hit.addEventListener("click", openGift);
  reset.addEventListener("click", closeGift);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen) closeGift();
  });

  seedDrift();
})();
