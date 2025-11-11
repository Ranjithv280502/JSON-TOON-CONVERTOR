const API_URL = '/api';

document.addEventListener('DOMContentLoaded', function() {
    const jsonInput = document.getElementById('json-input');
    const toonOutput = document.getElementById('toon-output');
    const convertBtn = document.getElementById('convert-btn');
    const clearInputBtn = document.getElementById('clear-input');
    const exampleBtn = document.getElementById('example-btn');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');
    const inputError = document.getElementById('input-error');
    const outputSuccess = document.getElementById('output-success');
    const stats = document.getElementById('stats');
    const toggleDirectionBtn = document.getElementById('toggle-direction');
    const directionLabel = document.getElementById('direction-label');
    const inputLabel = document.getElementById('input-label');
    const outputLabel = document.getElementById('output-label');

    let currentDirection = 'json_to_toon';

    if (!jsonInput || !toonOutput || !convertBtn) {
        alert('ERROR: Page elements not loaded. Please refresh.');
        return;
    }

    const exampleJSON = {
        "users": [
            {
                "id": 1,
                "name": "Alice",
                "email": "alice@example.com",
                "role": "admin"
            },
            {
                "id": 2,
                "name": "Bob",
                "email": "bob@example.com",
                "role": "user"
            }
        ],
        "metadata": {
            "version": "1.0",
            "timestamp": "2024-01-15T10:30:00Z"
        }
    };

    const exampleTOON = `users[2,]{id,name,email,role}:
  1,Alice,alice@example.com,admin
  2,Bob,bob@example.com,user
metadata:
  version: "1.0"
  timestamp: "2024-01-15T10:30:00Z"`;

    function updateLabels() {
        if (currentDirection === 'json_to_toon') {
            directionLabel.textContent = 'JSON → TOON';
            inputLabel.textContent = 'JSON Input';
            outputLabel.textContent = 'TOON Output';
            jsonInput.placeholder = 'Enter your JSON here...\n\nExample:\n{\n  "name": "John",\n  "age": 30,\n  "city": "New York"\n}';
            toonOutput.placeholder = 'TOON output will appear here...';
        } else {
            directionLabel.textContent = 'TOON → JSON';
            inputLabel.textContent = 'TOON Input';
            outputLabel.textContent = 'JSON Output';
            jsonInput.placeholder = 'Enter your TOON here...\n\nExample:\nname: John\nage: 30\ncity: New York';
            toonOutput.placeholder = 'JSON output will appear here...';
        }
    }

    toggleDirectionBtn.addEventListener('click', () => {
        currentDirection = currentDirection === 'json_to_toon' ? 'toon_to_json' : 'json_to_toon';
        updateLabels();
        jsonInput.value = '';
        toonOutput.value = '';
        clearError();
        clearSuccess();
        if (stats) stats.textContent = '';
    });

    function showError(msg) {
        if (inputError) {
            inputError.textContent = msg;
            inputError.classList.add('show');
        }
    }

    function clearError() {
        if (inputError) inputError.classList.remove('show');
    }

    function showSuccess(msg) {
        if (outputSuccess) {
            outputSuccess.textContent = msg;
            outputSuccess.classList.add('show');
        }
    }

    function clearSuccess() {
        if (outputSuccess) outputSuccess.classList.remove('show');
    }

    exampleBtn.addEventListener('click', () => {
        if (currentDirection === 'json_to_toon') {
            jsonInput.value = JSON.stringify(exampleJSON, null, 2);
        } else {
            jsonInput.value = exampleTOON;
        }
        clearError();
        clearSuccess();
    });

    clearInputBtn.addEventListener('click', () => {
        jsonInput.value = '';
        toonOutput.value = '';
        clearError();
        clearSuccess();
        if (stats) stats.textContent = '';
    });

    convertBtn.addEventListener('click', async () => {
        const inputText = jsonInput.value.trim();
        
        if (!inputText) {
            showError('Please enter input data');
            return;
        }

        convertBtn.disabled = true;
        convertBtn.innerHTML = '<span class="loading"></span><span>Converting...</span>';
        clearError();
        clearSuccess();
        toonOutput.value = '';
        if (stats) stats.textContent = '';

        try {
            const response = await fetch(`${API_URL}/convert`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    direction: currentDirection,
                    data: inputText
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                showError(errorData.error || 'Conversion failed');
                return;
            }
            
            const data = await response.json();
            
            if (data.output) {
                const outputText = String(data.output);
                
                toonOutput.removeAttribute('readonly');
                toonOutput.readOnly = false;
                toonOutput.value = '';
                toonOutput.value = outputText;
                
                if (toonOutput.value.length === 0) {
                    toonOutput.textContent = outputText;
                    toonOutput.innerText = outputText;
                    toonOutput.value = outputText;
                }
                
                toonOutput.setAttribute('readonly', 'readonly');
                toonOutput.readOnly = true;
                toonOutput.style.cssText = 'color: #f8fafc !important; background-color: #252b47 !important; opacity: 1 !important; visibility: visible !important; display: block !important;';
                
                if (stats) {
                    const originalSize = data.original_size || 0;
                    const outputSize = data.output_size || 0;
                    if (currentDirection === 'json_to_toon' && data.reduction) {
                        stats.textContent = `From ${originalSize} tokens to ${outputSize} tokens\nSize reduction: ${data.reduction}`;
                    } else if (currentDirection === 'toon_to_json' && data.increase) {
                        stats.textContent = `From ${originalSize} tokens to ${outputSize} tokens\nSize increase: ${data.increase}`;
                    }
                }
                showSuccess('Conversion successful!');
            } else {
                showError('No output data in response');
            }
        } catch (error) {
            showError(`Error: ${error.message}`);
        } finally {
            convertBtn.disabled = false;
            convertBtn.innerHTML = `
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                    <circle cx="30" cy="30" r="28" stroke="currentColor" stroke-width="3"/>
                    <path d="M20 30L40 30M35 25L40 30L35 35" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Convert</span>
            `;
        }
    });

    copyBtn.addEventListener('click', async () => {
        if (!toonOutput.value) {
            showError('No data to copy');
            return;
        }
        try {
            await navigator.clipboard.writeText(toonOutput.value);
            showSuccess('Copied!');
            setTimeout(clearSuccess, 2000);
        } catch (error) {
            showError('Copy failed');
        }
    });

    downloadBtn.addEventListener('click', () => {
        if (!toonOutput.value) {
            showError('No data to download');
            return;
        }
        const extension = currentDirection === 'json_to_toon' ? 'toon' : 'json';
        const blob = new Blob([toonOutput.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `output.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showSuccess('Downloaded!');
        setTimeout(clearSuccess, 2000);
    });

    jsonInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            convertBtn.click();
        }
    });

    updateLabels();
});
