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
  if (filename === 'color-system.html' || filename === 'onboard.html') return;

  var nav = document.querySelector('.nav-actions');
  if (!nav) return;

  var depth = (location.pathname.indexOf('/demo/') !== -1) ? '..' : '.';

  /* ── Build DOM — custom dropdown ── */
  var wrap = document.createElement('div');
  wrap.className = 'nav-project';
  var label = document.createElement('span');
  label.className = 'nav-project-label';
  label.textContent = 'Project';

  var ddWrap = document.createElement('div');
  ddWrap.className = 'nav-proj-wrap';
  var ddBtn = document.createElement('button');
  ddBtn.className = 'nav-proj-btn';
  ddBtn.type = 'button';
  ddBtn.textContent = '…';
  var ddPanel = document.createElement('div');
  ddPanel.className = 'nav-proj-panel';
  ddWrap.appendChild(ddBtn);
  ddWrap.appendChild(ddPanel);

  var newBtn = document.createElement('button');
  newBtn.className = 'nav-project-new';
  newBtn.type = 'button';
  newBtn.textContent = '+ New';
  newBtn.addEventListener('click', function() {
    window.location.href = 'color-system.html?new-project=1';
  });
  wrap.appendChild(label);
  wrap.appendChild(ddWrap);
  wrap.appendChild(newBtn);

  var toggle = document.getElementById('themeToggle');
  if (toggle) nav.insertBefore(wrap, toggle);
  else nav.appendChild(wrap);

  /* ── State ── */
  var currentId = localStorage.getItem('dtf-active-project') || '';
  var panelOpen = false;
  var cachedList = []; /* last-known project list for switching */

  /* GitHub API setup */
  var ghApiBase = 'https://api.github.com/repos/sridhar-ravi-2917/Design-Token-Forge';
  var ghToken = localStorage.getItem('dtf-gh-pat') || '';
  var ghHdrs = ghToken
    ? { 'Authorization': 'Bearer ' + ghToken, 'Accept': 'application/vnd.github+json' }
    : { 'Accept': 'application/vnd.github+json' };
  var upstreamOwner = 'sridhar-ravi-2917';

  /* Set button text to active project name */
  function syncBtnLabel() {
    var active = cachedList.find(function(p){ return p.id === currentId; });
    ddBtn.textContent = active ? (active.name || active.id) : (currentId || '…');
  }

  /* ── Visibility filter (owner + deleted) ── */
  function getVisibleProjects(list) {
    var deletedRaw = localStorage.getItem('dtf-deleted-projects');
    var deleted = [];
    try { deleted = JSON.parse(deletedRaw) || []; } catch(e) {}
    var filtered = list.filter(function(p) { return deleted.indexOf(p.id) === -1; });
    var ghUser = (localStorage.getItem('dtf-gh-user') || '').toLowerCase();
    if (ghUser && ghUser !== upstreamOwner.toLowerCase()) {
      filtered = filtered.filter(function(p) { return p.owner && p.owner.toLowerCase() === ghUser; });
    }
    return filtered;
  }

  /* ── Render items into panel ── */
  function renderPanel(list) {
    ddPanel.innerHTML = '';
    if (!list.length) {
      var empty = document.createElement('div');
      empty.className = 'nav-proj-loading';
      empty.textContent = 'No projects';
      ddPanel.appendChild(empty);
      return;
    }
    list.forEach(function(proj) {
      var row = document.createElement('button');
      row.className = 'nav-proj-item';
      row.type = 'button';
      if (proj.id === currentId) row.setAttribute('data-active', '');

      var nameEl = document.createElement('span');
      nameEl.className = 'nav-proj-item-name';
      nameEl.textContent = proj.name || proj.id;
      row.appendChild(nameEl);

      /* Action buttons (rename + delete) */
      var actions = document.createElement('span');
      actions.className = 'nav-proj-item-actions';

      var renBtn = document.createElement('button');
      renBtn.className = 'nav-proj-item-act';
      renBtn.type = 'button';
      renBtn.title = 'Rename';
      renBtn.innerHTML = '&#9998;'; /* ✎ pencil */
      renBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        doRename(proj);
      });

      var delBtn = document.createElement('button');
      delBtn.className = 'nav-proj-item-act del';
      delBtn.type = 'button';
      delBtn.title = 'Delete';
      delBtn.innerHTML = '&#128465;'; /* 🗑 */
      delBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        doDelete(proj);
      });

      actions.appendChild(renBtn);
      actions.appendChild(delBtn);
      row.appendChild(actions);

      /* Click row → switch project */
      row.addEventListener('click', function() {
        selectProject(proj.id);
        closePanel();
      });

      ddPanel.appendChild(row);
    });
  }

  /* ── Fetch live projects from GitHub API ── */
  function fetchLiveProjects(cb) {
    fetch(ghApiBase + '/contents/projects?ref=main&_cb=' + Date.now(), { headers: ghHdrs })
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(dirs){
        if (!dirs || !Array.isArray(dirs)) { cb(null); return; }
        var projects = dirs.filter(function(d){ return d.type === 'dir'; });
        var results = []; var pending = projects.length;
        if (pending === 0) { cb([]); return; }
        projects.forEach(function(dir){
          fetch(ghApiBase + '/contents/projects/' + dir.name + '/config.json?ref=main', { headers: ghHdrs })
            .then(function(r){ return r.ok ? r.json() : null; })
            .then(function(file){
              if (file && file.content) {
                try {
                  var cfg = JSON.parse(atob(file.content.replace(/\n/g, '')));
                  results.push({ id: cfg.id || dir.name, name: cfg.name || dir.name, owner: cfg.owner || '' });
                } catch(e) { results.push({ id: dir.name, name: dir.name, owner: '' }); }
              }
            }).catch(function(){})
            .finally(function(){
              pending--;
              if (pending === 0) cb(results);
            });
        });
      }).catch(function(){ cb(null); });
  }

  /* ── Open / close panel ── */
  function openPanel() {
    panelOpen = true;
    ddPanel.setAttribute('data-open', '');
    /* Show loading state immediately */
    ddPanel.innerHTML = '';
    var loader = document.createElement('div');
    loader.className = 'nav-proj-loading';
    loader.textContent = 'Loading…';
    ddPanel.appendChild(loader);
    /* Fetch fresh list */
    fetchLiveProjects(function(list) {
      if (!panelOpen) return; /* closed before fetch completed */
      if (list && list.length) {
        /* Clean deleted */
        var remoteIds = list.map(function(p){ return p.id; });
        try {
          var delList = JSON.parse(localStorage.getItem('dtf-deleted-projects') || '[]');
          var cleaned = delList.filter(function(id){ return remoteIds.indexOf(id) !== -1; });
          if (cleaned.length !== delList.length) localStorage.setItem('dtf-deleted-projects', JSON.stringify(cleaned));
        } catch(e) {}
        /* Merge just-created local projects */
        var localKnown = [];
        try { localKnown = JSON.parse(localStorage.getItem('dtf-known-projects') || '[]'); } catch(e) {}
        var activeLocal = localKnown.find(function(p){ return p.id === currentId; });
        if (activeLocal && !list.some(function(p){ return p.id === currentId; })) {
          list.push(activeLocal);
        }
        localStorage.setItem('dtf-known-projects', JSON.stringify(list));
        cachedList = list;
        var visible = getVisibleProjects(list);
        renderPanel(visible);
        syncBtnLabel();
      } else if (list !== null && list.length === 0) {
        var localList = [];
        try { localList = JSON.parse(localStorage.getItem('dtf-known-projects') || '[]'); } catch(e) {}
        if (localList.length > 0) {
          cachedList = localList;
          renderPanel(getVisibleProjects(localList));
        } else {
          window.location.href = 'onboard.html';
        }
      } else {
        /* API failed — show cached */
        renderPanel(getVisibleProjects(cachedList));
      }
    });
  }

  function closePanel() {
    panelOpen = false;
    ddPanel.removeAttribute('data-open');
  }

  /* Toggle on button click */
  ddBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    if (panelOpen) closePanel();
    else openPanel();
  });

  /* Close on outside click */
  document.addEventListener('click', function(e) {
    if (panelOpen && !ddWrap.contains(e.target)) closePanel();
  });

  /* Close on Escape */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && panelOpen) closePanel();
  });

  /* ── Select a project ── */
  function selectProject(newId) {
    if (!newId || newId === currentId) return;
    currentId = newId;
    localStorage.setItem('dtf-active-project', newId);
    syncBtnLabel();

    /* On deployed per-project sites, navigate to the other project's URL */
    var loc = location.pathname;
    var knownIds = cachedList.map(function(p) { return p.id; });
    var segments = loc.split('/');
    var demoIdx = segments.lastIndexOf('demo');
    if (demoIdx > 0) {
      var curSlug = segments[demoIdx - 1];
      if (curSlug && curSlug !== newId && knownIds.indexOf(curSlug) !== -1) {
        segments[demoIdx - 1] = newId;
        location.href = segments.join('/');
        return;
      }
    }
    _applyProjectTokens(newId);
  }

  /* ── Rename project (API call) ── */
  function doRename(proj) {
    var newName = prompt('Rename project:', proj.name || proj.id);
    if (!newName || newName === proj.name) return;
    if (!ghToken) { alert('Connect GitHub (PAT) in Color System to rename projects.'); return; }
    /* Fetch current config.json to get its SHA */
    var cfgPath = 'projects/' + proj.id + '/config.json';
    fetch(ghApiBase + '/contents/' + cfgPath + '?ref=main', { headers: ghHdrs })
      .then(function(r){ return r.ok ? r.json() : Promise.reject(r); })
      .then(function(file){
        var cfg = JSON.parse(atob(file.content.replace(/\n/g, '')));
        cfg.name = newName;
        var body = JSON.stringify({
          message: 'Rename project ' + proj.id + ' to ' + newName,
          content: btoa(JSON.stringify(cfg, null, 2)),
          sha: file.sha,
          branch: 'main'
        });
        return fetch(ghApiBase + '/contents/' + cfgPath, {
          method: 'PUT', headers: ghHdrs, body: body
        });
      })
      .then(function(r){
        if (!r.ok) return Promise.reject(r);
        proj.name = newName;
        /* Update localStorage */
        cachedList.forEach(function(p){ if(p.id === proj.id) p.name = newName; });
        localStorage.setItem('dtf-known-projects', JSON.stringify(cachedList));
        syncBtnLabel();
        renderPanel(getVisibleProjects(cachedList));
      })
      .catch(function(err){ alert('Rename failed. Check permissions.'); console.error(err); });
  }

  /* ── Delete project (API call) ── */
  function doDelete(proj) {
    if (!confirm('Delete project "' + (proj.name || proj.id) + '"? This cannot be undone.')) return;
    if (!ghToken) { alert('Connect GitHub (PAT) in Color System to delete projects.'); return; }
    /* Recursively delete all files in the project folder */
    var dirPath = 'projects/' + proj.id;
    fetch(ghApiBase + '/contents/' + dirPath + '?ref=main', { headers: ghHdrs })
      .then(function(r){ return r.ok ? r.json() : Promise.reject(r); })
      .then(function(items){
        if (!Array.isArray(items)) items = [items];
        var delPromises = items.filter(function(f){ return f.type === 'file'; }).map(function(f){
          return fetch(ghApiBase + '/contents/' + f.path, {
            method: 'DELETE',
            headers: ghHdrs,
            body: JSON.stringify({ message: 'Delete ' + f.path, sha: f.sha, branch: 'main' })
          });
        });
        return Promise.all(delPromises);
      })
      .then(function(){
        /* Mark deleted locally */
        var delList = [];
        try { delList = JSON.parse(localStorage.getItem('dtf-deleted-projects') || '[]'); } catch(e) {}
        if (delList.indexOf(proj.id) === -1) delList.push(proj.id);
        localStorage.setItem('dtf-deleted-projects', JSON.stringify(delList));
        /* Remove from cached list */
        cachedList = cachedList.filter(function(p){ return p.id !== proj.id; });
        localStorage.setItem('dtf-known-projects', JSON.stringify(cachedList));
        /* If we deleted the active project, switch to first visible */
        if (currentId === proj.id) {
          var visible = getVisibleProjects(cachedList);
          if (visible.length) {
            selectProject(visible[0].id);
          } else {
            localStorage.removeItem('dtf-active-project');
            window.location.href = 'onboard.html';
            return;
          }
        }
        renderPanel(getVisibleProjects(cachedList));
        syncBtnLabel();
      })
      .catch(function(err){ alert('Delete failed. Check permissions.'); console.error(err); });
  }

  /* ── Initial load: populate from localStorage cache, then set button label ── */
  var knownRaw = localStorage.getItem('dtf-known-projects');
  try { cachedList = JSON.parse(knownRaw) || []; } catch(e) {}
  syncBtnLabel();

  /* Also do a background fetch on page load to validate active project still exists */
  fetchLiveProjects(function(list) {
    if (list && list.length) {
      var remoteIds = list.map(function(p){ return p.id; });
      try {
        var delList = JSON.parse(localStorage.getItem('dtf-deleted-projects') || '[]');
        var cleaned = delList.filter(function(id){ return remoteIds.indexOf(id) !== -1; });
        if (cleaned.length !== delList.length) localStorage.setItem('dtf-deleted-projects', JSON.stringify(cleaned));
      } catch(e) {}
      var localKnown = [];
      try { localKnown = JSON.parse(localStorage.getItem('dtf-known-projects') || '[]'); } catch(e) {}
      var activeLocal = localKnown.find(function(p){ return p.id === currentId; });
      if (activeLocal && !list.some(function(p){ return p.id === currentId; })) {
        list.push(activeLocal);
      }
      cachedList = list;
      localStorage.setItem('dtf-known-projects', JSON.stringify(list));
      syncBtnLabel();
      /* If active project was deleted remotely, reset */
      if (currentId && !remoteIds.some(function(id){ return id === currentId; }) && !activeLocal) {
        var visible = getVisibleProjects(list);
        if (visible.length) selectProject(visible[0].id);
        else { window.location.href = 'onboard.html'; }
      }
    } else if (list !== null && list.length === 0) {
      var localList = [];
      try { localList = JSON.parse(localStorage.getItem('dtf-known-projects') || '[]'); } catch(e) {}
      if (!localList.length) { window.location.href = 'onboard.html'; }
    }
  });

  /* Helper: apply project tokens by swapping <style> and fetching config */
  var _pendingPid = null; /* guard against rapid switch race conditions */
  function _applyProjectTokens(pid) {
    _pendingPid = pid;
    var cached = localStorage.getItem('dtf-saved-tokens-' + pid) || '';

    if (cached) {
      /* Show cached CSS immediately for fast render */
      _injectCSS(cached);
      localStorage.setItem('dtf-saved-tokens', cached);
      _notifyAndRefresh();
    }

    /* Fetch fresh CSS+config from server — but only apply file-based CSS
       if the user hasn't saved edits from Color System for this project. */
    var hasEdits = !!localStorage.getItem('dtf-color-config-' + pid);
    _fetchProjectAssets(pid, function(freshCSS) {
      if (_pendingPid !== pid) return; /* stale — user switched again */
      if (freshCSS && !hasEdits) {
        localStorage.setItem('dtf-saved-tokens-' + pid, freshCSS);
        localStorage.setItem('dtf-saved-tokens', freshCSS);
        if (freshCSS !== cached) {
          _injectCSS(freshCSS);
          _notifyAndRefresh();
        }
      } else if (!cached && !hasEdits) {
        var el = document.getElementById('dtfSavedTokens');
        if (el) el.textContent = '';
        _notifyAndRefresh();
      }
    });
  }

  /* Inject CSS into the dtfSavedTokens <style> element */
  function _injectCSS(css) {
    var el = document.getElementById('dtfSavedTokens');
    if (el) { el.textContent = css; }
    else {
      var s = document.createElement('style');
      s.id = 'dtfSavedTokens';
      s.textContent = css;
      document.head.appendChild(s);
    }
  }

  /* Fetch project config + CSS from server; calls done(assembledCSS or null) */
  function _fetchProjectAssets(pid, done) {
    var configPaths = [
      depth + '/projects/' + pid + '/config.json',  /* local dev */
      depth + '/' + pid + '/config.json'             /* deployed */
    ];

    /* Fetch config (always — may have changed) */
    _tryFetch(configPaths, function(cfgText) {
      if (cfgText) {
        /* Use a separate key so we don't overwrite color-system.html's edited state */
        localStorage.setItem('dtf-raw-config-' + pid, cfgText);
      }
      /* Fetch per-project CSS (primitives + semantic + surfaces) */
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
            var assembled = parts.filter(Boolean).join('\n');
            done(assembled || null);
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

  /* Always fetch fresh config+CSS from server on page load.
     Show cached CSS immediately above for fast render, then update. */
  if (activeProject) {
    var depth = (location.pathname.indexOf('/demo/') !== -1) ? '..' : '.';
    var cfgUrl = depth + '/projects/' + activeProject + '/config.json?_cb=' + Date.now();
    var cssFiles = ['primitives.css', 'semantic.css', 'surfaces.css'];

    /* Fetch config */
    fetch(cfgUrl).then(function(r) {
      if (!r.ok) throw new Error(r.status);
      return r.text();
    }).then(function(text) {
      /* Use a separate key so we don't overwrite color-system.html's edited state */
      localStorage.setItem('dtf-raw-config-' + activeProject, text);
      if (typeof window.DTF.onThemeChange === 'function') {
        requestAnimationFrame(window.DTF.onThemeChange);
      }
    }).catch(function() {});

    /* Fetch CSS files — only overwrite user's saved tokens if no color-system edits exist */
    var hasEditedConfig = !!localStorage.getItem('dtf-color-config-' + activeProject);
    if (!hasEditedConfig) {
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
