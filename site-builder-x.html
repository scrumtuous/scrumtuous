<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Miles Creative Nexus Zone:  Website or Brand Analyzer</title>
    <style>
        body {
            font-family: 'Open Sans', sans-serif;
            background-color: #2A2B2E;
            color: #ffffff;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .container {
            text-align: center;
            background-color: #1E1F22;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            width: 100%;
            max-width: 500px;
        }

        label {
            font-weight: bold;
            display: block;
            margin-bottom: 10px;
        }

        input[type="text"] {
            width: 100%;
            padding: 12px;
            margin-bottom: 20px;
            border: 1px solid #444;
            border-radius: 4px;
            background-color: #333;
            color: #fff;
        }

        button {
            padding: 12px 24px;
            background-color: #E84393;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s ease;
        }

        button:hover {
            background-color: #D63074;
        }

        button:disabled {
            background-color: #888;
            cursor: not-allowed;
        }

        .results-container {
            margin-top: 20px;
            text-align: left;
        }

        .file-links ul,
        .result-data ul {
            list-style-type: none;
            padding: 0;
        }

        .file-links li,
        .result-data li {
            margin-bottom: 5px;
            color: #E84393;
        }

        .file-links li a,
        .result-data li a {
            color: #E84393;
            text-decoration: none;
            font-weight: bold;
        }

        .file-links li a:hover,
        .result-data li a:hover {
            text-decoration: underline;
        }

        .checkmark {
            color: green;
        }

        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid #ccc;
            border-top-color: #007BFF;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }

            100% {
                transform: rotate(360deg);
            }
        }
    </style>
</head>

<body>

    <div class="container">
        <div class="form-container">
            <label for="websiteNameOrBrand">Enter Website Name or Brand:</label>
            <input type="text" id="websiteNameOrBrand" name="websiteNameOrBrand" required>
            <button id="analyzeButton" onclick="analyzeWebsite()">Analyze</button>
        </div>

        <div class="results-container">
            <div class="file-links" id="fileLinks"></div>
            <div class="result-data" id="resultData"></div>
        </div>
    </div>

    <script>
        async function analyzeWebsite() {
            const websiteNameOrBrand = document.getElementById('websiteNameOrBrand').value;
            const analyzeButton = document.getElementById('analyzeButton');
            analyzeButton.disabled = true;

            try {
                const response = await fetch('http://54.245.207.37:3000/api/generate-html-links', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ websiteNameOrBrand })
                });

                const data = await response.json();
                displayResults(data);
                analyzeButton.disabled = false;
            } catch (error) {
                console.error('Error:', error);
                analyzeButton.disabled = false;
            }
        }

        function displayResults(data) {
            if (!data || !data.filePaths) {
                console.error('Invalid data passed to displayResults:', data);
                return;
            }

            const fileLinksContainer = document.getElementById('fileLinks');

            // Dynamically create the file links
            const fileLinksHTML = Object.keys(data.filePaths).map(key => {
                return `
                    <li id="${key}">${capitalize(key.replace(/Link$/, ''))} Layout: 
                        <a href="${data.filePaths[key]}" target="_blank">${data.filePaths[key]}</a> 
                        <span class="status loading"></span>
                    </li>`;
            }).join('');

            fileLinksContainer.innerHTML = `
                <h3>Generated Sites</h3>
                <ul>
                    ${fileLinksHTML}
                </ul>
            `;

            // Dynamically check the status for each file path
            Object.keys(data.filePaths).forEach(key => {
                checkLinkStatus(key, data.filePaths[key]);
            });
        }

        function checkLinkStatus(elementId, url) {
            const checkStatus = async () => {
                try {
                    console.log(`Checking status for ${url}`);
                    const response = await fetch(url, { method: 'GET' });
                    if (response.ok) {
                        console.log(`${url} is accessible`);
                        const statusElement = document.querySelector(`#${elementId} .status`);
                        if (statusElement) {
                            statusElement.innerHTML = '✔';
                            statusElement.classList.remove('loading');
                            statusElement.classList.add('checkmark');
                        }
                        // Stop checking if the URL is accessible
                        clearInterval(interval);
                    } else {
                        console.log(`Response not OK for ${url}. Status: ${response.status}`);
                    }
                } catch (error) {
                    console.log(`Error checking ${url}: `, error);
                }
            };

            // Set an interval to check the status periodically
            const interval = setInterval(checkStatus, 5000);

            // Run the check immediately as well
            checkStatus();
        }

        // Helper function to capitalize the first letter
        function capitalize(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }

    </script>

</body>

</html>
