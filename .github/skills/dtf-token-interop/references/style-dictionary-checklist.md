# Style Dictionary Checklist

## Purpose

Enable teams using Style Dictionary to consume DTF tokens in their multi-platform build pipeline (CSS, iOS, Android, Flutter).

## Output
`dist/style-dictionary/` directory containing:
- `tokens.json` — Style Dictionary input format
- `config.json` — Style Dictionary configuration

## Token Format (Style Dictionary input)

```json
{
  "color": {
    "primary": {
      "25": { "value": "#F5F7FF", "type": "color", "description": "Primary palette step 25" },
      "50": { "value": "#E8EDFE", "type": "color" },
      "500": { "value": "#224FCE", "type": "color" }
    }
  },
  "spacing": {
    "none": { "value": "0px", "type": "dimension" },
    "1": { "value": "1px", "type": "dimension" }
  },
  "radius": {
    "none": { "value": "0px", "type": "dimension" },
    "sm": { "value": "4px", "type": "dimension" }
  }
}
```

## Style Dictionary Config

```json
{
  "source": ["dist/style-dictionary/tokens.json"],
  "platforms": {
    "css": {
      "transformGroup": "css",
      "buildPath": "dist/style-dictionary/css/",
      "files": [{
        "destination": "variables.css",
        "format": "css/variables"
      }]
    },
    "ios": {
      "transformGroup": "ios-swift",
      "buildPath": "dist/style-dictionary/ios/",
      "files": [{
        "destination": "StyleDictionary.swift",
        "format": "ios-swift/class.swift"
      }]
    },
    "android": {
      "transformGroup": "android",
      "buildPath": "dist/style-dictionary/android/",
      "files": [{
        "destination": "style_dictionary.xml",
        "format": "android/resources"
      }]
    }
  }
}
```

## Script

### File: `scripts/export-style-dictionary.cjs`

1. Parse CSS token files
2. Convert to Style Dictionary's flat JSON format
3. **Use resolved values** (not var() — Style Dictionary resolves its own aliases)
4. Map to Style Dictionary's CTI (Category/Type/Item) naming
5. Write tokens.json + config.json

## Verification

```bash
# 1. Generate
node scripts/export-style-dictionary.cjs

# 2. Valid JSON
node -e "JSON.parse(require('fs').readFileSync('dist/style-dictionary/tokens.json', 'utf8')); console.log('✅ valid')"

# 3. If Style Dictionary is installed, build all platforms
npx style-dictionary build --config dist/style-dictionary/config.json
ls dist/style-dictionary/css/
ls dist/style-dictionary/ios/
ls dist/style-dictionary/android/
```

## Notes

- Style Dictionary is a **build tool** — it transforms tokens into platform-native formats
- DTF provides the Style Dictionary INPUT — teams run the build themselves
- This is lower priority than W3C DTCG and Tailwind (more niche use case)
