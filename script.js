/**
 * FILE: script.js
 * PURPOSE: Core logic engine. Handles Navigation, Rendering, and Interactions.
 * 
 * CONNECTED FILES:
 * - index.html (Manipulates DOM elements defined here)
 * - Updates/blog-data.js (READS data from global `BLOG_DATA` array)
 * - Updates/about-data.js (READS data from global `ABOUT_DATA` object)
 * - Updates/scrolltxt-footer.js (READS data for footer)
 * 
 * KEY FUNCTIONS:
 * - handleNavigation(): Manages page switching (Home <-> Sections).
 * - renderSkeleton(): Shows offline UI when internet drops.
 * - runBootSequence(): Handles the Radio Wave / PWA Splash startup.
 */



// Implements the "Same page itself everything happens" logic with Dynamic JSON Loading

document.addEventListener('DOMContentLoaded', () => {
    const navLeftBtn = document.getElementById('navLeftBtn');
    const navRightBtn = document.getElementById('navRightBtn');
    const navDropdown = document.getElementById('navDropdown');
    const mainContent = document.getElementById('mainContent');

    // Views
    window.homeView = document.getElementById('home-view');
    window.dynamicContainer = document.getElementById('dynamic-content-container');

    const mbImage = document.querySelector('.mb'); // The person image
    const bootScreen = document.getElementById('boot-screen');
    const deviceFrame = document.querySelector('.device-frame');

    // Navigation Data
    window.pages = [
        {
            id: 'home',
            title: 'UN <span class="reversed">R</span>ESTRICTED <span class="green-text">AREA</span>',
            headerTitle: 'HOME',
            icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>`
        },
        {
            id: 'about',
            title: 'ABOUT <span class="green-text">ME</span>',
            headerTitle: 'ABOUT',
            icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
        },
        {
            id: 'works',
            title: 'SELECTED <span class="green-text">WORKS</span>',
            headerTitle: 'WORKS',
            icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`
        },
        {
            id: 'blog',
            title: 'MY <span class="green-text">BLOG</span>',
            headerTitle: 'BLOG',
            icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`
        },

        {
            id: 'vibe',
            title: 'VIBE <span class="green-text">ZONE</span>',
            headerTitle: 'VIBE',
            icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12l-4.74-4.74 1.4-1.4 4.74 4.74"></path><path d="M12 9l4.74-4.74 1.4 1.4-4.74 4.74"></path></svg>`
        },
        {
            id: 'contact',
            title: 'CONTACT <span class="green-text">ME</span>',
            headerTitle: 'CONTACT',
            icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`
        }
    ];

    window.currentPageIndex = 0;

    // UI Elements
    // Fixed: 'iconContainer' now refers to the WRAPPER (div) for animation
    const iconContainer = document.getElementById('iconContainer');
    // New: 'iconDisplaySpan' refers to the inner span for content updates
    const iconDisplaySpan = document.querySelector('.icon-display');

    const pageNameDisplay = document.getElementById('pageNameDisplay');
    // --- Boot Screen Elements ---
    // (Already declared above)
    const homeBtn = document.getElementById('homeBtn');

    // --- Google Drive Modal Elements ---
    const driveModal = document.getElementById('driveModal');
    const driveModalContainer = document.querySelector('.drive-modal-container');
    const closeDriveBtn = document.getElementById('closeDriveBtn');
    const driveFrame = document.getElementById('driveFrame');
    // Actual folder ID provided by user
    const GDRIVE_ID = "1U3xUj-a0QxP720mXNEAFqrYHXrT_3xBV";


    // --- Content Fetching & Rendering ---



    async function loadContent(pageId) {
        dynamicContainer.innerHTML = '<div class="loading-text">LOADING DATA...</div>';

        switch (pageId) {
            case 'about':
                renderAbout();
                break;
            case 'works':
                renderWorks();
                break;
            case 'blog':
                renderBlog();
                break;
            case 'vibe':
                renderVibe();
                break;
            case 'contact':
                renderContact();
                break;
            default:
                break;
        }
    }

    // --- RENDERERS ---

    function renderFooter() {
        if (typeof FOOTER_DATA === 'undefined') return;
        const footerSpans = document.querySelectorAll('.scrolling-text-item');
        // Repeat text to ensure it spans across the screen (News Ticker style)
        // Creating a long string: "TEXT   TEXT   TEXT   TEXT"
        const repeatedText = Array(4).fill(FOOTER_DATA.text).join('&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  &nbsp; &nbsp; &nbsp;');

        footerSpans.forEach(span => {
            span.innerHTML = repeatedText; // Use innerHTML to parse spacers
        });
    }

    // Initialize Global Elements
    renderFooter();

    /* =========================================
       SECTION: Content Rendering Logic
       PURPOSE: Functions that inject HTML into the dynamic container.
       ========================================= */

    function renderAbout() {

        if (typeof ABOUT_DATA === 'undefined') {
            dynamicContainer.innerHTML = '<div class="loading-text">ABOUT DATA NOT FOUND</div>';
            return;
        }

        // Generate Paragraphs
        let paragraphsHTML = '';
        ABOUT_DATA.paragraphs.forEach(para => {
            paragraphsHTML += `<p>${para}</p>`;
        });

        dynamicContainer.innerHTML = `
            <div class="content-wrapper about-content">
                <h2>${ABOUT_DATA.title}</h2>
                <div class="scroll-wrapper">
                    ${paragraphsHTML}
                    <br>
                    <p><strong>${ABOUT_DATA.skillsTitle}</strong> ${ABOUT_DATA.skills}</p>
                    <br>
                    ${ABOUT_DATA.tagline ? `<br><p class="green-text" style="font-weight:bold; letter-spacing: 1px;">${ABOUT_DATA.tagline}</p>` : ''}
                    ${ABOUT_DATA.author ? `<br><p style="text-align: right; margin-top: 10px;">${ABOUT_DATA.author}</p>` : ''}
                </div>
                <div class="scifi-decoration">
                    <div class="line"></div>
              
                </div>
            </div>
        `;
        // dot also we can add <div class="dot"></div>
    }

    function renderWorks() {
        dynamicContainer.innerHTML = `
            <div class="content-wrapper works-content center-layout">
                <div class="circular-nav-container">
                    <svg class="rotating-text-svg" viewBox="0 0 200 200">
                        <defs>
                            <path id="circlePath" d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0" />
                        </defs>
                        <text>
                            <textPath xlink:href="#circlePath" class="circle-text-path" startOffset="1%" text-anchor="middle">
                                <tspan fill="#ffffff">•</tspan>
                            </textPath>
                            <textPath xlink:href="#circlePath" class="circle-text-path" startOffset="26%" text-anchor="middle">
                                <tspan fill="#ffffff">SELECTED</tspan> WORKS
                            </textPath>
                            <textPath xlink:href="#circlePath" class="circle-text-path" startOffset="51%" text-anchor="middle">
                                <tspan fill="#ffffff">•</tspan>
                            </textPath>
                            <textPath xlink:href="#circlePath" class="circle-text-path" startOffset="76%" text-anchor="middle">
                                <tspan fill="#ffffff">SELECTED</tspan> WORKS
                            </textPath>
                        </text>
                    </svg>
                    <a href="javascript:void(0)" class="tap-here-btn" onclick="openDriveModal(this); return false;">
                        TAP<br>HERE
                    </a>
                </div>
            </div>
        `;
        // Inline onclick handles the event now, no external listener needed.
    }

    function renderVibe() {
        dynamicContainer.innerHTML = `
            <div class="vibe-content">
                <div class="game-container">
                    <!-- HUD Bar (Solid Top) -->
                    <div class="hud-bar">
                        <div class="score-display">
                            P: <span id="scoreVal">0</span> L: <span id="levelVal">1</span>
                        </div>
                        <div class="hud-controls">
                            <button id="manualPauseBtn" class="hud-btn" title="Pause">II</button>
                            <button id="manualStopBtn" class="hud-btn" title="Stop">X</button>
                        </div>
                    </div>

                    <!-- Canvas Wrapper (Game Area) -->
                    <div class="canvas-wrapper">
                        <canvas id="gameCanvas" width="320" height="215"></canvas>
                        <div id="gameOverlay" class="game-ui-layer">
                            <!-- Start Screen -->
                            <div id="startScreen" class="overlay-screen active">
                                <h2 style="color:#00ff00; font-size: 1.2rem; margin-bottom: 5px;">ROCKET DEFENSE</h2>
                                <button id="startGameBtn" class="game-btn">START</button>
                            </div>

                            <!-- Pause Screen -->
                            <div id="pauseScreen" class="overlay-screen">
                                <h2>PAUSED</h2>
                                <button id="resumeGameBtn" class="game-btn">RESUME</button>
                                <button id="quitGameBtn" class="game-btn">QUIT</button>
                            </div>

                            <!-- Game Over Screen -->
                            <div id="gameOverScreen" class="overlay-screen">
                                <h2 style="color:red; font-size: 1.2rem;">FAILED</h2>
                                <p>SCORE: <span id="finalScore">0</span></p>
                                <button id="restartGameBtn" class="game-btn">RETRY</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="game-controls-pad">
                    <div class="d-pad">
                        <button id="btnUp" class="ctrl-btn">▲</button>
                        <button id="btnDown" class="ctrl-btn">▼</button>
                    </div>
                    <!-- System controls moved to HUD -->
                    <div class="action-pad">
                        <button id="btnFire" class="ctrl-btn fire-btn">FIRE</button>
                    </div>
                </div>
            </div>
        `;
        // Initialize Game Logic
        setTimeout(initGameLogic, 100);
    }


    function renderBlog(filterText = '') {
        if (typeof BLOG_DATA === 'undefined') {
            dynamicContainer.innerHTML = '<div class="loading-text">BLOG DATA NOT FOUND</div>';
            return;
        }

        let blogHTML = `<div class="content-wrapper blog-content">`;

        // 1. Sort by Date (Latest First)
        const sortedPosts = [...BLOG_DATA].sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });

        // 2. Filter Data
        const upperFilter = filterText.toUpperCase().trim();
        const filteredPosts = sortedPosts.filter(post => {
            if (!upperFilter) return true;
            return (post.title && post.title.toUpperCase().includes(upperFilter)) ||
                (post.category && post.category.toUpperCase().includes(upperFilter)) ||
                (post.preview && post.preview.toUpperCase().includes(upperFilter));
        });

        // 3. Loop through Filtered Data
        if (filteredPosts.length > 0) {
            filteredPosts.forEach(post => {
                blogHTML += `
                    <div class="blog-card" onclick="openBlogModal(${post.id}, this); updateBlogURL(${post.id});">
                        <div class="blog-info">
                            <div class="blog-date" style="text-transform: uppercase;">${post.category || 'GENERAL'}</div>
                            <div class="blog-title">${post.title}</div>
                            <div class="blog-preview">${post.preview}</div>
                        </div>
                    </div>
                `;
            });
        } else {
            // No Results
            blogHTML += `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; position: fixed; top: 0; left: 0; width: 100%; height: 100%; text-align: center; color: var(--primary-green); margin-right: -25px; overflow: hidden; z-index: 0; pointer-events: none;">
                    <h4>NO TRANSMISSION FOUND</h4><br>
                    <p class="asp" style="opacity: 0.7;">ADJUST SEARCH PARAMETERS</p>
                </div>
            `;
        }

        blogHTML += `</div>`;
        dynamicContainer.innerHTML = blogHTML;
    }

    // Helper to update URL and Schema when opening blog
    window.updateBlogURL = function (id) {
        history.pushState({ page: 'blog', id: id }, '', `?page=blog&id=${id}`);
        updatePageMetadata('blog', { id: id });

        // Find post data
        const post = BLOG_DATA.find(p => p.id === id);
        if (post) {
            const schemaId = 'dynamic-blog-schema';
            let script = document.getElementById(schemaId);
            if (!script) {
                script = document.createElement('script');
                script.id = schemaId;
                script.type = 'application/ld+json';
                document.head.appendChild(script);
            }

            // Dynamic Article Schema
            const schema = {
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                "headline": post.title,
                "image": [
                    `https://www.mathewsb.in/${post.media}`
                ],
                "datePublished": new Date(post.date).toISOString().split('T')[0],
                "author": {
                    "@type": "Person",
                    "name": "Mathews B"
                },
                "description": post.preview
            };

            script.text = JSON.stringify(schema);
        }
    };


    function renderContact() {
        dynamicContainer.innerHTML = `
            <div class="content-wrapper contact-content" style="display:flex; flex-direction:column; justify-content:center; height:100%; text-align: left;">
                
                <!-- Slightly smaller header (80% of original), LEFT ALIGNED -->
                <h2 style="font-size:1.5rem; margin-bottom:5px; text-align: left; width: 100%;">ESTABLISH <span class="green-text">CONNECTION</span></h2>
                
                <!-- Smaller paragraph, CSS Class Controlled, Custom Line Breaks -->
                <p class="contact-text-block">
                    Available for <i>freelance opportunities and collaborations.</i> And also for<span style='background: black; color: #00ff00; padding: 0 5px;'>any doubts, free to connect.</span>
                </p>

                <!-- OPEN FORM BUTTON -->
                <div style="margin-bottom:20px; text-align:left;">
                    <a href="#" class="submit-btn" onclick="event.preventDefault(); openContactModal(this);" style="display:inline-block; text-decoration:none; padding:10px 30px;">
                        INITIATE TRANSMISSION
                    </a>
                </div>

                <!-- Icons Row -->
                <div class="social-icons-row" style="display:flex; gap:30px; justify-content:flex-start; align-items:center;">
                    
                    <!-- MAIL -->
                    <a href="mailto:hello@mathewsb.in" class="icon-link" aria-label="Email">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                    </a>

                    <!-- LINKEDIN -->
                    <a href="https://www.linkedin.com/in/mathews-b-designer" target="_blank" class="icon-link" aria-label="LinkedIn">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                            <rect x="2" y="9" width="4" height="12"></rect>
                            <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                    </a>



                </div>

                <!-- Ambient "Cyber Fly" -->
                <div class="cyber-fly" id="cyberFly">
                    <span class="buzz-text">bzz..</span>
                </div>
            </div>
        `;

        // Start Insect AI
        setTimeout(() => {
            const fly = document.getElementById('cyberFly');
            const container = document.querySelector('.contact-content');
            if (!fly || !container) return;

            // --- CLICK LISTENER FOR AI BOX (CONTACT PAGE) ---
            fly.style.cursor = 'pointer';
            fly.style.pointerEvents = 'auto';
            fly.title = "Click to talk to Buzz AI";

            const triggerInsectPage = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (window.openInsectAi) window.openInsectAi(fly);
            };

            fly.addEventListener('click', triggerInsectPage);
            fly.addEventListener('touchstart', triggerInsectPage, { passive: false });

            // Targets to land on: Headers, Paragraphs, Icons
            const targets = container.querySelectorAll('h2, p, .icon-link, .submit-btn');

            let isLanded = false;

            function moveFly() {
                // Return if user navigated away (fly removed)
                if (!document.getElementById('cyberFly')) return;

                if (isLanded) {
                    // Take off!
                    isLanded = false;
                    fly.classList.remove('landed');
                    fly.classList.add('buzzing'); // Buzz when taking off
                    setTimeout(() => fly.classList.remove('buzzing'), 500);

                    // Fly to random spot first
                    const x = Math.random() * (container.clientWidth - 20);
                    const y = Math.random() * (container.clientHeight - 20);
                    animateTo(x, y, 1000 + Math.random() * 1000, moveFly);
                } else {
                    // Decide: Land or Fly around?
                    // 40% chance to land if targets exist
                    const wantToLand = Math.random() < 0.4 && targets.length > 0;

                    if (wantToLand) {
                        // Pick random target
                        const target = targets[Math.floor(Math.random() * targets.length)];
                        // Get relative coordinates
                        const contRect = container.getBoundingClientRect();
                        const tgtRect = target.getBoundingClientRect();

                        // Calculate relative position within container
                        const relL = tgtRect.left - contRect.left;
                        const relT = tgtRect.top - contRect.top;

                        // Pick random spot ON the element
                        const landX = relL + Math.random() * tgtRect.width;
                        const landY = relT + Math.random() * tgtRect.height;

                        // Move there
                        animateTo(landX, landY, 1500, () => {
                            // Landed!
                            isLanded = true;
                            fly.classList.add('landed');

                            // Maybe buzz while sitting?
                            if (Math.random() < 0.5) {
                                setTimeout(() => {
                                    if (isLanded) fly.classList.add('buzzing');
                                }, 500);
                                setTimeout(() => {
                                    fly.classList.remove('buzzing');
                                }, 1500);
                            }

                            // Sit for 2-4 seconds then move
                            setTimeout(moveFly, 2000 + Math.random() * 2000);
                        });
                    } else {
                        // Just fly somewhere




                        const x = Math.random() * (container.clientWidth - 20);
                        const y = Math.random() * (container.clientHeight - 20);
                        animateTo(x, y, 1000 + Math.random() * 2000, moveFly);
                    }
                }
            }

            function visitTaskbarBox(taskbarTarget) {
                isVisiting = true;
                // 1. Get Coordinates
                const startRect = fly.getBoundingClientRect();
                const endRect = taskbarTarget.getBoundingClientRect();

                // Hide Original
                fly.style.opacity = '0';

                const startX = startRect.left + startRect.width / 2;
                const startY = startRect.top + startRect.height / 2;
                const endX = endRect.left + endRect.width / 2;
                const endY = endRect.top + endRect.height / 2 - 40; // Hover slightly above

                // Path: Start -> Taskbar -> Start
                animateFlyTransfer(startX, startY, endX, endY, () => {
                    // At destination (Taskbar).

                    const visitFly = document.createElement('div');
                    visitFly.className = 'cyber-fly fixed-flight buzzing';
                    visitFly.style.left = endX + 'px';
                    visitFly.style.top = endY + 'px';
                    // Random rotation
                    visitFly.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`;
                    document.body.appendChild(visitFly);

                    setTimeout(() => {
                        visitFly.remove();
                        // Fly Back
                        animateFlyTransfer(endX, endY, startX, startY, () => {
                            fly.style.opacity = '1';
                            isVisiting = false; // Reset flag
                            moveFly();
                        });
                    }, 1500); // Talk for 1.5s
                });
            }

            function animateTo(x, y, duration, callback) {
                // Calculate rotation to face direction
                const currentLeft = parseFloat(fly.style.left) || 0;
                const currentTop = parseFloat(fly.style.top) || 0;

                const deltaX = x - currentLeft;
                const deltaY = y - currentTop;
                const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90; // +90 because our bug faces up/down? or adjustment. 
                // CSS Rotate: 0deg is usually up or right. Let's assume standard rotation.
                // Actually my CSS wing flutter is scaleY, which implies body is vertical. 
                // Let's set rotation.

                fly.style.transition = `top ${duration}ms ease-in-out, left ${duration}ms ease-in-out, transform 0.5s linear`;
                fly.style.left = `${x}px`;
                fly.style.top = `${y}px`;
                fly.style.transform = `rotate(${angle}deg)`;

                setTimeout(callback, duration);
            }

            // Initial Start
            // Set initial position to center to avoid 0,0 jump
            fly.style.left = (container.clientWidth / 2) + 'px';
            fly.style.top = (container.clientHeight / 2) + 'px';
            moveFly();
        }, 100);
    }


    // Optional: Trigger exit modal on back button if at home?
    // For now, user claims they can open it, so we just fix the buttons.
    window.updateContent = function () {
        const page = pages[currentPageIndex];
        const audioPlayerContainer = document.querySelector('.centered-audio-player');

        // 1. Update Header Info
        if (pageNameDisplay) pageNameDisplay.textContent = page.headerTitle;
        if (iconDisplaySpan) iconDisplaySpan.innerHTML = page.icon;



        // 1.5. Dynamic Container Class Management
        const pageId = page.id;

        // Remove previous page-specific classes
        dynamicContainer.classList.remove('about-container', 'works-container', 'blog-container', 'vibe-container', 'contact-container');

        // Trigger Contact Guide
        if (pageId === 'contact' && window.showContactGuide) {
            window.showContactGuide();
        }

        // Add new class based on pageId
        if (pageId !== 'home') {
            dynamicContainer.classList.add(`${pageId}-container`);
        }

        // 1.6. Toggle No-Scroll for Vibe/Contact
        if (pageId === 'vibe' || pageId === 'contact') {
            dynamicContainer.classList.add('noscroll-container');
        } else {
            dynamicContainer.classList.remove('noscroll-container');
        }

        // --- BLOG SEARCH VISIBILITY ---
        const searchContainer = document.getElementById('blogSearchContainer');
        if (searchContainer) {
            if (pageId === 'blog') {
                searchContainer.style.display = 'block';
                // Reset input on entry? Optional. Let's keep state for now.
            } else {
                searchContainer.style.display = 'none';
            }
        }
        // ------------------------------

        // 2. Toggle Views
        if (page.id === 'home') {
            // SHOW HOME
            document.body.classList.remove('hide-audio'); // Ensure audio is visible
            document.body.classList.remove('works-mode'); // Remove works mode
            homeView.classList.remove('hidden-view');
            homeView.classList.add('active-view');
            dynamicContainer.classList.remove('active-view');
            dynamicContainer.classList.add('hidden-view');

            // Show Person Image on Home
            if (mbImage && document.body.classList.contains('intro-finished')) {
                // Replay entry animation when coming back to home
                playHeroEntry();
            }

            // Hide Home Button via CSS or JS
            if (homeBtn) homeBtn.style.display = 'none';

            // FULL AUDIO PLAYER
            if (audioPlayerContainer) {
                audioPlayerContainer.classList.remove('minimal-player');
                // audioPlayerContainer.style.display = 'flex'; // Handled by CSS class removal
            }

        } else if (page.id === 'works') {
            // SPECIAL CASE: User wants NO audio player stuff on Works page

            document.body.classList.add('works-mode'); // Specific class for Works page styling (e.g., hide scrollbar)

            // SHOW DYNAMIC
            homeView.classList.remove('active-view');
            homeView.classList.add('hidden-view');
            dynamicContainer.classList.remove('hidden-view');
            dynamicContainer.classList.add('active-view');

            // Load specific data
            loadContent(page.id);

            // Show Person Image on other pages too (Ghost Effect)
            if (mbImage) {
                mbImage.style.display = 'block';
            }

            // Show Home Button
            if (homeBtn) homeBtn.style.display = 'block';

        } else {
            // SHOW DYNAMIC (About, Contact)
            document.body.classList.remove('hide-audio'); // Ensure audio is visible
            document.body.classList.remove('works-mode'); // Remove works mode

            homeView.classList.remove('active-view');
            homeView.classList.add('hidden-view');
            dynamicContainer.classList.remove('hidden-view');
            dynamicContainer.classList.add('active-view');

            // Load specific data
            loadContent(page.id);

            // Show Person Image on other pages too (Ghost Effect)
            if (mbImage) {
                mbImage.style.display = 'block';
                // Ensure opacity is 1 so animation controls it, or let animation handle it.
                // We don't force opacity 0 here anymore.
            }

            // Show Home Button
            if (homeBtn) homeBtn.style.display = 'block';

            // MINIMAL AUDIO PLAYER
            if (audioPlayerContainer) {
                audioPlayerContainer.classList.add('minimal-player');
                // audioPlayerContainer.style.display = 'flex'; // Handled by CSS class removal
            }
        }

        console.log(`Navigated to page ${currentPageIndex}: ${page.title}`);
    }

    // --- Unified Transition Helper ---
    let isTransitioning = false; // Prevent rapid clicking

    window.transitionView = function (updateCallback) {
        if (isTransitioning) return; // Block concurrent transitions
        isTransitioning = true;

        // 1. Fade Out Current View
        // Find the currently active view (Home or Dynamic)
        const currentActive = document.querySelector('.active-view');

        if (currentActive) {
            // We use inline style or class. Since .active-view has opacity 1,
            // we can just force opacity 0 inline to trigger transition.
            currentActive.style.opacity = '0';
        }

        if (pageNameDisplay) pageNameDisplay.classList.add('fade-out');
        if (iconDisplaySpan) iconDisplaySpan.classList.add('fade-out');

        // 2. Wait for transition (Increased to 600ms for slower smoother feel)
        setTimeout(() => {
            // 3. Update Content (This swaps .active-view / .hidden-view classes)
            try {
                updateCallback();
            } catch (e) {
                console.error("Error during view transition:", e);
            } finally {
                // Clean up the manual opacity override we set on the OLD active element
                if (currentActive) {
                    currentActive.style.opacity = '';
                }

                // The NEW active view (set by updateCallback) will have .active-view class.
                // CSS handles the fade-in (opacity 0 -> 1).

                if (pageNameDisplay) pageNameDisplay.classList.remove('fade-out');
                if (iconDisplaySpan) iconDisplaySpan.classList.remove('fade-out');

                // Ensure MainContent is visible (just in case)
                mainContent.style.opacity = '1';

                // Release Lock
                isTransitioning = false;
            }

        }, 600); // Slower transition (was 400ms)
    }

    /* =========================================
       SECTION: Navigation Controller
       PURPOSE: Handles state changes, URL updates, and View Transitions.
       ========================================= */

    function handleNavigation(direction) {
        if (isTransitioning) return; // Double check (though transitionView handles it)

        // Cleanup Vibe Game if leaving it
        if (pages[currentPageIndex].id === 'vibe') {
            if (typeof cleanupGame === 'function') cleanupGame();
        }

        // 1. Calculate Next Index (Predictive)
        let nextIndex;
        if (direction === 'next') {
            nextIndex = (currentPageIndex + 1) % pages.length;
        } else {
            nextIndex = (currentPageIndex - 1 + pages.length) % pages.length;
        }

        // 2. Visual Updates IMMEDIATELY (Responsiveness)
        renderDropdown(nextIndex); // Show next page as active in dropdown
        updateNavButtons('standard'); // Reset button to next (Standard State)
        startNavLoop(); // Reset loop timer

        // 3. Trigger View Transition
        transitionView(() => {
            // 4. Update Actual State (Inside Callback - Safe)
            currentPageIndex = nextIndex;

            // Update URL
            const pageId = pages[currentPageIndex].id;
            const newUrl = `?page=${pageId}`;
            history.pushState({ page: pageId }, '', newUrl);

            updateContent();
            updatePageMetadata(pageId);

            // Re-render dropdown with actual index (to be sure)
            renderDropdown();
        });
    }

    // --- Dynamic Meta Tags ---
    // --- Dynamic Meta Tags ---
    function updatePageMetadata(pageId, extraData = null) {
        const baseTitle = "Mathews B";
        let title = baseTitle;
        let description = "Portfolio of Mathews B - Creative Designer, Product Designer, and Web Developer.";

        switch (pageId) {
            case 'home':
                title = baseTitle;
                description = "Im Mathews B, a Creative Generalist, Product Designer, and Web Developer based in Kozhikode, Kerala, India. Specializing in UI/UX, Motion Graphics, and Interactive Storytelling.";
                break;
            case 'about':
                title = "About";
                if (typeof ABOUT_DATA !== 'undefined' && ABOUT_DATA.paragraphs) {
                    const tempDiv = document.createElement("div");
                    tempDiv.innerHTML = ABOUT_DATA.paragraphs[0];
                    description = tempDiv.textContent || tempDiv.innerText || "";
                }
                break;
            case 'works':
                title = "Works";
                description = "Explore the selected works and projects of Mathews B, showcasing UI/UX design, motion graphics, and creative development.";
                break;
            case 'vibe':
                title = "Vibe";
                description = "Experience the Vibe Zone. A place for interactive experiments and gaming.";
                break;
            case 'contact':
                title = "Contact";
                description = "Get in touch with Mathews B for freelance opportunities, collaborations, or just to say hello. Based in Kozhikode, Kerala.";
                break;
            case 'blog':
                title = "Blog";
                description = "Read the latest thoughts, tutorials, and updates from Mathews B on Design, Technology, and Creativity.";
                if (extraData && extraData.id) {
                    const post = BLOG_DATA.find(p => p.id == extraData.id);
                    if (post) {
                        title = `${post.title} - Mathews B Blog`;
                        description = post.preview;
                    }
                }
                break;
        }

        document.title = title;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', description);

        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', title);

        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', description);
    }



    // --- Event Listeners ---

    // --- Navigation & Dropdown Logic ---

    // --- Synchronized Looping Navigation Logic ---
    let navLoopInterval;
    let isLoopActive = false;
    let currentLoopState = 'standard'; // 'standard' (Prev/Next) or 'morphed' (Next/Hb)
    let isMenuOpen = false;

    // Elements
    // const navLeftBtn = document.getElementById('navLeftBtn'); // Already declared
    // const navRightBtn = document.getElementById('navRightBtn'); // Already declared
    // const navDropdown = document.getElementById('navDropdown'); // Already declared

    // SVGs / Icons
    const iconPrev = `<span class="btn-content rotate-enter">&lt;</span>`;
    const iconNext = `<span class="btn-content rotate-enter">&gt;</span>`;
    const iconHamburger = `<span class="btn-content rotate-enter"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg></span>`;
    const iconClose = `<span class="btn-content rotate-enter"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span>`;

    function updateNavButtons(state) {
        currentLoopState = state;

        // If Menu is Open, Force specific state (Close button on Right)
        if (isMenuOpen) {
            if (navRightBtn && navRightBtn.dataset.iconType !== 'close') {
                navRightBtn.innerHTML = iconClose;
                navRightBtn.style.border = '1px solid var(--primary-green)';
                navRightBtn.dataset.iconType = 'close';
            }
            if (navLeftBtn && navLeftBtn.dataset.iconType !== 'prev') {
                navLeftBtn.innerHTML = iconPrev;
                navLeftBtn.dataset.iconType = 'prev';
            }
            return;
        }

        // Standard State: Left=Prev, Right=Next
        if (state === 'standard') {
            if (navLeftBtn && navLeftBtn.dataset.iconType !== 'prev') {
                navLeftBtn.innerHTML = iconPrev;
                navLeftBtn.dataset.iconType = 'prev';
            }
            if (navRightBtn) {
                if (navRightBtn.dataset.iconType !== 'next') {
                    navRightBtn.innerHTML = iconNext;
                    navRightBtn.dataset.iconType = 'next';
                }
                // Ensure border is correct (always check or just set?)
                // Setting style property is cheap, innerHTML is expensive/animates.
                if (navRightBtn.dataset.borderType !== 'standard') {
                    navRightBtn.style.border = '1px solid var(--primary-green)';
                    navRightBtn.dataset.borderType = 'standard';
                }
            }
        }
        // Morphed State: Left=Next, Right=Hamburger
        else if (state === 'morphed') {
            if (navLeftBtn && navLeftBtn.dataset.iconType !== 'next') {
                navLeftBtn.innerHTML = iconNext;
                navLeftBtn.dataset.iconType = 'next';
            }
            if (navRightBtn) {
                if (navRightBtn.dataset.iconType !== 'hamburger') {
                    navRightBtn.innerHTML = iconHamburger;
                    navRightBtn.dataset.iconType = 'hamburger';
                }
                if (navRightBtn.dataset.borderType !== 'standard') {
                    navRightBtn.style.border = '1px solid var(--primary-green)';
                    navRightBtn.dataset.borderType = 'standard';
                }
            }
        }
    }

    function startNavLoop() {
        stopNavLoop(); // Clear any existing
        if (isMenuOpen) return; // Don't loop if menu is open

        isLoopActive = true;
        navLoopInterval = setInterval(() => {
            // Check if hovered
            const leftHover = navLeftBtn && navLeftBtn.matches(':hover');
            const rightHover = navRightBtn && navRightBtn.matches(':hover');

            if (!leftHover && !rightHover) {
                // Toggle State
                const newState = currentLoopState === 'standard' ? 'morphed' : 'standard';
                updateNavButtons(newState);
            }
        }, 2000); // 2 Seconds per state
    }

    function stopNavLoop() {
        isLoopActive = false;
        clearInterval(navLoopInterval);
    }



    // Render Dropdown
    function renderDropdown(overrideIndex = null) {
        if (!navDropdown) return;
        navDropdown.innerHTML = '';

        const effectiveIndex = overrideIndex !== null ? overrideIndex : currentPageIndex;

        pages.forEach((page, index) => {
            // if (page.id === 'home') return; // User requested Home in dropdown

            const item = document.createElement('div');
            item.className = 'nav-dropdown-item';
            if (index === effectiveIndex) {
                item.classList.add('active-dropdown-item');
            }
            item.innerHTML = `${page.icon} <span>${page.headerTitle}</span>`;

            item.addEventListener('click', () => {
                toggleMenu(false);
                handleNavigationByIndx(index);
            });

            navDropdown.appendChild(item);
        });
    }

    function toggleMenu(forceState = null) {
        if (!navDropdown) return;
        const shouldOpen = forceState !== null ? forceState : navDropdown.classList.contains('hidden-dropdown'); // If hidden, we want to open (true)

        if (shouldOpen) {
            // Open Menu
            isMenuOpen = true;
            navDropdown.classList.remove('hidden-dropdown');
            stopNavLoop(); // Pause loop
            updateNavButtons('standard'); // Will be overridden by isMenuOpen check inside updateNavButtons?
            // Actually updateNavButtons checks isMenuOpen.
            // Force update to show Close icon
            updateNavButtons(currentLoopState);
        } else {
            // Close Menu
            isMenuOpen = false;
            navDropdown.classList.add('hidden-dropdown');
            updateNavButtons('standard');
            startNavLoop(); // Resume loop
        }
    }

    // --- Event Listeners ---

    // Left Button
    if (navLeftBtn) {
        navLeftBtn.addEventListener('mouseenter', stopNavLoop);
        navLeftBtn.addEventListener('mouseleave', startNavLoop);
        navLeftBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (isMenuOpen) {
                // Optional: Close menu if clicking outside? 
                // For now, let's allow navigation even if menu is open?
                // Or maybe Left Button acts as Prev always?
            }

            // Action depends on state
            if (currentLoopState === 'standard') {
                handleNavigation('prev');
            } else {
                handleNavigation('next'); // Left button acts as Next in morphed state
            }
        });
    }

    // Right Button
    if (navRightBtn) {
        navRightBtn.addEventListener('mouseenter', stopNavLoop);
        navRightBtn.addEventListener('mouseleave', startNavLoop);
        navRightBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (isMenuOpen) {
                toggleMenu(false);
                return;
            }

            if (currentLoopState === 'standard') {
                handleNavigation('next');
            } else {
                toggleMenu(true);
            }
        });
    }

    // Initialize
    updateNavButtons('standard');
    renderDropdown();
    startNavLoop();

    // --- Click Outside to Close Menu ---
    document.addEventListener('click', (e) => {
        if (isMenuOpen && navDropdown && !navDropdown.contains(e.target)) {
            // If the user clicked the hamburger, that button's listener handles the toggle.
            // The button listener uses e.stopPropagation(), so this listener should not fire for button clicks.
            // But explicit check adds safety.
            if (navRightBtn && navRightBtn.contains(e.target)) return;

            toggleMenu(false);
        }
    });

    // Helper for direct navigation
    function handleNavigationByIndx(index) {
        if (index === currentPageIndex) return;
        if (window.isTransitioning) return;

        // Cleanup Vibe if needed
        if (pages[currentPageIndex].id === 'vibe') {
            if (typeof cleanupGame === 'function') cleanupGame();
        }

        transitionView(() => {
            currentPageIndex = index;
            const pageId = pages[currentPageIndex].id;
            const newUrl = `?page=${pageId}`;
            history.pushState({ page: pageId }, '', newUrl);
            updateContent();
            updatePageMetadata(pageId);
            renderDropdown(); // Update active state in dropdown
        });
    }

    // Dropdown outside click listener REMOVED.

    // Cycle Start REMOVED.




    // --- 3D Home Button Logic ---

    // 1. Home Face Click -> Go Home


    // 2. Menu Face Click -> Open Nav Modal








    if (homeBtn) {
        homeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Cleanup Vibe Game if leaving it
            if (pages[currentPageIndex].id === 'vibe') {
                if (typeof cleanupGame === 'function') cleanupGame();
            }

            transitionView(() => {
                currentPageIndex = 0;
                // Update URL
                history.pushState({ page: 'home' }, '', '?page=home');

                // Force reset for home
                if (dynamicContainer) dynamicContainer.innerHTML = '';
                updateContent();
                updatePageMetadata('home');
            });
        });
    }





    // --- Animation Helper ---
    // --- Animation Helper ---
    function playHeroEntry() {
        if (!mbImage) return;

        // Reset Animation State
        mbImage.classList.remove('animate-ghost');
        mbImage.classList.remove('entry-anim');
        mbImage.classList.remove('slide-up-initial'); // Ensure this is removed

        // Force Reflow
        void mbImage.offsetWidth;

        // Ensure Display is Block
        mbImage.style.display = 'block';
        mbImage.style.opacity = ''; // Let CSS handle it
        mbImage.style.transition = ''; // clear any inline transitions

        // Trigger Entry Animation (CSS Keyframes)
        mbImage.classList.add('entry-anim');

        // Wait for animation to finish (2.5s) then switch to Ghost Loop
        setTimeout(() => {
            mbImage.classList.remove('entry-anim');
            mbImage.classList.add('animate-ghost');
        }, 2500);
    }

    // --- Boot Sequence ---
    const runBootSequence = (skipBoot = false) => {
        if (!bootScreen) return;

        // --- PWA SPLASH HANDLING ---
        const pwaSplash = document.getElementById('pwa-splash');
        const isPWA = window.matchMedia('(display-mode: standalone)').matches;

        if (isPWA && pwaSplash && !skipBoot) {
            // If PWA, we wait for the Splash Logo (Green Screen) to finish FIRST.
            // Then we fade it out and start the standard Radio Wave boot.
            setTimeout(() => {
                pwaSplash.style.opacity = '0';
                setTimeout(() => {
                    pwaSplash.style.display = 'none';
                    // NOW Start Standard Radio Wave Boot
                    startStandardBoot(skipBoot);
                }, 500);
            }, 2000); // Reduced from 4200ms
            return;
        }

        startStandardBoot(skipBoot);
    };

    const startStandardBoot = (skipBoot) => {
        // If specific content is requested via URL, skip the long boot sequence
        if (skipBoot) {
            bootScreen.style.display = 'none';
            document.body.classList.add('intro-finished');
            if (deviceFrame) deviceFrame.classList.add('intro-finished');
            if (mbImage) {
                mbImage.classList.add('entry-anim');
                mbImage.style.display = 'block';
                // Ensure ghost animation starts after a moment
                setTimeout(() => mbImage.classList.add('animate-ghost'), 100);
            }
            return;
        }

        bootScreen.style.display = 'flex';
        void bootScreen.offsetWidth;
        bootScreen.style.opacity = '1';
        document.body.classList.remove('intro-finished');
        if (deviceFrame) deviceFrame.classList.remove('intro-finished');
        if (mbImage) {
            mbImage.style.opacity = '0';
            mbImage.style.display = 'none';
        }

        setTimeout(() => {
            bootScreen.style.display = 'none';
            if (deviceFrame) {
                deviceFrame.classList.add('glitch-blast');

                // Trigger Intro Animations IMMEDIATELY (Meteors + Text Glitch)
                if (deviceFrame) deviceFrame.classList.add('intro-finished');
                document.body.classList.add('intro-finished');

                setTimeout(() => {
                    deviceFrame.classList.remove('glitch-blast');

                    // DELAYED Hero Entry (Wait for animations to play a bit)
                    setTimeout(() => {
                        if (mbImage) {
                            // Reveal Hero Image
                            if (typeof playHeroEntry === 'function') {
                                playHeroEntry();
                            } else {
                                // Fallback
                                mbImage.style.display = 'block';
                                mbImage.classList.add('entry-anim'); // Use existing animation class
                            }
                        }
                    }, 500); // 0.5s Delay for Image (Smoother entry)

                }, 500);
            }

        }, 2000); // REDUCED: Fast Boot (was 4500)
    };

    // --- URL Routing ---
    function handleRouting() {
        const urlParams = new URL(window.location.href).searchParams;
        const pageParam = urlParams.get('page');
        const blogId = urlParams.get('blog'); // Legacy/Simple
        const idParam = urlParams.get('id'); // General ID
        const actionParam = urlParams.get('action'); // ACTION HANDLER (For Widgets)

        if (actionParam === 'play_music') {
            // WIDGET ACTION: Fast Boot + Auto Play
            runBootSequence(true); // Skip boot animation
            setTimeout(() => {
                if (bgAudio) {
                    // Try to play (May be blocked by browser policy without interaction, 
                    // but since it's an app launch, it often works)
                    bgAudio.play().catch(e => {
                        console.log("Auto-play blocked, waiting for interaction");
                    });
                    updatePlayerUI();
                }
            }, 500);
            return true;
        }

        if (pageParam) {
            const pageIndex = pages.findIndex(p => p.id === pageParam);
            if (pageIndex !== -1) {
                currentPageIndex = pageIndex;
                updateContent(); // Load the view
                updatePageMetadata(pageParam);

                // Special Handling for Blog Post
                if (pageParam === 'blog' && idParam !== null) {
                    // Wait for blog list to render then open modal
                    setTimeout(() => {
                        const post = BLOG_DATA.find(b => b.id == idParam);
                        if (post) {
                            // Helper function needs to be exposed or logic duplicated. 
                            // Since openBlogModal is global (in html onclick), likely defined below or need to attach.
                            // Checking if openBlogModal is in scopes. It is attached to window in script usually?
                            // Let's assume openBlogModal is available or we trigger the click.
                            if (typeof openBlogModal === 'function') {
                                openBlogModal(post.id, null); // null for element as we don't have the clicked card
                                updatePageMetadata('blog', { id: post.id });
                            }
                        }
                    }, 500);
                }
                return true; // Routed
            }
        }
        return false; // No route, standard boot
    }

    // Initial Load
    // updateContent(); // REMOVED: handleRouting calls it if needed, or fallback to 0

    // Check Route
    const hasRoute = handleRouting();

    if (!hasRoute) {
        updateContent(); // Default Home
        updatePageMetadata('home');
        if (bootScreen) runBootSequence();
    } else {
        // If routed, skip boot animation for faster access
        if (bootScreen) runBootSequence(true);
    }



    // --- Advanced Audio Controls (Restored) ---
    const bgAudio = document.getElementById('bg-audio');

    if (bgAudio) {
        // UI Elements
        const playPauseBtn = document.getElementById('playPauseBtn');
        const prevTrackBtn = document.getElementById('prevTrackBtn');
        const nextTrackBtn = document.getElementById('nextTrackBtn');
        const modeToggleBtn = document.getElementById('modeToggleBtn');
        const volumeSlider = document.getElementById('volumeSlider');
        const muteBtn = document.getElementById('muteBtn');
        const nowPlayingText = document.querySelector('.now-playing-text');

        // Resources
        const STREAM_URL = "https://stream.nightride.fm/nightride.mp3";
        // Use Global Playlist or empty array fallback
        const LOCAL_PLAYLIST = window.LOCAL_PLAYLIST || [];
        let localTrackIndex = 0;
        let isOnline = true;

        // DEBUG: Error Handling - Auto Fallback
        bgAudio.addEventListener('error', (e) => {
            console.error("Audio Error:", e);
            if (isOnline) {
                console.log("Stream failed, switching to Local...");
                isOnline = false; // Switch mode
                updateModeIcon();
                playTrack(localTrackIndex); // Try local
            } else {
                updateText("ERROR: CANNOT LOAD FILE");
            }
        });

        // Icons
        const playIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
        const pauseIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;

        const soundOnIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
        const soundOffIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
        const globeIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`;
        const fileIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg`;

        bgAudio.volume = 0.5;

        // Functions
        const updateText = (text) => {
            if (nowPlayingText) nowPlayingText.textContent = text;
        };

        const updatePlayerUI = () => {
            if (playPauseBtn) {
                playPauseBtn.innerHTML = bgAudio.paused ? playIcon : pauseIcon;
                if (bgAudio.paused) playPauseBtn.classList.add('is-paused');
                else playPauseBtn.classList.remove('is-paused');
            }
            if (muteBtn) muteBtn.innerHTML = bgAudio.muted ? soundOffIcon : soundOnIcon;
            if (modeToggleBtn) modeToggleBtn.innerHTML = isOnline ? globeIcon : fileIcon;
        };

        const loadTrack = (play = true) => {
            if (isOnline) {
                bgAudio.src = STREAM_URL;
                bgAudio.loop = false;
                updateText("(FM) NIGHT RIDE SYNTHWAVE");
            } else {
                const track = LOCAL_PLAYLIST[localTrackIndex];
                bgAudio.src = track.src;
                // bgAudio.loop = true; // CHANGED: Disable loop to allow auto-next
                bgAudio.loop = false;
                updateText(`(LOCAL) ${track.title}`);
            }
            if (play) {
                bgAudio.play().then(updatePlayerUI).catch(updatePlayerUI);
            }
        };

        // Event Listeners
        // Auto-Next Track Listener
        bgAudio.addEventListener('ended', () => {
            if (!isOnline) {
                handleTrackChange('next');
            }
        });

        if (modeToggleBtn) modeToggleBtn.addEventListener('click', () => {
            isOnline = !isOnline;
            loadTrack(true);
        });

        // Toggle Logic for Buttons
        // Toggle Logic for Buttons
        const toggleAudio = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation(); // Prevent bubbling issues
            }

            if (bgAudio.paused) {
                const playPromise = bgAudio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.error("Audio Play Error:", error);
                        updatePlayerUI(); // Reset UI on failure
                    });
                }
            } else {
                bgAudio.pause();
            }
            // Note: We rely on 'play' and 'pause' events to update UI
        };

        if (playPauseBtn) {
            // Remove any existing listeners (good practice if re-running)
            playPauseBtn.removeEventListener('click', toggleAudio);
            playPauseBtn.addEventListener('click', toggleAudio);
        }

        bgAudio.addEventListener('play', updatePlayerUI);
        bgAudio.addEventListener('pause', updatePlayerUI);

        const handleTrackChange = (direction) => {
            if (isOnline) {
                bgAudio.currentTime = 0;
                bgAudio.play();
                updateText("(FM) RETUNING...");
                setTimeout(() => updateText("(FM) NIGHT RIDE SYNTHWAVE"), 1000);
            } else {
                if (direction === 'next') localTrackIndex = (localTrackIndex + 1) % LOCAL_PLAYLIST.length;
                else localTrackIndex = (localTrackIndex - 1 + LOCAL_PLAYLIST.length) % LOCAL_PLAYLIST.length;
                loadTrack(true);
            }
        };

        if (prevTrackBtn) prevTrackBtn.addEventListener('click', () => handleTrackChange('prev'));
        if (nextTrackBtn) nextTrackBtn.addEventListener('click', () => handleTrackChange('next'));

        if (volumeSlider) volumeSlider.addEventListener('input', (e) => {
            bgAudio.volume = parseFloat(e.target.value);
            if (bgAudio.muted && bgAudio.volume > 0) bgAudio.muted = false;
            updatePlayerUI();
        });

        if (muteBtn) muteBtn.addEventListener('click', () => {
            bgAudio.muted = !bgAudio.muted;
            updatePlayerUI();
        });

        // Initialize
        updateText("(FM) NIGHT RIDE SYNTHWAVE");
        updatePlayerUI();
        bgAudio.play().catch(() => { });
        document.addEventListener('click', () => {
            if (bgAudio.paused) bgAudio.play().catch(() => { });
        }, { once: true });
    }

    // --- GAME ENGINE ---
    let gameLoopId;
    let canvas, ctx;
    let player, bullets, enemies;
    let score = 0;
    let level = 1;
    let gameState = 'MENU'; // MENU, PLAYING, PAUSED, GAMEOVER
    let keys = {};
    let enemySpawnTimer = 0;

    function initGameLogic() {
        // Initialize Game State IMMEDIATELY to prevent draw() crashes
        player = { x: 20, y: 150, w: 30, h: 30, color: '#00ff00', speed: 5 };
        bullets = [];
        enemies = [];
        keys = {};

        canvas = document.getElementById('gameCanvas');
        if (!canvas) return; // Not on page
        ctx = canvas.getContext('2d');

        // Buttons
        const startBtn = document.getElementById('startGameBtn');
        const resumeBtn = document.getElementById('resumeGameBtn');
        const quitBtn = document.getElementById('quitGameBtn');
        const restartBtn = document.getElementById('restartGameBtn');
        const manualPauseBtn = document.getElementById('manualPauseBtn');
        const manualStopBtn = document.getElementById('manualStopBtn');

        if (startBtn) startBtn.addEventListener('click', startGame);
        if (resumeBtn) resumeBtn.addEventListener('click', resumeGame);
        if (quitBtn) quitBtn.addEventListener('click', stopGame);
        if (restartBtn) restartBtn.addEventListener('click', startGame);

        if (manualPauseBtn) manualPauseBtn.addEventListener('click', () => {
            if (gameState === 'PLAYING') pauseGame();
            else if (gameState === 'PAUSED') resumeGame();
        });

        if (manualStopBtn) manualStopBtn.addEventListener('click', stopGame);

        // --- NEW CONTROLS LOGIC ---
        const btnUp = document.getElementById('btnUp');
        const btnDown = document.getElementById('btnDown');
        const btnFire = document.getElementById('btnFire');

        // Helper for touch/mouse handling
        const bindBtn = (btn, key) => {
            if (!btn) return;
            const down = (e) => {
                e.preventDefault();
                keys[key] = true;
                // Haptic Feedback for Touch
                if (e.type === 'touchstart' && navigator.vibrate) {
                    try { navigator.vibrate(40); } catch (err) { /* Ignore if not supported/allowed */ }
                }
            };
            const up = (e) => { e.preventDefault(); keys[key] = false; };

            btn.addEventListener('mousedown', down);
            btn.addEventListener('mouseup', up);
            btn.addEventListener('touchstart', down, { passive: false });
            btn.addEventListener('touchend', up);
            btn.addEventListener('mouseleave', up); // Safety
        };

        bindBtn(btnUp, 'ArrowUp');
        bindBtn(btnDown, 'ArrowDown');
        bindBtn(btnFire, 'Space');

        // Touch Input on Canvas (Optional alternate control)
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touchY = e.touches[0].clientY;
            const rect = canvas.getBoundingClientRect();
            const relY = touchY - rect.top;

            if (relY < rect.height / 2) keys['ArrowUp'] = true;
            else keys['ArrowDown'] = true;
            keys['Space'] = true; // Auto shoot on touch
        }, { passive: false });

        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            keys['ArrowUp'] = false;
            keys['ArrowDown'] = false;
            keys['Space'] = false;
        });

        // Initial Render
        draw();
    }

    // Global Input Listeners (One time init)
    window.addEventListener('keydown', (e) => {
        keys[e.code] = true;

        // Game Start/Retry on Enter
        if (e.code === 'Enter') {
            const currentPage = pages[currentPageIndex];
            if (currentPage && currentPage.id === 'vibe') {
                if (gameState === 'MENU' || gameState === 'GAMEOVER') {
                    // Prevent default usually not needed unless it triggers form submit
                    e.preventDefault();
                    startGame();
                }
            }
        }

        // Page Navigation (Left/Right Arrows)
        if (e.code === 'ArrowLeft') {
            const currentPage = pages[currentPageIndex];
            // If Game is active, BLOCK navigation (prevent accidental exit)
            if (currentPage && currentPage.id === 'vibe' && gameState === 'PLAYING') return;
            handleNavigation('prev');
        }

        if (e.code === 'ArrowRight') {
            const currentPage = pages[currentPageIndex];
            // If Game is active, BLOCK navigation (Game uses ArrowRight for action)
            if (currentPage && currentPage.id === 'vibe' && gameState === 'PLAYING') return;
            handleNavigation('next');
        }
    });
    window.addEventListener('keyup', (e) => keys[e.code] = false);

    function startGame() {
        // Haptic Feedback: Short tick for button press
        if (navigator.vibrate) {
            try { navigator.vibrate(40); } catch (e) { }
        }

        score = 0;
        level = 1;
        // Player Start: Left Center. Width/Height swapped for Horizontal visual profile if needed, 
        // but let's keep it squareish or rotate. 
        // Horizontal Mode: x is fixed-ish, y changes.
        player = { x: 20, y: 150, w: 30, h: 30, color: '#00ff00', speed: 5 };
        bullets = [];
        enemies = [];
        gameState = 'PLAYING';
        enemySpawnTimer = 0;

        document.getElementById('startScreen').classList.remove('active');
        document.getElementById('gameOverScreen').classList.remove('active');
        document.getElementById('pauseScreen').classList.remove('active');

        updateScoreUI();
        gameLoop();
    }

    function pauseGame() {
        if (gameState !== 'PLAYING') return;
        gameState = 'PAUSED';
        cancelAnimationFrame(gameLoopId);
        document.getElementById('pauseScreen').classList.add('active');
    }

    function resumeGame() {
        if (gameState !== 'PAUSED') return;
        gameState = 'PLAYING';
        document.getElementById('pauseScreen').classList.remove('active');
        gameLoop();
    }

    function stopGame() {
        gameState = 'MENU';
        cancelAnimationFrame(gameLoopId);
        document.getElementById('pauseScreen').classList.remove('active');
        document.getElementById('gameOverScreen').classList.remove('active');
        document.getElementById('startScreen').classList.add('active');
        // Clear board
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Explicit global cleaner
    function cleanupGame() {
        gameState = 'MENU';
        cancelAnimationFrame(gameLoopId);
        // Remove listeners if you want to be super clean, but weak refs are ok here for now
    }

    function gameOver() {
        gameState = 'GAMEOVER';
        // Haptic Feedback: Long vibration for failure
        if (navigator.vibrate) {
            try { navigator.vibrate(200); } catch (e) { }
        }
        document.getElementById('finalScore').textContent = score;
        document.getElementById('gameOverScreen').classList.add('active');
    }

    function gameLoop() {
        if (gameState !== 'PLAYING') return;
        update();
        draw();
        gameLoopId = requestAnimationFrame(gameLoop);
    }

    function update() {
        // Player Move (Y-Axis)
        if (keys['ArrowUp'] && player.y > 0) player.y -= player.speed;
        if (keys['ArrowDown'] && player.y < canvas.height - player.h) player.y += player.speed;

        // Shoot
        if (keys['Space'] || keys['ArrowRight']) { // Right arrow can also shoot
            // Cooldown logic similar to before
            if (bullets.length === 0 || bullets[bullets.length - 1].x > player.x + 50) {
                // Bullet moves Right
                bullets.push({ x: player.x + 30, y: player.y + 13, w: 10, h: 4, speed: 7 });
            }
        }

        // Bullets Move (Right)
        bullets.forEach((b, i) => {
            b.x += b.speed;
            if (b.x > canvas.width) bullets.splice(i, 1);
        });

        // Spawn Enemies (From Right)
        enemySpawnTimer++;
        if (enemySpawnTimer > (60 - level * 2)) {
            const size = 30;
            const y = Math.random() * (canvas.height - size);
            // Spawn at Right Edge
            enemies.push({ x: canvas.width, y: y, w: size, h: size, speed: 2 + level * 0.5 });
            enemySpawnTimer = 0;
        }

        // Enemies Move (Left)
        enemies.forEach((e, i) => {
            e.x -= e.speed;

            // Collision Player
            if (rectIntersect(player, e)) {
                gameOver();
            }

            // Remove off screen (Left)
            if (e.x + e.w < 0) {
                enemies.splice(i, 1);
            }
        });

        // Collision Bullet-Enemy
        bullets.forEach((b, bi) => {
            enemies.forEach((e, ei) => {
                if (rectIntersect(b, e)) {
                    score += 10;
                    if (score > 0 && score % 100 === 0) level++;
                    updateScoreUI();
                    enemies.splice(ei, 1);
                    bullets.splice(bi, 1);
                }
            });
        });
    }

    function draw() {
        // BG
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Stars (Horizontal Flow)
        ctx.fillStyle = '#fff';
        // Draw some static stars, or animate them moving left for speed effect?
        // Static for now to save perf/complexity
        if (Math.random() > 0.9) ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);

        // Player (Rocket Points Right)
        ctx.fillStyle = '#00ff00';
        ctx.beginPath();
        // Triangle pointing Right
        ctx.moveTo(player.x + player.w, player.y + player.h / 2); // Tip (Right)
        ctx.lineTo(player.x, player.y); // Top Left
        ctx.lineTo(player.x, player.y + player.h); // Bottom Left
        ctx.fill();

        // Engine Flame (Optional)
        ctx.fillStyle = 'orange';
        ctx.fillRect(player.x - 5, player.y + 10, 5, 10);

        // Bullets
        ctx.fillStyle = '#fff';
        bullets.forEach(b => ctx.fillRect(b.x, b.y, b.w, b.h));

        // Enemies
        ctx.fillStyle = 'red';
        enemies.forEach(e => {
            ctx.fillRect(e.x, e.y, e.w, e.h);
            // Eyes (Looking Left)
            ctx.fillStyle = '#000';
            ctx.fillRect(e.x + 5, e.y + 10, 5, 5);
            ctx.fillRect(e.x + 5, e.y + 20, 5, 5); // Stacked eyes or side by side? Side by side for simplicity
            ctx.fillStyle = 'red';
        });
    }

    function updateScoreUI() {
        const s = document.getElementById('scoreVal');
        const l = document.getElementById('levelVal');
        if (s) s.textContent = score;
        if (l) l.textContent = level;
    }

    function rectIntersect(r1, r2) {
        return !(r2.x > r1.x + r1.w ||
            r2.x + r2.w < r1.x ||
            r2.y > r1.y + r1.h ||
            r2.y + r2.h < r1.y);
    }


    // --- GOOGLE DRIVE MODAL LOGIC (GENIE EFFECT) ---
    // Defined globally so onclick can find it
    window.openDriveModal = function (originElement) {
        // If already minimized, just restore it
        if (driveModal.classList.contains('minimized')) {
            restoreDriveModal();
            return;
        }

        if (!driveModal || !driveModalContainer || !driveFrame) return;

        // FORCE Z-INDEX (Fix for Works Opening Above Buzz AI)
        // STRICT: Use setProperty to override CSS !important
        driveModal.style.setProperty("z-index", "2147483647", "important");
        // Lower Insect AI if open
        const insectModal = document.getElementById('insectAiModal');
        if (insectModal) insectModal.style.setProperty("z-index", "2147483640", "important");

        // 1. Calculate Origin for Genie Effect
        const rect = originElement.getBoundingClientRect();
        const containerRect = deviceFrame.getBoundingClientRect();

        // Center of button
        const btnX = rect.left + rect.width / 2;
        const btnY = rect.top + rect.height / 2;

        // Center of container
        const contX = containerRect.left;
        const contY = containerRect.top;

        // Relative position inside the container
        const originX = btnX - contX;
        const originY = btnY - contY;

        // Apply Transform Origin dynamically
        driveModalContainer.style.transformOrigin = `${originX}px ${originY}px`;

        // 2. Load Content
        driveFrame.src = `https://drive.google.com/embeddedfolderview?id=${GDRIVE_ID}#grid`;

        // 3. Activate Blur on Background Elements
        deviceFrame.classList.add('blur-mode');

        // 4. Show Modal
        driveModal.style.display = 'flex';
        // Force reflow/frame to ensure transition plays
        requestAnimationFrame(() => {
            driveModal.classList.remove('minimized');
            driveModal.classList.remove('genie-anim'); // Safety clear
            driveModal.classList.add('active');
        });
    }







    // --- MINIMIZE LOGIC ---
    const minimizeDriveBtn = document.getElementById('minimizeDriveBtn');
    const taskbarContainer = document.getElementById('taskbarContainer');

    window.minimizeDriveModal = function () {
        if (!driveModal) return;

        // 1. Hide Modal (Visual only, keep state)
        // driveModal.classList.remove('active'); // Don't remove active immediately
        driveModal.classList.add('genie-anim'); // TRIGGER ANIMATION
        driveModal.classList.add('minimized'); // Mark state

        setTimeout(() => {
            if (driveModal.classList.contains('minimized')) {
                driveModal.style.display = 'none';
            }
            driveModal.classList.remove('active');
            driveModal.classList.remove('genie-anim');
        }, 400);

        // 2. Remove Blur
        if (deviceFrame) deviceFrame.classList.remove('blur-mode');

        // 3. Add to Taskbar
        if (taskbarContainer) {
            const taskItem = document.createElement('div');
            taskItem.className = 'taskbar-item';
            taskItem.id = 'taskbarItem_Drive';
            taskItem.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                <span class="task-close-btn" onclick="event.stopPropagation(); closeDriveModal();">X</span>
            `;
            taskItem.onclick = restoreDriveModal;
            taskbarContainer.appendChild(taskItem);
        }
    }

    window.restoreDriveModal = function () {
        if (!driveModal) return;

        // 1. Show Modal
        driveModal.style.display = 'flex';
        // Need a small delay to allow display flex to apply before adding class for transition
        requestAnimationFrame(() => {
            driveModal.classList.remove('minimized');
            driveModal.classList.add('active');
        });

        // 2. Restore Blur
        if (deviceFrame) deviceFrame.classList.add('blur-mode');

        // 3. Remove From Taskbar
        const taskItem = document.getElementById('taskbarItem_Drive');
        if (taskItem) taskItem.remove();
    }

    if (minimizeDriveBtn) {
        minimizeDriveBtn.addEventListener('click', minimizeDriveModal);
    }

    window.closeDriveModal = function () {
        const driveModal = document.getElementById('driveModal');
        const driveFrame = document.getElementById('driveFrame');
        if (!driveModal) return;

        // Animation Logic: If active, animate out
        if (driveModal.classList.contains('active')) {
            driveModal.classList.add('genie-anim');
            setTimeout(finalizeDriveClose, 350);
        } else {
            finalizeDriveClose();
        }

        function finalizeDriveClose() {
            // FIX: Hide FIRST to prevent ghost transition
            driveModal.style.display = 'none';
            if (driveFrame) driveFrame.src = '';

            driveModal.classList.remove('active');
            driveModal.classList.remove('genie-anim');

            if (deviceFrame) deviceFrame.classList.remove('blur-mode');

            // Taskbar Cleanup
            const taskItem = document.getElementById('taskbarItem_Drive');
            const taskbarGroup = document.getElementById('taskbarGroup');

            // FIX: ONLY remove if NOT animating from Close All (Check Group Animation)
            const isGroupAnimating = taskbarGroup && taskbarGroup.classList.contains('left-dissolve-anim');

            if (taskItem && !isGroupAnimating) {
                taskItem.remove();
            }

            driveModal.classList.remove('minimized');
        }
    }

    // --- FIX: Works Page Close Button Listener was missing! ---
    // reused global 'closeDriveBtn' from top of file
    if (closeDriveBtn) {
        closeDriveBtn.addEventListener('click', closeDriveModal);
    }

    // --- CONTACT MODAL LOGIC (GENIE EFFECT) ---
    // Custom Form Logic

    let modalFlyInterval; // Global to clear on close

    function initModalFly(container) {
        // Remove existing if any
        const existingFly = container.querySelector('.cyber-fly');
        if (existingFly) existingFly.remove();

        // Create Fly
        const fly = document.createElement('div');
        fly.className = 'cyber-fly';
        fly.id = 'modalCyberFly';
        fly.innerHTML = '<span class="buzz-text">bzz..</span>';

        // --- CLICK LISTENER FOR AI BOX ---
        fly.style.cursor = 'pointer';
        fly.style.pointerEvents = 'auto'; // Force enable clicks (override CSS)
        // Reverted padding/margin to fix visual size issue per user request
        fly.title = "Click to talk to Buzz AI";

        const triggerInsect = (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("Insect Clicked!"); // Debug trigger
            if (window.openInsectAi) {
                window.openInsectAi(fly);
            } else {
                console.error("openInsectAi function not found!");
            }
        };

        fly.addEventListener('click', triggerInsect);
        fly.addEventListener('touchstart', triggerInsect, { passive: false }); // Better mobile response

        container.appendChild(fly);

        // Initial Position (Off-screen / Entrance)
        // Start from top-right corner outside
        fly.style.left = '100%';
        fly.style.top = '-20px';

        // Targets to land on: Inputs, Labels, Button, Title
        const targets = container.querySelectorAll('h2, p, input, textarea, .submit-btn-form');

        let isLanded = false;

        function moveFly() {
            // Check if fly still exists (modal closed?)
            if (!document.getElementById('modalCyberFly')) return;

            if (isLanded) {
                // Take off!
                isLanded = false;
                fly.classList.remove('landed');
                fly.classList.add('buzzing');
                setTimeout(() => fly.classList.remove('buzzing'), 500);

                // Fly to random spot first
                const x = Math.random() * (container.clientWidth - 20);
                const y = Math.random() * (container.clientHeight - 20);
                animateTo(x, y, 1000 + Math.random() * 1000, moveFly);
            } else {
                // Decide: Land or Fly around?
                // 50% chance to land if targets exist
                const wantToLand = Math.random() < 0.5 && targets.length > 0;

                if (wantToLand) {
                    // Pick random target
                    const target = targets[Math.floor(Math.random() * targets.length)];
                    // Get relative coordinates
                    const contRect = container.getBoundingClientRect();
                    const tgtRect = target.getBoundingClientRect();

                    // Calculate relative position within container
                    const relL = tgtRect.left - contRect.left;
                    const relT = tgtRect.top - contRect.top;

                    // Pick random spot ON the element boundaries
                    const landX = relL + Math.random() * tgtRect.width;
                    const landY = relT + Math.random() * tgtRect.height;

                    // Move there
                    animateTo(landX, landY, 1500, () => {
                        // Landed!
                        isLanded = true;
                        fly.classList.add('landed');

                        // Maybe buzz while sitting?
                        if (Math.random() < 0.5) {
                            setTimeout(() => {
                                if (isLanded) fly.classList.add('buzzing');
                            }, 500);
                            setTimeout(() => {
                                fly.classList.remove('buzzing');
                            }, 1500);
                        }

                        // Sit for 2-4 seconds then move
                        setTimeout(moveFly, 2000 + Math.random() * 2000);
                    });
                } else {
                    // Just fly somewhere
                    const x = Math.random() * (container.clientWidth - 20);
                    const y = Math.random() * (container.clientHeight - 20);
                    animateTo(x, y, 1000 + Math.random() * 2000, moveFly);
                }
            }
        }

        function animateTo(x, y, duration, callback) {
            // Calculate rotation to face direction
            const currentLeft = parseFloat(fly.style.left) || 0;
            const currentTop = parseFloat(fly.style.top) || 0;

            const deltaX = x - currentLeft;
            const deltaY = y - currentTop;
            const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;

            fly.style.transition = `top ${duration}ms ease-in-out, left ${duration}ms ease-in-out, transform 0.5s linear`;
            fly.style.left = `${x}px`;
            fly.style.top = `${y}px`;
            fly.style.transform = `rotate(${angle}deg)`;

            setTimeout(callback, duration);
        }

        // ENTRY ANIMATION
        // Fly in from corner to center first
        setTimeout(() => {
            const centerX = container.clientWidth / 2;
            const centerY = container.clientHeight / 2;
            animateTo(centerX, centerY, 1500, moveFly);
        }, 500); // Wait for modal Genie anim
    }

    window.openContactModal = function (originElement) {
        const contactModal = document.getElementById('contactModal');
        // Warning: This selector looks for .drive-modal-container inside #contactModal
        // Ensure index.html structure matches this
        const contactModalContainer = contactModal ? contactModal.querySelector('.drive-modal-container') : null;

        // Reset Form State
        const contactForm = document.getElementById('contactForm');
        const successMsg = document.getElementById('contactSuccessMsg');
        if (contactForm) {
            contactForm.style.display = 'flex';
            contactForm.reset();
        }
        if (successMsg) successMsg.style.display = 'none';


        if (!contactModal || !contactModalContainer) {
            console.error("Contact Modal elements not found!");
            return;
        }

        // 1. Calculate Origin for Genie Effect
        const rect = originElement.getBoundingClientRect();
        const containerRect = deviceFrame.getBoundingClientRect();

        const btnX = rect.left + rect.width / 2;
        const btnY = rect.top + rect.height / 2;
        const contX = containerRect.left;
        const contY = containerRect.top;
        const originX = btnX - contX;
        const originY = btnY - contY;

        contactModalContainer.style.transformOrigin = `${originX}px ${originY}px`;

        // 2. Load Contact Form - ALREADY LOADED IN HTML
        // No src assignment needed.

        // 3. Activate Blur
        deviceFrame.classList.add('blur-mode');

        // 4. Show Modal
        contactModal.style.display = 'flex';
        requestAnimationFrame(() => {
            contactModal.classList.remove('minimized');
            contactModal.classList.remove('genie-anim');
            contactModal.classList.add('active');

            // --- INSECT ENTER SEQUENCE ---
            initModalFly(contactModalContainer);
        });
    }

    // --- FORM SUBMISSION HANDLER ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Simulate Sending
            const btn = contactForm.querySelector('.submit-btn-form');
            if (btn) {
                const originalText = btn.textContent;
                btn.textContent = "SENDING...";
                btn.disabled = true;

                setTimeout(() => {
                    // Success!
                    contactForm.style.display = 'none';
                    const successMsg = document.getElementById('contactSuccessMsg');
                    if (successMsg) {
                        successMsg.style.display = 'flex';
                        successMsg.style.flexDirection = 'column';
                        successMsg.style.alignItems = 'center';
                        successMsg.style.justifyContent = 'center';
                        successMsg.style.height = '100%';
                    }

                    // Reset Button
                    btn.textContent = originalText;
                    btn.disabled = false;

                    // Close automatically after 2s?
                    setTimeout(() => {
                        window.closeContactModal();
                    }, 2000);

                }, 1500);
            }
        });
    }

    window.closeContactModal = function () {
        const contactModal = document.getElementById('contactModal');
        const contactFrame = document.getElementById('contactFrame');
        if (!contactModal) return;

        // Cleanup Fly
        const fly = document.getElementById('modalCyberFly');
        if (fly) fly.remove();

        // Animation Check
        if (contactModal.classList.contains('active')) {
            contactModal.classList.add('genie-anim');
            setTimeout(finalizeContactClose, 350);
        } else {
            finalizeContactClose();
        }

        function finalizeContactClose() {
            // FIX: Hide FIRST to prevent ghost transition
            contactModal.style.display = 'none';
            // if (contactFrame) contactFrame.src = ''; // REMOVED

            contactModal.classList.remove('active');
            contactModal.classList.remove('genie-anim');

            if (deviceFrame) deviceFrame.classList.remove('blur-mode');

            // Clean up taskbar
            const taskItem = document.getElementById('taskbarItem_Contact');
            const taskbarGroup = document.getElementById('taskbarGroup');

            // FIX: ONLY remove if NOT animating from Close All (Check Group Animation)
            const isGroupAnimating = taskbarGroup && taskbarGroup.classList.contains('left-dissolve-anim');

            if (taskItem && !isGroupAnimating) {
                taskItem.remove();
            }

            contactModal.classList.remove('minimized');
        }
    }

    // Attach Close Listener for Contact Modal
    const closeContactBtn = document.getElementById('closeContactBtn');
    if (closeContactBtn) {
        closeContactBtn.addEventListener('click', closeContactModal);
    }

    // --- BUZZ AI INSIGHT TRIGGER ---
    // --- TUTORIAL GUIDE ---
    let tutorialShown = false; // Flag

    window.showTutorial = function () {
        if (tutorialShown) return;
        const tutorialOverlay = document.getElementById('tutorial-overlay');
        const closeBtn = document.getElementById('closeTutorialBtn');

        if (tutorialOverlay) {
            tutorialOverlay.classList.remove('active'); // Reset
            tutorialOverlay.style.display = 'flex';

            // Force Reflow
            void tutorialOverlay.offsetWidth;

            tutorialOverlay.classList.add('active');
            tutorialShown = true;

            // Close Logic
            closeBtn.onclick = function () {
                tutorialOverlay.classList.remove('active');
                setTimeout(() => {
                    tutorialOverlay.style.display = 'none';
                }, 500);
            };
        }
    }

    // --- CONTACT GUIDE (BUZZ AI) ---
    // --- CONTACT GUIDE (BUZZ AI) ---
    window.showContactGuide = function () {
        // Removed session check for easier testing/visibility
        // if (sessionStorage.getItem('contactGuideShown')) return;

        const contactOverlay = document.getElementById('contact-guide-overlay');
        const closeBtn = document.getElementById('closeContactGuideBtn');

        if (contactOverlay) {
            contactOverlay.classList.remove('active');
            contactOverlay.style.display = 'flex';

            // Force Reflow
            void contactOverlay.offsetWidth;

            contactOverlay.classList.add('active');
            // sessionStorage.setItem('contactGuideShown', 'true'); // Disabled for testing

            // Close Logic (Button)
            closeBtn.onclick = function () {
                contactOverlay.classList.remove('active');
                setTimeout(() => {
                    contactOverlay.style.display = 'none';
                }, 500);
            };
        }
    }

    /* REMOVED OLD INSIGHT LOGIC
    // AI speaks about the new section
    const insights = {
        'about': "WELCOME TO THE <b>ABOUT SECTOR</b>.<br>HERE LIES THE ORIGIN STORY AND DATA PROFILE OF MATHEWS B.",
        'works': "ACCESSING <b>PROJECT ARCHIVES</b>.<br>COMMENCE SCROLL TO VIEW SELECTED CASE STUDIES.",
        'blog': "ENTERING <b>TRANSMISSION LOGS</b>.<br>LATEST THOUGHTS AND TUTORIALS LOADED.",
        'vibe': "WARNING: ENTERING <b>VIBE ZONE</b>.<br>INTERACTIVE EXPERIMENTS AHEAD. PROCEED WITH CURIOSITY.",
        'contact': "COMMUNICATION CHANNELS OPEN.<br>READY TO INITIATE <b>DIRECT CONTACT</b> PROTOCOLS."
    };

    const msg = insights[pageId];
    if (msg) {
        // 1. Open AI if closed (Minimize style or full?)
        // Let's just open it as a notification (minimized taskbar pop?)
        // User Request: "BUZZ AI CLICK THAT IS THERE WHILE PAGE MOVE SHOW THE INSIGHT" -> Implies opening the chat.

        // Check if already open
        const insectModal = document.getElementById('insectAiModal');
        if (!insectModal || insectModal.style.display === 'none') {
            // Open it
            // We need an origin element for genie effect. Let's use the Navbar or Page Title.
            const origin = document.getElementById('pageNameDisplay') || document.body;
            if (window.openInsectAi) window.openInsectAi(origin);
        }

        // 2. Add Message
        setTimeout(() => {
            if (window.insectAsk) {
                // Directly inject AI message without user query
                addInsectMessage(`<b>🤖 SYSTEM INSIGHT:</b><br>${msg}`, 'ai');
                // Speak it?
                const cleanText = msg.replace(/<[^>]*>/g, '').replace('MATHEWS B', 'Mathews');
                if (typeof speakText === 'function') speakText(cleanText);
            }
        }, 500);
    }
} */

    // --- INSECT AI LOGIC ---

    // Define taskbarContainer globally for this scope if not already
    // (It was defined above for Drive logic, so we should just use it or ensure unique naming if checking separately)
    // To be safe and avoid "redeclare" error if it was block scoped above:
    const insectTaskbarContainer = document.getElementById('taskbarContainer');

    window.openInsectAi = function (originElement) {
        const insectModal = document.getElementById('insectAiModal');
        const insectContainer = document.getElementById('insectAiContainer');
        const insectSearch = document.getElementById('insectSearchInput');

        if (!insectModal || !insectContainer) return;

        // 0. If minimized, restore
        if (insectModal.classList.contains('minimized')) {
            window.restoreInsectModal();
            return;
        }

        // 1. Calculate Origin for Genie Effect (if clicked on insect)

        // 1. Calculate Origin for Genie Effect (if clicked on insect)
        if (originElement) {
            const rect = originElement.getBoundingClientRect();
            const containerRect = deviceFrame.getBoundingClientRect(); // Use global deviceFrame

            // Center of fly
            const btnX = rect.left + rect.width / 2;
            const btnY = rect.top + rect.height / 2;
            const contX = containerRect.left;
            const contY = containerRect.top;
            const originX = btnX - contX;
            const originY = btnY - contY;

            insectContainer.style.transformOrigin = `${originX}px ${originY}px`;
        }

        // 2. Blur Background
        if (deviceFrame) deviceFrame.classList.add('blur-mode');

        // 3. Show Modal
        insectModal.style.display = 'flex';
        requestAnimationFrame(() => {
            insectModal.classList.remove('genie-anim');
            insectModal.classList.add('active');
            if (insectSearch) insectSearch.focus();
        });
    }

    window.closeInsectAi = function () {
        const insectModal = document.getElementById('insectAiModal');
        if (!insectModal) return;

        // Animation Check
        if (insectModal.classList.contains('active')) {
            insectModal.classList.add('genie-anim');
            setTimeout(finalizeInsectClose, 350);
        } else {
            finalizeInsectClose();
        }

        function finalizeInsectClose() {
            insectModal.style.display = 'none';
            insectModal.classList.remove('active');
            insectModal.classList.remove('genie-anim');
            insectModal.classList.remove('minimized');

            if (deviceFrame) deviceFrame.classList.remove('blur-mode');

            // Clean up taskbar
            const taskItem = document.getElementById('taskbarItem_Insect');
            // Only remove if not part of a "Close All" group animation (simplified check)
            if (taskItem) taskItem.remove();
        }
    }

    // Listeners
    const closeInsectBtn = document.getElementById('closeInsectBtn');
    if (closeInsectBtn) closeInsectBtn.addEventListener('click', closeInsectAi);

    // Minimize Logic
    const minimizeInsectBtn = document.getElementById('minimizeInsectBtn');
    // Using insectTaskbarContainer defined above

    // --- INSECT FLIGHT ANIMATION HELPER ---
    function animateFlyTransfer(startX, startY, endX, endY, callback) {
        animateMultiStageFlight([{ x: startX, y: startY }, { x: endX, y: endY }], callback);
    }

    // --- MULTI-STAGE FLIGHT ---
    function animateMultiStageFlight(points, callback) {
        if (points.length < 2) {
            if (callback) callback();
            return;
        }

        const start = points[0];
        const end = points[1];
        const remainingPoints = points.slice(1);

        // Capture Device Frame for Relative Positioning
        const deviceFrame = document.querySelector('.device-frame');
        const frameRect = deviceFrame.getBoundingClientRect();

        // Convert Global to Relative
        const startRelX = start.x - frameRect.left;
        const startRelY = start.y - frameRect.top;
        const endRelX = end.x - frameRect.left;
        const endRelY = end.y - frameRect.top;

        // Create temporary fly
        const fly = document.createElement('div');
        fly.className = 'cyber-fly'; // Removed 'fixed-flight' to avoid fixed pos
        fly.innerHTML = '<div style="width:100%; height:100%;"></div>';

        // Apply Transient Styles (Matches fixed-flight transition but absolute)
        fly.style.position = 'absolute';
        fly.style.zIndex = '999';
        fly.style.transition = 'top 0.8s ease-in-out, left 0.8s ease-in-out, transform 0.5s linear';

        // Initial Position
        fly.style.left = `${startRelX}px`;
        fly.style.top = `${startRelY}px`;
        fly.style.transform = `translate(-50%, -50%) rotate(0deg)`;

        deviceFrame.appendChild(fly); // Append to Frame, not Body

        // Calculate Angle
        const deltaX = endRelX - startRelX;
        const deltaY = endRelY - startRelY;
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;

        // Force Reflow
        fly.getBoundingClientRect();

        // Animate
        fly.style.left = `${endRelX}px`;
        fly.style.top = `${endRelY}px`;
        fly.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

        // Cleanup after transition (0.8s matches CSS)
        setTimeout(() => {
            fly.remove();
            // Recursive call for next leg
            if (remainingPoints.length > 1) {
                // --- PAUSE AT FRIEND LOCATION ---
                const pauseFly = document.createElement('div');
                pauseFly.className = 'cyber-fly buzzing';
                // Same relative styling
                pauseFly.style.position = 'absolute';
                pauseFly.style.zIndex = '999';

                pauseFly.style.left = `${endRelX}px`;
                pauseFly.style.top = `${endRelY}px`;
                pauseFly.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

                deviceFrame.appendChild(pauseFly);

                setTimeout(() => {
                    pauseFly.remove();
                    animateMultiStageFlight(remainingPoints, callback);
                }, 800); // 0.8s "Visit" pause
            } else {
                if (callback) callback();
            }
        }, 800);
    }

    window.minimizeInsectModal = function () {
        const insectModal = document.getElementById('insectAiModal');
        if (!insectModal) return;

        // 1. Get Start Coordinates (Icon in Title)
        const titleIcon = insectModal.querySelector('.insect-icon-static') || insectModal;
        const startRect = titleIcon.getBoundingClientRect();
        const startX = startRect.left + startRect.width / 2;
        const startY = startRect.top + startRect.height / 2;

        // 2. Create Taskbar Item EARLIER (Hidden Content)
        if (insectTaskbarContainer && !document.getElementById('taskbarItem_Insect')) {
            const taskItem = document.createElement('div');
            taskItem.className = 'taskbar-item';
            taskItem.id = 'taskbarItem_Insect';

            // Initially Empty or Hidden Fly
            taskItem.innerHTML = `
                 <div class="cyber-fly taskbar-icon waiting-to-land">
                    <span class="buzz-text">bzz..</span>
                 </div>
                 <span class="task-close-btn" onclick="event.stopPropagation(); closeInsectAi();">X</span>
             `;
            taskItem.onclick = restoreInsectModal;
            insectTaskbarContainer.appendChild(taskItem);

            // 3. Get End Coordinates (Center of new Taskbar Item)
            // Need a slight delay for DOM to settle? Usually immediate append works for rect.
            requestAnimationFrame(() => {
                const endRect = taskItem.getBoundingClientRect();
                const endX = endRect.left + endRect.width / 2;
                const endY = endRect.top + endRect.height / 2;

                // --- INTELLIGENCE CHECK: Is there a friend? ---
                const friendFly = document.getElementById('cyberFly'); // Contact page insect
                let flightPath = [];

                if (friendFly && document.body.contains(friendFly) && friendFly.offsetParent !== null) {
                    // Friend exists and is visible!
                    const friendRect = friendFly.getBoundingClientRect();
                    const friendX = friendRect.left + friendRect.width / 2;
                    const friendY = friendRect.top + friendRect.height / 2;

                    flightPath = [
                        { x: startX, y: startY },
                        { x: friendX, y: friendY },
                        { x: endX, y: endY }
                    ];
                } else {
                    // Direct Flight
                    flightPath = [
                        { x: startX, y: startY },
                        { x: endX, y: endY }
                    ];
                }

                // 4. Trigger Multi-Stage Flight
                animateMultiStageFlight(flightPath, () => {
                    // On Land: Show the taskbar fly
                    const taskFly = taskItem.querySelector('.cyber-fly');
                    if (taskFly) {
                        taskFly.classList.remove('waiting-to-land');
                        taskFly.style.opacity = ''; // Let CSS take over

                        // START AUTONOMOUS BEHAVIOR
                        initTaskbarInsectBehavior(taskItem);
                    }
                });
            });
        }

        // 5. Animate Modal Out (Genie) - Parallel
        insectModal.classList.add('genie-anim');
        insectModal.classList.add('minimized');

        setTimeout(() => {
            if (insectModal.classList.contains('minimized')) {
                insectModal.style.display = 'none';
            }
            insectModal.classList.remove('active');
            insectModal.classList.remove('genie-anim');
        }, 400);

        // Remove Blur
        if (deviceFrame) deviceFrame.classList.remove('blur-mode');
    }

    // --- TASKBAR INSECT AUTONOMY ---
    function initTaskbarInsectBehavior(taskbarItem) {
        const fly = taskbarItem.querySelector('.cyber-fly');
        if (!fly) return;

        function behaviorLoop() {
            if (!document.body.contains(taskbarItem)) return; // Stop if removed

            // STRICT SIT & BLINK ONLY
            // User Requirement: "WHILE MINIMIZE... GO TO SEE FRIEND... AND SIT TASKBAR ICON THATS ONLY NEED"
            // No autonomous flying out.

            fly.classList.remove('buzzing');
            fly.style.transform = 'translate(-50%, -50%)'; // Ensure centered

            // Random Blink (Opacity Flicker)
            if (Math.random() < 0.3) {
                fly.style.opacity = '0.4';
                setTimeout(() => fly.style.opacity = '', 150);
            }

            // Loop every 2-4 seconds
            setTimeout(behaviorLoop, 2000 + Math.random() * 2000);
        }
        behaviorLoop();
    }

    window.restoreInsectModal = function () {
        const insectModal = document.getElementById('insectAiModal');
        // Check taskbar item existence
        const taskItem = document.getElementById('taskbarItem_Insect');

        if (!insectModal || !taskItem) return;

        // 1. Hide Taskbar Fly immediately (it takes off)
        const taskFly = taskItem.querySelector('.cyber-fly');
        if (taskFly) taskFly.style.opacity = '0';

        // 2. Get Start Coordinates (Taskbar)
        const startRect = taskItem.getBoundingClientRect();
        const startX = startRect.left + startRect.width / 2;
        const startY = startRect.top + startRect.height / 2;

        // 3. Get End Coordinates (Title Icon)
        // We need to briefly display modal to measure, or assume previous position?
        // Better: user clicked taskbar, so modal is currently hidden/minimized.
        // We can measure where it *will* be, or just aim for center screen/last known?
        // Let's generic aim for where the title bar usually is: Center-ish top.
        // OR: Make modal visible but invisible opacity to measure?
        insectModal.style.display = 'flex';
        insectModal.style.opacity = '0'; // Temp hide

        const titleIcon = insectModal.querySelector('.insect-icon-static') || insectModal;
        const endRect = titleIcon.getBoundingClientRect();
        const endX = endRect.left + endRect.width / 2;
        const endY = endRect.top + endRect.height / 2;

        // Reset opacity for Genie
        insectModal.style.opacity = '';

        // 4. Trigger Fly Animation
        animateFlyTransfer(startX, startY, endX, endY, () => {
            // Animation done, nothing specific to do usually
        });

        // 5. Animate Modal In
        requestAnimationFrame(() => {
            insectModal.classList.remove('minimized');
            insectModal.classList.add('active');
        });

        // Restore Blur
        if (deviceFrame) deviceFrame.classList.add('blur-mode');

        // Remove From Taskbar
        taskItem.remove();
    }

    if (minimizeInsectBtn) {
        minimizeInsectBtn.addEventListener('click', minimizeInsectModal);
    }

    const refreshInsectBtn = document.getElementById('refreshInsectBtn');
    if (refreshInsectBtn) {
        refreshInsectBtn.addEventListener('click', () => {
            const chatHistory = document.getElementById('insectChatHistory');
            if (chatHistory) {
                chatHistory.innerHTML = `
                    <div class="chat-message ai-message">
                        <div class="message-content">
                            SYSTEM RESET COMPLETE.<br>
                            HELLO! I'M BUZZ AI.<br>
                            READY FOR NEW QUERY.
                        </div>
                    </div>`;
            }
        });
    }

    const deleteChatHistoryBtn = document.getElementById('deleteChatHistoryBtn');
    if (deleteChatHistoryBtn) {
        deleteChatHistoryBtn.addEventListener('click', () => {
            const chatHistory = document.getElementById('insectChatHistory');
            if (chatHistory) {
                chatHistory.innerHTML = `
                 <div class="chat-message ai-message">
                        <div class="message-content">
                            HISTORY DELETED.
                        </div>
                    </div>`;
            }
        });
    }


    // Search & Chat Logic
    // --- ADVANCED AI LOGIC ---

    // --- VOICE CONTROL LOGIC ---
    // --- VOICE CONTROL LOGIC ---
    let voiceEnabled = true; // Default: ON

    // Global toggle function
    window.toggleBuzzVoice = () => {
        voiceEnabled = !voiceEnabled;
        if (!voiceEnabled) window.speechSynthesis.cancel();
        updateAllVoiceIndicators();
    };

    function updateAllVoiceIndicators() {
        // 1. Update Bubble Indicators
        const indicators = document.querySelectorAll('.buzz-voice-indicator');
        indicators.forEach(btn => {
            if (voiceEnabled) {
                btn.innerHTML = `
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 3px;">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                    VOICE: ON
                `;
                btn.style.color = '#00ff00';
                btn.style.borderColor = '#00ff00';
            } else {
                btn.innerHTML = `
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 3px;">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <line x1="23" y1="9" x2="17" y2="15"></line>
                        <line x1="17" y1="9" x2="23" y2="15"></line>
                    </svg>
                    VOICE: OFF
                `;
                btn.style.color = '#666';
                btn.style.borderColor = '#444';
            }
        });
    }

    // Speech Synthesis Helper
    const speakText = (text) => {
        if (!voiceEnabled) return;

        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            const voices = window.speechSynthesis.getVoices();

            let preferredVoice = voices.find(v => v.name.includes('Google US English'));
            if (!preferredVoice) {
                preferredVoice = voices.find(v => v.name.includes('Male') || v.name.includes('David') || v.name.includes('Mark'));
            }

            if (preferredVoice) utterance.voice = preferredVoice;
            utterance.pitch = 1.1;
            utterance.rate = 1.1;
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleAIResponse = (userQuery) => {
        const query = userQuery.toLowerCase();
        let responseHTML = "";
        let textToSpeak = "";

        // 1. OFFLINE CHECK
        if (!navigator.onLine) {
            const offlineMsg = "🔴 <b>OFFLINE MODE:</b> CANNOT REACH HIVE MIND SERVER. PLEASE CHECK YOUR CONNECTION.";
            addInsectMessage(offlineMsg, 'ai');
            speakText("No internet connection. I cannot access external databases.");
            return;
        }

        // 2. RESTRICTED TOPICS (Security & Scope)
        const restrictedTerms = ['how you build', 'source code', 'github repo', 'script.js'];
        const isRestricted = restrictedTerms.some(term => query.includes(term));

        if (isRestricted || query.includes('confidential') || query.includes('secret')) {
            responseHTML = `
                <b>🚫 ACCESS DENIED:</b><br>
                SORRY, I WILL NOT ANSWER QUESTIONS ABOUT THE PORTFOLIO'S CODE OR CONFIDENTIAL DATA.<br>
                PLEASE ASK ABOUT MATHEWS B OR HIS WORKS.
            `;
            textToSpeak = "Sorry, I will not answer questions about the portfolio's code. Please ask about Mathews B.";
            addInsectMessage(responseHTML, 'ai');
            speakText(textToSpeak);
            return;
        }

        // 2.5 SMART GREETINGS (User Request: "Greet Wisely")
        const greetings = ['hi', 'hello', 'hey', 'greetings', 'hola', 'sup'];
        if (greetings.some(g => query === g || query === g + '.' || query === g + '!')) {
            const wiseGreetings = [
                "GREETINGS. SYSTEMS NOMINAL. HOW MAY I ASSIST YOU TODAY?",
                "HELLO. I AM ONLINE AND READY TO PROCESS YOUR QUERY.",
                "SALUTATIONS. THE ARCHIVES ARE OPEN. WHAT DO YOU SEEK?",
                "SYSTEMS ACTIVE. I AM LISTENING."
            ];
            const randomGreeting = wiseGreetings[Math.floor(Math.random() * wiseGreetings.length)];

            responseHTML = `<b>👋 ${randomGreeting}</b>`;
            textToSpeak = randomGreeting;
            addInsectMessage(responseHTML, 'ai');
            speakText(textToSpeak);
            return;
        }

        // 3. INTERNAL KNOWLEDGE & REFLEXES (ROBUST LOCAL MATCHING)
        // ---------------------------------------------------------

        // HELPER: Check if query matches local intent
        const isLocalQuery = (text, keywords) => {
            return keywords.some(k => text.includes(k));
        };

        // A.0 BUZZ AI IDENTITY (Specific Override)
        if (query === 'who are you' || query === 'who are you?' || query === 'what are you') {
            responseHTML = `
                <b>🤖 SYSTEM IDENTITY:</b><br><br>
                I AM <b>BUZZ AI</b>, THE INTERACTIVE NAVIGATOR FOR THIS PORTFOLIO.<br>
                I EXIST TO ASSIST YOU IN EXPLORING THE WORKS AND DATA OF MATHEWS B.
             `;
            textToSpeak = "I am Buzz AI, your interactive navigator.";
            addInsectMessage(responseHTML, 'ai');
            speakText(textToSpeak);
            return;
        }

        // A. IDENTITY & "WHO IS HE"
        const identityKeywords = [
            'who are you', 'who is mathews', 'about mathews', 'tell me about mathews',
            'who is he', 'about him', 'his background', 'his story', 'the designer',
            'mathews b', 'mathew b', 'mateo', 'author', 'creator', 'developer', 'owner',
            'who made this', 'who built this'
        ];
        if (isLocalQuery(query, identityKeywords) || query === 'mathews' || query === 'mathew') {
            if (typeof ABOUT_DATA !== 'undefined') {
                const bio = ABOUT_DATA.paragraphs.join("<br><br>");
                responseHTML = `<b>👤 IDENTITY RECORD:</b><br><br>${bio}`;
                textToSpeak = "Mathews B is a Creative Generalist and Designer focused on interactive storytelling and immersive experiences.";
                addInsectMessage(responseHTML, 'ai');
                speakText(textToSpeak);
                return;
            }
        }

        // B. CONTACT & SOCIALS
        const contactKeywords = [
            'email', 'mail', 'phone', 'call', 'whatsapp', 'contact', 'reach', 'address', 'location',
            'linkedin', 'linked in', 'github', 'git', 'social', 'instagram', 'facebook', 'twitter', 'x.com'
        ];
        if (isLocalQuery(query, contactKeywords)) {
            responseHTML = `
                <b>👤 CONTACT DATA FOUND:</b><br><br>
                📧 <a href="mailto:hello@mathewsb.in" style="color:#00ff00; text-decoration:underline;">hello@mathewsb.in</a><br>
                🔗 <a href="https://www.linkedin.com/in/mathews-b-designer" target="_blank" style="color:#00ff00; text-decoration:underline;">LinkedIn Profile</a>
            `;
            textToSpeak = "You can contact Mathews via email or LinkedIn.";
            addInsectMessage(responseHTML, 'ai');
            speakText(textToSpeak);
            return;
        }

        // C. SKILLS & TOOLS
        const skillKeywords = [
            'skill', 'stack', 'tech', 'technology', 'software', 'tool', 'program', 'app', 'ide',
            'language', 'code', 'coding', 'framework', 'library', 'react', 'node', 'js', 'javascript',
            'html', 'css', 'python', 'java', 'c++', 'c#', 'unity', 'unreal', 'godot', 'blender',
            'adobe', 'photoshop', 'illustrator', 'after effects', 'premiere', 'figma', 'xd', 'sketch',
            'what does he use', 'what do you use'
        ];
        if (isLocalQuery(query, skillKeywords)) {
            // FIX: If user asks "What is HTML" or "Full form of HTML", go to Wiki.
            // Only capture if it's NOT a definition query, OR if it explicitly asks about usage.
            const isDefinition = query.includes('what is') || query.includes('what are') || query.includes('full form') || query.includes('define') || query.includes('meaning');
            const isPersonal = query.includes('you') || query.includes('mathews') || query.includes('use') || query.includes('know') || query.includes('stack');

            // If it's a definition and NOT personal, skip this block (let it go to Wiki)
            if (isDefinition && !isPersonal) {
                // Do nothing, fall through to Wiki
            } else {
                if (typeof ABOUT_DATA !== 'undefined') {
                    const skillsText = ABOUT_DATA.skills;
                    responseHTML = `<b>🛠️ TECH STACK & SKILLS:</b><br><br>${skillsText}`;
                    textToSpeak = "Mathews is proficient in a wide range of tools including Figma, Blender, and Modern Web Technologies.";
                    addInsectMessage(responseHTML, 'ai');
                    speakText(textToSpeak);
                    return;
                }
            }
        }

        // D. WORKS & PROJECTS
        const workKeywords = [
            'work', 'project', 'portfolio', 'case study', 'design', 'ui', 'ux', 'web', 'site', 'app',
            'creation', 'made', 'built', 'showcase', 'gallery', 'sample', 'example'
        ];
        if (isLocalQuery(query, workKeywords)) {
            responseHTML = `
                <b>📂 ARCHIVES FOUND:</b><br><br>
                ACCESSING SELECTED WORKS DATABASE...<br>
                <br>
                <a href="#" onclick="if(window.openDriveModal) { window.openDriveModal(document.body); } else { console.error('Drive Modal Not Found'); } return false;" style="color:#00ff00; text-decoration:underline; font-weight:bold;">👉 CLICK TO OPEN WORKS FOLDER</a>
            `;
            textToSpeak = "Opening Selected Works database.";
            addInsectMessage(responseHTML, 'ai');
            speakText(textToSpeak);
            return;
        }

        // E. BLOG & ARTICLES
        const blogKeywords = ['blog', 'article', 'news', 'post', 'read', 'story', 'update', 'tutorial', 'guide'];
        if (isLocalQuery(query, blogKeywords)) {
            if (typeof BLOG_DATA !== 'undefined') {
                // Sort and get latest
                const latestPosts = [...BLOG_DATA].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
                let listHtml = '<ul style="margin: 10px 0; padding-left: 20px; color: white;">';
                latestPosts.forEach(post => {
                    listHtml += `<li style="margin-bottom: 8px;"><a href="#" onclick="window.openBlogModal('${post.id}', null); return false;" style="color: #00ff00;">${post.title}</a></li>`;
                });
                listHtml += '</ul>';
                responseHTML = `<b>📝 LATEST TRANSMISSIONS:</b><br>${listHtml}`;
                speakText("Here are the latest blog posts.");
                addInsectMessage(responseHTML, 'ai');
                return;
            }
        }

        // F. INTERESTS
        const interestKeywords = ['interest', 'hobby', 'like', 'love', 'passion', 'fan', 'watch', 'listen', 'play', 'game', 'music', 'movie'];
        if (isLocalQuery(query, interestKeywords)) {
            if (typeof ABOUT_DATA !== 'undefined') {
                // Find a relevant paragraph or default to bio
                const relevantPara = ABOUT_DATA.paragraphs.find(p => p.toLowerCase().includes('passion') || p.toLowerCase().includes('love'));
                const bio = relevantPara || ABOUT_DATA.paragraphs[0]; // Fallback
                responseHTML = `<b>❤️ INTERESTS RECORD:</b><br><br>${bio}`;
                textToSpeak = "Mathews is passionate about media, animation, and storytelling.";
                addInsectMessage(responseHTML, 'ai');
                speakText(textToSpeak);
                return;
            }
        }

        // G. TIME & DATE
        if (isLocalQuery(query, ['time', 'clock', 'hour', 'minute'])) {
            const time = new Date().toLocaleTimeString();
            responseHTML = `<b>⌚ LOCAL TIME:</b> ${time}`;
            speakText(`The current time is ${time}`);
            addInsectMessage(responseHTML, 'ai');
            return;
        }
        if (isLocalQuery(query, ['date', 'day', 'today', 'month', 'year', 'calendar'])) {
            const date = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            responseHTML = `<b>📅 TODAY'S DATE:</b> ${date}`;
            speakText(`Today is ${date}`);
            addInsectMessage(responseHTML, 'ai');
            return;
        }


        // 4. GLOBAL KNOWLEDGE: WIKIPEDIA (The "Billion Questions" Handler)
        // -----------------------------------------------------------------

        const loadingId = addInsectMessage(`
            <div style="display:flex; align-items:center; gap:10px;">
                <span class="spinner-loader" style="width:12px; height:12px; border:2px solid #00ff00; border-top-color:transparent; border-radius:50%; animation:spin 1s linear infinite;"></span>
                SEARCHING GLOBAL ARCHIVES...
            </div>
        `, 'ai', true);

        // ENHANCEMENT: Rewrite "Who is X" -> "X" for better Wiki results
        // FIX: "CM of Kerala" -> "Chief Minister of Kerala"
        let wikiQuery = userQuery;

        // 1. Clean the query first to handle abbreviations
        // FIX: Must use a new variable to ensure we match against the CLEANED version
        let processedQuery = userQuery.replace(/\bcm\b/gi, "Chief Minister");
        processedQuery = processedQuery.replace(/\bpm\b/gi, "Prime Minister");

        // 2. Match regex against the CLEANED query
        const whoIsMatch = processedQuery.match(/^who is (?:the )?(.+?)(?:\?)?$/i);

        if (whoIsMatch) {
            // "Who is Chief Minister of Kerala" -> "Current Chief Minister of Kerala"
            // This phrases helps Wiki find the 'List of...' or Incumbent info better than just the role name.
            wikiQuery = "Current " + whoIsMatch[1];
        } else {
            // If no "Who is" match, still use the processed query (with CM/PM fixed)
            wikiQuery = processedQuery;
        }

        callWikipediaAPI(wikiQuery, loadingId);
    };

    // --- WIKIPEDIA API INTEGRATION (Enhanced: Search + Extract) ---
    async function callWikipediaAPI(userQuery, loadingMsgId) {
        try {
            // STEP 1: SEARCH for the most relevant page title
            // Use 'list=search' (srsearch) which is a full-text search, better for questions than opensearch (prefix)
            const searchEndpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(userQuery)}&format=json&origin=*&srlimit=1`;

            const searchResponse = await fetch(searchEndpoint);
            const searchData = await searchResponse.json();

            // Search format: data.query.search[0].title
            if (!searchData.query || !searchData.query.search || searchData.query.search.length === 0) {
                throw new Error("No Wiki results found for search.");
            }

            const bestTitle = searchData.query.search[0].title;

            // STEP 2: FETCH EXTRACT for that specific title
            const extractEndpoint = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&redirects=1&origin=*&titles=${encodeURIComponent(bestTitle)}`;

            const extractResponse = await fetch(extractEndpoint);
            const extractData = await extractResponse.json();

            // Remove Loading Bubble
            const loadingBubble = document.getElementById(loadingMsgId);
            if (loadingBubble) loadingBubble.remove();

            const pages = extractData.query.pages;
            const pageId = Object.keys(pages)[0];
            const pageData = pages[pageId];

            if (pageId !== "-1" && pageData.extract) {
                // SUCCESS
                let summary = pageData.extract;
                // Clean up output
                if (summary.length > 800) summary = summary.substring(0, 800) + "...";

                const responseHTML = `
                    <b>📚 WIKI KNOWLEDGE:</b><br>
                    <span style="font-size:0.8em; opacity:0.7;">TOPIC: ${bestTitle.toUpperCase()}</span><br><br>
                    ${summary.replace(/\n/g, '<br>')}<br><br>
                    🔗 <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(bestTitle)}" target="_blank" style="color:#00ff00; text-decoration:underline;">READ FULL ARTICLE</a>
                 `;
                addInsectMessage(responseHTML, 'ai');
                speakText(summary.substring(0, 200));
            } else {
                throw new Error("Wiki extract failed.");
            }

        } catch (error) {
            // Remove loading if error happened before
            const loadingBubble = document.getElementById(loadingMsgId);
            if (loadingBubble) loadingBubble.remove();

            // FALLBACK TO GOOGLE
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(userQuery)}`;
            const responseHTML = `
                <b>🌐 EXTENDING SEARCH:</b><br><br>
                I COULD NOT RETRIEVE A DIRECT ANSWER FROM THE ARCHIVES.<br>
                REROUTING CONNECTION TO GLOBAL SEARCH:<br>
                <br>
                👉 <a href="${searchUrl}" target="_blank" style="color:#00ff00; text-decoration:underline;">CLICK TO VIEW RESULTS FOR "${userQuery.toUpperCase()}"</a>
            `;
            addInsectMessage(responseHTML, 'ai');
            speakText("Rerouting to Google Search.");
        }
    }
    const handleFileUploadMock = (file) => {
        const loadingId = addInsectMessage(`SCANNING FILE: <b>${file.name}</b>...`, 'ai', true);

        setTimeout(() => {
            const loadingBubble = document.getElementById(loadingId);
            if (loadingBubble) loadingBubble.remove();

            let analysis = "";
            let speech = "";

            if (file.type === 'application/pdf') {
                analysis = `<b>📄 FILE SCAN COMPLETE</b><br>SIZE: ${(file.size / 1024).toFixed(1)} KB<br><br>I HAVE PROCESSED THIS DOCUMENT.`;
                speech = "File scan complete.";
            } else if (file.type.startsWith('image/')) {
                analysis = `<b>🖼️ IMAGE SCAN COMPLETE</b><br>VISUAL DATA RECEIVED.<br><br>I HAVE PROCESSED THIS IMAGE.`;
                speech = "Image scan complete.";
            } else {
                analysis = "⚠️ FILE TYPE UNKNOWN.";
                speech = "File type unknown.";
            }

            addInsectMessage(analysis, 'ai');
            speakText(speech);
        }, 2000);
    };

    // Event Handlers
    const insectSearchInput = document.getElementById('insectSearchInput');
    const insectSendBtn = document.getElementById('insectSendBtn');

    // stopVoiceBtn logic removed (replaced by voiceTitleBtn toggle)

    /* ATTACH REMOVED
    const insectFileInput = document.getElementById('insectFileInput');
    if (insectFileInput) {
        insectFileInput.addEventListener('change', (e) => { ... });
    }
    */
    const insectFileInput = null; // Forced null to ignore

    if (insectSendBtn && insectSearchInput) {
        const send = () => {
            const text = insectSearchInput.value.trim();
            if (text) {
                addInsectMessage(text, 'user');
                handleAIResponse(text);
                insectSearchInput.value = '';
            }
        };
        insectSendBtn.addEventListener('click', send);
        insectSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') send();
        });
    }

    // Global Access
    window.insectAsk = (query) => {
        addInsectMessage(query, 'user');
        handleAIResponse(query);
    }

    function addInsectMessage(text, type, isLoading = false) {
        const chatHistory = document.getElementById('insectChatHistory');
        if (!chatHistory) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${type}-message`;
        if (isLoading) msgDiv.id = `msg-${Date.now()}`;

        let contentHtml = `<div class="message-content">${text}</div>`;

        // INJECT VOICE CONTROLS FOR AI MESSAGES
        if (type === 'ai' && !isLoading) {
            contentHtml += `
                <div class="buzz-voice-indicator" onclick="toggleBuzzVoice()" 
                     style="margin-top: 6px; padding-top: 4px; border-top: 1px solid rgba(255,255,255,0.1); 
                            font-size: 0.65em; display: inline-flex; align-items: center; cursor: pointer; 
                            user-select: none; transition: color 0.2s;">
                    <!-- Content injected by updateAllVoiceIndicators -->
                    VOICE: OFF
                </div>
            `;
            // Defer update to ensure element is in DOM
            setTimeout(updateAllVoiceIndicators, 0);
        }

        msgDiv.innerHTML = contentHtml;

        chatHistory.appendChild(msgDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
        return msgDiv.id;
    }

    // --- CONTACT MINIMIZE LOGIC ---
    const minimizeContactBtn = document.getElementById('minimizeContactBtn');

    window.minimizeContactModal = function () {
        const contactModal = document.getElementById('contactModal');
        if (!contactModal) return;

        // 1. Hide Modal
        // contactModal.classList.remove('active');
        contactModal.classList.add('genie-anim'); // TRIGGER GENIE ANIMATION
        contactModal.classList.add('minimized');

        setTimeout(() => {
            if (contactModal.classList.contains('minimized')) {
                contactModal.style.display = 'none';
            }
            contactModal.classList.remove('active');
            contactModal.classList.remove('genie-anim');
        }, 400);

        // 2. Remove Blur
        if (deviceFrame) deviceFrame.classList.remove('blur-mode');

        // 3. Add to Taskbar
        if (taskbarContainer) {
            const taskItem = document.createElement('div');
            taskItem.className = 'taskbar-item';
            taskItem.id = 'taskbarItem_Contact';
            taskItem.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <span class="task-close-btn" onclick="event.stopPropagation(); closeContactModal();">X</span>
            `;
            taskItem.onclick = restoreContactModal;
            taskbarContainer.appendChild(taskItem);
        }
    }

    window.restoreContactModal = function () {
        const contactModal = document.getElementById('contactModal');
        if (!contactModal) return;

        // 1. Show Modal
        contactModal.style.display = 'flex';
        requestAnimationFrame(() => {
            contactModal.classList.remove('minimized');
            contactModal.classList.add('active');
        });

        // 2. Restore Blur
        if (deviceFrame) deviceFrame.classList.add('blur-mode');

        // 3. Remove From Taskbar
        const taskItem = document.getElementById('taskbarItem_Contact');
        if (taskItem) taskItem.remove();
    }

    if (minimizeContactBtn) {
        minimizeContactBtn.addEventListener('click', minimizeContactModal);
    }

    // --- CUSTOM BLOG MODAL LOGIC ---
    // New logic uses BLOG_DATA    // --- BLOG MODAL ---
    window.openBlogModal = function (id, element) {
        const modal = document.getElementById('blogModal');
        const container = document.getElementById('blogModalContainer');
        const contentArea = document.getElementById('blogContentArea');

        if (!modal || !container || !contentArea) return;

        // FORCE Z-INDEX IN JS TO BE SURE
        modal.style.zIndex = "2147483647";
        // Ensure Insect AI is lower if open
        const insectModal = document.getElementById('insectAiModal');
        if (insectModal) insectModal.style.zIndex = "2147483640";

        // 1. Find the post
        // FIX: Match ID loosely (==) to handle string/number mismatch, AND parse for safety
        // Also handling the case where 'id' might be passed as string '0'
        const targetId = parseInt(id, 10);
        const initialPost = BLOG_DATA.find(p => p.id == id || p.id === targetId);

        if (!initialPost) {
            console.error("Blog Post not found for ID:", id);
            return;
        }

        const activeId = initialPost.id; // Correct ID to use

        // Store active ID
        modal.dataset.activePostId = activeId;

        // Check if this specific article is minmized and remove it (Opening restores it)
        const specificTaskItem = document.getElementById(`taskbarItem_Blog_${activeId}`);
        if (specificTaskItem) specificTaskItem.remove();

        // 1. Sort posts by Date (Safely)
        // FIX: Handle "STAY TUNED" or invalid dates by treating them as new
        const sortedPosts = [...BLOG_DATA].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            if (isNaN(dateA)) return -1; // Newest (top)
            if (isNaN(dateB)) return 1;
            return dateB - dateA;
        });

        // 2. Find Current Post Index
        const currentIndex = sortedPosts.findIndex(p => p.id == activeId);
        if (currentIndex === -1) {
            console.error("Post not found:", id);
            return;
        }

        const post = sortedPosts[currentIndex];
        const nextPost = (currentIndex < sortedPosts.length - 1) ? sortedPosts[currentIndex + 1] : null;
        const prevPost = (currentIndex > 0) ? sortedPosts[currentIndex - 1] : null;

        // Helper: Render Content
        const renderContent = () => {
            let heroSrc = post.media;
            const heroMediaHTML = `
                <div class="blog-detail-hero" style="background-image: url('${heroSrc}');">
                    <div class="blog-hero-overlay">
                        <span class="blog-category-tag">${post.category || 'GENERAL'}</span>
                        <div class="blog-detail-title">${post.title}</div>
                        <div class="blog-detail-subtitle">${post.preview}</div>
                        <div class="blog-detail-date">${post.date}</div>
                    </div>
                </div>`;

            blogContentArea.innerHTML = `
                ${heroMediaHTML}
                <div class="blog-detail-content">
                    ${post.content}
                </div>
                <div class="blog-nav-footer">
                    ${prevPost ?
                    `<button class="nav-article-btn" onclick="openBlogModal(${prevPost.id})" title="Previous">
                           &lt;
                        </button>`
                    : `<button class="nav-article-btn disabled">&lt;</button>`}
                    
                    <button class="nav-article-btn share-btn" onclick="shareArticle('${post.title.replace(/'/g, "\\'")}', window.location.href)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:5px;"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                        SHARE
                    </button>

                    ${nextPost ?
                    `<button class="nav-article-btn" onclick="openBlogModal(${nextPost.id})" title="Next">
                           &gt;
                        </button>`
                    : `<button class="nav-article-btn disabled">&gt;</button>`}
                </div>
            `;
            // Mark as loaded
            blogModal.dataset.loadedPostId = String(activeId);
        };

        // 3. Logic: Transition vs Initial Load
        if (blogModal.classList.contains('active')) {
            // Already Open -> Enable SMOOTH TRANSITION
            if (blogModal.dataset.loadedPostId !== String(activeId)) {
                // Fade Out
                blogContentArea.classList.add('content-fade-out');

                // Wait for fade out, then swap
                setTimeout(() => {
                    renderContent();
                    blogContentArea.scrollTop = 0; // Reset scroll
                    blogContentArea.classList.remove('content-fade-out'); // Fade In
                }, 300);
            }
        } else {
            // Initial Open -> Render Immediately
            if (blogModal.dataset.loadedPostId !== String(activeId)) {
                renderContent();
            }

            // Execute Genie Effect Logic
            // FIX: Use 'element' (argument) instead of undefined 'originElement'
            if (element) {
                const rect = element.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect(); deviceFrame.getBoundingClientRect();
                const btnX = rect.left + rect.width / 2;
                const btnY = rect.top + rect.height / 2;
                const contX = containerRect.left;
                const contY = containerRect.top;
                const originX = btnX - contX;
                const originY = btnY - contY;
                blogModalContainer.style.transformOrigin = `${originX}px ${originY}px`;
            }

            // Activate Blur & Show
            deviceFrame.classList.add('blur-mode');
            blogModal.style.display = 'flex';
            blogModal.classList.remove('genie-anim');
            void blogModalContainer.offsetWidth; // Force Reflow

            requestAnimationFrame(() => {
                blogModal.classList.remove('minimized');
                blogModal.classList.add('active');
            });
        }
    }

    window.closeBlogModal = function () {
        const blogModal = document.getElementById('blogModal');
        if (!blogModal) return;

        if (blogModal.classList.contains('active')) {
            // Reset origin to prevent jump/jerk during close
            const blogModalContainer = document.getElementById('blogModalContainer');
            if (blogModalContainer) blogModalContainer.style.transformOrigin = 'center center';

            blogModal.classList.add('genie-anim');
            setTimeout(finalizeBlogClose, 350);
        } else {
            finalizeBlogClose();
        }

        function finalizeBlogClose() {
            // FIX: Hide FIRST to prevent ghost transition
            blogModal.style.display = 'none';
            // Clear content to stop video playing
            const blogContentArea = document.getElementById('blogContentArea');
            if (blogContentArea) blogContentArea.innerHTML = '';

            // FIX: Reset loaded ID so it re-renders next time
            delete blogModal.dataset.loadedPostId;

            blogModal.classList.remove('active');
            blogModal.classList.remove('genie-anim');
            deviceFrame.classList.remove('blur-mode');

            // Taskbar Cleanup
            // Fix: Find correct ID based on stored dataset (since minimize creates unique IDs)
            let taskItem = document.getElementById('taskbarItem_Blog'); // Fallback legacy

            if (blogModal.dataset.activePostId) {
                const specificId = `taskbarItem_Blog_${blogModal.dataset.activePostId}`;
                const specificItem = document.getElementById(specificId);
                if (specificItem) taskItem = specificItem;
            }

            // FIX: ONLY remove if NOT animating (Check Group Animation)
            const taskbarGroup = document.getElementById('taskbarGroup');
            const isGroupAnimating = taskbarGroup && taskbarGroup.classList.contains('left-dissolve-anim');

            if (taskItem && !isGroupAnimating) {
                taskItem.remove();
            }

            // Remove minimized class
            blogModal.classList.remove('minimized');
        }
    }

    // Attach Close Listener for Blog Modal
    const closeBlogBtn = document.getElementById('closeBlogBtn');
    if (closeBlogBtn) {
        closeBlogBtn.addEventListener('click', closeBlogModal);
    }

    // --- BLOG MINIMIZE LOGIC ---
    const minimizeBlogBtn = document.getElementById('minimizeBlogBtn');

    window.minimizeBlogModal = function () {
        const blogModal = document.getElementById('blogModal');
        if (!blogModal) return;

        // 1. Minimize with GENIE Animation
        // Reset origin to prevent jump/jerk
        const blogModalContainer = document.getElementById('blogModalContainer');
        if (blogModalContainer) blogModalContainer.style.transformOrigin = 'center center';

        blogModal.classList.add('genie-anim'); // TRIGGER ANIMATION
        blogModal.classList.add('minimized');

        setTimeout(() => {
            if (blogModal.classList.contains('minimized')) {
                blogModal.style.display = 'none';
            }
            blogModal.classList.remove('active');
            blogModal.classList.remove('genie-anim');
        }, 400);

        // 2. Remove Blur
        if (deviceFrame) deviceFrame.classList.remove('blur-mode');

        // 3. Add Taskbar Item
        if (taskbarContainer) {
            const activePostId = blogModal.dataset.activePostId || 'generic';
            const taskId = `taskbarItem_Blog_${activePostId}`;

            // Robust Fix: If duplicate exists, remove it first to ensure clean state
            const existingItem = document.getElementById(taskId);
            if (existingItem) {
                existingItem.remove();
            }

            const taskItem = document.createElement('div');
            taskItem.className = 'taskbar-item';
            taskItem.id = taskId;
            // Standard generic Blog Icon for all posts
            taskItem.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                <span class="task-close-btn" onclick="event.stopPropagation(); closeBlogModal();">X</span>
            `;
            // Restore specific post on click
            taskItem.onclick = function () {
                openBlogModal(activePostId, taskItem);
            };
            taskbarContainer.appendChild(taskItem);
        }
    }

    // window.restoreBlogModal Removed (Duplicate/Dead Code)

    if (minimizeBlogBtn) {
        minimizeBlogBtn.addEventListener('click', minimizeBlogModal);
    }

    // --- SHARE FUNCTIONALITY ---
    window.shareArticle = function (title, url) {
        // Use current URL for now, or specific post URL if you have routing
        const shareData = {
            title: title,
            text: `Check out this article: ${title}`,
            url: url || window.location.href
        };

        if (navigator.share) {
            navigator.share(shareData)
                .then(() => console.log('Shared successfully'))
                .catch((error) => console.log('Error sharing', error));
        } else {
            // Fallback
            navigator.clipboard.writeText(`${shareData.title}\n${shareData.url}`)
                .then(() => alert('Link copied to clipboard!'))
                .catch(err => console.error('Could not copy text: ', err));
        }
    }


    // --- SCROLL TO TOP LOGIC ---
    const blogScrollTopBtn = document.getElementById('blogScrollTopBtn');
    const blogContentArea = document.getElementById('blogContentArea');
    const blogModalOverlay = document.getElementById('blogModal'); // The overlay acts as scroller on mobile

    if (blogScrollTopBtn && blogContentArea && blogModalOverlay) {
        // 1. Click to Scroll (Target BOTH to be safe)
        blogScrollTopBtn.addEventListener('click', () => {
            blogContentArea.scrollTo({ top: 0, behavior: 'smooth' });
            blogModalOverlay.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // 2. Toggle Visibility on Scroll
        // function to check scroll position of EITHER
        let scrollTimeout;
        const checkScroll = () => {
            // Check scroll of overlay (mobile) OR content (desktop)
            const scrollTop = blogContentArea.scrollTop + blogModalOverlay.scrollTop;

            if (scrollTop > 50) {
                blogScrollTopBtn.classList.add('visible');

                // Add scrolling state (Opacity 100%)
                blogScrollTopBtn.classList.add('is-scrolling');

                // Clear existing timeout
                clearTimeout(scrollTimeout);

                // Remove scrolling state after 1000ms of inactivity (Return to 50%)
                scrollTimeout = setTimeout(() => {
                    blogScrollTopBtn.classList.remove('is-scrolling');
                }, 1000);

            } else {
                blogScrollTopBtn.classList.remove('visible');
                blogScrollTopBtn.classList.remove('is-scrolling');
            }
        };

        blogContentArea.addEventListener('scroll', checkScroll);
        blogModalOverlay.addEventListener('scroll', checkScroll);
    }

    // --- CLOSE ALL LOGIC ---
    const closeAllBtn = document.getElementById('closeAllTaskbarBtn');

    window.updateCloseAllButton = function () {
        if (!closeAllBtn) return;
        const taskbarItems = document.querySelectorAll('.taskbar-item');
        if (taskbarItems.length > 0) {
            closeAllBtn.classList.add('visible');
        } else {
            closeAllBtn.classList.remove('visible');
        }
    }

    // Call this whenever we minimize/restore
    // We can hook into the existing functions or use a MutationObserver on the taskbar container?
    // Let's create an observer for robustness
    if (taskbarContainer && closeAllBtn) {
        const observer = new MutationObserver(updateCloseAllButton);
        observer.observe(taskbarContainer, { childList: true });
    }

    if (closeAllBtn) {
        closeAllBtn.addEventListener('click', () => {
            // 1. Animate Entire Group (Taskbar + Button) together
            const taskbarGroup = document.getElementById('taskbarGroup');
            if (taskbarGroup) {
                // Remove first to reset
                taskbarGroup.classList.remove('slide-left-fade-out');
                // Trigger Reflow
                void taskbarGroup.offsetWidth;
                // Add Animation Class
                taskbarGroup.classList.add('slide-left-fade-out');
            }

            // 2. WAIT for animation, THEN Close Modals & Cleanup
            setTimeout(() => {
                // Close Modals (This removes taskbar items logic internal to them, but we clarify removal below too)
                if (window.closeDriveModal) window.closeDriveModal();
                if (window.closeContactModal) window.closeContactModal();
                if (window.closeBlogModal) window.closeBlogModal();

                // Extra safety: Remove any remaining items
                const allItems = document.querySelectorAll('.taskbar-item');
                allItems.forEach(item => item.remove());

                // FIX: Force button state to hidden INSTANTLY to prevent flash
                if (closeAllBtn) {
                    // Disable transition temporarily so it doesn't "fade out" while jumping back
                    closeAllBtn.style.transition = 'none';
                    closeAllBtn.classList.remove('visible');
                    closeAllBtn.style.opacity = '0';
                    closeAllBtn.style.visibility = 'hidden';
                }

                // Reset the Group Animation (opacity goes back to 1)
                if (taskbarGroup) {
                    taskbarGroup.classList.remove('slide-left-fade-out');
                }

                updateCloseAllButton();

                // Clean up inline styles after a brief moment so future transitions work
                setTimeout(() => {
                    if (closeAllBtn) {
                        closeAllBtn.style.transition = '';
                        closeAllBtn.style.opacity = '';
                        closeAllBtn.style.visibility = '';
                    }
                }, 50);

            }, 600); // 600ms matches CSS animation time (Smoother)
        });
    }

    // Close on click outside (Optional, but user said "Close button needed")
    // If they want click outside to close:
    // Close on click outside (Optional - Disabled)

    // --- BODY SCROLL LOCK HELPER ---
    const lockBodyScroll = () => {
        document.body.style.overflow = 'hidden';
    };

    const unlockBodyScroll = () => {
        document.body.style.overflow = '';
    };

    // --- POPUP AD LOGIC ---
    const popupAd = document.getElementById('popupAd');
    const closePopupBtn = document.getElementById('closePopupBtn');

    if (popupAd && closePopupBtn) {
        // Show after delay (Wait for boot sequence to finish ~3s)
        // CHECK: Only show on HOME page
        setTimeout(() => {
            // Check if active page is Home
            // The home view has ID 'home-view' and gets class 'active-view' when visible
            const homeViewEl = document.getElementById('home-view');
            const isHomeActive = homeViewEl && homeViewEl.classList.contains('active-view');

            if (isHomeActive) {
                popupAd.style.display = 'flex';
                void popupAd.offsetWidth; // Force Reflow
                popupAd.classList.remove('hidden-popup');
                popupAd.classList.add('show-popup');
            }
        }, 3500);
        closePopupBtn.addEventListener('click', () => {
            popupAd.classList.remove('show-popup');
            // Wait for transition then hide
            setTimeout(() => {
                popupAd.classList.add('hidden-popup');
                popupAd.style.display = 'none'; // Ensure clicks pass through
                unlockBodyScroll();
            }, 500);
        });
    }



    // --- Dynamic Meta Tags ---
    window.updatePageMetadata = function (pageId, extraData = null) {
        // Standardized App Name for Title Matching
        const baseTitle = "Mathews B";
        let title = baseTitle;
        let description = "Portfolio of Mathews B - Creative Designer, Product Designer, and Web Developer.";

        switch (pageId) {
            case 'home':
                title = baseTitle;
                description = "Im Mathews B, a Creative Generalist, Product Designer, and Web Developer based in Kozhikode, Kerala, India. Specializing in UI/UX, Motion Graphics, and Interactive Storytelling.";
                break;
            case 'about':
                title = "Mathews B - About Me";
                if (typeof ABOUT_DATA !== 'undefined' && ABOUT_DATA.paragraphs) {
                    const tempDiv = document.createElement("div");
                    tempDiv.innerHTML = ABOUT_DATA.paragraphs[0];
                    description = tempDiv.textContent || tempDiv.innerText || "";
                }
                break;
            case 'works':
                title = "Mathews B - Selected Works";
                description = "Explore the selected works and projects of Mathews B, showcasing UI/UX design, motion graphics, and creative development.";
                break;
            case 'vibe':
                title = "Mathews B - Vibe Zone";
                description = "Experience the Vibe Zone. A place for interactive experiments and gaming.";
                break;
            case 'contact':
                title = "Mathews B - Contact Me";
                description = "Get in touch with Mathews B for freelance opportunities, collaborations, or just to say hello. Based in Kozhikode, Kerala.";
                break;
            case 'blog':
                title = "Mathews B - Blog";
                description = "Read the latest thoughts, tutorials, and updates from Mathews B on Design, Technology, and Creativity.";
                if (extraData && extraData.id) {
                    const post = BLOG_DATA.find(p => p.id == extraData.id);
                    if (post) {
                        title = `Mathews B - ${post.title}`;
                        description = post.preview;
                    }
                }
                break;
        }

        document.title = title;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', description);

        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', title);

        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', description);
    }

    // --- OFFLINE HANDLING (SKELETON SCREEN) ---
    function renderSkeleton() {
        if (!dynamicContainer) return;

        dynamicContainer.innerHTML = `
            <div class="skeleton-screen">
                <div class="skeleton-header shimmer"></div>
                <div class="skeleton-grid">
                    <div class="skeleton-card">
                        <div class="skeleton-image shimmer"></div>
                        <div class="skeleton-text shimmer"></div>
                        <div class="skeleton-text short shimmer"></div>
                    </div>
                    <div class="skeleton-card">
                        <div class="skeleton-image shimmer"></div>
                        <div class="skeleton-text shimmer"></div>
                        <div class="skeleton-text short shimmer"></div>
                    </div>
                    <div class="skeleton-card">
                        <div class="skeleton-image shimmer"></div>
                        <div class="skeleton-text shimmer"></div>
                        <div class="skeleton-text short shimmer"></div>
                    </div>
                    <div class="skeleton-card">
                        <div class="skeleton-image shimmer"></div>
                        <div class="skeleton-text shimmer"></div>
                        <div class="skeleton-text short shimmer"></div>
                    </div>
                </div>
                <!-- Offline Toast -->
                <div class="offline-message">
                    <div class="offline-dot"></div>
                    <span>YOU ARE OFFLINE</span>
                </div>
            </div>
        `;
    }

    function handleConnectionChange() {
        if (!navigator.onLine) {
            // Offline: Show Skeleton
            renderSkeleton();
        } else {
            // Online: Restore Content
            updateContent();
        }
    }

    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);

    // Initial Check (Just in case they load offline)
    if (!navigator.onLine) {
        renderSkeleton();
    }

    // --- IMAGE SKELETON HANDLING (.mb) ---
    // Purpose: Replace broken image icon with sweep animation when offline

    function monitorHeroImage() {
        if (!mbImage) return;

        // Create ID for skeleton reference
        const SKELETON_ID = 'hero-skeleton-loader';

        const enableSkeleton = () => {
            // Avoid duplicates
            if (document.getElementById(SKELETON_ID)) return;

            const skeleton = document.createElement('div');
            skeleton.id = SKELETON_ID;
            // Inherit .mb positioning classes
            skeleton.className = 'mb skeleton-sweep';

            // Adjust styles to match exact geometry of .mb
            // .mb is bottom -10vh, height 85vh. 
            // We need to ensure this new div has width.
            // .mb is an IMG so it has intrinsic width. The div won't.
            // We'll set a reasonable width or aspect ratio. 
            // Assuming portrait, let's say 400px max or auto.
            skeleton.style.width = '100%';
            skeleton.style.maxWidth = '500px'; // Approx width of person image
            // skeleton.style.background = '#1a1a1a'; // handled by CSS class

            // Insert
            mbImage.parentNode.insertBefore(skeleton, mbImage);

            // Hide broken image
            mbImage.style.display = 'none';
        };

        const disableSkeleton = () => {
            const skeleton = document.getElementById(SKELETON_ID);
            if (skeleton) skeleton.remove();

            mbImage.style.display = 'block';
            if (document.body.classList.contains('intro-finished')) {
                mbImage.classList.add('hero-revealed');
            }
        };

        // Listeners
        mbImage.addEventListener('error', () => {
            if (!navigator.onLine) {
                enableSkeleton();
            }
        });

        mbImage.addEventListener('load', () => {
            disableSkeleton();
        });

        // Initial Status Check
        if (mbImage.complete) {
            if (mbImage.naturalWidth === 0) {
                // Failed/Broken
                if (!navigator.onLine) enableSkeleton();
            } else {
                // Success/Cached - Reveal Immediately
                disableSkeleton();
            }
        }

        // Retry on Online
        window.addEventListener('online', () => {
            // Check if currently broken/skeleton is active
            if (document.getElementById(SKELETON_ID)) {
                console.log("Network back: Retrying Hero Image...");
                const currentSrc = mbImage.src.split('?')[0];
                mbImage.src = currentSrc + '?t=' + Date.now();
            }
        });
    }

    // Start Monitoring
    monitorHeroImage();

    // --- EXIT APP LOGIC (Back Button Trap) ---
    const exitModal = document.getElementById('exitModal');
    const confirmExitBtn = document.getElementById('confirmExitBtn');
    const cancelExitBtn = document.getElementById('cancelExitBtn');

    if (exitModal && confirmExitBtn && cancelExitBtn) {

        // Trap the back button logic - ONLY FOR PWA (Standalone)
        // User Requirement: "EXIT APPLICATION DONT SHOW IN WEB BROWSER ONLY AT THE TIME APP INSTALLED"
        const isPWA = window.matchMedia('(display-mode: standalone)').matches;

        if (isPWA) {
            // We push a state so that the first 'back' action triggers popstate instead of leaving
            window.history.pushState(null, "", window.location.href);

            window.addEventListener('popstate', function (event) {
                // Logic: If user presses back, show Exit Modal instead of leaving

                // Check if modal is already visible
                if (exitModal.classList.contains('show-popup')) {
                    // If open, close it (Cancel action)
                    exitModal.classList.remove('show-popup');
                    setTimeout(() => exitModal.classList.add('hidden-popup'), 500);
                } else {
                    // If closed, OPEN it
                    exitModal.classList.remove('hidden-popup');
                    exitModal.classList.add('show-popup');
                }

                // RE-TRAP: Push state again so the NEXT back press also triggers this
                window.history.pushState(null, "", window.location.href);
            });
        }

        // Cancel Button
        cancelExitBtn.addEventListener('click', () => {
            exitModal.classList.remove('show-popup');
            setTimeout(() => {
                exitModal.classList.add('hidden-popup');
            }, 500);
        });

        // Confirm Button
        confirmExitBtn.addEventListener('click', () => {
            window.close(); // Attempt to close window (works in PWA)
            // Fallback for browsers
            // window.location.href = "https://www.google.com"; // REMOVED: User requested only close app
        });
    }

    // --- SWIPE NAVIGATION LOGIC ---
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let isSwiping = false; // Flag to track if the gesture is a swipe

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        isSwiping = false; // Reset
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
        const touchX = e.changedTouches[0].screenX;
        const touchY = e.changedTouches[0].screenY;

        // Check if moved enough to be considered a swipe/scroll intent, not a tap
        if (Math.abs(touchX - touchStartX) > 10 || Math.abs(touchY - touchStartY) > 10) {
            isSwiping = true;
        }
    }, { passive: false });

    document.addEventListener('touchend', (e) => {
        if (!isSwiping) return; // If it was just a tap (little movement), don't treat as swipe nav

        touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        handleSwipeGesture(touchEndX, touchEndY);

        // Reset after a short delay to ensure click blocking works
        setTimeout(() => { isSwiping = false; }, 100);
    }, { passive: false });

    // Block accidental clicks if we were swiping
    document.addEventListener('click', (e) => {
        if (isSwiping) {
            e.preventDefault();
            e.stopPropagation();
            console.log("Click blocked due to swipe");
        }
    }, true); // Capture phase to intercept early

    function handleSwipeGesture(touchEndX, touchEndY) {
        // 1. Safety Checks
        // If Vibe Game is playing, don't swipe navigate
        if (pages[currentPageIndex].id === 'vibe' && typeof gameState !== 'undefined' && gameState === 'PLAYING') return;

        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // --- BLOG SWIPE LOGIC ---
        const blogModal = document.getElementById('blogModal');
        if (blogModal && blogModal.classList.contains('active')) {
            if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 100) {
                if (deltaX < 0) {
                    // Swipe Left -> Next Post
                    const nextBtn = document.querySelector('.nav-article-btn[title="Next"]');
                    if (nextBtn && !nextBtn.classList.contains('disabled')) nextBtn.click();
                } else {
                    // Swipe Right -> Prev Post
                    const prevBtn = document.querySelector('.nav-article-btn[title="Previous"]');
                    if (prevBtn && !prevBtn.classList.contains('disabled')) prevBtn.click();
                }
            }
            return; // Block main navigation
        }

        // Refined Thresholds for "Smoother" feel
        const MIN_SWIPE_DISTANCE = 30; // Reduced from 50 (More sensitive)
        const MAX_VERTICAL_DEVIATION = 75; // Increased from 50 (More forgiving of diagonal)

        // Ensure it's a horizontal-ish swipe
        if (Math.abs(deltaX) > MIN_SWIPE_DISTANCE && Math.abs(deltaY) < MAX_VERTICAL_DEVIATION) {
            // Extra check: If vertical scroll was significant relative to horizontal, maybe ignore?
            // But simpler is often better.

            if (deltaX < 0) {
                // Swiped Left -> Go Next (finger moves left, content moves left)
                handleNavigation('next');
            } else {
                // Swiped Right -> Go Prev
                handleNavigation('prev');
            }
        }
    }



    // --- KEYBOARD NAVIGATION LOGIC ---
    document.addEventListener('keydown', (e) => {
        // Ignore if Vibe Game is playing (Game controls take precedence)
        if (pages[currentPageIndex].id === 'vibe' && typeof gameState !== 'undefined' && gameState === 'PLAYING') return;

        // Ignore if any modal is open
        if (document.querySelector('.show-popup') || document.querySelector('.drive-modal-overlay.active')) return;

        if (e.key === 'ArrowRight') {
            handleNavigation('next');
        } else if (e.key === 'ArrowLeft') {
            handleNavigation('prev');
        }
    });

    // --- COOKIE CONSENT LOGIC ---
    // --- COOKIE CONSENT LOGIC ---
    const cookieStrip = document.getElementById('cookieConsentStrip');
    const cookieModal = document.getElementById('cookiePolicyModal');
    // const openCookiePolicyBtn = document.getElementById('openCookiePolicy'); // REMOVED: Whole strip is now the button
    const quickAcceptBtn = document.getElementById('quickAcceptCookie'); // The [OK] button
    const cookieAcceptBtn = document.getElementById('cookieAcceptBtn'); // Modal Accept
    const cookieCancelBtn = document.getElementById('cookieCancelBtn'); // Modal Cancel

    function checkCookieConsent() {
        if (!localStorage.getItem('cookieConsent_v3')) {
            // Show strip after delay with animation
            setTimeout(() => {
                if (cookieStrip) {
                    cookieStrip.classList.remove('hidden-strip');
                    cookieStrip.classList.add('visible-strip'); // Triggers keyframe animation
                }
            }, 2000);
        }
    }

    function hideCookieStrip() {
        if (cookieStrip) {
            cookieStrip.classList.remove('visible-strip');
            cookieStrip.classList.add('exit-anim');

            // Wait for animation to finish
            setTimeout(() => {
                cookieStrip.classList.remove('exit-anim');
                cookieStrip.classList.add('hidden-strip');
            }, 600);
        }
    }

    function acceptAllCookies(e) {
        if (e) e.stopPropagation(); // Prevent strip click
        localStorage.setItem('cookieConsent_v3', 'true');
        hideCookieStrip();
        if (cookieModal) closePopup(cookieModal);
    }

    function closePopup(modal) {
        modal.classList.remove('show-popup');
        setTimeout(() => modal.classList.add('hidden-popup'), 500);
    }

    // Init Logic
    checkCookieConsent();

    // Event Listeners

    // 1. CLICKING THE STRIP OPENS SETTINGS
    if (cookieStrip) {
        cookieStrip.addEventListener('click', (e) => {
            // If user clicked the "OK" button, do nothing (handled by its own listener)
            if (e.target === quickAcceptBtn || e.target.closest('#quickAcceptCookie')) return;

            // Open Modal
            if (cookieModal) {
                cookieModal.classList.remove('hidden-popup');
                cookieModal.classList.add('show-popup');
            }
        });
    }

    // 2. QUICK ACCEPT [OK]
    if (quickAcceptBtn) {
        quickAcceptBtn.addEventListener('click', acceptAllCookies);
    }

    // 3. MODAL ACCEPT
    if (cookieAcceptBtn) {
        cookieAcceptBtn.addEventListener('click', acceptAllCookies);
    }

    // 4. MODAL CANCEL
    if (cookieCancelBtn) {
        cookieCancelBtn.addEventListener('click', () => {
            if (cookieModal) closePopup(cookieModal);

            // User CANCELED:
            // 1. Hide the strip immediately.
            hideCookieStrip();

            // 2. SAVE this decision so it doesn't appear on refresh.
            // User said: "NO NEED IN REFRESH TO SHOW".
            localStorage.setItem('cookieConsent_v3', 'false');
        });
    }

    // --- Privacy & Terms Logic ---
    // --- Privacy & Terms Logic ---
    const privacyModal = document.getElementById('privacyModal');
    const termsModal = document.getElementById('termsModal');
    const openPrivacyBtn = document.getElementById('openPrivacyModal');
    const openTermsBtn = document.getElementById('openTermsModal');
    const privacyCloseX = document.getElementById('privacyCloseX');
    const termsCloseX = document.getElementById('termsCloseX');

    if (openPrivacyBtn) {
        openPrivacyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (privacyModal) {
                privacyModal.classList.remove('hidden-popup');
                privacyModal.classList.add('show-popup');
            }
        });
    }

    if (openTermsBtn) {
        openTermsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (termsModal) {
                termsModal.classList.remove('hidden-popup');
                termsModal.classList.add('show-popup');
            }
        });
    }

    if (privacyCloseX) {
        privacyCloseX.addEventListener('click', () => {
            if (privacyModal) closePopup(privacyModal);
        });
    }

    if (termsCloseX) {
        termsCloseX.addEventListener('click', () => {
            if (termsModal) closePopup(termsModal);
        });
    }

    // --- Copyright & Date Cycle ---
    function animateCopyright() {
        const copyrightEl = document.getElementById('copyrightFooter');
        if (!copyrightEl) return;

        // NOTE: CSS handles positioning (absolute, bottom right)
        // We only toggle classes here.

        const originalText = '© MATHEWS B / 2026 <i>V<b>2.2</b></i>';
        let showDate = false;

        setInterval(() => {
            // 1. Trigger Light Sweep
            copyrightEl.classList.add('sweep-active');

            // 2. Fade Out Text slightly before change
            setTimeout(() => {
                copyrightEl.classList.add('copyright-sweep-out');
            }, 100);

            // 3. Change Text Mid-Sweep
            setTimeout(() => {
                if (showDate) {
                    copyrightEl.innerHTML = originalText;
                    copyrightEl.classList.remove('date-active'); // Enable Hover
                    showDate = false;
                } else {
                    const now = new Date();
                    const dateStr = now.toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    }).toUpperCase();
                    const timeStr = now.toLocaleTimeString('en-US', {
                        hour12: true,
                        hour: 'numeric',
                        minute: 'numeric'
                    });
                    copyrightEl.innerHTML = `${dateStr} • ${timeStr}`;
                    copyrightEl.classList.add('date-active'); // Disable Hover
                    showDate = true;
                }
                // Fade In
                copyrightEl.classList.remove('copyright-sweep-out');
            }, 400);

            // 4. Remove Sweep Class to reset
            setTimeout(() => {
                copyrightEl.classList.remove('sweep-active');
            }, 1200);

        }, 5000);
    }

    // Start Animation with a slight delay
    setTimeout(animateCopyright, 1000);

    // --- Logo Click Handler ---
    // --- Logo Click Handler ---
    // --- Logo Click Handler (Custom SPA Transition) ---
    window.goToLogoHome = function (e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        try {
            console.log("goToLogoHome: Triggered (Custom)");

            // Cleanup Vibe Game
            if (typeof pages !== 'undefined' && pages[currentPageIndex] && pages[currentPageIndex].id === 'vibe') {
                if (typeof cleanupGame === 'function') cleanupGame();
            }

            // --- Standard Transition (Matches Home Button) ---
            if (typeof window.transitionView === 'function') {
                window.transitionView(() => {
                    currentPageIndex = 0;
                    history.pushState({ page: 'home' }, '', 'index.html');

                    // Reset Dynamic Container
                    if (window.dynamicContainer) window.dynamicContainer.innerHTML = '';

                    // Update Content & Metadata
                    if (typeof window.updateContent === 'function') window.updateContent();
                    if (typeof window.updatePageMetadata === 'function') window.updatePageMetadata('home');
                    if (typeof renderDropdown === 'function') renderDropdown(); // Update active state

                    window.scrollTo(0, 0);
                });
            } else {
                // Fallback if transitionView is somehow missing
                console.warn("transitionView not found, using fallback reload");
                window.location.href = 'index.html';
            }

        } catch (err) {
            console.error("goToLogoHome Failed:", err);
            // Fallback only if absolutely necessary
            window.location.href = 'index.html';
        }
    };

    // Start Boot (Initial)
    runBootSequence();

    // --- BLOG SEARCH LOGIC ---
    const blogSearchInput = document.getElementById('blogSearchInput');
    const blogSearchReset = document.getElementById('blogSearchReset');

    if (blogSearchInput) {
        blogSearchInput.addEventListener('input', (e) => {
            renderBlog(e.target.value);
        });
    }

    if (blogSearchReset) {
        blogSearchReset.addEventListener('click', () => {
            if (blogSearchInput) {
                blogSearchInput.value = '';
                renderBlog('');
                blogSearchInput.focus();
            }
        });
    }

}); // End Main DOMContentLoaded

