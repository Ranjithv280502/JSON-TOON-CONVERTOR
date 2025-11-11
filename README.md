# JSON to TOON Converter

A simple web tool that converts JSON into TOON format. TOON (Token-Oriented Object Notation) is basically a more compact way to represent data that works great with AI models. It uses way fewer tokens than regular JSON usually 30-60% less which means cheaper API calls and faster processing.

## What It Does

You paste in some JSON, click a button, and get back the same data in TOON format. The app shows you exactly how many tokens you saved, which is pretty useful if you're working with language models.

## Features

- Big input and output boxes so you can see everything clearly
- Shows token count before and after conversion
- Copy button to grab the TOON output quickly
- Download option to save it as a file
- Example data button to test it out
- Real-time JSON validation so you know if your input is valid

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

1. Type or paste your JSON into the left box (or click "Load Example" to try it out)
2. Click the big circular "Convert" button in the middle
3. Your TOON output appears in the right box
4. You'll see stats showing how many tokens you saved
5. Use the Copy or Download buttons if you need the output

You can also press `Ctrl + Enter` while typing JSON to convert it quickly.

## Example

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

The stats will show something like "From 45 tokens to 32 tokens" with the percentage reduction.

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
