# JSON ↔ TOON Converter

A simple web tool that converts between JSON and TOON format bidirectionally. TOON (Token-Oriented Object Notation) is basically a more compact way to represent data that works great with AI models. It uses way fewer tokens than regular JSON usually 30-60% less which means cheaper API calls and faster processing.

## What It Does

You can convert JSON to TOON or TOON back to JSON. Just paste your data, click a button, and get the converted output. The app shows you exactly how many tokens you saved (or gained when converting back), which is pretty useful if you're working with language models.

## Features

- Bidirectional conversion: JSON → TOON and TOON → JSON
- Toggle button to easily switch between conversion directions
- Big input and output boxes so you can see everything clearly
- Shows token count before and after conversion
- Copy button to grab the output quickly
- Download option to save it as a file (automatically uses .toon or .json extension)
- Example data button to test both directions
- Real-time input validation

## Getting Started

You'll need Python installed (3.7 or newer should work fine).

1. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the server:
   ```bash
   python app.py
   ```

3. Open your browser and go to:
   ```
   http://localhost:5000
   ```

That's it. The page should load and you can start converting.

## How to Use

**Converting JSON to TOON:**
1. Make sure the toggle shows "JSON → TOON" (default)
2. Type or paste your JSON into the left box (or click "Load Example")
3. Click the big circular "Convert" button in the middle
4. Your TOON output appears in the right box
5. You'll see stats showing how many tokens you saved

**Converting TOON to JSON:**
1. Click the toggle button to switch to "TOON → JSON"
2. Type or paste your TOON format data into the left box (or click "Load Example")
3. Click "Convert"
4. Your JSON output appears in the right box
5. Stats will show the size increase

You can also press `Ctrl + Enter` while typing to convert quickly.

## Examples

**JSON to TOON:**
Input JSON:
```json
{
  "name": "John",
  "age": 30,
  "city": "New York"
}
```

Output TOON:
```
name: John
age: 30
city: New York
```

**TOON to JSON:**
Input TOON:
```
name: John
age: 30
city: New York
```

Output JSON:
```json
{
  "name": "John",
  "age": 30,
  "city": "New York"
}
```

The stats will show token counts and percentage changes for both directions.

## Project Files

```
JSON to TOON/
├── app.py              # Flask server that handles the conversion
├── requirements.txt    # Python packages needed
├── README.md          # This file
└── static/
    ├── index.html     # The web page
    ├── style.css      # All the styling
    └── script.js      # The JavaScript that makes it work
```

## API

If you want to use this programmatically, there's an endpoint at `/api/convert` that accepts POST requests with JSON and returns the TOON format.

## Why TOON?

Regular JSON has a lot of extra characters - quotes, brackets, commas, etc. TOON strips most of that out while keeping the data readable. When you're paying per token for API calls, saving 30-60% adds up fast.

## Tech Stack

- Backend: Flask (Python)
- Frontend: Plain HTML, CSS, and JavaScript
- TOON encoding: python-toon library

## Troubleshooting

If something's not working:
- Make sure the Flask server is running (you should see output in the terminal)
- Check that your JSON is valid (the app will tell you if it's not)
- Open the browser console (F12) to see any error messages

## License

Feel free to use this however you want. It's open source.
