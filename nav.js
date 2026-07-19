/* ============================================================
   nav.js — shared navigation menu for the Kitab Tajwid site
   Include this on every page with:
     <script src="nav.js"></script>
   It injects a 3-line burger button at the leftmost side of the
   header bar (before the logo), which opens a dropdown listing
   every html page in the site.

   To add a new page later: add one object to NAV_PAGES below.
   ============================================================ */

const NAV_PAGES = [
  { href: "46.html",   title: "Hukum Membaca al-Quran atas Orang yang Berhadas", pages: "ms. 46-48" },
  { href: "49.html",   title: "Hukum Menyentuh al-Quran atas Orang yang Berhadas", pages: "ms. 49-51" },
  { href: "110.html",   title: "Hukum Isti'adzah", pages: "ms. 110–114" },
  { href: "115.html",   title: "Hukum Basmalah", pages: "ms. 115–119" },
  { href: "156.html",   title: "Idgham Mutamathilain, Mutaqaribain & Mutajanisain", pages: "ms. 156–163" },
  { href: "182.html", title: "Martabat Mad Far'ie", pages: "ms. 182–187" },
  { href: "index.html", title: "Qashr pada Mad Jaiz Munfashil", pages: "ms. 188–190" },
  { href: "191.html", title: "Huruf-huruf Pembukaan Surah", pages: "ms. 191–195" },
  { href: "203.html", title: "Hukum Ra'", pages: "ms. 203-211" },
  { href: "254.html", title: "Waqaf Jibril", pages: "ms. 254-256" },
  { href: "257.html", title: "Hukum Waqaf pada Akhir Kalimah", pages: "ms. 257-258" },
  { href: "259.html", title: "Kesimpulan Wajah-Wajah Waqaf", pages: "ms. 259-265" },
  { href: "284.html", title: "Hukum Kalimah-Kalimah Khas", pages: "ms. 284-285" },
  { href: "312.html", title: "Hukum Takbir", pages: "ms. 312-315" },
];

