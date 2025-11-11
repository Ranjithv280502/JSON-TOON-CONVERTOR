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
        jsonInput.value = JSON.stringify(exampleJSON, null, 2);
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
        const jsonText = jsonInput.value.trim();
        
        if (!jsonText) {
            showError('Please enter JSON data');
            return;
        }

        let jsonData;
        try {
            jsonData = JSON.parse(jsonText);
        } catch (e) {
            showError(`Invalid JSON: ${e.message}`);
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
                body: JSON.stringify(jsonData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                showError(errorData.error || 'Conversion failed');
                return;
            }
            
            const data = await response.json();
            
            if (data.toon) {
                const toonText = String(data.toon);
                
                toonOutput.removeAttribute('readonly');
                toonOutput.readOnly = false;
                toonOutput.value = '';
                toonOutput.value = toonText;
                
                if (toonOutput.value.length === 0) {
                    toonOutput.textContent = toonText;
                    toonOutput.innerText = toonText;
                    toonOutput.value = toonText;
                }
                
                toonOutput.setAttribute('readonly', 'readonly');
                toonOutput.readOnly = true;
                toonOutput.style.cssText = 'color: #f8fafc !important; background-color: #252b47 !important; opacity: 1 !important; visibility: visible !important; display: block !important;';
                
                if (stats && data.reduction) {
                    const originalSize = data.original_size || 0;
                    const toonSize = data.toon_size || 0;
                    stats.textContent = `From ${originalSize} tokens to ${toonSize} tokens\nSize reduction: ${data.reduction}`;
                }
                showSuccess('Conversion successful!');
            } else {
                showError('No TOON data in response');
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
            showError('No TOON data to copy');
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
            showError('No TOON data to download');
            return;
        }
        const blob = new Blob([toonOutput.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'output.toon';
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
});
