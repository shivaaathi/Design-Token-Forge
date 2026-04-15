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

  /* Load current project from localStorage (synced by Color System editor) */
  var currentId = localStorage.getItem('dtf-active-project') || '';

  function populateSelect(list) {
    if (!list || !list.length) { sel.innerHTML = '<option>(none)</option>'; return; }
    sel.innerHTML = '';
    for (var i = 0; i < list.length; i++) {
      var opt = document.createElement('option');
      opt.value = list[i].id;
      opt.textContent = list[i].name || list[i].id;
      if (list[i].id === currentId) opt.selected = true;
      sel.appendChild(opt);
    }
  }

  /* Primary source: localStorage knownProjects (set by color-system.html) */
  var knownRaw = localStorage.getItem('dtf-known-projects');
  var knownList = null;
  try { knownList = JSON.parse(knownRaw); } catch(e) {}
  if (knownList && knownList.length) {
    populateSelect(knownList);
  }

  /* Also try fetching from status/projects endpoints as fallback */
  fetch(statusUrl).then(function(r){ return r.json(); }).then(function(d){
    if (d.project && d.project.id && !currentId) currentId = d.project.id;
    return fetch(projectsUrl);
  }).then(function(r){ return r.json(); }).then(function(list){
    /* Merge with localStorage list — remote may have additional or renamed entries */
    if (list && list.length && (!knownList || !knownList.length)) {
      populateSelect(list);
    }
  }).catch(function(){
    if (!knownList || !knownList.length) sel.innerHTML = '<option>(offline)</option>';
  });

  /* When user switches project, update active and reload tokens */
  sel.addEventListener('change', function() {
    var newId = sel.value;
    if (!newId) return;
    localStorage.setItem('dtf-active-project', newId);

    /* ── On deployed per-project sites, navigate to the other project's URL ── */
    var loc = location.pathname;
    /* Check if current URL contains a project slug right before /demo/ */
    var knownIds = (knownList || []).map(function(p) { return p.id; });
    var segments = loc.split('/');
    var demoIdx = segments.lastIndexOf('demo');
    if (demoIdx > 0) {
      var curSlug = segments[demoIdx - 1];
      /* Only redirect if curSlug is a known project ID (not repo name, not 'dist') */
      if (curSlug && curSlug !== newId && knownIds.indexOf(curSlug) !== -1) {
        segments[demoIdx - 1] = newId;
        location.href = segments.join('/');
        return;
      }
    }

    /* ── Local / non-per-project-deployed: swap CSS in place ── */
    _applyProjectTokens(newId);
  });

  /* Helper: apply project tokens by swapping <style> and fetching config */
  var _pendingPid = null; /* guard against rapid switch race conditions */
  function _applyProjectTokens(pid) {
    _pendingPid = pid;
    var css = localStorage.getItem('dtf-saved-tokens-' + pid) || '';
    var styleEl = document.getElementById('dtfSavedTokens');

    if (css) {
      /* Per-project CSS found in localStorage — inject it */
      if (styleEl) { styleEl.textContent = css; }
      else {
        var s = document.createElement('style');
        s.id = 'dtfSavedTokens';
        s.textContent = css;
        document.head.appendChild(s);
      }
      localStorage.setItem('dtf-saved-tokens', css);
      _notifyAndRefresh();
    } else {
      /* No saved CSS — try fetching config.json + CSS from server */
      _fetchProjectAssets(pid, function() {
        if (_pendingPid === pid) _notifyAndRefresh();
      });
    }
  }

  /* Fetch project config from server, store in localStorage, and optionally fetch CSS */
  function _fetchProjectAssets(pid, done) {
    var configPaths = [
      depth + '/projects/' + pid + '/config.json',  /* local dev */
      depth + '/' + pid + '/config.json'             /* deployed */
    ];

    /* Try to fetch config first */
    _tryFetch(configPaths, function(cfgText) {
      if (cfgText) {
        localStorage.setItem('dtf-color-config-' + pid, cfgText);
      }
      /* Try to fetch per-project CSS (primitives + semantic + surfaces) */
      var assembled = '';
      var fetches = [
        { local: depth + '/projects/' + pid + '/primitives.css', deployed: depth + '/' + pid + '/packages/tokens/src/primitives.css' },
        { local: depth + '/projects/' + pid + '/semantic.css',   deployed: depth + '/' + pid + '/packages/tokens/src/semantic.css' },
        { local: depth + '/projects/' + pid + '/surfaces.css',   deployed: depth + '/' + pid + '/packages/tokens/src/surfaces.css' }
      ];
      var pending = fetches.length;
      var parts = [];
      fetches.forEach(function(f, idx) {
        _tryFetch([f.local, f.deployed], function(text) {
          if (text) parts[idx] = text;
          pending--;
          if (pending === 0) {
            assembled = parts.filter(Boolean).join('\n');
            if (assembled) {
              localStorage.setItem('dtf-saved-tokens-' + pid, assembled);
              localStorage.setItem('dtf-saved-tokens', assembled);
              var styleEl = document.getElementById('dtfSavedTokens');
              if (styleEl) { styleEl.textContent = assembled; }
              else {
                var s = document.createElement('style');
                s.id = 'dtfSavedTokens';
                s.textContent = assembled;
                document.head.appendChild(s);
              }
            } else {
              /* No CSS available — clear override so <link> base takes effect */
              var el = document.getElementById('dtfSavedTokens');
              if (el) el.textContent = '';
            }
            done();
          }
        });
      });
    });
  }

  /* Try multiple URL paths, call cb with first successful text (or null) */
  function _tryFetch(urls, cb) {
    if (!urls.length) { cb(null); return; }
    fetch(urls[0] + '?_cb=' + Date.now()).then(function(r) {
      if (!r.ok) throw new Error(r.status);
      return r.text();
    }).then(function(text) {
      cb(text);
    }).catch(function() {
      _tryFetch(urls.slice(1), cb);
    });
  }

  function _notifyAndRefresh() {
    if (typeof window.DTF.onThemeChange === 'function') {
      requestAnimationFrame(window.DTF.onThemeChange);
    }
  }
})();

