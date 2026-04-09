/* ════════════════════════════════════════════════════════════
   Design Token Forge — Shared Demo JS
   Nav dropdown, theme toggle, sidebar IntersectionObserver.
   Each page can set  window.DTF.onThemeChange = fn;
   to hook into theme switches (e.g. refresh an inspector).
   ════════════════════════════════════════════════════════════ */

window.DTF = window.DTF || { onThemeChange: null };

/* ── Project Selector (injected into nav bar on every page) ── */
(function(){
  /* color-system.html has its own dedicated project bar — skip it there */
  var path = location.pathname;
  var filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  if (filename === 'color-system.html') return;

  var nav = document.querySelector('.nav-actions');
  if (!nav) return;

  /* Determine base URL: ../status.json for demo pages, ./status.json for root */
  var depth = (location.pathname.indexOf('/demo/') !== -1) ? '..' : '.';
  var statusUrl = depth + '/status.json?_cb=' + Date.now();
  var projectsUrl = depth + '/projects.json?_cb=' + Date.now();

  /* Build DOM */
  var wrap = document.createElement('div');
  wrap.className = 'nav-project';
  var label = document.createElement('span');
  label.className = 'nav-project-label';
  label.textContent = 'Project';
  var sel = document.createElement('select');
  sel.innerHTML = '<option>…</option>';
  var newBtn = document.createElement('button');
  newBtn.className = 'nav-project-new';
  newBtn.type = 'button';
  newBtn.textContent = '+ New';
  newBtn.addEventListener('click', function() {
    window.location.href = 'color-system.html?new-project=1';
  });
  wrap.appendChild(label);
  wrap.appendChild(sel);
  wrap.appendChild(newBtn);

  /* Insert before theme toggle */
  var toggle = document.getElementById('themeToggle');
  if (toggle) nav.insertBefore(wrap, toggle);
  else nav.appendChild(wrap);

  /* Load current project from status, then load project list */
  var currentId = '';
  fetch(statusUrl).then(function(r){ return r.json(); }).then(function(d){
    if (d.project && d.project.id) currentId = d.project.id;
    return fetch(projectsUrl);
  }).then(function(r){ return r.json(); }).then(function(list){
    if (!list || !list.length) { sel.innerHTML = '<option>(none)</option>'; return; }
    sel.innerHTML = '';
    for (var i = 0; i < list.length; i++) {
      var opt = document.createElement('option');
      opt.value = list[i].id;
      opt.textContent = list[i].name;
      if (list[i].id === currentId) opt.selected = true;
      sel.appendChild(opt);
    }
  }).catch(function(){ sel.innerHTML = '<option>(offline)</option>'; });
})();

/* ── Inject Saved Color Tokens (from Color System page) ── */
(function(){
  var savedCSS = localStorage.getItem('dtf-saved-tokens');
  if (savedCSS) {
    var style = document.createElement('style');
    style.id = 'dtfSavedTokens';
    style.textContent = savedCSS;
    document.head.appendChild(style);
  }
})();

/* ── Disabled Roles (brand-as-optional) ── */
(function(){
  window.DTF.disabledRoles = [];
  try {
    var raw = localStorage.getItem('dtf-color-config');
    if (raw) {
      var cfg = JSON.parse(raw);
      if (cfg.disabledRoles && cfg.disabledRoles.length) {
        window.DTF.disabledRoles = cfg.disabledRoles;
        /* Hide pill buttons for disabled roles */
        var rules = '';
        for (var i = 0; i < cfg.disabledRoles.length; i++) {
          var rid = cfg.disabledRoles[i];
          rules += '[data-ctrl-role="' + rid + '"]{display:none !important}\n';
        }
        var s = document.createElement('style');
        s.id = 'dtfDisabledRoles';
        s.textContent = rules;
        document.head.appendChild(s);
        /* Remove disabled-role options from selects after DOM ready */
        document.addEventListener('DOMContentLoaded', function() {
          var disabled = window.DTF.disabledRoles;
          for (var d = 0; d < disabled.length; d++) {
            var opts = document.querySelectorAll('option[value="' + disabled[d] + '"]');
            for (var o = 0; o < opts.length; o++) opts[o].remove();
          }
        });
      }
    }
  } catch(e){}
})();

/* ── Nav Dropdown — now handled by nav.js ── */

/* ── Theme Toggle (persisted across pages via localStorage) ── */
(function(){
  var STORAGE_KEY='dtf-theme';
  var html=document.documentElement;
  var toggle=document.getElementById('themeToggle');

  /* Restore saved preference on load */
  var saved=localStorage.getItem(STORAGE_KEY);
  if(saved==='dark'){
    html.setAttribute('data-theme','dark');
    if(toggle) toggle.textContent='Toggle Light';
  } else {
    html.removeAttribute('data-theme');
    if(toggle) toggle.textContent='Toggle Dark';
  }

  if(!toggle) return;
  toggle.addEventListener('click',function(){
    var isDark=html.getAttribute('data-theme')==='dark';
    if(isDark){html.removeAttribute('data-theme');toggle.textContent='Toggle Dark';localStorage.setItem(STORAGE_KEY,'light');}
    else{html.setAttribute('data-theme','dark');toggle.textContent='Toggle Light';localStorage.setItem(STORAGE_KEY,'dark');}
    if(typeof window.DTF.onThemeChange==='function'){
      requestAnimationFrame(window.DTF.onThemeChange);
    }
  });
})();

