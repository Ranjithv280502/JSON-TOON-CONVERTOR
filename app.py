from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from toon import encode as toon_encode, decode as toon_decode
import json

app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/api/convert', methods=['POST'])
def convert_json_to_toon():
    try:
        data = request.get_json()
        direction = data.get('direction', 'json_to_toon')
        input_data = data.get('data', '')
        
        if not input_data:
            return jsonify({'error': 'No input data provided'}), 400
        
        if direction == 'json_to_toon':
            try:
                json_obj = json.loads(input_data) if isinstance(input_data, str) else input_data
                toon_data = toon_encode(json_obj)
                
                if not isinstance(toon_data, str):
                    toon_data = str(toon_data)
                
                original_json = json.dumps(json_obj) if isinstance(json_obj, dict) else input_data
                original_size = len(original_json)
                toon_size = len(toon_data)
                reduction_pct = ((1 - toon_size / original_size) * 100) if original_size > 0 else 0
                
                return jsonify({
                    'success': True,
                    'output': toon_data,
                    'original_size': original_size,
                    'output_size': toon_size,
                    'reduction': f"{reduction_pct:.1f}%"
                })
            except json.JSONDecodeError as e:
                return jsonify({'error': f'Invalid JSON: {str(e)}'}), 400
        
        elif direction == 'toon_to_json':
            try:
                json_obj = toon_decode(input_data)
                json_data = json.dumps(json_obj, indent=2)
                
                toon_size = len(input_data)
                json_size = len(json_data)
                increase_pct = ((json_size / toon_size - 1) * 100) if toon_size > 0 else 0
                
                return jsonify({
                    'success': True,
                    'output': json_data,
                    'original_size': toon_size,
                    'output_size': json_size,
                    'increase': f"{increase_pct:.1f}%"
                })
            except Exception as e:
                return jsonify({'error': f'Invalid TOON format: {str(e)}'}), 400
        
        else:
            return jsonify({'error': 'Invalid direction. Use "json_to_toon" or "toon_to_json"'}), 400
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Conversion error: {str(e)}'}), 500

@app.route('/api/validate', methods=['POST'])
def validate_json():
    try:
        json_str = request.get_data(as_text=True)
        json.loads(json_str)
        return jsonify({'valid': True})
    except json.JSONDecodeError as e:
        return jsonify({'valid': False, 'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)

