# W3C DTCG Format Checklist

## Specification Reference
W3C Design Tokens Community Group format: https://tr.designtokens.org/format/

## Output File
`dist/tokens.dtcg.json`

## Structure

```json
{
  "$description": "Design Token Forge — W3C DTCG token export",
  "primitive": {
    "color": {
      "primary": {
        "white": { "$value": "#FFFFFF", "$type": "color" },
        "25": { "$value": "#F5F7FF", "$type": "color" },
        "50": { "$value": "#E8EDFE", "$type": "color" }
      }
    },
    "spacing": {
      "none": { "$value": "0px", "$type": "dimension" },
      "1": { "$value": "1px", "$type": "dimension" },
      "2": { "$value": "2px", "$type": "dimension" }
    },
    "font": {
      "family": {
        "sans": { "$value": "Inter, system-ui, sans-serif", "$type": "fontFamily" }
      },
      "size": {
        "10": { "$value": "10px", "$type": "dimension" },
        "12": { "$value": "12px", "$type": "dimension" }
      }
    }
  },
  "semantic": {
    "primary": {
      "content": {
        "default": {
          "$value": "{primitive.color.primary.700}",
          "$type": "color",
          "$extensions": {
            "com.dtf.modes": {
              "light": "{primitive.color.primary.700}",
              "dark": "{primitive.color.primary.200}"
            }
          }
        }
      }
    }
  },
  "extra": {
    "radius": {
      "none": { "$value": "0px", "$type": "dimension" },
      "xs": { "$value": "2px", "$type": "dimension" },
      "sm": { "$value": "4px", "$type": "dimension" },
      "md": { "$value": "8px", "$type": "dimension" },
      "lg": { "$value": "12px", "$type": "dimension" },
      "xl": { "$value": "16px", "$type": "dimension" },
      "full": { "$value": "9999px", "$type": "dimension" }
    },
    "shadow": {
      "sm": {
        "$value": [{ "offsetX": "0px", "offsetY": "1px", "blur": "2px", "spread": "0px", "color": "rgba(0,0,0,0.05)" }],
        "$type": "shadow"
      }
    }
  }
}
```

## Script

### File: `scripts/export-dtcg.cjs`

1. Parse all 4 CSS files (primitives, semantic, surfaces, extras)
2. Map CSS types to DTCG types:
   - Hex colors → `"color"`
   - px values → `"dimension"`
   - font-family → `"fontFamily"`
   - font-weight → `"fontWeight"`
   - shadow → `"shadow"` (composite)
   - duration → `"duration"`
   - cubic-bezier → `"cubicBezier"`
   - opacity → `"number"`
3. Resolve `var()` references to DTCG alias syntax: `{group.subgroup.name}`
4. Handle light/dark as `$extensions` modes
5. Write to `dist/tokens.dtcg.json`

## Validation

```bash
# 1. Generate
node scripts/export-dtcg.cjs

# 2. Valid JSON
node -e "JSON.parse(require('fs').readFileSync('dist/tokens.dtcg.json', 'utf8')); console.log('✅ valid JSON')"

# 3. Has all expected groups
node -e "
const t = JSON.parse(require('fs').readFileSync('dist/tokens.dtcg.json', 'utf8'));
for (const g of ['primitive', 'semantic', 'extra']) {
  console.log(g in t ? '✅ ' + g : '❌ ' + g);
}
"

# 4. Token count sanity check
node -e "
const t = JSON.parse(require('fs').readFileSync('dist/tokens.dtcg.json', 'utf8'));
const count = JSON.stringify(t).match(/\\\"\\\$value\\\"/g)?.length || 0;
console.log('Total tokens:', count, '(expected ~400-600)');
"
```
