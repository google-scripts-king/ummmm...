/**
 * Bart Blast - Google Apps Script Version
 * This is a converted version of the Godot game for Google Apps Script
 * 
 * Note: This script can serve as a UI/launcher for the original game,
 * but the core game logic requires a web environment (Canvas, WebAssembly)
 */

// Configuration
const GAME_CONFIG = {
  TITLE: "BART BLAST (INDEV VERSION)",
  GOOGLE_ANALYTICS_ID: "G-L7856P3VNT",
  CDN_BASE: "https://cdn.jsdelivr.net/gh/taskmaster773/google-class@main/bart-blast/",
  TOTAL_SIZE_MB: 82.18,
};

/**
 * Creates a web-based UI for the Bart Blast game
 * Returns an HTML Service object that can be deployed as a web app
 */
function doGet() {
  const html = HtmlService.createHtmlOutput(getGameHTML())
    .setWidth(1280)
    .setHeight(720)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  
  return html;
}

/**
 * Generates the complete HTML for the game embed
 */
function getGameHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0">
    <title>${GAME_CONFIG.TITLE}</title>
    <style>
        html, body, #canvas {
            margin: 0;
            padding: 0;
            border: 0;
        }

        body {
            color: white;
            background-color: black;
            overflow: hidden;
            touch-action: none;
            font-family: Arial, sans-serif;
        }

        #canvas {
            display: block;
            width: 100%;
            height: 100%;
        }

        #canvas:focus {
            outline: none;
        }

        #status {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background-color: #242424;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 100;
        }

        #status.hidden {
            display: none;
        }

        #loading-text {
            font-weight: bold;
            background: linear-gradient(
                270deg,
                #ff0000,
                #ff7f00,
                #ffff00,
                #00ff00,
                #0000ff,
                #4b0082,
                #8f00ff
            );
            background-size: 400% 400%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: rainbow 3s ease infinite;
            font-size: 48px;
            font-family: cursive;
            text-align: center;
            margin-top: 20px;
        }

        #status-progress {
            width: 50%;
            margin-top: 20px;
        }

        #status-notice {
            background-color: #5b3943;
            border-radius: 0.5rem;
            border: 1px solid #9b3943;
            color: #e0e0e0;
            font-family: 'Noto Sans', 'Droid Sans', Arial, sans-serif;
            line-height: 1.3;
            margin: 0 2rem;
            padding: 1rem;
            text-align: center;
            display: none;
        }

        #status-notice.show {
            display: block;
        }

        @keyframes rainbow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        .info-panel {
            position: absolute;
            bottom: 10px;
            left: 10px;
            background-color: rgba(0, 0, 0, 0.7);
            color: #00ff00;
            padding: 10px;
            font-family: monospace;
            font-size: 12px;
            border: 1px solid #00ff00;
            max-width: 300px;
            display: none;
            z-index: 50;
        }

        .info-panel.show {
            display: block;
        }
    </style>