/* ── Sidebar IntersectionObserver ─────────────────────── */
(function(){
  var sideLinks=document.querySelectorAll('#sidebarNav a');
  var sectionEls=[];
  sideLinks.forEach(function(a){var t=document.querySelector(a.getAttribute('href'));if(t)sectionEls.push(t);});
  if(sectionEls.length&&window.IntersectionObserver){
    var obs=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        var link=document.querySelector('#sidebarNav a[href="#'+e.target.id+'"]');
        if(!link)return;
        if(e.isIntersecting)link.classList.add('active');
        else link.classList.remove('active');
      });
    },{rootMargin:'-100px 0px -60% 0px',threshold:0});
    sectionEls.forEach(function(s){obs.observe(s);});
  }

  /* ── Framework snippet tabs ──────────────────────── */
  document.addEventListener('click', function(e) {
    var tab = e.target.closest('.fw-snippet-tab');
    if (!tab) return;
    var container = tab.closest('.fw-snippet');
    if (!container) return;
    container.querySelectorAll('.fw-snippet-tab').forEach(function(t) { t.setAttribute('aria-selected', 'false'); });
    tab.setAttribute('aria-selected', 'true');
    container.querySelectorAll('.fw-snippet-code').forEach(function(c) { c.removeAttribute('data-active'); });
    var panel = container.querySelector('.fw-snippet-code[data-panel="' + tab.dataset.tab + '"]');
    if (panel) panel.setAttribute('data-active', '');
  });
})();

/* ── Reactive Framework Snippets ─────────────────────── */
/* Syncs code-snippet variant/size/shape values to the active pill-bar. */
(function(){
  var snippets = document.querySelectorAll('.fw-snippet-code');
  if (!snippets.length) return;

  /* Store original text as immutable template */
  snippets.forEach(function(el){ el.dataset.tpl = el.textContent; });

  function activeVal(axis){
    var el = document.querySelector('[data-ctrl-'+axis+'][aria-pressed="true"]');
    return el ? el.getAttribute('data-ctrl-'+axis) : '';
  }

  /* Boolean-like pill: true only when the "true" option is pressed */
  function isBoolPillActive(attr){
    var el = document.querySelector('[data-ctrl-'+attr+'="true"][aria-pressed="true"]');
    return !!el;
  }

  /* Toggle a line containing `needle` — strip when hide=true, restore from tpl when show */
  function toggleLine(text, needle, hide){
    if(hide) return text.replace(new RegExp('\\n[^\\n]*'+needle.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'[^\\n]*','g'), '');
    return text;
  }

  /* Replace a hardcoded value for a given data attr in the HTML panel */
  function replaceHtmlAttr(text, attr, val){
    var re = new RegExp(attr+'="[^"]*"','g');
    return text.replace(re, attr+'="'+val+'"');
  }

  /* Replace the Vue ?? 'default' fallback */
  function replaceVueDefault(text, prop, val){
    var re = new RegExp("("+prop+"\\s*\\?\\?\\s*)'[^']*'","g");
    return text.replace(re, "$1'"+val+"'");
  }

  function sync(){
    var v = activeVal('variant');
    var s = activeVal('size');
    var h = activeVal('height');           /* textarea only */
    var rounded = isBoolPillActive('rounded');
    /* For toggle/checkbox/radio: variant "" = default (hide), "outlined" = show */
    var emptyVariant = (v === '');
    /* Does this page even have a variant bar? */
    var hasVariantBar = !!document.getElementById('variantBar');

    snippets.forEach(function(el){
      var t = el.dataset.tpl;
      var p = el.dataset.panel;

      if(p==='html'){
        /* Variant: update value or inject/strip for empty-default components */
        if(v) t = replaceHtmlAttr(t, 'data-variant', v);
        if(emptyVariant) t = t.replace(/\s*data-variant="[^"]*"/g, '');
        /* Size */
        t = replaceHtmlAttr(t, 'data-size', s);
        /* Height (textarea) */
        if(h) t = replaceHtmlAttr(t, 'data-height', h);
        /* Rounded: boolean toggle */
        if(rounded && t.indexOf('data-rounded') === -1){
          t = t.replace(/(data-size="[^"]*")/, '$1 data-rounded');
        } else if(!rounded){
          t = t.replace(/\s*data-rounded/g, '');
        }
        /* Variant inject for toggle/checkbox/radio HTML when "outlined" selected */
        if(v && hasVariantBar && t.indexOf('data-variant') === -1){
          t = t.replace(/(data-size="[^"]*")/, '$1 data-variant="'+v+'"');
        }

      } else if(p==='vue'){
        if(v) t = replaceVueDefault(t, 'variant', v);
        t = replaceVueDefault(t, 'size', s);
        if(h) t = replaceVueDefault(t, 'height', h);
        /* Conditional lines: hide when inactive */
        if(!rounded) t = toggleLine(t, ':data-rounded', true);
        /* For variant || undefined pattern (toggle/checkbox/radio): hide when empty */
        if(emptyVariant) t = toggleLine(t, ':data-variant', true);

      } else if(p==='react'){
        /* Conditional lines: hide when inactive */
        if(!rounded) t = toggleLine(t, 'data-rounded', true);
        if(emptyVariant) t = toggleLine(t, 'data-variant', true);
      }

      el.textContent = t;
    });
  }

  /* Defer to run after each page's own pill-bar click handler */
  ['variantBar','sizeBar','roundedBar','heightBar'].forEach(function(id){
    var bar = document.getElementById(id);
    if(bar) bar.addEventListener('click', function(e){
      if(e.target.closest('.pill')) setTimeout(sync, 0);
    });
  });
})();