// Attach Listener Robustly
document.addEventListener('DOMContentLoaded', () => {
    const logoLink = document.getElementById('logoLink');
    if (logoLink) {
        console.log("Logo Link Found - Attaching Listener");
        logoLink.addEventListener('click', window.goToLogoHome);
    } else {
        console.error("Logo Link NOT found!");
    }



    // --- COOKIE CONSENT LOGIC (Restored) ---
    const cookieConsentStrip = document.getElementById('cookieConsentStrip');
    const quickAcceptCookie = document.getElementById('quickAcceptCookie');

    if (cookieConsentStrip && quickAcceptCookie) {
        // Check Local Storage
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieConsentStrip.classList.remove('hidden-strip');
                cookieConsentStrip.classList.add('visible-strip');
            }, 3500); // Show after boot
        }

        // Accept Click
        quickAcceptCookie.addEventListener('click', () => {
            cookieConsentStrip.classList.remove('visible-strip');
            cookieConsentStrip.classList.add('exit-anim');
            localStorage.setItem('cookieConsent', 'true');
            setTimeout(() => {
                cookieConsentStrip.classList.add('hidden-strip');
            }, 600);
        });
    }

    // Show Tutorial after boot (approx delay) - ONLY ON HOME PAGE
    setTimeout(() => {
        // Check if current page is HOME (index 0 or id 'home')
        if (currentPageIndex === 0 && window.showTutorial) {
            window.showTutorial();
        }
    }, 4000); // 4s to be safe after boot
});