(function(){

  function currentFile(){
    const path = window.location.pathname.split("/").pop();
    return path === "" ? "index.html" : path;
  }

  function injectStyles(){
    const style = document.createElement("style");
    style.textContent = `
      .nav-burger{
        appearance:none; border:none; cursor:pointer;
        width:38px; height:38px; border-radius:10px;
        background:rgba(255,255,255,0.08);
        display:flex; flex-direction:column; align-items:center; justify-content:center;
        gap:4px; flex-shrink:0;
        transition:background .15s ease;
      }
      .nav-burger:hover{ background:rgba(255,255,255,0.16); }
      .nav-burger span{
        display:block; width:18px; height:2px; border-radius:2px;
        background:#EFF7F3; transition:transform .2s ease, opacity .2s ease;
      }
      .nav-burger.open span:nth-child(1){ transform:translateY(6px) rotate(45deg); }
      .nav-burger.open span:nth-child(2){ opacity:0; }
      .nav-burger.open span:nth-child(3){ transform:translateY(-6px) rotate(-45deg); }

      .nav-wrap{ position:relative; display:flex; align-items:center; }

      .nav-dropdown{
        position:absolute; top:calc(100% + 12px); left:0;
        min-width:320px;
        max-height:420px;
        display:flex; flex-direction:column;
        background: linear-gradient(180deg, #123B35 0%, #0B2D28 100%);
        border:1px solid rgba(255,255,255,0.12);
        border-radius:14px;
        padding:10px;
        box-shadow: 0 16px 36px -12px rgba(0,0,0,0.45);
        opacity:0; visibility:hidden; transform:translateY(-6px);
        transition: opacity .15s ease, transform .15s ease, visibility .15s ease;
        z-index:200;
      }
      .nav-dropdown.open{ opacity:1; visibility:visible; transform:translateY(0); }

      .nav-search{
        display:flex; align-items:center; gap:8px;
        background:rgba(255,255,255,0.07);
        border:1px solid rgba(255,255,255,0.14);
        border-radius:10px;
        padding:9px 12px;
        margin-bottom:8px;
        flex-shrink:0;
      }
      .nav-search svg{ flex-shrink:0; opacity:0.6; }
      .nav-search input{
        appearance:none; border:none; outline:none; background:transparent;
        color:#F3FAF7; font-family:'Nunito', sans-serif; font-size:13.5px;
        width:100%;
      }
      .nav-search input::placeholder{ color:#8FADA4; }

      .nav-list{ overflow-y:auto; display:flex; flex-direction:column; gap:3px; }
      .nav-empty{
        padding:14px 12px; font-family:'Nunito', sans-serif; font-size:13px;
        color:#8FADA4; text-align:center;
      }

      .nav-item{
        display:flex; align-items:flex-start; gap:10px;
        padding:10px 12px; border-radius:10px;
        text-decoration:none; color:#EFF7F3;
        border:1px solid transparent;
        transition:background .15s ease, border-color .15s ease;
      }
      .nav-item:hover{ background:rgba(255,255,255,0.08); }
      .nav-item.active{
        background:rgba(255,255,255,0.1);
        border-color:rgba(255,255,255,0.18);
      }
      .nav-item .nav-num{
        flex-shrink:0; margin-top:1px;
        font-family:'Nunito', sans-serif; font-size:12.5px; font-weight:700;
        color:#7FB5A4;
        min-width:18px;
      }
      .nav-item .nav-text{ display:flex; flex-direction:column; gap:3px; }
      .nav-item b{
        font-family:'Nunito', sans-serif; font-size:14px; font-weight:600;
        color:#F3FAF7; line-height:1.4; letter-spacing:0.1px;
      }
      .nav-item small{ font-size:11.5px; color:#9BC9BB; letter-spacing:0.2px; }

      @media (max-width:880px){
        .nav-dropdown{ min-width:270px; left:0; }
      }
    `;
    document.head.appendChild(style);
  }

  function renderList(dropdown, query){
    const active = currentFile();
    const q = (query || "").trim().toLowerCase();

    const filtered = NAV_PAGES
      .map((p, i) => ({ ...p, num: i + 1 }))
      .filter(p => !q || p.title.toLowerCase().includes(q) || p.pages.toLowerCase().includes(q));

    const list = dropdown.querySelector(".nav-list");

    if (filtered.length === 0){
      list.innerHTML = `<div class="nav-empty">Tiada topik sepadan.</div>`;
      return;
    }

    list.innerHTML = filtered.map(p => `
      <a class="nav-item ${p.href === active ? 'active' : ''}" href="${p.href}">
        <span class="nav-num">${p.num}.</span>
        <span class="nav-text">
          <b>${p.title}</b>
          <small>${p.pages}</small>
        </span>
      </a>
    `).join("");
  }

  function buildMarkup(){
    const wrap = document.createElement("div");
    wrap.className = "nav-wrap";

    const burger = document.createElement("button");
    burger.className = "nav-burger";
    burger.setAttribute("aria-label", "Buka menu navigasi");
    burger.innerHTML = "<span></span><span></span><span></span>";

    const dropdown = document.createElement("div");
    dropdown.className = "nav-dropdown";
    dropdown.innerHTML = `
      <div class="nav-search">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#EFF7F3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="text" placeholder="Cari topik..." autocomplete="off">
      </div>
      <div class="nav-list"></div>
    `;

    const searchInput = dropdown.querySelector("input");
    renderList(dropdown, "");
    searchInput.addEventListener("input", () => renderList(dropdown, searchInput.value));
    searchInput.addEventListener("click", (e) => e.stopPropagation());

    wrap.appendChild(burger);
    wrap.appendChild(dropdown);

    burger.addEventListener("click", (e) => {
      e.stopPropagation();
      const willOpen = !burger.classList.contains("open");
      burger.classList.toggle("open");
      dropdown.classList.toggle("open");
      if (willOpen){
        searchInput.value = "";
        renderList(dropdown, "");
        setTimeout(() => searchInput.focus(), 50);
      }
    });

    document.addEventListener("click", (e) => {
      if (!wrap.contains(e.target)){
        burger.classList.remove("open");
        dropdown.classList.remove("open");
      }
    });

    return wrap;
  }

  function mount(){
    const brand = document.querySelector(".brand");
    if (!brand){ return; }
    const nav = buildMarkup();
    brand.insertBefore(nav, brand.firstChild);
  }

  injectStyles();

  if (document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }

})();
