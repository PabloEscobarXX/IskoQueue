// ---------- State ----------
let activeCategory = "All";
let query = "";

// ---------- Elements ----------
const $cards = document.getElementById("cards");
const $count = document.getElementById("count");
const $chips = document.getElementById("chips");
const $search = document.getElementById("search");
const $listView = document.getElementById("list-view");
const $detailView = document.getElementById("detail-view");
const $home = document.getElementById("home");
const $results = document.getElementById("results");
const $craveForm = document.getElementById("crave-form");
const $craveInput = document.getElementById("crave-input");
const $suggest = document.getElementById("suggest");
const $homeCats = document.getElementById("home-cats");
const $auth = document.getElementById("auth");

// ---------- Map setup ----------
// PUP Sta. Mesa campus. The map is locked to this area.
const PUP_CENTER = [14.5978, 121.0113];
const PUP_BOUNDS = L.latLngBounds([14.5925, 121.0060], [14.6030, 121.0170]); // south-west, north-east corners

const map = L.map("map", {
  center: PUP_CENTER,
  zoom: 17,
  minZoom: 16,              // can't zoom out past the campus area
  maxZoom: 19,
  maxBounds: PUP_BOUNDS,    // can't drag away from the campus
  maxBoundsViscosity: 1.0,  // hard stop at the edge
});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

const markerLayer = L.layerGroup().addTo(map);