/* ── Inject Saved Color Tokens (from Color System page) ── */
(function(){
  /* Load project-specific tokens if an active project is set, else fall back to global */
  var activeProject = localStorage.getItem('dtf-active-project');
  var savedCSS = null;
  if (activeProject) {
    savedCSS = localStorage.getItem('dtf-saved-tokens-' + activeProject);
  }
  if (!savedCSS) {
    savedCSS = localStorage.getItem('dtf-saved-tokens');
  }
  if (savedCSS) {
    var style = document.createElement('style');
    style.id = 'dtfSavedTokens';
    style.textContent = savedCSS;
    document.head.appendChild(style);
  }

  /* If we have an active project but no per-project CSS/config yet, bootstrap from server */
  if (activeProject && !localStorage.getItem('dtf-saved-tokens-' + activeProject)) {
    var depth = (location.pathname.indexOf('/demo/') !== -1) ? '..' : '.';
    var cfgUrl = depth + '/projects/' + activeProject + '/config.json?_cb=' + Date.now();
    var cssFiles = ['primitives.css', 'semantic.css', 'surfaces.css'];

    /* Fetch config if missing */
    if (!localStorage.getItem('dtf-color-config-' + activeProject)) {
      fetch(cfgUrl).then(function(r) {
        if (!r.ok) throw new Error(r.status);
        return r.text();
      }).then(function(text) {
        localStorage.setItem('dtf-color-config-' + activeProject, text);
        /* Re-render if page supports it */
        if (typeof window.DTF.onThemeChange === 'function') {
          requestAnimationFrame(window.DTF.onThemeChange);
        }
      }).catch(function() {});
    }

    /* Fetch CSS files if missing */
    var pending = cssFiles.length;
    var parts = [];
    cssFiles.forEach(function(file, idx) {
      var url = depth + '/projects/' + activeProject + '/' + file + '?_cb=' + Date.now();
      fetch(url).then(function(r) {
        if (!r.ok) throw new Error(r.status);
        return r.text();
      }).then(function(text) {
        parts[idx] = text;
      }).catch(function() {}).finally(function() {
        pending--;
        if (pending === 0) {
          var assembled = parts.filter(Boolean).join('\n');
          if (assembled) {
            localStorage.setItem('dtf-saved-tokens-' + activeProject, assembled);
            localStorage.setItem('dtf-saved-tokens', assembled);
            var el = document.getElementById('dtfSavedTokens');
            if (el) { el.textContent = assembled; }
            else {
              var s = document.createElement('style');
              s.id = 'dtfSavedTokens';
              s.textContent = assembled;
              document.head.appendChild(s);
            }
            if (typeof window.DTF.onThemeChange === 'function') {
              requestAnimationFrame(window.DTF.onThemeChange);
            }
          }
        }
      });
    });
  }
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