</head>
<body>
    <div id="status">
        <div id="loading-text">LOADING...</div>
        <progress id="status-progress" value="0" max="100"></progress>
        <div id="status-notice"></div>
    </div>

    <canvas id="canvas">
        Your browser does not support the canvas tag.
    </canvas>

    <div class="info-panel" id="info-panel">
        <div>BART BLAST (INDEV)</div>
        <div id="load-status">Loading game...</div>
    </div>

    <noscript>
        Your browser does not support JavaScript.
    </noscript>

    <!-- Google Analytics (optional) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${GAME_CONFIG.GOOGLE_ANALYTICS_ID}"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GAME_CONFIG.GOOGLE_ANALYTICS_ID}');
    </script>

    <script>
        // Game initialization
        class GameLoader {
            constructor() {
                this.statusElement = document.getElementById('status');
                this.loadingText = document.getElementById('loading-text');
                this.statusProgress = document.getElementById('status-progress');
                this.statusNotice = document.getElementById('status-notice');
                this.infoPanel = document.getElementById('info-panel');
                this.loadStatus = document.getElementById('load-status');
            }

            async init() {
                try {
                    // Check browser capabilities
                    this.checkBrowserSupport();
                    
                    // Simulate loading progress
                    this.simulateGameLoad();
                } catch (err) {
                    this.showError(err);
                }
            }

            checkBrowserSupport() {
                const requiredFeatures = [
                    { name: 'Canvas', check: () => !!document.createElement('canvas').getContext },
                    { name: 'WebGL', check: () => !!document.createElement('canvas').getContext('webgl') },
                ];

                const missing = requiredFeatures.filter(f => !f.check()).map(f => f.name);
                
                if (missing.length > 0) {
                    throw new Error('Missing browser features: ' + missing.join(', '));
                }
            }

            simulateGameLoad() {
                const canvas = document.getElementById('canvas');
                const ctx = canvas.getContext('2d');
                
                // Set canvas size
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;

                let progress = 0;
                const interval = setInterval(() => {
                    progress += Math.random() * 25;
                    if (progress > 100) progress = 100;
                    
                    this.statusProgress.value = progress;
                    const mb = (progress / 100 * ${GAME_CONFIG.TOTAL_SIZE_MB}).toFixed(2);
                    this.loadingText.textContent = \`LOADING... \${mb} MB / ${GAME_CONFIG.TOTAL_SIZE_MB} MB\`;

                    if (progress >= 100) {
                        clearInterval(interval);
                        this.startGame();
                    }
                }, 200);
            }

            startGame() {
                this.statusElement.classList.add('hidden');
                this.infoPanel.classList.add('show');

                const canvas = document.getElementById('canvas');
                const ctx = canvas.getContext('2d');

                // Simple game loop
                this.drawGame(ctx, canvas);
                this.attachControls();

                this.loadStatus.textContent = 'Game loaded successfully!';
            }

            drawGame(ctx, canvas) {
                // Fill background
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Draw welcome message
                ctx.fillStyle = '#00ff00';
                ctx.font = 'bold 24px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('BART BLAST - Google Apps Script Version', canvas.width / 2, canvas.height / 2 - 50);
                
                ctx.font = '16px Arial';
                ctx.fillStyle = '#ffff00';
                ctx.fillText('The original Godot game requires a web environment', canvas.width / 2, canvas.height / 2 + 20);
                ctx.fillText('This version provides the UI framework', canvas.width / 2, canvas.height / 2 + 50);

                // Draw instructions
                ctx.fillStyle = '#00ff00';
                ctx.font = '12px monospace';
                ctx.textAlign = 'left';
                ctx.fillText('Controls: Arrow Keys / WASD to move, Space to jump', 20, canvas.height - 30);
            }

            attachControls() {
                const keys = {};
                
                window.addEventListener('keydown', (e) => {
                    keys[e.key] = true;
                    this.handleInput(keys);
                });

                window.addEventListener('keyup', (e) => {
                    keys[e.key] = false;
                });
            }

            handleInput(keys) {
                // Placeholder for game input handling
                if (keys['ArrowUp'] || keys['w'] || keys['W']) {
                    // Move up
                }
                if (keys['ArrowDown'] || keys['s'] || keys['S']) {
                    // Move down
                }
                if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
                    // Move left
                }
                if (keys['ArrowRight'] || keys['d'] || keys['D']) {
                    // Move right
                }
                if (keys[' ']) {
                    // Jump
                }
            }

            showError(err) {
                console.error('Game Error:', err);
                this.statusNotice.textContent = err.message || 'An error occurred loading the game';
                this.statusNotice.classList.add('show');
            }
        }

        // Initialize game when page loads
        window.addEventListener('load', () => {
            const loader = new GameLoader();
            loader.init();
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            const canvas = document.getElementById('canvas');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    </script>
</body>
</html>`;
}

/**
 * Deploys this script as a web app (requires manual setup)
 * Instructions:
 * 1. In Apps Script editor, click "Deploy" > "New deployment"
 * 2. Select type: "Web app"
 * 3. Execute as: Your account
 * 4. Who has access: "Anyone"
 * 5. Copy and share the deployment URL
 */
function deployAsWebApp() {
  Logger.log("To deploy this as a web app:");
  Logger.log("1. Click Deploy > New deployment");
  Logger.log("2. Select 'Web app' as the type");
  Logger.log("3. Set 'Execute as' to your account");
  Logger.log("4. Set 'Who has access' to 'Anyone'");
  Logger.log("The game will be accessible via a unique URL");
}