function makePin(stall) {
  return L.divIcon({
    className: "",
    html: `<div class="pin" style="background:${stall.color}"><span>${stall.emoji}</span></div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
  });
}

// ---------- Helpers ----------
function isOpenNow(stall) {
  const hour = new Date().getHours() + new Date().getMinutes() / 60;
  // handles places that close after midnight (e.g. open 18, close 4)
  return stall.open < stall.close
    ? hour >= stall.open && hour < stall.close
    : hour >= stall.open || hour < stall.close;
}

function formatHour(h) {
  const hh = h % 24;
  const suffix = hh >= 12 ? "PM" : "AM";
  const twelve = hh % 12 === 0 ? 12 : hh % 12;
  return `${twelve}:00 ${suffix}`;
}

const peso = (n) => "₱" + n.toLocaleString("en-PH");

function matches(stall) {
  const inCategory = activeCategory === "All" || stall.category === activeCategory;
  const q = query.trim().toLowerCase();
  if (!q) return inCategory;
  const inText =
    stall.name.toLowerCase().includes(q) ||
    stall.category.toLowerCase().includes(q) ||
    stall.area.toLowerCase().includes(q) ||
    stall.menu.some((m) => m.name.toLowerCase().includes(q));
  return inCategory && inText;
}

// ---------- Category chips ----------
function renderChips() {
  const categories = ["All", ...new Set(STALLS.map((s) => s.category))];
  $chips.innerHTML = "";
  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "chip";
    btn.textContent = cat;
    btn.setAttribute("aria-pressed", String(cat === activeCategory));
    btn.addEventListener("click", () => {
      activeCategory = cat;
      renderChips();
      renderList();
    });
    $chips.appendChild(btn);
  });
}

// ---------- List + markers ----------
function renderList() {
  const results = STALLS.filter(matches);

  $count.textContent = `${results.length} ${results.length === 1 ? "stall" : "stalls"} found`;
  $cards.innerHTML = "";
  markerLayer.clearLayers();

  if (results.length === 0) {
    $cards.innerHTML = `<li class="empty">No stalls match your search. Try a different dish or category.</li>`;
    return;
  }

  results.forEach((stall) => {
    // card
    const open = isOpenNow(stall);
    const li = document.createElement("li");
    li.innerHTML = `
      <button class="card" type="button">
        <div class="thumb" style="background:${stall.color}22">${stall.emoji}</div>
        <div>
          <h3>${stall.name}</h3>
          <div class="meta">${stall.category} · ${stall.area}</div>
          <div class="row">
            <span>★ ${stall.rating}</span>
            <span>${stall.eta}</span>
            <span>Delivery ${peso(stall.deliveryFee)}</span>
            <span class="status ${open ? "is-open" : "is-closed"}">${open ? "Open now" : "Closed"}</span>
          </div>
        </div>
      </button>`;
    li.querySelector("button").addEventListener("click", () => showDetail(stall));
    $cards.appendChild(li);

    // map marker
    L.marker([stall.lat, stall.lng], { icon: makePin(stall), title: stall.name })
      .addTo(markerLayer)
      .bindTooltip(stall.name)
      .on("click", () => showDetail(stall));
  });

  // zoom the map so every result is visible
  const bounds = L.latLngBounds(results.map((s) => [s.lat, s.lng]));
  map.fitBounds(bounds, { padding: [50, 50], maxZoom: 18 });
}

// ---------- Detail view (menu + location) ----------
function showDetail(stall) {
  const open = isOpenNow(stall);
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${stall.lat},${stall.lng}`;

  $detailView.innerHTML = `
    <button class="back" type="button">← Back to all stalls</button>
    <div class="hero" style="background:${stall.color}22">${stall.emoji}</div>
    <h2>${stall.name}</h2>
    <div class="meta">${stall.category} · ★ ${stall.rating}</div>
    <div class="row">
      <span class="status ${open ? "is-open" : "is-closed"}">${open ? "Open now" : "Closed"}</span>
      <span>${formatHour(stall.open)} – ${formatHour(stall.close)}</span>
    </div>
    <p class="meta">📍 ${stall.area}</p>
    <div class="actions">
      <a class="btn" href="${directions}" target="_blank" rel="noopener">Get directions</a>
    </div>
    <h3 class="menu-title">Menu</h3>
    <ul class="menu">
      ${stall.menu
        .map(
          (m) => `
        <li>
          <div>
            <div class="dish">${m.name}</div>
            ${m.desc ? `<div class="desc">${m.desc}</div>` : ""}
          </div>
          <div class="price">${peso(m.price)}</div>
        </li>`
        )
        .join("")}
    </ul>`;

  $detailView.querySelector(".back").addEventListener("click", showList);

  $listView.hidden = true;
  $detailView.hidden = false;
  document.getElementById("panel").scrollTop = 0;

  // zoom the map to this stall
  map.flyTo([stall.lat, stall.lng], 18, { duration: 0.8 });
}

function showList() {
  $detailView.hidden = true;
  $listView.hidden = false;
  renderList();
}

// ---------- Search ----------
$search.addEventListener("input", (e) => {
  query = e.target.value;
  if (!$detailView.hidden) {
    $detailView.hidden = true;
    $listView.hidden = false;
  }
  renderList();
});

// ---------- Home page <-> results page ----------
const SUGGESTIONS = ["Isaw", "Milk tea", "Silog", "Turon", "Lugaw", "Inihaw"];

function makeHomeChip(label, onClick) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "home-chip";
  btn.textContent = label;
  btn.addEventListener("click", onClick);
  return btn;
}

function renderHome() {
  $suggest.innerHTML = "";
  SUGGESTIONS.forEach((word) =>
    $suggest.appendChild(makeHomeChip(word, () => showResults({ q: word })))
  );

  $homeCats.innerHTML = "";
  [...new Set(STALLS.map((s) => s.category))].forEach((cat) =>
    $homeCats.appendChild(makeHomeChip(cat, () => showResults({ cat })))
  );
}

function showResults({ q = "", cat = "All" } = {}) {
  query = q;
  activeCategory = cat;
  $search.value = q;

  $home.hidden = true;
  $auth.hidden = true;
  $results.hidden = false;
  $detailView.hidden = true;
  $listView.hidden = false;

  map.invalidateSize(); // the map was hidden, so tell Leaflet its real size
  renderChips();
  renderList();
  window.scrollTo(0, 0);
}

function showHome() {
  $results.hidden = true;
  $auth.hidden = true;
  $home.hidden = false;
  $craveInput.value = "";
  $craveInput.focus();
}

$craveForm.addEventListener("submit", (e) => {
  e.preventDefault();
  showResults({ q: $craveInput.value });
});
document.getElementById("see-all").addEventListener("click", () => showResults());
document.getElementById("brand").addEventListener("click", showHome);

// ---------- Accounts ----------
// DEMO ONLY: accounts are saved in this browser's localStorage, so they only exist on
// this computer. A real site needs a backend + database to store accounts safely
// (e.g. Firebase Auth, or Node/Express with hashed passwords on a server).
const USERS_KEY = "kainan_users";
const SESSION_KEY = "kainan_session";

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || {}; } catch { return {}; }
}
function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }

function currentUser() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
}

async function hashPassword(password, salt) {
  if (!window.crypto || !crypto.subtle) {
    throw new Error("Open the site with Live Server (http://localhost) to use accounts.");
  }
  const data = new TextEncoder().encode(salt + password);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function randomSalt() {
  return [...crypto.getRandomValues(new Uint8Array(16))]
    .map((b) => b.toString(16).padStart(2, "0")).join("");
}

// "Log in" button, or "Hi, Name" + "Log out" (top right of home and results pages)
function renderAccount() {
  const user = currentUser();
  ["account-home", "account-results"].forEach((id) => {
    const box = document.getElementById(id);
    box.innerHTML = "";
    if (user) {
      const who = document.createElement("span");
      who.className = "who";
      who.textContent = "Hi, " + user.name.split(" ")[0]; // textContent keeps user input safe
      const out = document.createElement("button");
      out.type = "button";
      out.textContent = "Log out";
      out.addEventListener("click", () => {
        localStorage.removeItem(SESSION_KEY);
        renderAccount();
      });
      box.append(who, out);
    } else {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = "Log in";
      btn.addEventListener("click", () => showAuth("login"));
      box.appendChild(btn);
    }
  });
}

const $loginForm = document.getElementById("login-form");
const $signupForm = document.getElementById("signup-form");
const $authMsg = document.getElementById("auth-msg");
let viewBeforeAuth = "home";

function setAuthMode(mode) {
  const login = mode === "login";
  $loginForm.hidden = !login;
  $signupForm.hidden = login;
  document.getElementById("tab-login").setAttribute("aria-pressed", String(login));
  document.getElementById("tab-signup").setAttribute("aria-pressed", String(!login));
  document.getElementById("auth-title").textContent = login ? "Log in" : "Create account";
  document.getElementById("auth-sub").textContent = login ? "Welcome back." : "Sign up to get started.";
  $authMsg.textContent = "";
  $authMsg.className = "form-msg";
}

function showAuth(mode = "login") {
  viewBeforeAuth = $results.hidden ? "home" : "results";
  $home.hidden = true;
  $results.hidden = true;
  $auth.hidden = false;
  setAuthMode(mode);
  (mode === "login" ? $loginForm : $signupForm).querySelector("input").focus();
}

function leaveAuth() {
  $auth.hidden = true;
  if (viewBeforeAuth === "results") {
    $results.hidden = false;
    map.invalidateSize();
  } else {
    $home.hidden = false;
  }
}

function authError(msg) {
  $authMsg.textContent = msg;
  $authMsg.className = "form-msg";
}

$loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const email = document.getElementById("login-email").value.trim().toLowerCase();
    const password = document.getElementById("login-password").value;
    const user = getUsers()[email];
    const ok = user && (await hashPassword(password, user.salt)) === user.hash;
    if (!ok) return authError("Incorrect email or password.");

    localStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, email }));
    $loginForm.reset();
    renderAccount();
    leaveAuth();
  } catch (err) {
    authError(err.message);
  }
});

$signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim().toLowerCase();
    const password = document.getElementById("signup-password").value;

    const users = getUsers();
    if (users[email]) return authError("That email already has an account. Try logging in.");

    const salt = randomSalt();
    users[email] = { name, salt, hash: await hashPassword(password, salt) };
    saveUsers(users);

    localStorage.setItem(SESSION_KEY, JSON.stringify({ name, email }));
    $signupForm.reset();
    renderAccount();
    leaveAuth();
  } catch (err) {
    authError(err.message);
  }
});

document.getElementById("tab-login").addEventListener("click", () => setAuthMode("login"));
document.getElementById("tab-signup").addEventListener("click", () => setAuthMode("signup"));
document.getElementById("auth-back").addEventListener("click", leaveAuth);

// ---------- Start ----------
renderHome();
renderAccount();
$craveInput.focus();
