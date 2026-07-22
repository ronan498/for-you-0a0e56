(function () {
  "use strict";

  /* ============================================================
     THE SCHEDULE  —  edit here.
     Each day unlocks on its date (in HER local time), so a new
     one is waiting when she wakes up. Drop assets/dayN.mp4 for
     each. A day stays locked until its date arrives.
     ============================================================ */
  var ARRIVAL = "2026-07-31"; // the morning you land in NYC
  var DAYS = [
    { n: 1, date: "2026-07-22", src: "assets/day1.mp4" },
    { n: 2, date: "2026-07-23", src: "assets/day2.mp4" },
    { n: 3, date: "2026-07-24", src: "assets/day3.mp4" },
    { n: 4, date: "2026-07-25", src: "assets/day4.mp4" },
    { n: 5, date: "2026-07-26", src: "assets/day5.mp4" },
    { n: 6, date: "2026-07-27", src: "assets/day6.mp4" },
    { n: 7, date: "2026-07-28", src: "assets/day7.mp4" },
    { n: 8, date: "2026-07-29", src: "assets/day8.mp4" },
    { n: 9, date: "2026-07-30", src: "assets/day9.mp4" }
  ];
  /* ============================================================ */

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var WATCHED_KEY = "fy_watched_v1";

  var stage       = document.getElementById("stage");
  var calendarEl  = document.getElementById("calendar");
  var countdownEl = document.getElementById("countdown");
  var driftHost   = document.getElementById("driftPetals");

  var reveal      = document.getElementById("reveal");
  var scrim       = document.getElementById("scrim");
  var revealLabel = document.getElementById("revealLabel");
  var screenEl    = document.getElementById("screen");
  var video       = document.getElementById("giftVideo");
  var placeholder = document.getElementById("placeholderText");
  var burst       = document.querySelector(".gift__burst");
  var resetBtn    = document.getElementById("reset");

  var isOpen = false;
  var clearing = false;
  var lastFocused = null;

  /* ---------- date helpers (local time) ---------- */
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function parseLocal(s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function todayStr() { var d = new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function isUnlocked(day) { return todayStr() >= day.date; }        // YYYY-MM-DD compares chronologically
  function weekday(s) { return parseLocal(s).toLocaleDateString("en-US", { weekday: "short" }); }
  function monthDay(s) { return parseLocal(s).toLocaleDateString("en-US", { month: "short", day: "numeric" }); }

  /* ---------- watched state ---------- */
  function getWatched() {
    try { return JSON.parse(localStorage.getItem(WATCHED_KEY)) || []; } catch (e) { return []; }
  }
  function markWatched(n) {
    try {
      var w = getWatched();
      if (w.indexOf(n) === -1) { w.push(n); localStorage.setItem(WATCHED_KEY, JSON.stringify(w)); }
    } catch (e) {}
  }

  /* ---------- countdown ---------- */
  function renderCountdown() {
    var days = Math.round((parseLocal(ARRIVAL) - parseLocal(todayStr())) / 86400000);
    var txt;
    if (days > 1) txt = days + " mornings until New York";
    else if (days === 1) txt = "one more morning until New York";
    else if (days === 0) txt = "New York, today";
    else txt = "I'm with you in New York";
    countdownEl.textContent = txt;
  }

  /* ---------- calendar ---------- */
  function newestUnlocked() {
    var newest = null;
    for (var i = 0; i < DAYS.length; i++) { if (isUnlocked(DAYS[i])) newest = DAYS[i]; }
    return newest;
  }

  function renderCalendar() {
    var watched = getWatched();
    var newest = newestUnlocked();
    calendarEl.innerHTML = "";

    DAYS.forEach(function (day) {
      var unlocked = isUnlocked(day);
      var isWatched = watched.indexOf(day.n) !== -1;
      var isNew = unlocked && newest && day.n === newest.n && !isWatched;

      var li = document.createElement("li");
      li.className = "day " + (unlocked ? "is-unlocked" : "is-locked");
      if (isWatched) li.className += " is-watched";
      if (isNew) li.className += " is-new";

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "card";

      var box = document.createElement("div");
      box.className = "card__box";
      var num = document.createElement("span");
      num.className = "card__num";
      num.textContent = day.n;
      box.appendChild(num);
      if (!unlocked) {
        var lock = document.createElement("span");
        lock.className = "card__lock";
        lock.textContent = "🔒";
        lock.setAttribute("aria-hidden", "true");
        box.appendChild(lock);
      }

      var meta = document.createElement("div");
      meta.className = "card__meta";
      var dEl = document.createElement("span");
      dEl.className = "card__day";
      dEl.textContent = "Day " + day.n;
      var dateEl = document.createElement("span");
      dateEl.className = "card__date";
      dateEl.textContent = unlocked ? (weekday(day.date) + " · " + monthDay(day.date)) : ("opens " + weekday(day.date));
      meta.appendChild(dEl);
      meta.appendChild(dateEl);

      btn.appendChild(box);
      btn.appendChild(meta);

      if (isNew) {
        var badge = document.createElement("span");
        badge.className = "card__badge";
        badge.textContent = "new";
        btn.appendChild(badge);
      }

      if (unlocked) {
        btn.setAttribute("aria-label", "Open day " + day.n);
        btn.addEventListener("click", function () { lastFocused = btn; openDay(day); });
      } else {
        btn.disabled = true;
        btn.setAttribute("aria-label", "Day " + day.n + ", opens " + weekday(day.date) + " " + monthDay(day.date));
      }

      li.appendChild(btn);
      calendarEl.appendChild(li);
    });
  }

  /* ---------- ambient + burst petals ---------- */
  function seedDrift() {
    if (reduce || !driftHost) return;
    for (var i = 0; i < 14; i++) {
      var p = document.createElement("span");
      p.className = "petal-drift";
      p.style.left = (Math.random() * 100) + "%";
      p.style.setProperty("--sz", (10 + Math.random() * 12) + "px");
      p.style.setProperty("--dx", (Math.random() * 120 - 60) + "px");
      p.style.setProperty("--dr", (Math.random() * 540 - 180) + "deg");
      p.style.animationDuration = (11 + Math.random() * 12) + "s";
      p.style.animationDelay = (-Math.random() * 20) + "s";
      p.style.opacity = 0.35 + Math.random() * 0.4;
      driftHost.appendChild(p);
    }
  }
  function burstPetals() {
    if (reduce || !burst) return;
    for (var i = 0; i < 18; i++) {
      var p = document.createElement("span");
      p.className = "burst-petal";
      var a = Math.random() * Math.PI * 2, d = 120 + Math.random() * 220;
      p.style.setProperty("--sz", (12 + Math.random() * 12) + "px");
      p.style.setProperty("--bx", Math.cos(a) * d + "px");
      p.style.setProperty("--by", (Math.sin(a) * d - 120) + "px");
      p.style.setProperty("--br", (Math.random() * 720 - 360) + "deg");
      p.style.animationDelay = (Math.random() * 0.12) + "s";
      burst.appendChild(p);
      void p.offsetWidth;
      p.classList.add("go");
    }
    window.setTimeout(function () { while (burst.firstChild) burst.removeChild(burst.firstChild); }, 1600);
  }

  /* ---------- video wiring ---------- */
  video.addEventListener("loadeddata", function () { screenEl.classList.add("has-video"); });
  video.addEventListener("loadedmetadata", function () {
    if (video.videoWidth && video.videoHeight) {
      screenEl.querySelector(".screen__frame").style.setProperty("--vid-ar", video.videoWidth + " / " + video.videoHeight);
    }
  });
  video.addEventListener("error", function () {
    if (clearing || reveal.hidden) return;         // ignore teardown / not-open errors
    placeholder.textContent = "this one is on its way 🤍";
  });

  /* ---------- open / close ---------- */
  function openDay(day) {
    if (isOpen) return;
    isOpen = true;

    revealLabel.textContent = "Day " + day.n;
    screenEl.classList.remove("has-video");
    placeholder.textContent = "opening…";
    screenEl.querySelector(".screen__frame").style.setProperty("--vid-ar", "9 / 16");

    clearing = false;
    video.src = day.src;
    video.load();

    reveal.hidden = false;
    document.body.classList.add("modal-open");
    void reveal.offsetWidth;               // reflow so the transition plays
    reveal.classList.add("is-open");
    burstPetals();

    video.currentTime = 0;
    video.muted = false;
    var pr = video.play();
    if (pr && pr.catch) { pr.catch(function () { video.muted = true; video.play().catch(function () {}); }); }

    markWatched(day.n);
    renderCalendar();

    window.setTimeout(function () {
      if (!isOpen) return;
      screenEl.style.pointerEvents = "auto";
      video.setAttribute("controls", "");
      resetBtn.focus();
    }, reduce ? 0 : 950);
  }

  function closeReveal() {
    if (!isOpen) return;
    isOpen = false;
    reveal.classList.remove("is-open");
    video.pause();
    video.removeAttribute("controls");
    screenEl.style.pointerEvents = "none";

    window.setTimeout(function () {
      reveal.hidden = true;
      document.body.classList.remove("modal-open");
      clearing = true;
      video.removeAttribute("src");
      video.load();
      if (lastFocused) { try { lastFocused.focus(); } catch (e) {} }
    }, reduce ? 0 : 820);
  }

  resetBtn.addEventListener("click", closeReveal);
  scrim.addEventListener("click", closeReveal);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && isOpen) closeReveal(); });

  /* ---------- go ---------- */
  renderCountdown();
  renderCalendar();
  seedDrift();
})();
