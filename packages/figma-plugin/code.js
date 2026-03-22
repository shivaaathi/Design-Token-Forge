/* ═══════════════════════════════════════════════════════════════
   Design Token Forge — Figma Plugin (Live Sync Edition)
   Connects to DTF Sync Server for real-time token updates.
   ═══════════════════════════════════════════════════════════════ */

figma.showUI(__html__, { width: 480, height: 560 });

/* ── Helpers ──────────────────────────────────────────────── */

function hexToRGB(hex) {
  var h = hex.replace('#', '');
  if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255
  };
}

function toFigmaValue(raw, type) {
  if (type === 'COLOR') return hexToRGB(raw);
  if (type === 'FLOAT')  return parseFloat(raw) || 0;
  return String(raw);
}

function log(msg) {
  console.log('[DTF] ' + msg);
}

/* ── Scan for existing DTF collections ───────────────────── */

var DTF_PREFIXES = ['T0 ', 'T1 ', 'T2 ', 'T3 ', 'DTF /', 'primitives-numbers', 'comp size'];

function isDTFCollection(name) {
  for (var p = 0; p < DTF_PREFIXES.length; p++) {
    if (name.indexOf(DTF_PREFIXES[p]) === 0) return true;
  }
  return false;
}

function findDTFCollections() {
  var all = figma.variables.getLocalVariableCollections();
  var found = [];
  for (var i = 0; i < all.length; i++) {
    if (isDTFCollection(all[i].name)) {
      found.push(all[i]);
    }
  }
  return found;
}

/* ── Delete all DTF collections ──────────────────────────── */

function deleteAllDTF() {
  var cols = findDTFCollections();
  log('Deleting ' + cols.length + ' existing DTF collections');
  for (var i = 0; i < cols.length; i++) {
    var varIds = cols[i].variableIds;
    for (var j = 0; j < varIds.length; j++) {
      var v = figma.variables.getVariableById(varIds[j]);
      if (v) v.remove();
    }
    cols[i].remove();
  }
  return cols.length;
}

/* ── Create all collections from token data ──────────────── */

function createAll(data) {
  var stats = { collections: 0, variables: 0, aliases: 0, errors: [] };

  /* Pass 1: Create all collections, modes, and variables.
     Build a lookup so aliases can be resolved in pass 2. */
  var varLookup = {}; // "CollectionName::VarPath" => figma Variable obj
  var pendingAliases = []; // { variable, modeId, ref }

  for (var ci = 0; ci < data.collections.length; ci++) {
    var col = data.collections[ci];
    try {
      var collection = figma.variables.createVariableCollection(col.name);
      stats.collections++;

      /* Hide foundation collections from the property panel */
      if (col.hiddenFromPublishing) {
        collection.hiddenFromPublishing = true;
      }

      var modeMap = {};
      var firstModeId = collection.modes[0].modeId;
      collection.renameMode(firstModeId, col.modes[0]);
      modeMap[col.modes[0]] = firstModeId;

      for (var mi = 1; mi < col.modes.length; mi++) {
        try {
          var newModeId = collection.addMode(col.modes[mi]);
          modeMap[col.modes[mi]] = newModeId;
        } catch (modeErr) {
          stats.errors.push('Mode ' + col.modes[mi] + ' in ' + col.name + ': ' + modeErr.message
            + ' (Figma plan may limit modes to 4)');
          log('Mode limit hit: ' + col.modes[mi] + ' — ' + modeErr.message);
        }
      }

      for (var vi = 0; vi < col.variables.length; vi++) {
        var v = col.variables[vi];
        var resolvedType = null;
        if (v.type === 'COLOR')  resolvedType = 'COLOR';
        if (v.type === 'FLOAT')  resolvedType = 'FLOAT';
        if (v.type === 'STRING') resolvedType = 'STRING';
        if (!resolvedType) continue;

        try {
          var variable = figma.variables.createVariable(v.name, collection.id, resolvedType);
          varLookup[col.name + '::' + v.name] = variable;

          /* Apply Figma scopes — empty array hides from all pickers */
          if (Array.isArray(v.scopes)) {
            try {
              variable.scopes = v.scopes;
            } catch (scopeErr) {
              log('Scope error on ' + v.name + ': ' + scopeErr.message);
            }
          }

          var modeNames = Object.keys(v.values);
          for (var ki = 0; ki < modeNames.length; ki++) {
            var modeName = modeNames[ki];
            var mId = modeMap[modeName];
            if (!mId) continue;
            var rawVal = v.values[modeName];

            /* Check if this is an alias reference */
            if (rawVal && typeof rawVal === 'object' && rawVal.type === 'VARIABLE_ALIAS') {
              pendingAliases.push({ variable: variable, modeId: mId, ref: rawVal });
            } else {
              variable.setValueForMode(mId, toFigmaValue(rawVal, resolvedType));
            }
          }
          stats.variables++;
        } catch (ve) {
          stats.errors.push(v.name + ': ' + ve.message);
        }
      }
    } catch (ce) {
      stats.errors.push('Collection ' + col.name + ': ' + ce.message);
    }
  }

  /* Pass 2: Resolve alias references now that all variables exist */
  for (var ai = 0; ai < pendingAliases.length; ai++) {
    var pa = pendingAliases[ai];
    var lookupKey = pa.ref.collection + '::' + pa.ref.name;
    var target = varLookup[lookupKey];
    if (target) {
      try {
        var alias = figma.variables.createVariableAlias(target);
        pa.variable.setValueForMode(pa.modeId, alias);
        stats.aliases++;
      } catch (ae) {
        /* Fallback: if alias fails, log but don't break */
        stats.errors.push('Alias ' + pa.ref.name + ': ' + ae.message);
      }
    } else {
      stats.errors.push('Alias target not found: ' + lookupKey);
    }
  }

  return stats;
}

/* ── Message handler ─────────────────────────────────────── */

figma.ui.onmessage = function(msg) {

  if (msg.type === 'scan') {
    try {
      var cols = findDTFCollections();
      var varCount = 0;
      var colNames = [];
      for (var i = 0; i < cols.length; i++) {
        varCount += cols[i].variableIds.length;
        colNames.push(cols[i].name);
      }
      figma.ui.postMessage({
        type: 'scan-result',
        found: cols.length > 0,
        colNames: colNames,
        varCount: varCount
      });
    } catch (e) {
      figma.ui.postMessage({ type: 'scan-result', found: false, colNames: [], varCount: 0 });
    }
  }

  /* Lightweight verify — just check if DTF variables still exist */
  if (msg.type === 'verify') {
    try {
      var cols = findDTFCollections();
      var varCount = 0;
      for (var i = 0; i < cols.length; i++) {
        varCount += cols[i].variableIds.length;
      }
      figma.ui.postMessage({ type: 'verify-result', varCount: varCount });
    } catch (e) {
      figma.ui.postMessage({ type: 'verify-result', varCount: 0 });
    }
  }

  if (msg.type === 'sync') {
    try {
      var deleted = deleteAllDTF();
      figma.ui.postMessage({ type: 'progress', text: 'Creating T0 → T1 → T2/T3 collections...' });
      var stats = createAll(msg.data);
      figma.ui.postMessage({ type: 'done', stats: stats, replaced: deleted > 0, hash: msg.hash || '' });
      figma.notify(
        'DTF: ' + stats.variables + ' variables synced, ' + stats.aliases + ' aliases' +
        (stats.errors.length > 0 ? ' (' + stats.errors.length + ' errors)' : '')
      );
    } catch (e) {
      figma.ui.postMessage({ type: 'error', error: e.message });
    }
  }

  if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};
