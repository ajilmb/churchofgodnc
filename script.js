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
 * - runBootSequence(): Handles the Radio Wave / PWA Splash startup.
 */



// Implements the "Same page itself everything happens" logic with Dynamic JSON Loading

document.addEventListener('DOMContentLoaded', () => {
    const navLeftBtn = document.getElementById('navLeftBtn');
    const navRightBtn = document.getElementById('navRightBtn');
    const navDropdown = document.getElementById('navDropdown');
    const mainContent = document.getElementById('mainContent');

    // Reset persistence (Ensures Home shows first on next visit)
    localStorage.removeItem('currentPage');

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
    const homeBtnWrapper = document.getElementById('homeBtnWrapper');

    // --- Google Drive Modal Elements ---
    const driveModal = document.getElementById('driveModal');
    const driveModalContainer = document.querySelector('.drive-modal-container');
    const closeDriveBtn = document.getElementById('closeDriveBtn');
    const driveFrame = document.getElementById('driveFrame');
    // Actual folder ID provided by user
    const GDRIVE_ID = "1U3xUj-a0QxP720mXNEAFqrYHXrT_3xBV";


    // --- Content Fetching & Rendering ---

    // Work Status Loop Variable
    let workStatusInterval = null;

    // --- Unified Scroll Indicator Engine ---
    window.evaluateScroll = function () {
        const target = document.getElementById('dynamic-content-container');
        const indicator = document.getElementById('globalScrollIndicator');
        if (!target || !indicator) return;

        const p = pages[currentPageIndex];
        // Show only for About and Blog sectors
        if (!p || (p.id !== 'about' && p.id !== 'blog')) {
            indicator.classList.add('hidden-indicator');
            return;
        }

        const hasScroll = target.scrollHeight > target.clientHeight + 10;
        if (hasScroll) {
            const isAtBottom = target.scrollHeight - target.scrollTop - target.clientHeight <= 15;
            const isAtTop = target.scrollTop < 5;

            // Hide if at bottom, show if anything else (especially at top)
            if (isAtBottom && !isAtTop) {
                indicator.classList.add('hidden-indicator');
            } else {
                indicator.classList.remove('hidden-indicator');
                indicator.style.display = 'flex';
            }
        } else {
            indicator.classList.add('hidden-indicator');
        }
    };

    // Attach Listeners Once
    dynamicContainer.addEventListener('scroll', window.evaluateScroll);
    const globalRO = new ResizeObserver(() => window.evaluateScroll());
    globalRO.observe(dynamicContainer);

    async function loadContent(pageId) {
        // Removed: 'LOADING DATA...' flicker - content swap should be instant.
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

        if (typeof ABOUT_DATA === 'undefined' || !ABOUT_DATA.enabled) {
            dynamicContainer.innerHTML = '<div class="no-content-message" style="text-align:center; padding: 20px; color: var(--primary-green, #00ff00);">Content not available</div>';
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
                <!-- Local Scroll Indicator Removed -->
                <div class="scifi-decoration">
                    <div class="line"></div>
              
                </div>
            </div>
        `;
        // Content is injected, trigger indicator evaluation
        setTimeout(window.evaluateScroll, 50);

    }

    function renderWorks() {
        if (typeof WORKS_CONFIG !== 'undefined' && !WORKS_CONFIG.enabled) {
            dynamicContainer.innerHTML = '<div class="no-content-message" style="text-align:center; padding: 20px; color: var(--primary-green, #00ff00);">Content currently unavailable</div>';
            return;
        }

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
                    <a href="javascript:void(0)" class="tap-here-btn" 
                       onclick="openDriveModal(this, (typeof WORKS_CONFIG !== 'undefined' ? WORKS_CONFIG.url : null)); return false;">
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
                    <div class="hud-bar">
                        <div class="score-display">
                            P: <span id="scoreVal">0</span> &nbsp;&nbsp; L: <span id="levelVal">1</span>
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
                                <img src="Images/rocket-defense-logo.svg" alt="ROCKET DEFENSE" style="width: 80%; max-width: 230px; margin-bottom: 5px; pointer-events: none; filter: drop-shadow(0px 0px 5px rgba(0,255,0,0.5));" />
                                <button id="startGameBtn" class="game-btn">START</button>
                            </div>

                            <!-- Pause Screen -->
                            <div id="pauseScreen" class="overlay-screen">
                                <img src="Images/paused-logo.svg" alt="PAUSED" style="width: 80%; max-width: 230px; margin-bottom: 0px; pointer-events: none; filter: drop-shadow(0px 0px 5px rgba(255,170,0,0.5));" />
                                <button id="resumeGameBtn" class="game-btn">RESUME</button>
                                <button id="quitGameBtn" class="game-btn">QUIT</button>
                            </div>

                            <!-- Game Over Screen -->
                            <div id="gameOverScreen" class="overlay-screen" style="justify-content: center; padding-top: 0;">
                                <img src="Images/game-over-logo.svg" alt="GAME OVER" style="width: 80%; max-width: 230px; margin: 0 auto; display: block; pointer-events: none; filter: drop-shadow(0px 0px 5px rgba(255,0,0,0.5));" />
                                <div style="width: 100%; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 0px; margin-top: -10px;">
                                    <img src="Images/score-label-logo.svg" alt="SCORE:" style="width: 90px; height: auto; margin: 0 auto; display: block; pointer-events: none; filter: drop-shadow(0px 0px 8px rgba(0, 190, 255, 1));" />
                                    <span id="finalScore" style="font-family: Impact, 'Arial Black', sans-serif; font-size: 1.6rem; line-height: 1; color: #ffffff; text-shadow: 0 0 10px #00aaff, 0 0 20px #0088ff, 0 0 30px #0055ff; display: block; margin: 0 auto; margin-top: -5px;">0</span>
                                </div>
                                <button id="restartGameBtn" class="game-btn" style="margin-top: 10px;">RETRY</button>
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
        if (typeof BLOG_DATA === 'undefined' || typeof BLOG_CONFIG === 'undefined' || !BLOG_CONFIG.enabled) {
            dynamicContainer.innerHTML = '<div class="no-content-message" style="text-align:center; padding: 20px; color: var(--primary-green, #00ff00);">Content not available</div>';
            return;
        }

        let blogHTML = `<div class="content-wrapper blog-content">`;

        // 1. Sort by Date (Latest First)
        const activePosts = BLOG_DATA.filter(post => post.enabled !== false);
        const sortedPosts = [...activePosts].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            const isInvalidA = isNaN(dateA.getTime());
            const isInvalidB = isNaN(dateB.getTime());

            if (isInvalidA && isInvalidB) return 0; // Maintain array order
            if (isInvalidA) return 1;  // Put invalid (STAY TUNED) at bottom
            if (isInvalidB) return -1; // Put invalid (STAY TUNED) at bottom
            return dateB - dateA;      // Latest first
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
                const onClickAction = post.externalLink
                    ? `window.open('${post.externalLink}', '_blank');`
                    : `openBlogModal(${post.id}, this); updateBlogURL(${post.id});`;

                blogHTML += `
                    <div class="blog-card" onclick="${onClickAction}">
                        <div class="blog-info">
                            <div class="blog-date-wrapper">
                                <div class="blog-date" style="text-transform: uppercase;">${post.category || 'GENERAL'}</div>
                                <div class="blog-source-icon" style="width: auto; gap: 6px;">
                                    ${post.source === 'local'
                        ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`
                        : (post.source === 'substack' ? `<img src="Images/substack-icon.svg" alt="Substack">` : '')
                    }
                                    ${post.isPremium ? `<span class="premium-badge">PREMIUM</span>` : ''}
                                </div>
                            </div>
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

        blogHTML += `</div>`; // Close content-wrapper
        dynamicContainer.innerHTML = blogHTML;

        // Trigger indicator evaluation
        setTimeout(window.evaluateScroll, 50);

        // Image safety
        dynamicContainer.querySelectorAll('img').forEach(img => {
            if (!img.complete) img.addEventListener('load', window.evaluateScroll, { once: true });
        });
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
                ${(typeof CONTACT_CONFIG !== 'undefined' && CONTACT_CONFIG.formEnabled !== false) ? `
                <div style="margin-bottom:20px; text-align:left;">
                    <a href="#" class="submit-btn" onclick="event.preventDefault(); openContactModal(this);" style="display:inline-block; text-decoration:none; padding:10px 30px;">
                        INITIATE TRANSMISSION
                    </a>
                </div>` : ''}

                <!-- Icons Row -->
                <div class="social-icons-row" style="display:flex; gap:30px; justify-content:flex-start; align-items:center;">
                    
                    <!-- MAIL -->
                    ${(typeof CONTACT_CONFIG !== 'undefined' && CONTACT_CONFIG.emailEnabled !== false) ? `
                    <a href="mailto:${CONTACT_CONFIG.email}" class="icon-link" aria-label="Email">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                    </a>` : ''}

                    <!-- LINKEDIN -->
                    ${(typeof CONTACT_CONFIG !== 'undefined' && CONTACT_CONFIG.linkedinEnabled !== false) ? `
                    <a href="${CONTACT_CONFIG.linkedin}" target="_blank" class="icon-link" aria-label="LinkedIn">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                            <rect x="2" y="9" width="4" height="12"></rect>
                            <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                    </a>` : ''}

                    <!-- LINKTREE -->
                    ${(typeof CONTACT_CONFIG !== 'undefined' && CONTACT_CONFIG.linktreeEnabled !== false) ? `
                    <a href="${CONTACT_CONFIG.linktree}" target="_blank" class="icon-link" aria-label="Linktree">
                        <svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 -960 960 960" width="40" fill="currentColor">
                            <path d="M160-40v-80h640v80H160Zm0-800v-80h640v80H160Zm320 400q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm70-80q45-56 109-88t141-32q77 0 141 32t109 88h70v-480H160v480h70Zm118 0h264q-29-20-62.5-30T480-280q-36 0-69.5 10T348-240Zm103.5-291.5Q440-543 440-560t11.5-28.5Q463-600 480-600t28.5 11.5Q520-577 520-560t-11.5 28.5Q497-520 480-520t-28.5-11.5ZM480-480Z"/>
                        </svg>
                    </a>` : ''}



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

            // Setup hover listening for the submit button to camouflage fly
            const submitBtn = container.querySelector('.submit-btn');
            if (submitBtn) {
                submitBtn.addEventListener('mouseenter', () => {
                    submitBtn.classList.add('is-hovered');
                    const activeFly = document.getElementById('cyberFly');
                    if (activeFly) {
                        const flyRect = activeFly.getBoundingClientRect();
                        const btnRect = submitBtn.getBoundingClientRect();

                        // Check if fly overlaps with button
                        const isOverlapping = !(
                            flyRect.right < btnRect.left ||
                            flyRect.left > btnRect.right ||
                            flyRect.bottom < btnRect.top ||
                            flyRect.top > btnRect.bottom
                        );

                        if (isOverlapping) {
                            activeFly.classList.add('blacked-out');
                        }
                    }
                });
                submitBtn.addEventListener('mouseleave', () => {
                    submitBtn.classList.remove('is-hovered');
                    const activeFly = document.getElementById('cyberFly');
                    if (activeFly) activeFly.classList.remove('blacked-out');
                });

                // Track fly movement dynamically
                if (!window.mainFlyCollisionInterval) {
                    window.mainFlyCollisionInterval = setInterval(() => {
                        const activeFly = document.getElementById('cyberFly');
                        if (!activeFly || !submitBtn.classList.contains('is-hovered')) return;

                        const flyRect = activeFly.getBoundingClientRect();
                        const btnRect = submitBtn.getBoundingClientRect();
                        const isOverlapping = !(flyRect.right < btnRect.left || flyRect.left > btnRect.right || flyRect.bottom < btnRect.top || flyRect.top > btnRect.bottom);

                        if (isOverlapping) activeFly.classList.add('blacked-out');
                        else activeFly.classList.remove('blacked-out');

                    }, 50);
                }
            }

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
        const pageId = page.id;

        // 1. Reset Global UI Elements (Scroll Indicator & Timer)
        const globalIndicator = document.getElementById('globalScrollIndicator');
        if (globalIndicator) {
            globalIndicator.classList.add('hidden-indicator');
        }

        // 2. Reset Scroll Position
        if (dynamicContainer) {
            dynamicContainer.scrollTop = 0;
        }

        // 3. Update Header Info
        const iconContainer = document.getElementById('iconContainer');
        if (iconContainer) {
            iconContainer.classList.remove('work-status-active');
            iconContainer.style.display = '';
        }
        if (pageNameDisplay) pageNameDisplay.textContent = page.headerTitle;
        if (iconDisplaySpan) iconDisplaySpan.innerHTML = page.icon;

        // 4. Work Status Loop Logic
        if (window.workStatusInterval) {
            clearInterval(window.workStatusInterval);
            window.workStatusInterval = null;
        }
        if (pageId === 'works' && typeof WORK_STATUS_DATA !== 'undefined' && WORK_STATUS_DATA.enabled) {
            window.workStatusInterval = setInterval(() => {
                toggleWorkHeader();
            }, WORK_STATUS_DATA.interval);
        }

        // 5. Dynamic Container Class Management
        dynamicContainer.classList.remove('about-container', 'works-container', 'blog-container', 'vibe-container', 'contact-container');

        if (pageId === 'contact' && window.showContactGuide) {
            window.showContactGuide();
        }

        if (pageId !== 'home') {
            dynamicContainer.classList.add(`${pageId}-container`);
        }

        if (pageId === 'vibe' || pageId === 'contact') {
            dynamicContainer.classList.add('noscroll-container');
        } else {
            dynamicContainer.classList.remove('noscroll-container');
        }

        // --- BLOG SEARCH VISIBILITY ---
        const searchContainer = document.getElementById('blogSearchContainer');
        const substackLink = document.querySelector('.substack-link');

        if (searchContainer) {
            if (pageId === 'blog') {
                searchContainer.style.display = 'block';
            } else {
                searchContainer.style.display = 'none';
            }
        }

        if (substackLink) {
            if (pageId === 'blog') {
                substackLink.style.display = 'flex';
            } else {
                substackLink.style.display = 'none';
            }
        }
        // ------------------------------

        // --- BOTTOM NAV MENU VISIBILITY ---
        const bottomNavMenu = document.querySelector('.bottom-nav-menu');
        if (bottomNavMenu) {
            if (pageId === 'works') {
                bottomNavMenu.classList.add('active-menu');
            } else {
                bottomNavMenu.classList.remove('active-menu');
            }
        }
        // ----------------------------------

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


            // FULL AUDIO PLAYER
            if (audioPlayerContainer) {
                audioPlayerContainer.classList.remove('minimal-player');
                if (window.stopPlayPauseLoop) window.stopPlayPauseLoop();
            }

        } else if (page.id === 'works') {
            // SPECIAL CASE: Originally user wanted NO audio player stuff on Works page, 
            // but now wants the minimal player play button just like other pages.
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

            // MINIMAL AUDIO PLAYER
            if (audioPlayerContainer) {
                audioPlayerContainer.classList.add('minimal-player');
                if (window.startPlayPauseLoop) window.startPlayPauseLoop();
            }

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

            // MINIMAL AUDIO PLAYER
            if (audioPlayerContainer) {
                audioPlayerContainer.classList.add('minimal-player');
                if (window.startPlayPauseLoop) window.startPlayPauseLoop();
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

        // Immediate hide for global indicator to match content fade speed
        const globalInd = document.getElementById('globalScrollIndicator');
        if (globalInd) globalInd.classList.add('hidden-indicator');

        // 2. Wait for transition (400ms is enough for fade-out)
        setTimeout(() => {
            // 3. Update Content & Metadata
            try {
                updateCallback();
            } catch (e) {
                console.error("Error during content update:", e);
            } finally {
                // Ensure the view is revealed
                requestAnimationFrame(() => {
                    if (currentActive) currentActive.style.opacity = '';
                    if (pageNameDisplay) pageNameDisplay.classList.remove('fade-out');
                    if (iconDisplaySpan) iconDisplaySpan.classList.remove('fade-out');
                    mainContent.style.opacity = '1';
                });

                // Release Lock
                isTransitioning = false;
            }

        }, 400); // Back to 400ms for snappier feel
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

        // Sidebar Reset
        if (pages[nextIndex].id === 'home') {
            if (window.stopPlayPauseLoop) window.stopPlayPauseLoop();
        }

        // 3. Trigger View Transition
        transitionView(() => {
            // 4. Update Actual State (Inside Callback - Safe)
            currentPageIndex = nextIndex;

            // Update URL
            const pageId = pages[currentPageIndex].id;
            const newUrl = `?page=${pageId}`;
            history.pushState({ page: pageId }, '', newUrl);

            // SAVE TO LOCAL STORAGE REMOVED (Ensures Home shows first on refresh)
            // localStorage.setItem('currentPage', pageId);

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

    // --- Click Outside to Close Menu & Modals ---
    document.addEventListener('click', (e) => {
        // 1. Navigation Menu (Close if click is outside nav list and toggle button)
        if (isMenuOpen && navDropdown && !navDropdown.contains(e.target)) {
            // navRightBtn handles the toggle via its own listener + stopPropagation
            if (navRightBtn && navRightBtn.contains(e.target)) return;

            // Do not close if clicking inside tutorial overlays or popup overlays OR specific modals
            if (e.target.closest('.tutorial-overlay') || e.target.closest('.popup-overlay') || e.target.closest('.drive-modal-overlay')) return;

            toggleMenu(false);
        }

        // 2. Close active modals if clicking exactly on overlay OR anywhere outside device-frame
        const isOutsideDevice = deviceFrame && !deviceFrame.contains(e.target);

        // Drive Style Modals
        const activeDriveModals = document.querySelectorAll('.drive-modal-overlay.active');
        activeDriveModals.forEach(modal => {
            // Only close if:
            // 1. Clicked exactly on the backdrop (e.target === modal)
            // 2. Clicked outside the card (isOutsideDevice) AND NOT inside the modal itself
            if (e.target === modal || (isOutsideDevice && !modal.contains(e.target))) {
                const id = modal.id;
                if (id === 'driveModal' && window.closeDriveModal) window.closeDriveModal();
                else if (id === 'contactModal' && window.closeContactModal) window.closeContactModal();
                else if (id === 'projectsModal' && window.closeProjectsModal) window.closeProjectsModal();
                else if (id === 'experienceModal' && window.closeExperienceModal) window.closeExperienceModal();
                else if (id === 'educationModal' && window.closeEducationModal) window.closeEducationModal();
                else if (id === 'blogModal' && window.closeBlogModal) window.closeBlogModal();
                else if (id === 'insectAiModal' && window.closeInsectAi) window.closeInsectAi();
            }
        });

        // Popup Style Modals (Privacy, Terms, Cookies, Ad)
        const activePopups = document.querySelectorAll('.popup-overlay.show-popup');
        activePopups.forEach(popup => {
            if (e.target === popup || (isOutsideDevice && !popup.contains(e.target))) {
                if (typeof closePopup === 'function') {
                    const id = popup.id;
                    closePopup(popup);
                    if ((id === 'privacyModal' || id === 'termsModal') && deviceFrame) {
                        deviceFrame.classList.remove('blur-mode');
                    }
                }
            }
        });
    });


    // Helper for direct navigation
    function handleNavigationByIndx(index) {
        if (index === currentPageIndex) return;
        if (window.isTransitioning) return;

        // Cleanup Vibe if needed
        if (pages[currentPageIndex].id === 'vibe') {
            if (typeof cleanupGame === 'function') cleanupGame();
        }

        // Sidebar Reset (Only stop on home)
        if (pages[index].id === 'home') {
            if (window.stopPlayPauseLoop) window.stopPlayPauseLoop();
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
                    pwaSplash.style.pointerEvents = 'none'; // Ensure no interference
                    // NOW Start Standard Radio Wave Boot
                    startStandardBoot(skipBoot);
                }, 500);
            }, 2000);
            return;
        }

        // IMPORTANT: If not PWA or skipping boot, ensure PWA splash is GONE
        if (pwaSplash) {
            pwaSplash.style.display = 'none';
            pwaSplash.style.pointerEvents = 'none';
        }

        startStandardBoot(skipBoot);
    };

    const startStandardBoot = (skipBoot) => {
        // If specific content is requested via URL, skip the long boot sequence
        if (skipBoot) {
            bootScreen.style.display = 'none';
            bootScreen.style.pointerEvents = 'none';
            document.body.classList.add('intro-finished');
            if (deviceFrame) deviceFrame.classList.add('intro-finished');
            if (mbImage) {
                mbImage.classList.add('entry-anim');
                mbImage.style.display = 'block';
                mbImage.style.opacity = '1';
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

        // PERSISTENCE FALLBACK REMOVED: Home should always be the entry point unless deep-linked.
        // const storedPage = localStorage.getItem('currentPage');
        const effectivePage = pageParam;

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

        if (effectivePage) {
            const pageIndex = pages.findIndex(p => p.id === effectivePage);
            if (pageIndex !== -1) {
                currentPageIndex = pageIndex;
                updateContent(); // Load the view
                updatePageMetadata(effectivePage);

                // Special Handling for Blog Post
                const activeBlogId = idParam || blogId;
                if (effectivePage === 'blog' && activeBlogId !== null) {
                    // Wait for blog list to render then open modal
                    setTimeout(() => {
                        const post = BLOG_DATA.find(b => b.id == activeBlogId);
                        if (post) {
                            if (typeof openBlogModal === 'function') {
                                openBlogModal(post.id, null);
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
        const sidePlayPauseBtn = document.getElementById('sidePlayPauseBtn');
        const prevTrackBtn = document.getElementById('prevTrackBtn');
        const nextTrackBtn = document.getElementById('nextTrackBtn');
        const modeToggleBtn = document.getElementById('modeToggleBtn');
        const volumeSlider = document.getElementById('volumeSlider');
        const muteBtn = document.getElementById('muteBtn');
        const nowPlayingText = document.querySelector('.now-playing-text');
        const nowPlayingLink = document.getElementById('nowPlayingLink');

        const audioPlayerContainer = document.querySelector('.centered-audio-player');

        // Resources
        const STREAM_URL = "https://stream.nightride.fm/nightride.mp3";
        // Use Global Playlist or empty array fallback
        const LOCAL_PLAYLIST = (window.PLAYLIST_CONFIG && window.PLAYLIST_CONFIG.enabled === false) ? [] : (window.LOCAL_PLAYLIST || []).filter(s => s.enabled !== false);
        // --- Auto-Fallback & Fading Logic ---
        let localTrackIndex = 0;
        let isOnline = true;
        let isManualModeSwitch = false;
        let userPrefersLocal = false; // Tracks if user manually switched to local
        let fadeInterval = null;

        // Smoothly fades audio out (or in), over a given duration
        const fadeAudio = (audioElement, targetVolume, duration, callback) => {
            if (fadeInterval) clearInterval(fadeInterval);

            const startVolume = audioElement.volume;
            // Prevent division by zero and extremely small jumps
            if (Math.abs(startVolume - targetVolume) < 0.01) {
                audioElement.volume = targetVolume;
                if (callback) callback();
                return;
            }

            const steps = 20; // How many updates to make
            const stepTime = duration / steps;
            const volumeStep = (targetVolume - startVolume) / steps;

            fadeInterval = setInterval(() => {
                let newVolume = audioElement.volume + volumeStep;

                // Clamp volume between 0.0 and 1.0 (some browsers crash on out-of-bounds)
                if (newVolume > 1) newVolume = 1;
                if (newVolume < 0) newVolume = 0;

                audioElement.volume = newVolume;

                // Check completion condition based on direction
                if ((volumeStep > 0 && newVolume >= targetVolume) ||
                    (volumeStep < 0 && newVolume <= targetVolume)) {
                    clearInterval(fadeInterval);
                    audioElement.volume = targetVolume;
                    if (callback) callback();
                }
            }, stepTime);
        };

        const handleStreamFailure = (e) => {
            console.error("Audio Stream Failure Detected:", e);

            // IF we intentionally asked a manual load, ignore this stall/error
            // because the browser might temporarily throw 'stalled' while fetching.
            if (isManualModeSwitch) return;

            if (isOnline) {
                console.log("Stream failed or stalled. Smoothly falling back to Local...");

                // Fade out over 1.5 seconds
                fadeAudio(bgAudio, 0, 1500, () => {
                    isOnline = false;
                    const track = LOCAL_PLAYLIST[localTrackIndex];
                    bgAudio.src = track.src;
                    bgAudio.loop = false;
                    updateText(`(LOCAL) ${track.title}`);
                    updateModeIcon();
                    updatePlayerUI();

                    bgAudio.play().then(() => {
                        // Fade back in to half volume over 1.5 seconds
                        fadeAudio(bgAudio, 0.5, 1500);
                    }).catch(updatePlayerUI);
                });
            } else {
                updateText("ERROR: CANNOT LOAD LOCAL FILE");
            }
        };

        // Monitor for drops
        bgAudio.addEventListener('error', handleStreamFailure);
        bgAudio.addEventListener('stalled', handleStreamFailure);
        // Sometimes stream just suspends indefinitely
        bgAudio.addEventListener('suspend', () => {
            if (bgAudio.networkState === bgAudio.NETWORK_NO_SOURCE) {
                handleStreamFailure(new Error("Network Source Missing"));
            }
        });

        // Icons
        const playIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
        const pauseIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;

        const soundOnIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
        const soundOffIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
        const globeIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`;
        const homeIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.2 10l-6.5-5.2a2.5 2.5 0 0 0-3.4 0L3.8 10A2.5 2.5 0 0 0 2.5 12v7a2.5 2.5 0 0 0 2.5 2.5h14a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 20.2 10z"></path><path d="M9.5 21.5v-4.5a2.5 2.5 0 0 1 2.5-2.5h0a2.5 2.5 0 0 1 2.5 2.5v4.5"></path></svg>`;

        let playPauseState = 'music'; // 'music' or 'home'
        let playPauseLoopInterval = null;
        const fileIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg`;

        bgAudio.volume = 0.5;

        // Functions
        const updateText = (text, link = "#") => {
            if (nowPlayingText) nowPlayingText.textContent = text;
            if (nowPlayingLink) nowPlayingLink.setAttribute("href", link);
        };

        const updateModeIcon = () => {
            if (modeToggleBtn) modeToggleBtn.innerHTML = isOnline ? globeIcon : fileIcon;
        };

        const updatePlayerUI = () => {
            // Update both main and side controls
            const btns = [playPauseBtn, sidePlayPauseBtn].filter(Boolean);

            btns.forEach(btn => {
                if (playPauseState === 'home') {
                    btn.innerHTML = `<span class="btn-content rotate-enter">${homeIcon}</span>`;
                    btn.dataset.iconType = 'home';
                } else {
                    const icon = bgAudio.paused ? playIcon : pauseIcon;
                    btn.innerHTML = `<span class="btn-content rotate-enter">${icon}</span>`;
                    btn.dataset.iconType = 'music';
                }

                if (bgAudio.paused) btn.classList.add('is-paused');
                else btn.classList.remove('is-paused');
            });

            if (muteBtn) muteBtn.innerHTML = bgAudio.muted ? soundOffIcon : soundOnIcon;
            updateModeIcon();
        };

        const startPlayPauseLoop = () => {
            // Morph loop only if NOT on home page
            const container = document.querySelector('.centered-audio-player');
            if (!container || !container.classList.contains('minimal-player')) return;

            // If already running, don't restart (keeps natural flow)
            if (playPauseLoopInterval) return;

            playPauseLoopInterval = setInterval(() => {
                if (playPauseBtn && !playPauseBtn.matches(':hover')) {
                    playPauseState = (playPauseState === 'music' ? 'home' : 'music');
                    updatePlayerUI();
                }
            }, 2000); // Toggle every 2 seconds
        };

        const stopPlayPauseLoop = () => {
            if (playPauseLoopInterval) {
                clearInterval(playPauseLoopInterval);
                playPauseLoopInterval = null;
            }
            playPauseState = 'music'; // Reset to music icon
            updatePlayerUI();
        };

        // Exposed for page transitions
        window.startPlayPauseLoop = startPlayPauseLoop;
        window.stopPlayPauseLoop = stopPlayPauseLoop;

        const loadTrack = (play = true) => {
            if (isOnline) {
                bgAudio.src = STREAM_URL;
                bgAudio.loop = false;
                updateText("(FM) NIGHT RIDE SYNTHWAVE", "https://nightride.fm/");
            } else {
                const track = LOCAL_PLAYLIST[localTrackIndex];
                bgAudio.src = track.src;
                // bgAudio.loop = true; // CHANGED: Disable loop to allow auto-next
                bgAudio.loop = false;
                updateText(`(LOCAL) ${track.title}`, track.link || "#");
            }
            if (play) {
                bgAudio.play().then(updatePlayerUI).catch(updatePlayerUI);
            }

            // Release the "manual switch lock" after a short delay so normal stalling checks apply later
            setTimeout(() => {
                isManualModeSwitch = false;
            }, 5000);
        };

        // Event Listeners
        // Auto-Next Track Listener
        bgAudio.addEventListener('ended', () => {
            if (!isOnline) {
                handleTrackChange('next');
            }
        });

        if (modeToggleBtn) modeToggleBtn.addEventListener('click', () => {
            isManualModeSwitch = true; // Set flag to block auto-fallback logic during the load
            if (fadeInterval) clearInterval(fadeInterval); // Kill any active auto-fallback fades
            bgAudio.volume = 0.5; // Ensure volume isn't trapped at 0 from a half-finished fade out

            isOnline = !isOnline;
            userPrefersLocal = !isOnline; // Register manual preference
            loadTrack(true);
            handleInitialAudioClick();
        });

        // Toggle Logic for Buttons
        // Toggle Logic for Buttons
        const toggleAudio = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation(); // Prevent bubbling issues
            }

            // If Home State: Navigate Home
            if (playPauseState === 'home') {
                if (typeof handleNavigationByIndx === 'function') {
                    handleNavigationByIndx(0);
                    // playPauseState will be reset via stopPlayPauseLoop called in updateContent
                }
                return;
            }

            // Normal Music Toggle
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

            // Once user interacts with ANY audio control, we kill the "first-click" document listener
            document.removeEventListener('click', handleInitialAudioClick);
            document.removeEventListener('touchstart', handleInitialAudioClick);
            document.removeEventListener('keydown', handleInitialAudioClick);
        };

        const btnsToAttach = [playPauseBtn, sidePlayPauseBtn].filter(Boolean);
        btnsToAttach.forEach(btn => {
            btn.removeEventListener('click', toggleAudio);
            btn.addEventListener('click', toggleAudio);

            // STOP flip timer when user hovers
            btn.addEventListener('mouseenter', () => {
                if (playPauseLoopInterval) {
                    clearInterval(playPauseLoopInterval);
                    playPauseLoopInterval = null;
                }
            });
            // RESUME flip timer when user leaves
            btn.addEventListener('mouseleave', () => {
                startPlayPauseLoop();
            });
        });

        bgAudio.addEventListener('play', updatePlayerUI);
        bgAudio.addEventListener('pause', updatePlayerUI);

        const handleTrackChange = (direction) => {
            if (isOnline) {
                bgAudio.currentTime = 0;
                bgAudio.play();
                updateText("(FM) RETUNING...", "https://nightride.fm/");
                setTimeout(() => updateText("(FM) NIGHT RIDE SYNTHWAVE", "https://nightride.fm/"), 1000);
            } else {
                if (direction === 'next') localTrackIndex = (localTrackIndex + 1) % LOCAL_PLAYLIST.length;
                else localTrackIndex = (localTrackIndex - 1 + LOCAL_PLAYLIST.length) % LOCAL_PLAYLIST.length;
                loadTrack(true);
            }
        };

        if (prevTrackBtn) prevTrackBtn.addEventListener('click', () => {
            handleTrackChange('prev');
            handleInitialAudioClick();
        });
        if (nextTrackBtn) nextTrackBtn.addEventListener('click', () => {
            handleTrackChange('next');
            handleInitialAudioClick();
        });

        if (volumeSlider) volumeSlider.addEventListener('input', (e) => {
            bgAudio.volume = parseFloat(e.target.value);
            if (bgAudio.muted && bgAudio.volume > 0) bgAudio.muted = false;
            updatePlayerUI();
            handleInitialAudioClick();
        });

        if (muteBtn) muteBtn.addEventListener('click', () => {
            bgAudio.muted = !bgAudio.muted;
            updatePlayerUI();
            handleInitialAudioClick();
        });

        // --- Auto-Reconnect FM Logic ---
        const attemptAutoReconnect = () => {
            if (window.PLAYLIST_CONFIG && window.PLAYLIST_CONFIG.autoReconnectFM === false) return;
            if (userPrefersLocal || isOnline) return;

            if (navigator.onLine) {
                // Ping to ensure actual internet availability
                fetch("https://ipv4.icanhazip.com", { mode: 'no-cors', cache: 'no-store' })
                    .then(() => {
                        console.log("Internet detected. Auto-switching back to FM...");
                        isManualModeSwitch = true; // Block fallback loop while swapping

                        // Fade out local audio, flip mode, fade in FM
                        fadeAudio(bgAudio, 0, 1000, () => {
                            isOnline = true;
                            loadTrack(true);
                            // Prepare for smooth fade in
                            bgAudio.volume = 0;
                            bgAudio.play().then(() => {
                                fadeAudio(bgAudio, 0.5, 1000);
                            }).catch(updatePlayerUI);
                        });
                    })
                    .catch(() => {
                        // Still blocked
                    });
            }
        };

        window.addEventListener('online', () => {
            setTimeout(attemptAutoReconnect, 2000);
        });

        // Periodic check to recover from stalled streams when internet is technically 'on' but was unreachable
        setInterval(() => {
            if (!userPrefersLocal && !isOnline && navigator.onLine) {
                attemptAutoReconnect();
            }
        }, 15000);

        // Initialize
        updateText("(FM) NIGHT RIDE SYNTHWAVE", "https://nightride.fm/");
        updatePlayerUI();
        bgAudio.play().catch(() => { });

        // Initial check for loop (useful if starting on non-home page)
        if (window.startPlayPauseLoop) {
            window.startPlayPauseLoop();
        }

        // --- Handle First Interaction Autoplay ---
        let hasInteracted = false;
        function handleInitialAudioClick(event) {
            if (!hasInteracted) {
                if (bgAudio.paused) {
                    bgAudio.play().then(() => {
                        updatePlayerUI();
                    }).catch((error) => {
                        hasInteracted = false; // Reset if blocked
                        return; // Stop execution to keep listeners active
                    });
                }
                hasInteracted = true;
                // Self-cleanup
                document.removeEventListener('click', handleInitialAudioClick);
                document.removeEventListener('touchstart', handleInitialAudioClick);
                document.removeEventListener('keydown', handleInitialAudioClick);
            }
        }

        document.addEventListener('click', handleInitialAudioClick);
        document.addEventListener('touchstart', handleInitialAudioClick);
        document.addEventListener('keydown', handleInitialAudioClick);
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
    let levelDisplayTimer = 0;

    const rocketSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path d="M20 30 C50 30 80 40 95 50 C80 60 50 70 20 70 Z" fill="#e0e0e0"/>
      <path d="M70 38 C85 42 95 50 95 50 C95 50 85 58 70 62 Z" fill="#d32f2f"/>
      <path d="M20 30 L10 15 L30 32 Z" fill="#1976d2"/>
      <path d="M20 70 L10 85 L30 68 Z" fill="#1976d2"/>
      <circle cx="60" cy="50" r="6" fill="#81d4fa" stroke="#424242" stroke-width="2"/>
    </svg>`;

    const asteroidSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path d="M30 15 Q50 5 70 20 Q95 35 85 65 Q75 90 40 85 Q10 80 15 50 Q20 25 30 15 Z" fill="#757575" stroke="#424242" stroke-width="3"/>
      <circle cx="35" cy="40" r="8" fill="#616161"/>
      <circle cx="60" cy="60" r="12" fill="#616161"/>
      <circle cx="70" cy="35" r="5" fill="#616161"/>
      <circle cx="45" cy="75" r="6" fill="#616161"/>
      <circle cx="25" cy="60" r="4" fill="#616161"/>
    </svg>`;

    const playerImg = new Image();
    playerImg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(rocketSvg);

    const enemyImg = new Image();
    enemyImg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(asteroidSvg);

    function initGameLogic() {
        // Initialize Game State IMMEDIATELY to prevent draw() crashes
        player = { x: 20, y: 150, w: 40, h: 40, color: '#00ff00', speed: 5 };
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
        if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
            const blogModal = document.getElementById('blogModal');
            const blogIsActive = blogModal && blogModal.classList.contains('active');

            if (blogIsActive) {
                // BLOG NAVIGATION MODE
                if (e.code === 'ArrowLeft' && blogModal.dataset.prevId) {
                    window.openBlogModal(blogModal.dataset.prevId);
                } else if (e.code === 'ArrowRight' && blogModal.dataset.nextId) {
                    window.openBlogModal(blogModal.dataset.nextId);
                }
                return; // BLOCK Page Navigation
            }

            // Check if ANY other modal is active (e.g., Projects, Certificates)
            const anyModalActive = document.querySelector('.drive-modal-overlay.active:not(#blogModal)');
            if (anyModalActive) return; // BLOCK Page Navigation while projects/etc are open

            // NORMAL PAGE NAVIGATION
            const currentPage = pages[currentPageIndex];
            if (currentPage && currentPage.id === 'vibe' && gameState === 'PLAYING') return;

            if (e.code === 'ArrowLeft') handleNavigation('prev');
            else if (e.code === 'ArrowRight') handleNavigation('next');
        }

        // --- KEYBOARD SCROLLING SUPPORT ---
        if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
            // Priority 1: Active Modals
            const activeModal = document.querySelector('.drive-modal-overlay.active');
            if (activeModal) {
                const scrollable = activeModal.querySelector('.drive-content-wrapper, .projects-inner-content, .insect-chat-history');
                if (scrollable) {
                    const amount = 40;
                    scrollable.scrollTop += (e.code === 'ArrowDown' ? amount : -amount);
                }
            } else {
                // Priority 2: Main Dynamic Content Area (e.g., About Page)
                const dynamicArea = document.getElementById('dynamic-content-container');
                if (dynamicArea && !dynamicArea.classList.contains('hidden-view')) {
                    const amount = 40;
                    dynamicArea.scrollTop += (e.code === 'ArrowDown' ? amount : -amount);
                }
            }
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
        player = { x: 20, y: 150, w: 40, h: 40, color: '#00ff00', speed: 5 };
        bullets = [];
        enemies = [];
        gameState = 'PLAYING';
        enemySpawnTimer = 0;
        levelDisplayTimer = 0;

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
        const title = document.querySelector('#gameOverScreen h2');
        if (title) title.textContent = 'GAME OVER';
        document.getElementById('finalScore').textContent = score;
        document.getElementById('gameOverScreen').classList.add('active');
    }

    function gameWin() {
        gameState = 'GAMEOVER';
        if (navigator.vibrate) {
            try { navigator.vibrate([100, 50, 100, 50, 100]); } catch (e) { }
        }
        const title = document.querySelector('#gameOverScreen h2');
        if (title) title.textContent = 'YOU WIN!';
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
                // Bullet moves Right - Adjusted to exit from center of nose cone
                bullets.push({ x: player.x + 38, y: player.y + 18, w: 10, h: 4, speed: 7 });
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
            const size = 35;
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
                    if (score > 0 && score % 100 === 0) {
                        if (level < 20) {
                            level++;
                            levelDisplayTimer = 120;
                        } else if (level === 20) {
                            gameWin();
                        }
                    }
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

        // Player (Realistic Rocket SVG)
        if (playerImg.complete) {
            ctx.drawImage(playerImg, player.x, player.y, player.w, player.h);
        }

        // Engine Flame FX (Dynamic)
        ctx.fillStyle = 'orange';
        if (Math.random() > 0.3) {
            ctx.fillRect(player.x - 8, player.y + player.h / 2 - 4, 10, 8);
        }

        // Bullets
        ctx.fillStyle = '#00e5ff'; // Cyan laser bullets
        bullets.forEach(b => {
            // Make lasers look cooler
            ctx.fillRect(b.x, b.y, b.w, b.h);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(b.x + b.w / 2, b.y + 1, b.w / 2, b.h - 2);
            ctx.fillStyle = '#00e5ff';
        });

        // Enemies (Realistic Asteroid SVG)
        enemies.forEach(e => {
            if (enemyImg.complete) {
                ctx.drawImage(enemyImg, e.x, e.y, e.w, e.h);
            }
        });

        // Level Up Display
        if (levelDisplayTimer > 0) {
            ctx.fillStyle = `rgba(0, 221, 255, ${levelDisplayTimer / 60})`;
            ctx.font = 'bold 36px Impact, Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`LEVEL ${level}`, canvas.width / 2, canvas.height / 2);
            levelDisplayTimer--;
        }
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
    window.openDriveModal = function (originElement, inputId = null, mode = 'works') {
        if (!driveModal || !driveModalContainer || !driveFrame) return;

        // Determine final ID (fallback to global GDRIVE_ID)
        let driveId = inputId || (typeof GDRIVE_ID !== 'undefined' ? GDRIVE_ID : "");

        // Auto-extract ID if full URL is provided
        if (typeof driveId === 'string' && driveId.includes('drive.google.com')) {
            if (driveId.includes('folders/')) {
                driveId = driveId.split('folders/')[1].split('?')[0].split('/')[0];
            } else if (driveId.includes('id=')) {
                driveId = driveId.split('id=')[1].split('&')[0];
            }
        }

        // 1. Capture Position BEFORE potential removal
        let originRect = null;
        if (originElement) {
            originRect = originElement.getBoundingClientRect();
        }

        // 2. Clear state if minimized
        const taskId = `taskbarItem_Drive_${mode}`;
        const taskItem = document.getElementById(taskId);
        if (taskItem) {
            taskItem.remove();
            if (typeof updateCloseAllButton === 'function') updateCloseAllButton();
        }

        if (driveModal.classList.contains('minimized')) {
            driveModal.classList.remove('minimized');
            driveModal.style.display = 'flex';
        }

        // 3. Set mode and z-index
        driveModal.dataset.mode = mode;
        driveModal.style.setProperty("z-index", "2147483647", "important");
        const insectModal = document.getElementById('insectAiModal');
        if (insectModal) insectModal.style.setProperty("z-index", "2147483640", "important");

        // 4. Position from captured origin (Genie Effect)
        if (originRect) {
            const centerX = originRect.left + originRect.width / 2;
            const centerY = originRect.top + originRect.height / 2;
            driveModalContainer.style.transformOrigin = `${centerX}px ${centerY}px`;
        }

        // 5. Load Content
        if (driveId) {
            driveFrame.src = `https://drive.google.com/embeddedfolderview?id=${driveId}#grid`;
        } else {
            console.error("openDriveModal: No Drive ID provided.");
        }

        // 6. Show Modal
        deviceFrame.classList.add('blur-mode');
        driveModal.style.display = 'flex';
        requestAnimationFrame(() => {
            driveModal.classList.remove('genie-anim');
            driveModal.classList.add('active');
        });
    }

    // --- EXPERIENCE MODAL LOGIC ---
    window.openExperienceModal = function (originElement) {
        const modal = document.getElementById('experienceModal');
        const container = modal.querySelector('.experience-modal-container');
        const innerContent = modal.querySelector('.option-experience-inner');

        if (!modal || !container) return;

        let originRect = null;
        if (originElement) {
            originRect = originElement.getBoundingClientRect();
        }

        const taskId = "taskbarItem_Experience";
        const taskItemElement = document.getElementById(taskId);
        if (taskItemElement) {
            taskItemElement.remove();
            if (typeof updateCloseAllButton === 'function') updateCloseAllButton();
        }

        modal.classList.remove('active', 'minimized', 'genie-anim');
        void modal.offsetWidth;

        if (originRect) {
            const centerX = originRect.left + originRect.width / 2;
            const centerY = originRect.top + originRect.height / 2;
            container.style.transformOrigin = `${centerX}px ${centerY}px`;
        }

        if (typeof lockBodyScroll === 'function') lockBodyScroll();
        if (deviceFrame) deviceFrame.classList.add('blur-mode');

        modal.style.display = 'flex';
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });

        renderExperienceList();

        if (innerContent) innerContent.scrollTop = 0;

        if (window.experienceScrollInitTimer) clearTimeout(window.experienceScrollInitTimer);
        window.experienceScrollInitTimer = setTimeout(() => {
            const indicator = document.getElementById('experienceScrollIndicator');
            let scrollTimer = null;

            const activeExp = (typeof EXPERIENCE_DATA !== 'undefined' && typeof EXPERIENCE_CONFIG !== 'undefined' && EXPERIENCE_CONFIG.enabled) ? EXPERIENCE_DATA.filter(e => e.enabled) : [];
            if (activeExp.length === 0) {
                if (indicator) indicator.classList.add('hidden-indicator');
                if (innerContent) innerContent.onscroll = null;
                return;
            }

            if (innerContent && indicator) {
                const checkScroll = () => {
                    indicator.classList.add('hidden-indicator');
                    if (scrollTimer) clearTimeout(scrollTimer);
                    scrollTimer = setTimeout(() => {
                        const isAtBottom = innerContent.scrollHeight - innerContent.scrollTop - innerContent.clientHeight <= 15;
                        const hasMoreContent = innerContent.scrollHeight > innerContent.clientHeight + 15;
                        if (!isAtBottom && hasMoreContent) {
                            indicator.classList.remove('hidden-indicator');
                        } else {
                            indicator.classList.add('hidden-indicator');
                        }
                    }, 150);
                };

                const initVisibility = () => {
                    // Small delay to ensure render is complete
                    setTimeout(() => {
                        const isAtBottom = innerContent.scrollHeight - innerContent.scrollTop - innerContent.clientHeight <= 10;
                        const hasMoreContent = innerContent.scrollHeight > innerContent.clientHeight + 15;
                        if (!isAtBottom && hasMoreContent) {
                            indicator.classList.remove('hidden-indicator');
                        } else {
                            indicator.classList.add('hidden-indicator');
                        }
                    }, 50);
                };
                initVisibility();
                innerContent.onscroll = checkScroll;
            }
        }, 500);
    }

    window.closeExperienceModal = function () {
        const modal = document.getElementById('experienceModal');
        const container = modal.querySelector('.experience-modal-container');
        if (!modal || !container) return;

        modal.classList.remove('active', 'minimized');
        if (typeof unlockBodyScroll === 'function') unlockBodyScroll();
        if (deviceFrame) deviceFrame.classList.remove('blur-mode');

        const taskId = "taskbarItem_Experience";
        const taskItem = document.getElementById(taskId);
        if (taskItem) taskItem.remove();
        if (typeof updateCloseAllButton === 'function') updateCloseAllButton();
    }

    window.minimizeExperienceModal = function () {
        const modal = document.getElementById('experienceModal');
        const container = modal.querySelector('.experience-modal-container');
        const taskbarContainer = document.getElementById('taskbarContainer');
        if (!modal || !container) return;

        const taskId = "taskbarItem_Experience";
        if (document.getElementById(taskId)) document.getElementById(taskId).remove();

        const taskItem = document.createElement('div');
        taskItem.className = 'taskbar-item';
        taskItem.id = taskId;
        taskItem.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
            <span class="task-close-btn" onclick="event.stopPropagation(); closeExperienceModal();">X</span>
        `;
        taskItem.onclick = function () { openExperienceModal(taskItem); };
        if (taskbarContainer) taskbarContainer.appendChild(taskItem);
        if (typeof updateCloseAllButton === 'function') updateCloseAllButton();

        const rect = taskItem.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        container.style.transformOrigin = `${centerX}px ${centerY}px`;

        modal.classList.remove('active');
        modal.classList.add('genie-anim', 'minimized');

        setTimeout(() => {
            if (modal.classList.contains('minimized')) {
                modal.style.display = 'none';
            }
            modal.classList.remove('genie-anim');
        }, 400);

        if (deviceFrame) deviceFrame.classList.remove('blur-mode');
    }

    function renderExperienceList() {
        const container = document.getElementById('experienceContainer');
        if (!container || typeof EXPERIENCE_DATA === 'undefined' || typeof EXPERIENCE_CONFIG === 'undefined' || !EXPERIENCE_CONFIG.enabled) {
            if (container) container.innerHTML = '<div class="no-content-message" style="text-align:center; padding: 20px; color: var(--primary-green, #00ff00);">Content not available</div>';
            return;
        }

        const activeExp = EXPERIENCE_DATA.filter(exp => exp.enabled);
        if (activeExp.length === 0) {
            container.innerHTML = '<div class="no-content-message" style="text-align:center; padding: 20px; color: var(--primary-green, #00ff00);">Content not available</div>';
            return;
        }

        let html = '';
        activeExp.forEach(exp => {
            // Using same classes as project items to inherit styles
            html += `
                <div class="project-item experience-item-box" style="display: block; pointer-events: none;">
                    <div class="project-name option-experience-name" style="pointer-events: auto;">${exp.role}</div>
                    <div class="project-details option-experience-details" style="pointer-events: auto;">
                        ( <span class="green-text">${exp.year}</span>, ${exp.company} )
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    // Attach Listeners
    const closeExperienceBtn = document.getElementById('closeExperienceBtn');
    if (closeExperienceBtn) closeExperienceBtn.onclick = closeExperienceModal;

    const minimizeExperienceBtn = document.getElementById('minimizeExperienceBtn');
    if (minimizeExperienceBtn) minimizeExperienceBtn.onclick = minimizeExperienceModal;


    // --- EDUCATION MODAL LOGIC ---
    window.openEducationModal = function (originElement) {
        const modal = document.getElementById('educationModal');
        const container = modal.querySelector('.education-modal-container');
        const innerContent = modal.querySelector('.option-education-inner');

        if (!modal || !container) return;

        let originRect = null;
        if (originElement) {
            originRect = originElement.getBoundingClientRect();
        }

        const taskId = "taskbarItem_Education";
        const taskItemElement = document.getElementById(taskId);
        if (taskItemElement) {
            taskItemElement.remove();
            if (typeof updateCloseAllButton === 'function') updateCloseAllButton();
        }

        modal.classList.remove('active', 'minimized', 'genie-anim');
        void modal.offsetWidth;

        if (originRect) {
            const centerX = originRect.left + originRect.width / 2;
            const centerY = originRect.top + originRect.height / 2;
            container.style.transformOrigin = `${centerX}px ${centerY}px`;
        }

        if (typeof lockBodyScroll === 'function') lockBodyScroll();
        if (deviceFrame) deviceFrame.classList.add('blur-mode');

        modal.style.display = 'flex';
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });

        renderEducationList();

        if (innerContent) innerContent.scrollTop = 0;

        if (window.educationScrollInitTimer) clearTimeout(window.educationScrollInitTimer);
        window.educationScrollInitTimer = setTimeout(() => {
            const indicator = document.getElementById('educationScrollIndicator');
            let scrollTimer = null;

            const activeEdu = (typeof EDUCATION_DATA !== 'undefined' && typeof EDUCATION_CONFIG !== 'undefined' && EDUCATION_CONFIG.enabled) ? EDUCATION_DATA.filter(e => e.enabled) : [];
            if (activeEdu.length === 0) {
                if (indicator) indicator.classList.add('hidden-indicator');
                if (innerContent) innerContent.onscroll = null;
                return;
            }

            if (innerContent && indicator) {
                const checkScroll = () => {
                    indicator.classList.add('hidden-indicator');
                    if (scrollTimer) clearTimeout(scrollTimer);
                    scrollTimer = setTimeout(() => {
                        const isAtBottom = innerContent.scrollHeight - innerContent.scrollTop - innerContent.clientHeight <= 15;
                        const hasMoreContent = innerContent.scrollHeight > innerContent.clientHeight + 15;
                        if (!isAtBottom && hasMoreContent) {
                            indicator.classList.remove('hidden-indicator');
                        } else {
                            indicator.classList.add('hidden-indicator');
                        }
                    }, 150);
                };

                const initVisibility = () => {
                    // Small delay to ensure render is complete
                    setTimeout(() => {
                        const isAtBottom = innerContent.scrollHeight - innerContent.scrollTop - innerContent.clientHeight <= 10;
                        const hasMoreContent = innerContent.scrollHeight > innerContent.clientHeight + 15;
                        if (!isAtBottom && hasMoreContent) {
                            indicator.classList.remove('hidden-indicator');
                        } else {
                            indicator.classList.add('hidden-indicator');
                        }
                    }, 50);
                };
                initVisibility();
                innerContent.onscroll = checkScroll;
            }
        }, 500);
    }

    window.closeEducationModal = function () {
        const modal = document.getElementById('educationModal');
        const container = modal.querySelector('.education-modal-container');
        if (!modal || !container) return;

        modal.classList.remove('active', 'minimized');
        if (typeof unlockBodyScroll === 'function') unlockBodyScroll();
        if (deviceFrame) deviceFrame.classList.remove('blur-mode');

        const taskId = "taskbarItem_Education";
        const taskItem = document.getElementById(taskId);
        if (taskItem) taskItem.remove();
        if (typeof updateCloseAllButton === 'function') updateCloseAllButton();
    }

    window.minimizeEducationModal = function () {
        const modal = document.getElementById('educationModal');
        const container = modal.querySelector('.education-modal-container');
        const taskbarContainer = document.getElementById('taskbarContainer');
        if (!modal || !container) return;

        const taskId = "taskbarItem_Education";
        if (document.getElementById(taskId)) document.getElementById(taskId).remove();

        const taskItem = document.createElement('div');
        taskItem.className = 'taskbar-item';
        taskItem.id = taskId;
        taskItem.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
            <span class="task-close-btn" onclick="event.stopPropagation(); closeEducationModal();">X</span>
        `;
        taskItem.onclick = function () { openEducationModal(taskItem); };
        if (taskbarContainer) taskbarContainer.appendChild(taskItem);
        if (typeof updateCloseAllButton === 'function') updateCloseAllButton();

        const rect = taskItem.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        container.style.transformOrigin = `${centerX}px ${centerY}px`;

        modal.classList.remove('active');
        modal.classList.add('genie-anim', 'minimized');

        setTimeout(() => {
            if (modal.classList.contains('minimized')) {
                modal.style.display = 'none';
            }
            modal.classList.remove('genie-anim');
        }, 400);

        if (deviceFrame) deviceFrame.classList.remove('blur-mode');
    }

    function renderEducationList() {
        const container = document.getElementById('educationContainer');
        if (!container || typeof EDUCATION_DATA === 'undefined' || typeof EDUCATION_CONFIG === 'undefined' || !EDUCATION_CONFIG.enabled) {
            if (container) container.innerHTML = '<div class="no-content-message" style="text-align:center; padding: 20px; color: var(--primary-green, #00ff00);">Content not available</div>';
            return;
        }

        const activeEdu = EDUCATION_DATA.filter(edu => edu.enabled);
        if (activeEdu.length === 0) {
            container.innerHTML = '<div class="no-content-message" style="text-align:center; padding: 20px; color: var(--primary-green, #00ff00);">Content not available</div>';
            return;
        }

        let html = '';
        activeEdu.forEach((edu, i) => {
            html += `
                <div class="project-item education-item-box" style="display: block; pointer-events: none;">
                    <div class="project-name option-education-course" style="pointer-events: auto;">${edu.course}</div>
                    <div class="project-details option-education-college" style="pointer-events: auto; padding-top: 5px;">
                        ${edu.college}
                    </div>
                    <div class="project-details option-education-year" style="pointer-events: auto; color: var(--primary-green, #00ff00); padding-top: 5px;">
                        ${edu.year}
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    // Attach Listeners
    const closeEducationBtn = document.getElementById('closeEducationBtn');
    if (closeEducationBtn) closeEducationBtn.onclick = closeEducationModal;

    const minimizeEducationBtn = document.getElementById('minimizeEducationBtn');
    if (minimizeEducationBtn) minimizeEducationBtn.onclick = minimizeEducationModal;


    // --- CERTIFICATES MODAL LOGIC ---
    window.openCertificatesModal = function (originElement) {
        const certUrl = (typeof CERTIFICATES_DATA !== 'undefined' && CERTIFICATES_DATA.enabled !== false
            ? (CERTIFICATES_DATA.url || CERTIFICATES_DATA.driveId)
            : null);

        window.openDriveModal(originElement, certUrl, 'certificates');
    }

    /* --- PROJECTS MODAL LOGIC --- */
    window.openProjectsModal = function (originElement) {
        const modal = document.getElementById('projectsModal');
        const container = modal.querySelector('.projects-modal-container');
        const innerContent = modal.querySelector('.projects-inner-content');

        if (!modal || !container) return;

        // 1. Capture Position BEFORE potential removal
        let originRect = null;
        if (originElement) {
            originRect = originElement.getBoundingClientRect();
        }

        // 2. Ensure taskbar item is removed immediately (the "spot")
        const taskId = "taskbarItem_Projects";
        const taskItemElement = document.getElementById(taskId);
        if (taskItemElement) {
            taskItemElement.remove();
            if (typeof updateCloseAllButton === 'function') updateCloseAllButton();
        }

        // 2. Clear state if minimized (and reset animation state)
        modal.classList.remove('active', 'minimized', 'genie-anim');

        // Force layout paint for state reset
        void modal.offsetWidth;

        // 3. Position from captured origin (Genie Effect)
        if (originRect) {
            const centerX = originRect.left + originRect.width / 2;
            const centerY = originRect.top + originRect.height / 2;
            container.style.transformOrigin = `${centerX}px ${centerY}px`;
        }

        // 4. Show Modal
        if (typeof lockBodyScroll === 'function') lockBodyScroll();
        if (deviceFrame) deviceFrame.classList.add('blur-mode');

        modal.style.display = 'flex';
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });

        // 3. Render Projects
        renderProjectsList();

        // 4. Reset Scroll
        if (innerContent) innerContent.scrollTop = 0;

        // 5. Scroll Indicator Logic - Clear previous to avoid timing issues
        if (window.projectScrollInitTimer) clearTimeout(window.projectScrollInitTimer);
        window.projectScrollInitTimer = setTimeout(() => {
            const indicator = document.getElementById('projectScrollIndicator');
            let scrollTimer = null;

            const activeProjects = (typeof PROJECTS_DATA !== 'undefined' && typeof PROJECTS_CONFIG !== 'undefined' && PROJECTS_CONFIG.enabled) ? PROJECTS_DATA.filter(p => p.enabled) : [];
            if (activeProjects.length === 0) {
                if (indicator) indicator.classList.add('hidden-indicator');
                if (innerContent) innerContent.onscroll = null;
                return;
            }

            if (innerContent && indicator) {
                const checkScroll = () => {
                    // Always hide indicator while actively scrolling
                    indicator.classList.add('hidden-indicator');

                    // Clear existing timer
                    if (scrollTimer) clearTimeout(scrollTimer);

                    // Re-evaluate visibility after scroll stops
                    scrollTimer = setTimeout(() => {
                        const isAtBottom = innerContent.scrollHeight - innerContent.scrollTop - innerContent.clientHeight <= 15;
                        const hasMoreContent = innerContent.scrollHeight > innerContent.clientHeight + 15;

                        if (!isAtBottom && hasMoreContent) {
                            indicator.classList.remove('hidden-indicator');
                        } else {
                            indicator.classList.add('hidden-indicator');
                        }
                    }, 150); // Small delay to detect scroll stop
                };

                // Initial check for non-scrolling state
                const initVisibility = () => {
                    // Small delay to ensure render is complete
                    setTimeout(() => {
                        const isAtBottom = innerContent.scrollHeight - innerContent.scrollTop - innerContent.clientHeight <= 10;
                        const hasMoreContent = innerContent.scrollHeight > innerContent.clientHeight + 15;
                        if (!isAtBottom && hasMoreContent) {
                            indicator.classList.remove('hidden-indicator');
                        } else {
                            indicator.classList.add('hidden-indicator');
                        }
                    }, 50);
                };

                initVisibility();
                innerContent.onscroll = checkScroll;
            }
        }, 500);
    }

    window.closeProjectsModal = function () {
        const modal = document.getElementById('projectsModal');
        const container = modal.querySelector('.projects-modal-container');
        if (!modal || !container) return;

        modal.classList.remove('active');
        modal.classList.remove('minimized'); // Reset state
        if (typeof unlockBodyScroll === 'function') unlockBodyScroll();
        if (deviceFrame) deviceFrame.classList.remove('blur-mode');

        // Cleanup taskbar item if it exists
        const taskId = "taskbarItem_Projects";
        const taskItem = document.getElementById(taskId);
        if (taskItem) taskItem.remove();
        if (typeof updateCloseAllButton === 'function') updateCloseAllButton();
    }

    window.minimizeProjectsModal = function () {
        const modal = document.getElementById('projectsModal');
        const container = modal.querySelector('.projects-modal-container');
        if (!modal || !container) return;

        // 1. Create Taskbar Item first (so we can get its future position)
        const taskId = "taskbarItem_Projects";
        if (document.getElementById(taskId)) document.getElementById(taskId).remove();

        const taskItem = document.createElement('div');
        taskItem.className = 'taskbar-item';
        taskItem.id = taskId;
        taskItem.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            <span class="task-close-btn" onclick="event.stopPropagation(); closeProjectsModal();">X</span>
        `;
        taskItem.onclick = function () { openProjectsModal(taskItem); };
        if (taskbarContainer) taskbarContainer.appendChild(taskItem);
        if (typeof updateCloseAllButton === 'function') updateCloseAllButton();

        // 2. Set dynamic transform origin to the taskbar item
        const rect = taskItem.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        container.style.transformOrigin = `${centerX}px ${centerY}px`;

        // 3. Trigger Animation (Remove active immediately so it can re-trigger growth if re-opened)
        modal.classList.remove('active');
        modal.classList.add('genie-anim');
        modal.classList.add('minimized');

        setTimeout(() => {
            if (modal.classList.contains('minimized')) {
                modal.style.display = 'none';
            }
            modal.classList.remove('genie-anim');
        }, 400);

        if (deviceFrame) deviceFrame.classList.remove('blur-mode');
    }

    function renderProjectsList() {
        const container = document.getElementById('projectsContainer');
        if (!container || typeof PROJECTS_DATA === 'undefined' || typeof PROJECTS_CONFIG === 'undefined' || !PROJECTS_CONFIG.enabled) {
            if (container) container.innerHTML = '<div class="no-content-message" style="text-align:center; padding: 20px; color: var(--primary-green, #00ff00);">Content not available</div>';
            return;
        }

        const activeProjects = PROJECTS_DATA.filter(project => project.enabled);
        if (activeProjects.length === 0) {
            container.innerHTML = '<div class="no-content-message" style="text-align:center; padding: 20px; color: var(--primary-green, #00ff00);">Content not available</div>';
            return;
        }

        let html = '';
        activeProjects.forEach(project => {
            html += `
                <a href="${project.link}" target="_blank" class="project-item">
                    <div class="project-name">${project.name}</div>
                    <div class="project-details">
                        ( <span>${project.category}</span>, ${project.year}, ${project.company} )
                    </div>
                </a>
            `;
        });
        container.innerHTML = html;

        // --- Handle Legacy (Old) Projects Button ---
        const legacyWrapper = document.getElementById('legacyProjectsWrapper');
        const legacyBtn = document.getElementById('legacyProjectsBtn');
        if (legacyWrapper && legacyBtn) {
            if (typeof LEGACY_PROJECTS_CONFIG !== 'undefined' && LEGACY_PROJECTS_CONFIG.enabled) {
                legacyWrapper.style.display = 'block';
                legacyBtn.href = LEGACY_PROJECTS_CONFIG.url || '#';
                legacyBtn.innerText = LEGACY_PROJECTS_CONFIG.displayName || 'OLD PROJECTS';
                // Ensure '#' links don't trigger reload
                legacyBtn.onclick = function (e) {
                    if (this.getAttribute('href') === '#') e.preventDefault();
                };
            } else {
                legacyWrapper.style.display = 'none';
            }
        }
    }

    // Attach Listeners
    const closeProjectsBtn = document.getElementById('closeProjectsBtn');
    if (closeProjectsBtn) closeProjectsBtn.onclick = closeProjectsModal;

    const minimizeProjectsBtn = document.getElementById('minimizeProjectsBtn');
    if (minimizeProjectsBtn) minimizeProjectsBtn.onclick = minimizeProjectsModal;







    // --- MINIMIZE LOGIC ---
    const minimizeDriveBtn = document.getElementById('minimizeDriveBtn');
    const taskbarContainer = document.getElementById('taskbarContainer');

    window.minimizeDriveModal = function () {
        if (!driveModal || !driveModalContainer) return;

        const mode = driveModal.dataset.mode || 'works';

        // 1. Create Taskbar Item first (Hidden or transparent doesn't matter, we just need the position)
        const taskId = `taskbarItem_Drive_${mode}`;
        if (document.getElementById(taskId)) document.getElementById(taskId).remove();

        const taskItem = document.createElement('div');
        taskItem.className = 'taskbar-item';
        taskItem.id = taskId;

        let iconSVG = '';
        if (mode === 'certificates') {
            iconSVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15l-3 3-3-3V3h12v12z"></path><path d="M12 15v8l-3-1-3 1v-5"></path></svg>`;
        } else {
            iconSVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`;
        }

        taskItem.innerHTML = `
            ${iconSVG}
            <span class="task-close-btn" onclick="event.stopPropagation(); closeDriveModal();">X</span>
        `;
        taskItem.onclick = restoreDriveModal;
        if (taskbarContainer) taskbarContainer.appendChild(taskItem);
        if (typeof updateCloseAllButton === 'function') updateCloseAllButton();

        // 2. Set dynamic transform origin based on NEW taskbar item position
        const rect = taskItem.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        driveModalContainer.style.transformOrigin = `${centerX}px ${centerY}px`;

        // 3. Trigger Animation
        driveModal.classList.add('genie-anim');
        driveModal.classList.add('minimized');

        setTimeout(() => {
            if (driveModal.classList.contains('minimized')) {
                driveModal.style.display = 'none';
            }
            driveModal.classList.remove('active');
            driveModal.classList.remove('genie-anim');
        }, 400);

        if (deviceFrame) deviceFrame.classList.remove('blur-mode');
    }

    window.restoreDriveModal = function () {
        if (!driveModal || !driveModalContainer) return;

        const mode = driveModal.dataset.mode || 'works';

        // 1. Capture Taskbar Position and Remove
        const taskId = `taskbarItem_Drive_${mode}`;
        const taskItem = document.getElementById(taskId);
        let originRect = null;
        if (taskItem) {
            originRect = taskItem.getBoundingClientRect();
            taskItem.remove();
            if (typeof updateCloseAllButton === 'function') updateCloseAllButton();
        }

        // 2. Set Origin
        if (originRect) {
            const centerX = originRect.left + originRect.width / 2;
            const centerY = originRect.top + originRect.height / 2;
            driveModalContainer.style.transformOrigin = `${centerX}px ${centerY}px`;
        }

        // 3. Show Modal
        driveModal.style.display = 'flex';
        requestAnimationFrame(() => {
            driveModal.classList.remove('minimized');
            driveModal.classList.add('active');
        });

        if (deviceFrame) deviceFrame.classList.add('blur-mode');
    }

    if (minimizeDriveBtn) {
        minimizeDriveBtn.addEventListener('click', minimizeDriveModal);
    }

    window.closeDriveModal = function () {
        const driveModal = document.getElementById('driveModal');
        const driveFrame = document.getElementById('driveFrame');
        if (!driveModal) return;

        const mode = driveModal.dataset.mode || 'works';

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
            const taskItem = document.getElementById(`taskbarItem_Drive_${mode}`);
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

        // Reset Form State & UI
        const contactForm = document.getElementById('contactForm');
        const successMsg = document.getElementById('contactSuccessMsg');

        if (contactModalContainer) {
            contactModalContainer.classList.remove('success-mode');
            // Restore window controls
            const controls = contactModalContainer.querySelector('.window-controls');
            if (controls) controls.style.display = '';
        }

        if (contactForm) {
            contactForm.style.display = 'flex';
            contactForm.reset();
            // Reset Button State
            const btn = contactForm.querySelector('.submit-btn-form');
            if (btn) {
                btn.textContent = "SEND TRANSMISSION";
                btn.disabled = false;

                // Add hover effect listeners for the insect camouflage
                btn.addEventListener('mouseenter', () => {
                    btn.classList.add('is-hovered');
                    const fly = document.getElementById('modalCyberFly');
                    if (fly) {
                        const flyRect = fly.getBoundingClientRect();
                        const btnRect = btn.getBoundingClientRect();

                        // Check if fly overlaps with button
                        const isOverlapping = !(
                            flyRect.right < btnRect.left ||
                            flyRect.left > btnRect.right ||
                            flyRect.bottom < btnRect.top ||
                            flyRect.top > btnRect.bottom
                        );

                        if (isOverlapping) {
                            fly.classList.add('blacked-out');
                        }
                    }
                });

                btn.addEventListener('mouseleave', () => {
                    btn.classList.remove('is-hovered');
                    const fly = document.getElementById('modalCyberFly');
                    if (fly) {
                        fly.classList.remove('blacked-out');
                    }
                });

                // Track fly movement
                if (!window.modalFlyCollisionInterval) {
                    window.modalFlyCollisionInterval = setInterval(() => {
                        const fly = document.getElementById('modalCyberFly');
                        if (!fly || !btn.classList.contains('is-hovered')) return;

                        const flyRect = fly.getBoundingClientRect();
                        const btnRect = btn.getBoundingClientRect();
                        const isOverlapping = !(flyRect.right < btnRect.left || flyRect.left > btnRect.right || flyRect.bottom < btnRect.top || flyRect.top > btnRect.bottom);

                        if (isOverlapping) fly.classList.add('blacked-out');
                        else fly.classList.remove('blacked-out');

                    }, 50);
                }
            }
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
    // --- FORM SUBMISSION HANDLER ---
    // [REMOVED] Simulated logic deleted to use real logic in index.html


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
            const closeTutorial = function () {
                tutorialOverlay.classList.remove('active');
                setTimeout(() => {
                    tutorialOverlay.style.display = 'none';
                }, 500);
                document.removeEventListener('keydown', handleTutorialEnter);

                // Autoplay music when acknowledged (mouse click or enter)
                const bgAudio = document.getElementById('bg-audio');
                if (bgAudio && bgAudio.paused) {
                    bgAudio.play().then(() => {
                        // Update player UI globally if function exists
                        if (typeof updatePlayerUI === 'function') updatePlayerUI();
                    }).catch(err => console.log('Autoplay prevented on click/enter:', err));
                }
            };

            const handleTutorialEnter = function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    closeTutorial();
                }
            };

            document.addEventListener('keydown', handleTutorialEnter);

            const handleTutorialClick = function (e) {
                if (e) e.stopPropagation();
                closeTutorial();
            };

            closeBtn.onclick = handleTutorialClick;
        }
    }

    // --- CONTACT GUIDE (BUZZ AI) ---
    // Flag to ensure it only shows once per PAGE RELOAD
    window.hasShownContactGuide = false;

    window.showContactGuide = function () {
        // If already shown in this session (page load), do nothing
        if (window.hasShownContactGuide) return;

        const contactOverlay = document.getElementById('contact-guide-overlay');
        const closeBtn = document.getElementById('closeContactGuideBtn');

        if (contactOverlay) {
            contactOverlay.classList.remove('active');
            contactOverlay.style.display = 'flex';

            // Force Reflow
            void contactOverlay.offsetWidth;

            contactOverlay.classList.add('active');

            // Mark as shown so it doesn't show again until reload
            window.hasShownContactGuide = true;

            const closeGuide = function () {
                contactOverlay.classList.remove('active');
                setTimeout(() => {
                    contactOverlay.style.display = 'none';
                }, 500);
                document.removeEventListener('keydown', handleEnter);
            };

            const handleEnter = function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    closeGuide();
                }
            };

            // Add Enter key listener
            document.addEventListener('keydown', handleEnter);

            // Close Logic (Button)
            if (closeBtn) {
                closeBtn.onclick = function (e) {
                    if (e) e.stopPropagation();
                    closeGuide();
                };
            }

            // Close on click outside
            contactOverlay.onclick = function (e) {
                if (e.target === contactOverlay) {
                    closeGuide();
                }
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
        const modal = document.getElementById('insectAiModal');
        const container = document.getElementById('insectAiContainer');
        const insectSearch = document.getElementById('insectSearchInput');

        if (!modal || !container) return;

        // 1. Capture Position BEFORE potential removal
        let originRect = null;
        if (originElement) {
            originRect = originElement.getBoundingClientRect();
        }

        // 2. If minimized, clear state and taskbar icon IMMEDIATELY
        const taskId = "taskbarItem_InsectAI";
        const taskItem = document.getElementById(taskId);
        if (taskItem) {
            taskItem.remove();
            if (typeof updateCloseAllButton === 'function') updateCloseAllButton();
        }

        if (modal.classList.contains('minimized')) {
            modal.classList.remove('minimized');
            modal.style.display = 'flex';
        }

        // 3. Set Origin
        if (originRect) {
            const centerX = originRect.left + originRect.width / 2;
            const centerY = originRect.top + originRect.height / 2;
            container.style.transformOrigin = `${centerX}px ${centerY}px`;
        }

        // 4. Blur Background
        if (deviceFrame) deviceFrame.classList.add('blur-mode');

        // 5. Show Modal
        modal.style.display = 'flex';
        requestAnimationFrame(() => {
            modal.classList.remove('genie-anim');
            modal.classList.add('active');
            if (insectSearch) insectSearch.focus();
        });
    }

    window.closeInsectAi = function () {
        const insectModal = document.getElementById('insectAiModal');
        if (!insectModal) return;

        // STOP VOICE WHEN CLOSING
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            if (window.wasAudioPlayingBeforeSpeech) {
                const bgAudio = document.getElementById('bg-audio');
                if (bgAudio) bgAudio.play().catch(e => console.log('Auto-resume blocked', e));
                window.wasAudioPlayingBeforeSpeech = false;
            }
        }

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
        const container = document.getElementById('insectAiContainer');
        if (!insectModal || !container) return;

        // 1. Create Taskbar Item first
        const taskId = 'taskbarItem_Insect';
        if (document.getElementById(taskId)) document.getElementById(taskId).remove();

        const taskItem = document.createElement('div');
        taskItem.className = 'taskbar-item';
        taskItem.id = taskId;
        taskItem.innerHTML = `
             <div class="cyber-fly taskbar-icon waiting-to-land">
                <span class="buzz-text">bzz..</span>
             </div>
             <span class="task-close-btn" onclick="event.stopPropagation(); closeInsectAi();">X</span>
         `;
        taskItem.onclick = restoreInsectModal;
        if (insectTaskbarContainer) insectTaskbarContainer.appendChild(taskItem);
        if (typeof updateCloseAllButton === 'function') updateCloseAllButton();

        // Get coordinates
        const taskRect = taskItem.getBoundingClientRect();
        const endX = taskRect.left + taskRect.width / 2;
        const endY = taskRect.top + taskRect.height / 2;

        const titleIcon = insectModal.querySelector('.insect-icon-static') || insectModal;
        const startRect = titleIcon.getBoundingClientRect();
        const startX = startRect.left + startRect.width / 2;
        const startY = startRect.top + startRect.height / 2;

        // "Friend" Side Coordinate (The Contact Page Insect)
        let friendX = window.innerWidth * 0.85;
        let friendY = window.innerHeight * 0.2;

        const friendElement = document.getElementById('cyberFly');
        if (friendElement && friendElement.offsetParent !== null) {
            const friendRect = friendElement.getBoundingClientRect();
            friendX = friendRect.left + friendRect.width / 2;
            friendY = friendRect.top + friendRect.height / 2;
        }

        // 2. Hide Modal
        container.style.transformOrigin = `${startX}px ${startY}px`;
        insectModal.classList.add('genie-anim');
        insectModal.classList.add('minimized');

        setTimeout(() => {
            if (insectModal.classList.contains('minimized')) {
                insectModal.style.display = 'none';
            }
            insectModal.classList.remove('active');
            insectModal.classList.remove('genie-anim');
        }, 400);

        if (deviceFrame) deviceFrame.classList.remove('blur-mode');

        // 3. Trigger Flight! Hide taskbar bug until flight lands
        const fly = taskItem.querySelector('.cyber-fly');
        if (fly) fly.style.opacity = '0';

        animateMultiStageFlight([
            { x: startX, y: startY },
            { x: friendX, y: friendY },
            { x: endX, y: endY }
        ], () => {
            if (!document.body.contains(taskItem)) return;
            if (fly) {
                fly.style.opacity = '1';
                fly.classList.remove('waiting-to-land');
                fly.classList.add('landed');
                initTaskbarInsectBehavior(taskItem);
            }
        });
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
        const container = document.getElementById('insectAiContainer');
        const taskId = 'taskbarItem_Insect';
        const taskItem = document.getElementById(taskId);

        if (!insectModal || !taskItem || !container) return;

        // 1. Capture Position BEFORE potential removal
        const startRect = taskItem.getBoundingClientRect();
        const startX = startRect.left + startRect.width / 2;
        const startY = startRect.top + startRect.height / 2;

        // 2. Remove From Taskbar IMMEDIATELY
        taskItem.remove();
        if (typeof updateCloseAllButton === 'function') updateCloseAllButton();

        // 3. Set Origin for Genie
        container.style.transformOrigin = `${startX}px ${startY}px`;

        // 4. Set display block to get target rect but keep hidden
        insectModal.style.display = 'flex';
        insectModal.style.opacity = '0';

        const titleIcon = insectModal.querySelector('.insect-icon-static') || insectModal;
        const endRect = titleIcon.getBoundingClientRect();
        const endX = endRect.left + endRect.width / 2;
        const endY = endRect.top + endRect.height / 2;

        // "Friend" Side Coordinate (The Contact Page Insect)
        let friendX = window.innerWidth * 0.85;
        let friendY = window.innerHeight * 0.2;

        const friendElement = document.getElementById('cyberFly');
        if (friendElement && friendElement.offsetParent !== null) {
            const friendRect = friendElement.getBoundingClientRect();
            friendX = friendRect.left + friendRect.width / 2;
            friendY = friendRect.top + friendRect.height / 2;
        }

        // 5. Trigger Multi-Stage Return Flight
        animateMultiStageFlight([
            { x: startX, y: startY },
            { x: friendX, y: friendY },
            { x: endX, y: endY }
        ], () => {
            insectModal.style.opacity = '';
            // 6. Animate Modal In
            requestAnimationFrame(() => {
                insectModal.classList.remove('minimized');
                insectModal.classList.add('active');
            });
            if (deviceFrame) deviceFrame.classList.add('blur-mode');
        });
    }

    if (minimizeInsectBtn) {
        minimizeInsectBtn.addEventListener('click', () => {
            // STOP VOICE WHEN MINIMIZING
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                if (window.wasAudioPlayingBeforeSpeech) {
                    const bgAudio = document.getElementById('bg-audio');
                    if (bgAudio) bgAudio.play().catch(e => console.log('Auto-resume blocked', e));
                    window.wasAudioPlayingBeforeSpeech = false;
                }
            }
            minimizeInsectModal();
        });
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
            // STOP VOICE WHEN DELETING HISTORY
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                if (window.wasAudioPlayingBeforeSpeech) {
                    const bgAudio = document.getElementById('bg-audio');
                    if (bgAudio) bgAudio.play().catch(e => console.log('Auto-resume blocked', e));
                    window.wasAudioPlayingBeforeSpeech = false;
                }
            }

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

            // PAUSE MUSIC WHEN SPEAKING
            const bgAudio = document.getElementById('bg-audio');
            if (bgAudio && !bgAudio.paused && bgAudio.currentTime > 0) {
                bgAudio.pause();
                window.wasAudioPlayingBeforeSpeech = true;
            }

            const utterance = new SpeechSynthesisUtterance(text);
            const voices = window.speechSynthesis.getVoices();

            let preferredVoice = voices.find(v => v.name.includes('Google UK English Male') || v.name.includes('Male') || v.name.includes('David') || v.name.includes('Mark'));
            if (!preferredVoice) {
                preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('English'));
            }

            if (preferredVoice) utterance.voice = preferredVoice;
            utterance.pitch = 1.1;
            utterance.rate = 1.1;

            // RESUME MUSIC WHEN FINISHED
            utterance.onend = () => {
                if (window.wasAudioPlayingBeforeSpeech) {
                    const bgAudio = document.getElementById('bg-audio');
                    if (bgAudio) bgAudio.play().catch(e => console.log('Auto-resume blocked', e));
                    window.wasAudioPlayingBeforeSpeech = false;
                }
            };

            window.speechSynthesis.speak(utterance);
        }
    };

    const handleAIResponse = (userQuery) => {
        const query = userQuery.toLowerCase().trim();
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
            textToSpeak = "System Identity. I am Buzz AI, the interactive navigator for this portfolio. I exist to assist you in exploring the works and data of Mathews B.";
            addInsectMessage(responseHTML, 'ai');
            speakText(textToSpeak);
            return;
        }

        // A.05 RESUME & PDF LINK
        const resumeKeywords = ['resume', 'cv', 'pdf', 'resume link', 'pdf link', 'mathews resume', 'mathews b resume', 'show the link'];
        // The user explicitly requested these triggers: 'MATHEWS', 'MATHEWS B', 'RESUME LINK', 'PDF LINK'
        const exactResumeTriggers = ['mathews', 'mathews b', 'resume link', 'pdf link', 'mathew'];

        if (isLocalQuery(query, resumeKeywords) || exactResumeTriggers.includes(query)) {
            responseHTML = `
                <b>📄 RESUME / CV RECORD:</b><br><br>
                ACCESSING PROFESSIONAL DATA PROFILE FOR MATHEWS B...<br>
                <br>
                <a href="Images/pdf/mathews_b.pdf" target="_blank" style="color:#00ff00; text-decoration:underline; font-weight:bold;">👉 CLICK HERE TO VIEW / DOWNLOAD PDF</a>
            `;
            textToSpeak = "Resume record found. Click the link provided to view or download the PDF file.";
            addInsectMessage(responseHTML, 'ai');
            speakText(textToSpeak);
            return;
        }

        // A. IDENTITY & "WHO IS HE"
        const identityKeywords = [
            'who are you', 'who is mathews', 'about mathews', 'tell me about mathews',
            'who is he', 'about him', 'his background', 'his story', 'the designer',
            'mathews b', 'mathew b', 'mateo', 'author', 'creator', 'developer', 'owner',
            'who made this', 'who built this', 'about me'
        ];
        if (isLocalQuery(query, identityKeywords) || query === 'mathews' || query === 'mathew') {
            if (typeof ABOUT_DATA !== 'undefined') {
                const bio = ABOUT_DATA.paragraphs.join("<br><br>");
                responseHTML = `<b>👤 IDENTITY RECORD:</b><br><br>${bio}`;
                textToSpeak = "Identity record. " + ABOUT_DATA.paragraphs.join(". ").replace(/<[^>]*>?/gm, '');
                addInsectMessage(responseHTML, 'ai');
                speakText(textToSpeak);
                return;
            }
        }

        // B. CONTACT & SOCIALS
        const contactKeywords = [
            'contact', 'email', 'mail', 'phone', 'whatsapp', 'reach', 'talk', 'message',
            'linkedin', 'linked in', 'linktree', 'social', 'instagram', 'facebook', 'twitter', 'x.com', 'info'
        ];

        // Specific Handler for LINKTREE
        if (isLocalQuery(query, ['linktree'])) {
            const link = (typeof CONTACT_CONFIG !== 'undefined') ? CONTACT_CONFIG.linktree : "https://linktr.ee/YOUR_LINKTREE_HERE";
            responseHTML = `<b>🔗 LINKTREE DIRECTORY:</b><br><br>You can access my full link directory here:<br><a href="${link}" target="_blank" style="color:#00ff00; text-decoration:underline; font-weight:bold;">👉 OPEN LINKTREE</a>`;
            textToSpeak = "Here is my Linktree directory. You can find all my important links there.";
            addInsectMessage(responseHTML, 'ai');
            speakText(textToSpeak);
            return;
        }

        // Specific Handler for SUBSTACK
        if (isLocalQuery(query, ['substack', 'newsletter'])) {
            const subUrl = (typeof SUBSTACK_CONFIG !== 'undefined') ? SUBSTACK_CONFIG.url : "https://substack.com/";
            const subName = (typeof SUBSTACK_CONFIG !== 'undefined') ? SUBSTACK_CONFIG.displayName : "CLICK TO OPEN SUBSTACK";
            responseHTML = `<b>🟠 SUBSTACK NEWSLETTER:</b><br><br>I publish regular insights and articles here:<br><a href="${subUrl}" target="_blank" style="color: #ff6600; text-decoration: underline; font-weight:bold;">👉 ${subName}</a>`;
            textToSpeak = "Here is my Substack newsletter link. I share regular insights and articles there.";
            addInsectMessage(responseHTML, 'ai');
            speakText(textToSpeak);
            return;
        }

        if (isLocalQuery(query, contactKeywords)) {
            const hasData = typeof CONTACT_CONFIG !== 'undefined';

            let html = "<b>👤 CONTACT DATA FOUND:</b><br><br>";
            let hasAtLeastOne = false;

            if (hasData) {
                if (CONTACT_CONFIG.emailEnabled !== false) {
                    html += `📧 <b>EMAIL:</b> <a href="mailto:${CONTACT_CONFIG.email}" style="color:#00ff00; text-decoration:underline;">${CONTACT_CONFIG.email}</a><br>`;
                    hasAtLeastOne = true;
                }
                if (CONTACT_CONFIG.linkedinEnabled !== false) {
                    html += `🔗 <b>LINKEDIN:</b> <a href="${CONTACT_CONFIG.linkedin}" target="_blank" style="color:#00ff00; text-decoration:underline;">LinkedIn Profile</a><br>`;
                    hasAtLeastOne = true;
                }
                if (CONTACT_CONFIG.linktreeEnabled !== false) {
                    html += `🔗 <b>LINKTREE:</b> <a href="${CONTACT_CONFIG.linktree}" target="_blank" style="color:#00ff00; text-decoration:underline;">Linktree Directory</a><br>`;
                    hasAtLeastOne = true;
                }
            }

            if (!hasAtLeastOne) {
                responseHTML = "<b>👤 CONTACT ARCHIVES:</b><br><br>ACCESS RESTRICTED. NO PUBLIC CHANNELS AVAILABLE.";
                textToSpeak = "Restricted archive. No public contact channels are currently active.";
            } else {
                responseHTML = html;
                textToSpeak = "Contact data found. You can reach out via the enabled channels.";
            }

            addInsectMessage(responseHTML, 'ai');
            speakText(textToSpeak);
            return;
        }

        // B.5 APPOINTMENTS & MENTORSHIP
        const appointmentKeywords = [
            'appointment', 'mentorship', 'booking', 'session', 'consultation', 'talk to him', 'meet', 'adplist', 'topmate', 'calendly'
        ];
        if (isLocalQuery(query, appointmentKeywords)) {
            if (typeof APPOINTMENTS_DATA !== 'undefined' && APPOINTMENTS_DATA.enabled) {
                let enabledLinks = [];
                if (APPOINTMENTS_DATA.adpList.enabled) enabledLinks.push(APPOINTMENTS_DATA.adpList);
                if (APPOINTMENTS_DATA.topmate.enabled) enabledLinks.push(APPOINTMENTS_DATA.topmate);
                if (APPOINTMENTS_DATA.additionalLinks) {
                    APPOINTMENTS_DATA.additionalLinks.forEach(link => {
                        if (link.enabled) enabledLinks.push(link);
                    });
                }

                if (enabledLinks.length > 0) {
                    let linksHtml = enabledLinks.map(link => `👉 <a href="${link.url}" target="_blank" style="color:#00ff00; text-decoration:underline; font-weight:bold;">${link.displayName}</a>`).join("<br>");
                    responseHTML = `<b>📅 APPOINTMENTS & MENTORSHIP:</b><br><br>I found the following active channels for booking:<br><br>${linksHtml}`;
                    textToSpeak = "I found " + enabledLinks.length + " active appointment channels. You can book a session via " + enabledLinks.map(l => l.displayName).join(", ");
                } else {
                    responseHTML = `<b>📅 APPOINTMENTS:</b><br><br>${APPOINTMENTS_DATA.disabledMessage}`;
                    textToSpeak = "Currently taking a break from new bookings. Please try again later or leave a message.";
                }
                addInsectMessage(responseHTML, 'ai');
                speakText(textToSpeak);
                return;
            }
        }

        // C. SKILLS & TOOLS
        const skillKeywords = [
            'skill', 'stack', 'tech', 'technology', 'software', 'tool', 'program', 'app', 'ide',
            'language', 'code', 'coding', 'framework', 'library', 'stack', 'expert'
        ];
        if (isLocalQuery(query, skillKeywords)) {
            const isDefinition = query.includes('what is') || query.includes('what are') || query.includes('full form') || query.includes('meaning');
            const isPersonal = query.includes('you') || query.includes('mathews') || query.includes('use') || query.includes('know') || query.includes('stack');

            if (isDefinition && !isPersonal) {
                // fall through to Wiki
            } else {
                if (typeof ABOUT_DATA !== 'undefined') {
                    const skillsText = ABOUT_DATA.skills;
                    responseHTML = `<b>🛠️ TECH STACK & SKILLS:</b><br><br>${skillsText}`;
                    textToSpeak = "Tech stack and skills. " + skillsText.replace(/<[^>]*>?/gm, '');
                    addInsectMessage(responseHTML, 'ai');
                    speakText(textToSpeak);
                    return;
                }
            }
        }

        // D. WORKS, PROJECTS & EXPERIENCE
        const workKeywords = [
            'work', 'project', 'portfolio', 'case study', 'made', 'built', 'experience', 'education', 'certificate', 'status'
        ];
        if (isLocalQuery(query, workKeywords)) {
            let subResponse = "";
            let subSpeech = "";

            // D.1 WORK STATUS
            if (isLocalQuery(query, ['status'])) {
                if (typeof WORK_STATUS_DATA !== 'undefined' && WORK_STATUS_DATA.enabled) {
                    subResponse += `<b>📡 CURRENT STATUS:</b><br>${WORK_STATUS_DATA.topText} <b>${WORK_STATUS_DATA.bottomText}</b><br><br>`;
                    subSpeech += `Current Status: ${WORK_STATUS_DATA.topText} ${WORK_STATUS_DATA.bottomText}. `;
                }
            }

            // D.2 PROJECTS (LATEST & OLD)
            if (isLocalQuery(query, ['project', 'work', 'made', 'built'])) {
                if (typeof PROJECTS_DATA !== 'undefined' && PROJECTS_DATA.length > 0) {
                    const latest = PROJECTS_DATA[0];
                    subResponse += `<b>🚀 LATEST PROJECT:</b> <span style="color:#00ff00;">${latest.title}</span> (${latest.category})<br><br>`;
                    subSpeech += `Latest project: ${latest.title}. `;
                }
                if (typeof WORKS_CONFIG !== 'undefined' && WORKS_CONFIG.enabled) {
                    subResponse += `📂 <b>WORKS LINK:</b> <a href="#" onclick="if(window.openDriveModal) { window.openDriveModal(document.body, (typeof WORKS_CONFIG !== 'undefined' ? WORKS_CONFIG.url : null)); } return false;" style="color:#00ff00; text-decoration:underline;">OPEN DRIVE ARCHIVE</a><br>`;
                    subSpeech += "You can view all works in the Drive Archive. ";
                }

                if (typeof LEGACY_PROJECTS_CONFIG !== 'undefined' && LEGACY_PROJECTS_CONFIG.enabled) {
                    const legacyUrl = LEGACY_PROJECTS_CONFIG.url || "https://www.google.com";
                    const legacyName = LEGACY_PROJECTS_CONFIG.displayName || "VIEW LEGACY DEPOT";
                    subResponse += `🔗 <b>${legacyName}:</b> <a href="${legacyUrl}" target="_blank" style="color:#00ff00; text-decoration:underline;">CLICK TO OPEN</a><br><br>`;
                    subSpeech += `Also check the ${legacyName}. `;
                } else {
                    subResponse += `<br>`;
                }
            }

            // D.3 EXPERIENCE
            if (isLocalQuery(query, ['experience'])) {
                if (typeof EXPERIENCE_DATA !== 'undefined' && EXPERIENCE_DATA.length > 0) {
                    const exp = EXPERIENCE_DATA[0];
                    subResponse += `<b>💼 EXPERIENCE:</b> ${exp.role} AT ${exp.company} (${exp.duration})<br><br>`;
                    subSpeech += `Recent Experience: ${exp.role} at ${exp.company}. `;
                }
            }

            // D.4 EDUCATION
            if (isLocalQuery(query, ['education'])) {
                if (typeof EDUCATION_DATA !== 'undefined' && EDUCATION_DATA.length > 0) {
                    const edu = EDUCATION_DATA[0];
                    subResponse += `<b>🎓 EDUCATION:</b> ${edu.degree} - ${edu.institution}<br><br>`;
                    subSpeech += `Education: ${edu.degree} from ${edu.institution}. `;
                }
            }

            // D.5 CERTIFICATES
            if (isLocalQuery(query, ['certificate'])) {
                subResponse += `<b>📜 CERTIFCATES:</b> ACCESSING CREDENTIAL VAULT...<br>
                               <a href="#" onclick="openCertificatesModal(this); return false;" style="color:#00ff00; text-decoration:underline;">👉 CLICK TO VIEW CERTIFICATIONS</a><br><br>`;
                subSpeech += "Certificates found. Click the link to view the credential vault. ";
            }

            if (subResponse) {
                responseHTML = `<b>📂 ARCHIVES FOUND:</b><br><br>${subResponse}`;
                textToSpeak = subSpeech;
                addInsectMessage(responseHTML, 'ai');
                speakText(textToSpeak);
                return;
            }
        }
        // E. BLOG & ARTICLES (LATEST, OLD, SUBSTACK)
        const blogKeywords = ['blog', 'article', 'news', 'post', 'read', 'story', 'substack'];
        if (isLocalQuery(query, blogKeywords)) {
            if (typeof BLOG_DATA !== 'undefined') {
                const isSubstack = query.includes('substack');
                const isLocal = query.includes('local') || query.includes('portfolio') || query.includes('this');

                if (isSubstack && !isLocal) {
                    const subUrl = (typeof SUBSTACK_CONFIG !== 'undefined') ? SUBSTACK_CONFIG.url : "https://mathewsb.substack.com/";
                    const subName = (typeof SUBSTACK_CONFIG !== 'undefined') ? SUBSTACK_CONFIG.displayName : "CLICK TO OPEN SUBSTACK";
                    responseHTML = `<b>🟠 SUBSTACK ARCHIVE:</b><br><br>ACCESSING EXTERNAL BLOG FEED...<br><br><a href="${subUrl}" target="_blank" style="color: #ff6600; text-decoration: underline; font-weight:bold;">👉 ${subName}</a>`;
                    textToSpeak = "Accessing external blog feed. Click the link to open the Substack archive.";
                } else if (isLocal && !isSubstack) {
                    const latestPosts = [...BLOG_DATA].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
                    let listHtml = '<ul style="margin: 10px 0; padding-left: 20px; color: white;">';
                    latestPosts.forEach(post => {
                        listHtml += `<li style="margin-bottom: 8px;"><a href="#" onclick="window.openBlogModal('${post.id}', null); return false;" style="color: #00ff00;">${post.title}</a></li>`;
                    });
                    listHtml += '</ul>';
                    responseHTML = `<b>📝 LOCAL TRANSMISSIONS:</b><br>${listHtml}`;
                    textToSpeak = "Local transmissions found. You can view the latest logs in the list below.";
                } else {
                    const latestPost = [...BLOG_DATA].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
                    const oldestPost = [...BLOG_DATA].sort((a, b) => new Date(a.date) - new Date(b.date))[0];

                    responseHTML = `<b>📝 BLOG DISPATCHES:</b><br><br>`;
                    responseHTML += `🆕 <b>LOCAL LATEST:</b> <a href="#" onclick="window.openBlogModal('${latestPost.id}', null); return false;" style="color: #00ff00;">${latestPost.title}</a><br>`;
                    responseHTML += `📜 <b>LOCAL OLDEST:</b> <a href="#" onclick="window.openBlogModal('${oldestPost.id}', null); return false;" style="color: #00ff00;">${oldestPost.title}</a><br><br>`;
                    responseHTML += `🟠 <b>SUBSTACK:</b> <a href="https://mathewsb.substack.com/" target="_blank" style="color: #ff6600; text-decoration: underline;">SUBSCRIBE TO SUBSTACK</a><br>`;

                    textToSpeak = `Blog dispatches. I found local articles and an external Substack feed. The latest local post is ${latestPost.title}.`;
                }

                addInsectMessage(responseHTML, 'ai');
                speakText(textToSpeak);
                return;
            }
        }

        // F. MUSIC & AUDIO
        const musicKeywords = ['music', 'song', 'audio', 'player', 'playlist', 'fm', 'synthwave', 'nightride', 'local'];
        if (isLocalQuery(query, musicKeywords)) {
            let musicInfo = "<b>🎵 AUDIO SYSTEMS:</b><br><br>";
            let musicSpeech = "Audio systems. ";

            if (window.LOCAL_PLAYLIST && window.LOCAL_PLAYLIST.length > 0) {
                musicInfo += `📜 <b>LOCAL TRACKS:</b> ${window.LOCAL_PLAYLIST.map(s => s.title).join(", ")}<br><br>`;
                musicSpeech += `Local tracks include ${window.LOCAL_PLAYLIST.map(s => s.title).join(", ")}. `;
            }
            musicInfo += `📻 <b>LIVE FM:</b> <a href="https://nightride.fm/" target="_blank" style="color:#00ff00; text-decoration:underline;">NIGHTRIDE.FM (SYNTHWAVE)</a><br>`;
            musicSpeech += "Live FM available from Nightride FM.";

            responseHTML = musicInfo;
            textToSpeak = musicSpeech;
            addInsectMessage(responseHTML, 'ai');
            speakText(textToSpeak);
            return;
        }

        // G. LEGAL, TERMS & PRIVACY
        const legalKeywords = ['terms', 'privacy', 'legal', 'policy', 'rule', 'condition'];
        if (isLocalQuery(query, legalKeywords)) {
            responseHTML = `
                <b>⚖️ LEGAL & POLICIES:</b><br><br>
                🛡️ <b>PRIVACY:</b> <a href="#" onclick="document.getElementById('openPrivacyModal').click(); return false;" style="color:#00ff00; text-decoration:underline;">VIEW PRIVACY POLICY</a><br>
                📜 <b>TERMS:</b> <a href="#" onclick="document.getElementById('openTermsModal').click(); return false;" style="color:#00ff00; text-decoration:underline;">VIEW TERMS OF USE</a>
            `;
            textToSpeak = "Legal and policies found. You can view the privacy policy or terms of use using the links provided.";
            addInsectMessage(responseHTML, 'ai');
            speakText(textToSpeak);
            return;
        }

        // H. NEWS & SCROLL TEXT
        const newsKeywords = ['scroll', 'news', 'update', 'marquee', 'footer'];
        if (isLocalQuery(query, newsKeywords)) {
            if (typeof FOOTER_CONFIG !== 'undefined') {
                const latestNews = FOOTER_CONFIG.scrollItems[0].replace(/<[^>]*>?/gm, '');
                responseHTML = `<b>📡 FOOTER NEWS FEED:</b><br><br>"${latestNews}"<br><br><i>(SCROLLING AT BOTTOM OF INTERFACE)</i>`;
                textToSpeak = `Footer news feed. ${latestNews}`;
                addInsectMessage(responseHTML, 'ai');
                speakText(textToSpeak);
                return;
            }
        }

        // I. TIME & DATE
        if (isLocalQuery(query, ['time', 'date', 'clock', 'today'])) {
            const time = new Date().toLocaleTimeString();
            const date = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            responseHTML = `<b>⌚ CHRONOMETER:</b><br>TIME: ${time}<br>DATE: ${date}`;
            textToSpeak = `The current time is ${time} and today is ${date}`;
            addInsectMessage(responseHTML, 'ai');
            speakText(textToSpeak);
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

        // ENHANCEMENT: Rewrite complex queries for better Wiki results
        let wikiQuery = userQuery;

        // 1. Clean the query to handle abbreviations
        let processedQuery = userQuery.replace(/\bcm\b/gi, "Chief Minister");
        processedQuery = processedQuery.replace(/\bpm\b/gi, "Prime Minister");

        // 2. Strip common question prefixes aggressively to isolate the topic
        const prefixesToRemove = [
            "who is the", "who is", "who was the", "who was",
            "what is the", "what is", "what are the", "what are",
            "where is the", "where is", "where are the", "where are",
            "how many", "tell me about", "can you tell me about", "give me info on", "search for"
        ];

        let strippedQuery = processedQuery.trim(); // Keep original case for Wiki better sometimes
        let lowerQuery = strippedQuery.toLowerCase();

        for (const prefix of prefixesToRemove) {
            if (lowerQuery.startsWith(prefix)) {
                strippedQuery = strippedQuery.substring(prefix.length).trim();
                break; // only strip the first matching prefix
            }
        }

        if (strippedQuery.length > 0) {
            wikiQuery = strippedQuery;
        }

        callWikipediaAPI(wikiQuery, loadingId, wikiQuery);
    };

    // --- WIKIPEDIA API INTEGRATION (Enhanced: Search + Extract) ---
    async function callWikipediaAPI(userQuery, loadingMsgId, originalSubject = "") {
        try {
            // STEP 1: SEARCH for the most relevant page title
            const searchEndpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(userQuery)}&format=json&origin=*&srlimit=1`;

            const searchResponse = await fetch(searchEndpoint);
            const searchData = await searchResponse.json();

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
                if (summary.length > 800) summary = summary.substring(0, 800) + "...";

                // Conversational Prefix (e.g. "THE CHIEF MINISTER OF KERALA IS PINARAYI VIJAYAN")
                let conversationalPrefix = "";
                const cleanSubject = originalSubject.toLowerCase().trim();
                const cleanTitle = bestTitle.toLowerCase().trim();

                if (cleanSubject !== cleanTitle && !cleanTitle.includes(cleanSubject)) {
                    conversationalPrefix = `THE ${originalSubject.toUpperCase()} IS <b>${bestTitle.toUpperCase()}</b>.<br><br>`;
                }

                const responseHTML = `
                    <b>📚 WIKI KNOWLEDGE:</b><br>
                    <span style="font-size:0.8em; opacity:0.7;">TOPIC: ${bestTitle.toUpperCase()}</span><br><br>
                    ${conversationalPrefix}${summary.replace(/\n/g, '<br>')}<br><br>
                    🔗 <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(bestTitle)}" target="_blank" style="color:#00ff00; text-decoration:underline;">READ FULL ARTICLE</a>
                 `;
                addInsectMessage(responseHTML, 'ai');
                speakText((conversationalPrefix ? conversationalPrefix.replace(/<[^>]*>?/gm, '') + " " : "") + summary);
            } else if (searchData.query.search[0].snippet) {
                // FALLBACK TO SEARCH SNIPPET
                const snippetSpan = document.createElement("span");
                snippetSpan.innerHTML = searchData.query.search[0].snippet;
                let snippetText = snippetSpan.textContent || snippetSpan.innerText;

                const responseHTML = `
                    <b>📚 WIKI KNOWLEDGE:</b><br>
                    <span style="font-size:0.8em; opacity:0.7;">TOPIC: ${bestTitle.toUpperCase()}</span><br><br>
                    ${snippetText}<br><br>
                    🔗 <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(bestTitle)}" target="_blank" style="color:#00ff00; text-decoration:underline;">READ FULL ARTICLE</a>
                 `;
                addInsectMessage(responseHTML, 'ai');
                speakText("Wiki Knowledge. Topic: " + bestTitle + ". " + snippetText);
            } else {
                throw new Error("Wiki extract failed.");
            }

        } catch (error) {
            // Remove loading if error happened before
            const loadingBubble = document.getElementById(loadingMsgId);
            if (loadingBubble) loadingBubble.remove();

            // NO FALLBACK TO GOOGLE. DISPLAY ERROR INLINE.
            const responseHTML = `
                <b>⚠️ ARCHIVE MISS:</b><br><br>
                NO DIRECT MATCH FOUND IN GLOBAL WIKI ARCHIVES FOR "${userQuery.toUpperCase()}".<br>
                PLEASE TRY REPHRASING YOUR QUERY.
            `;
            addInsectMessage(responseHTML, 'ai');
            speakText("No direct match found in global wiki archives.");
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
        const container = contactModal.querySelector('.drive-modal-container');
        if (!contactModal || !container) return;

        // 1. Create Taskbar Item first
        const taskId = 'taskbarItem_Contact';
        if (document.getElementById(taskId)) document.getElementById(taskId).remove();

        const taskItem = document.createElement('div');
        taskItem.className = 'taskbar-item';
        taskItem.id = taskId;
        taskItem.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            <span class="task-close-btn" onclick="event.stopPropagation(); closeContactModal();">X</span>
        `;
        taskItem.onclick = restoreContactModal;
        if (taskbarContainer) taskbarContainer.appendChild(taskItem);
        if (typeof updateCloseAllButton === 'function') updateCloseAllButton();

        // 2. Set dynamic transform origin
        const rect = taskItem.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        container.style.transformOrigin = `${centerX}px ${centerY}px`;

        // 3. Trigger Animation
        contactModal.classList.add('genie-anim');
        contactModal.classList.add('minimized');

        setTimeout(() => {
            if (contactModal.classList.contains('minimized')) {
                contactModal.style.display = 'none';
            }
            contactModal.classList.remove('active');
            contactModal.classList.remove('genie-anim');
        }, 400);

        if (deviceFrame) deviceFrame.classList.remove('blur-mode');
    }

    window.restoreContactModal = function () {
        const contactModal = document.getElementById('contactModal');
        const container = contactModal.querySelector('.drive-modal-container');
        if (!contactModal || !container) return;

        // 1. Capture Taskbar Position and Remove
        const taskId = 'taskbarItem_Contact';
        const taskItem = document.getElementById(taskId);
        let originRect = null;
        if (taskItem) {
            originRect = taskItem.getBoundingClientRect();
            taskItem.remove();
            if (typeof updateCloseAllButton === 'function') updateCloseAllButton();
        }

        // 2. Set Origin for Genie
        if (originRect) {
            const centerX = originRect.left + originRect.width / 2;
            const centerY = originRect.top + originRect.height / 2;
            container.style.transformOrigin = `${centerX}px ${centerY}px`;
        }

        // 3. Show Modal
        contactModal.style.display = 'flex';
        requestAnimationFrame(() => {
            contactModal.classList.remove('minimized');
            contactModal.classList.add('active');
        });

        // 4. Restore Blur
        if (deviceFrame) deviceFrame.classList.add('blur-mode');
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

        // Check if this specific article is minimized and remove it immediately
        const taskId = `taskbarItem_Blog_${activeId}`;
        const specificTaskItem = document.getElementById(taskId);
        if (specificTaskItem) {
            specificTaskItem.remove();
            if (typeof updateCloseAllButton === 'function') updateCloseAllButton();
        }

        // 1. Sort posts by Date (Safely)
        // FIX: Handle "STAY TUNED" or invalid dates by treating them as new
        const sortedPosts = BLOG_DATA.filter(p => p.enabled !== false).sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            const isInvalidA = isNaN(dateA.getTime());
            const isInvalidB = isNaN(dateB.getTime());

            if (isInvalidA && isInvalidB) return 0; // Maintain array order
            if (isInvalidA) return 1;  // Put invalid (STAY TUNED) at bottom
            if (isInvalidB) return -1; // Put invalid (STAY TUNED) at bottom
            return dateB - dateA;      // Latest first
        });

        // 2. Filter for Local Navigation Logic: Only browse between non-external posts
        const localPosts = sortedPosts.filter(p => p.source !== 'substack' && !p.externalLink);
        const currentIndex = localPosts.findIndex(p => p.id == activeId);
        const post = sortedPosts.find(p => p.id == activeId); // Find actual post from full list
        const nextPost = (currentIndex !== -1 && currentIndex < localPosts.length - 1) ? localPosts[currentIndex + 1] : null;
        const prevPost = (currentIndex !== -1 && currentIndex > 0) ? localPosts[currentIndex - 1] : null;

        // Store nav IDs for keyboard support
        modal.dataset.prevId = prevPost ? prevPost.id : "";
        modal.dataset.nextId = nextPost ? nextPost.id : "";

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
            if (element) {
                const rect = element.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                blogModalContainer.style.transformOrigin = `${centerX}px ${centerY}px`;
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
            // Clear URL so refreshing doesn't reopen the closed modal
            history.pushState({ page: 'blog' }, '', '?page=blog');
            if (typeof updatePageMetadata === 'function') {
                updatePageMetadata('blog');
            }

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

        // 2. Remove Blur and clear URL
        if (deviceFrame) deviceFrame.classList.remove('blur-mode');
        // Clear URL so refreshing doesn't reopen the minimized modal
        history.pushState({ page: 'blog' }, '', '?page=blog');
        if (typeof updatePageMetadata === 'function') {
            updatePageMetadata('blog');
        }

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
            // Force instant hide by removing transition briefly
            closeAllBtn.style.transition = 'none';
            closeAllBtn.classList.remove('visible');
            void closeAllBtn.offsetWidth; // Force reflow
            closeAllBtn.style.transition = '';
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
    // Logic removed as per request: content should not disappear when offline.

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



    // --- KEYBOARD NAVIGATION & SCROLLING LOGIC ---
    document.addEventListener('keydown', (e) => {
        const isVibe = pages[currentPageIndex].id === 'vibe';
        const isPlaying = typeof gameState !== 'undefined' && gameState === 'PLAYING';

        // 1. Handle Modal Scrolling (Highest Priority)
        const activeModal = document.querySelector('.drive-modal-overlay.active, .popup-overlay.show-popup');
        if (activeModal) {
            // Ignore if typing in an input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                let scrollTarget = null;
                const id = activeModal.id;

                if (id === 'projectsModal') scrollTarget = activeModal.querySelector('.projects-inner-content');
                else if (id === 'experienceModal') scrollTarget = activeModal.querySelector('.option-experience-inner');
                else if (id === 'educationModal') scrollTarget = activeModal.querySelector('.option-education-inner');
                else if (id === 'insectAiModal') scrollTarget = document.getElementById('insectChatHistory');
                else if (id === 'blogModal') scrollTarget = activeModal.querySelector('.blog-modal-content');
                else if (id === 'driveModal') {
                    // Drive uses iframe, we can't easily scroll IT, but we can try to focus it
                    const frame = document.getElementById('driveFrame');
                    if (frame) frame.focus();
                    return;
                }

                if (scrollTarget) {
                    e.preventDefault();
                    const amount = (e.key === 'ArrowDown') ? 60 : -60;
                    scrollTarget.scrollBy({ top: amount, behavior: 'smooth' });
                    return;
                }
            }
            return; // Exit other key handlers if modal is open
        }

        // 2. Handle Page Navigation (ArrowLeft / ArrowRight)
        if (!isVibe || !isPlaying) {
            if (e.key === 'ArrowRight') {
                handleNavigation('next');
                return;
            } else if (e.key === 'ArrowLeft') {
                handleNavigation('prev');
                return;
            }
        }

        // 3. Handle Page Scrolling (ArrowUp / ArrowDown for About/Works etc)
        if (!isVibe || !isPlaying) {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                const dynamicTarget = document.getElementById('dynamic-content-container');
                if (dynamicTarget && dynamicTarget.offsetParent !== null) {
                    // Only scroll if it's a page that actually overflows (like About or Blog list)
                    const isAbout = pages[currentPageIndex].id === 'about';
                    const isBlog = pages[currentPageIndex].id === 'blog';

                    if (isAbout || isBlog) {
                        e.preventDefault();
                        const amount = (e.key === 'ArrowDown') ? 60 : -60;
                        dynamicTarget.scrollBy({ top: amount, behavior: 'smooth' });
                    }
                }
            }
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

    // 0. CLOSE ICON (X) ON STRIP
    const cookieCloseStrip = document.getElementById('cookieCloseStrip');
    if (cookieCloseStrip) {
        cookieCloseStrip.addEventListener('click', (e) => {
            e.stopPropagation(); // Don't trigger strip click
            hideCookieStrip();
            localStorage.setItem('cookieConsent_v3', 'dismissed'); // Don't show again in this session
        });
    }

    // 1. CLICKING THE STRIP OPENS SETTINGS
    if (cookieStrip) {
        cookieStrip.addEventListener('click', (e) => {
            // If user clicked the "OK" button or Close button, do nothing
            if (e.target === quickAcceptBtn || e.target.closest('#quickAcceptCookie') || e.target === cookieCloseStrip) return;

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
                if (deviceFrame) deviceFrame.classList.add('blur-mode');
            }
        });
    }

    if (openTermsBtn) {
        openTermsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (termsModal) {
                termsModal.classList.remove('hidden-popup');
                termsModal.classList.add('show-popup');
                if (deviceFrame) deviceFrame.classList.add('blur-mode');
            }
        });
    }

    if (privacyCloseX) {
        privacyCloseX.addEventListener('click', () => {
            if (privacyModal) {
                closePopup(privacyModal);
                if (deviceFrame) deviceFrame.classList.remove('blur-mode');
            }
        });
    }

    if (termsCloseX) {
        termsCloseX.addEventListener('click', () => {
            if (termsModal) {
                closePopup(termsModal);
                if (deviceFrame) deviceFrame.classList.remove('blur-mode');
            }
        });
    }

    // --- Copyright & Date Cycle ---
    function updateDateTime() {
        const dateEl = document.getElementById('dateTimeDisplay');
        if (!dateEl) return;

        const update = () => {
            const now = new Date();
            const dateStr = now.toLocaleDateString('en-GB', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }).toUpperCase();
            const timeStr = now.toLocaleTimeString('en-US', {
                hour12: true,
                hour: 'numeric',
                minute: 'numeric'
            });
            dateEl.innerHTML = `${dateStr} • ${timeStr}`;
        };
        update();
        setInterval(update, 1000); // Update every second to ensure precision
    }

    // Start Date/Time Updater
    updateDateTime();

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

    // --- Work Status Loop Animation Helper ---
    function toggleWorkHeader() {
        const iconContainer = document.getElementById('iconContainer');
        const iconDisplaySpan = document.querySelector('.icon-display');
        const pageNameDisplay = document.getElementById('pageNameDisplay');

        if (!iconContainer || !iconDisplaySpan || !pageNameDisplay) return;

        // Check current state (is it showing default or status?)
        const isDefault = !iconContainer.classList.contains('work-status-active');

        // 1. Sweep OUT
        iconDisplaySpan.classList.add('sweep-out');
        pageNameDisplay.classList.add('sweep-out');

        setTimeout(() => {
            // 2. Change Content
            if (isDefault) {
                // Switch to STATUS
                iconContainer.classList.add('work-status-active');

                // Hide "WORKS" text, show Status Text
                pageNameDisplay.innerHTML = `<span class="work-status-text"><span class="status-dot"></span>${WORK_STATUS_DATA.text}</span>`;

                // Hide Icon (Square Brackets remain, inside is empty or maybe we hide brackets too?)
                // User said: "WORKS TEXT AND [ ICON ] CHANGE TO WHICH PLACE YOU ARE WORKING"
                // This implies the whole block changes.

                // So:
                // pageNameDisplay (WORKS) -> Hidden/Replaced
                // iconContainer ([ ICON ]) -> Hidden/Replaced

                // Update:
                pageNameDisplay.innerHTML = `
                    <div class="work-status-container">
                        <div class="status-dot-large"></div>
                        <div class="status-text-group">
                            <div class="status-line-top"><span class="green-highlight">REMOTE:</span> CURRENTLY WORKING @</div>
                            <div class="status-line-bottom">${WORK_STATUS_DATA.bottomText}</div>
                        </div>
                    </div>
                `;
                // Note: I hardcoded "REMOTE: CURRENTLY WORKING @" part to allow specific green highlight on "REMOTE:" 
                // as seen in the image (Green Text for Remote?). 
                // Actually, let's use the data but try to parse it or just style the top line generally.
                // The image shows "REMOTE:" in green? Hard to tell 100% but "REMOTE: CURRENTLY WORKING @" looks like mixed style.
                // To be safe and dynamic, I will use WORK_STATUS_DATA.topText but wrapping the first word might be risky if they change it.
                // Let's stick to using the variable but styling the container.

                pageNameDisplay.innerHTML = `
                    <div class="work-status-container">
                        <div class="status-dot-large"></div>
                        <div class="status-text-group">
                            <div class="status-line-top">${WORK_STATUS_DATA.topText.replace('REMOTE:', '<span class="green-highlight">REMOTE:</span>')}</div>
                            <div class="status-line-bottom">${WORK_STATUS_DATA.bottomText}</div>
                        </div>
                    </div>
                `;

                iconContainer.style.display = 'none'; // Hide [ ICON ]

            } else {
                // Switch back to DEFAULT ("WORKS")
                iconContainer.classList.remove('work-status-active');

                const page = pages.find(p => p.id === 'works');
                if (page) {
                    pageNameDisplay.textContent = page.headerTitle; // "WORKS"
                    iconDisplaySpan.innerHTML = page.icon;
                }
                iconContainer.style.display = 'block'; // Show [ ICON ]
            }

            // 3. Sweep IN
            iconDisplaySpan.classList.remove('sweep-out');
            pageNameDisplay.classList.remove('sweep-out');

            iconDisplaySpan.classList.add('sweep-in');
            pageNameDisplay.classList.add('sweep-in');

            // Cleanup Sweep In class
            setTimeout(() => {
                iconDisplaySpan.classList.remove('sweep-in');
                pageNameDisplay.classList.remove('sweep-in');
            }, 500);

        }, 400); // Wait for sweep-out animation (approx half second)
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
    // --- PROFESSIONAL PULSE LOGIC ---
    const profPulseBadge = document.getElementById('profPulseBadge');
    const profPulseDrawer = document.getElementById('profPulseDrawer');
    const deviceFrameForPulse = document.querySelector('.device-frame');

    const togglePulseDrawer = (isOpen) => {
        if (!profPulseDrawer) return;
        if (isOpen) {
            profPulseDrawer.classList.remove('hidden-drawer');
            if (deviceFrameForPulse) deviceFrameForPulse.classList.add('blur-mode');
        } else {
            profPulseDrawer.classList.add('hidden-drawer');
            if (deviceFrameForPulse) deviceFrameForPulse.classList.remove('blur-mode');
        }
    };

    if (profPulseBadge && profPulseDrawer) {
        profPulseBadge.addEventListener('click', (e) => {
            e.stopPropagation();
            const willOpen = profPulseDrawer.classList.contains('hidden-drawer');
            togglePulseDrawer(willOpen);
        });

        // Close Button Logic
        const closeBtn = document.getElementById('closeDrawerBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                togglePulseDrawer(false);
            });
        }
    }

    // Close on outside click (if open)
    document.addEventListener('click', (e) => {
        if (profPulseDrawer && !profPulseDrawer.classList.contains('hidden-drawer')) {
            // Do not close if clicking inside popup overlays OR the drawer itself OR the badge
            if (e.target.closest('.tutorial-overlay') || e.target.closest('.popup-overlay')) {
                return;
            }

            if (!profPulseDrawer.contains(e.target) && !profPulseBadge.contains(e.target)) {
                togglePulseDrawer(false);
            }
        }
    });

    // 2. Populate Content
    const initProfPulse = () => {
        // 1. Resume
        const resumeSection = document.getElementById('resumeSection');
        const resumeAction = document.getElementById('resumeAction');
        if (resumeSection && typeof RESUME_CONFIG !== 'undefined') {
            if (RESUME_CONFIG.enabled) {
                resumeSection.style.display = 'block';
                if (resumeAction) {
                    resumeAction.innerHTML = `
                        <a href="${RESUME_CONFIG.url}" target="_blank" class="booking-chip" data-active="true">
                            <span>${RESUME_CONFIG.displayName}</span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                        </a>
                    `;
                }
            } else {
                resumeSection.style.display = 'none';
            }
        }

        // 2. Achievements (Merits)
        const meritSection = document.getElementById('meritSection');
        const achGrid = document.getElementById('achievementsGrid');
        if (meritSection && typeof ACHIEVEMENTS_CONFIG !== 'undefined') {
            if (ACHIEVEMENTS_CONFIG.enabled) {
                meritSection.style.display = 'block';
                if (achGrid && typeof ACHIEVEMENTS_DATA !== 'undefined') {
                    const achHtml = `<div class="badge-grid" style="margin: 0; padding: 0; padding-bottom: 8px;">` + ACHIEVEMENTS_DATA.filter(ach => ach.enabled !== false).map(ach => `
                            <a href="${ach.link}" target="_blank" class="achievement-pill">
                                ${ach.title} [${ach.year}]
                            </a>
                        `).join('') + `</div>`;
                    achGrid.innerHTML = achHtml + achHtml;
                }
            } else {
                meritSection.style.display = 'none';
            }
        }

        // 3. Testimonials
        const testimonialsSection = document.getElementById('testimonialsSection');
        const tMarquee = document.getElementById('testimonialMarquee');
        if (testimonialsSection && typeof TESTIMONIALS_CONFIG !== 'undefined') {
            if (TESTIMONIALS_CONFIG.enabled) {
                testimonialsSection.style.display = 'block';
                if (tMarquee && typeof TESTIMONIALS_DATA !== 'undefined') {
                    const tHtml = `<div style="display: flex; flex-direction: column;">` + TESTIMONIALS_DATA.filter(t => t.enabled !== false).map(t => `
                            <a href="${t.socialLink}" target="_blank" class="testimonial-card-small">
                                <p class="t-message">"${t.message}"</p>
                                <div class="t-author-row">
                                    <img src="${t.profilePic}" alt="${t.name}" class="t-profile-pic" />
                                <div class="t-author-info">
                                        <p class="t-author-name">${t.name.toUpperCase()}</p>
                                        <p class="t-author-desig">${t.designation} • Via ${t.platform.charAt(0).toUpperCase() + t.platform.slice(1)}</p>
                                    </div>
                                </div>
                            </a>
                        `).join('') + `</div>`;
                    tMarquee.innerHTML = tHtml + tHtml;
                }
            } else {
                testimonialsSection.style.display = 'none';
            }
        }

        // 4. Bookings (Sessions)
        const sessionsSection = document.getElementById('sessionsSection');
        const bookingActions = document.getElementById('bookingActions');
        if (sessionsSection && typeof APPOINTMENTS_DATA !== 'undefined') {
            if (APPOINTMENTS_DATA.enabled) {
                sessionsSection.style.display = 'block';
                if (bookingActions) {
                    let html = '';
                    // ADPList
                    html += `
                        <div class="booking-item">
                            <a href="${APPOINTMENTS_DATA.adpList.enabled ? APPOINTMENTS_DATA.adpList.url : '#'}" 
                               target="${APPOINTMENTS_DATA.adpList.enabled ? '_blank' : '_self'}" 
                               class="booking-chip" 
                               data-active="${APPOINTMENTS_DATA.adpList.enabled}">
                                <span>${APPOINTMENTS_DATA.adpList.displayName}</span>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                            </a>
                        </div>
                    `;
                    // Topmate
                    html += `
                        <div class="booking-item">
                            <a href="${APPOINTMENTS_DATA.topmate.enabled ? APPOINTMENTS_DATA.topmate.url : '#'}" 
                               target="${APPOINTMENTS_DATA.topmate.enabled ? '_blank' : '_self'}" 
                               class="booking-chip" 
                               data-active="${APPOINTMENTS_DATA.topmate.enabled}">
                                <span>${APPOINTMENTS_DATA.topmate.displayName}</span>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                            </a>
                        </div>
                    `;

                    // Render Additional Links if present
                    if (APPOINTMENTS_DATA.additionalLinks && Array.isArray(APPOINTMENTS_DATA.additionalLinks)) {
                        APPOINTMENTS_DATA.additionalLinks.forEach(item => {
                            html += `
                                <div class="booking-item">
                                    <a href="${item.enabled ? item.url : '#'}" 
                                       target="${item.enabled ? '_blank' : '_self'}" 
                                       class="booking-chip" 
                                       data-active="${item.enabled}">
                                        <span>${item.displayName}</span>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                    </a>
                                </div>
                            `;
                        });
                    }
                    // Status dot logic
                    let statusMessage = "";
                    let statusClass = "";
                    let dotClass = "";

                    const activeLinks = [];
                    if (APPOINTMENTS_DATA.adpList.enabled) activeLinks.push(APPOINTMENTS_DATA.adpList.displayName);
                    if (APPOINTMENTS_DATA.topmate.enabled) activeLinks.push(APPOINTMENTS_DATA.topmate.displayName);
                    if (APPOINTMENTS_DATA.additionalLinks) {
                        APPOINTMENTS_DATA.additionalLinks.forEach(link => {
                            if (link.enabled) activeLinks.push(link.displayName);
                        });
                    }

                    if (activeLinks.length > 0) {
                        statusClass = "live-status";
                        dotClass = "live";

                        let itemsHtml = activeLinks.map(link => `<div class="live-scroll-item" style="padding-bottom: 4px; font-size: 0.65rem;">${link.toUpperCase()} IS LIVE</div>`).join('');
                        // Duplicate for smooth infinite scroll loop
                        let marqueeHtml = itemsHtml + itemsHtml;

                        html += `
                            <div class="booking-status-indicator ${statusClass}" style="flex-direction: column; align-items: stretch; padding: 12px; gap: 8px;">
                                <div class="drawer-section-header" style="margin-bottom: 0;">
                                    <h4 style="margin: 0; display: flex; align-items: center; gap: 6px; color: var(--primary-green); font-size: 0.7rem; letter-spacing: 1.5px;">
                                        <span class="status-dot ${dotClass}"></span> LIVE
                                    </h4>
                                    <button id="pauseLiveListBtn" class="drawer-control-btn" title="Pause/Play">
                                        <svg class="pause-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                            <rect x="6" y="4" width="4" height="16"></rect>
                                            <rect x="14" y="4" width="4" height="16"></rect>
                                        </svg>
                                        <svg class="play-icon hidden" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                        </svg>
                                    </button>
                                </div>
                                <div class="live-scroll-wrapper" style="overflow: hidden; height: 16px; position: relative;">
                                    <div id="liveListMarquee" class="anim-vertical" style="display: flex; flex-direction: column;">
                                        ${marqueeHtml}
                                    </div>
                                </div>
                            </div>
                        `;
                    } else {
                        statusMessage = APPOINTMENTS_DATA.disabledMessage;
                        statusClass = "busy-status";
                        dotClass = "busy";
                        html += `
                            <div class="booking-status-indicator ${statusClass}">
                                <span class="status-dot ${dotClass}"></span> ${statusMessage}
                            </div>
                        `;
                    }
                    bookingActions.innerHTML = html;
                }
            } else {
                sessionsSection.style.display = 'none';
            }
        }

        // 5. Substack
        const substackSection = document.getElementById('substackSection');
        const substackAction = document.getElementById('substackAction');
        if (substackSection && typeof SUBSTACK_CONFIG !== 'undefined') {
            if (SUBSTACK_CONFIG.enabled) {
                substackSection.style.display = 'block';
                if (substackAction) {
                    substackAction.innerHTML = `
                        <a href="${SUBSTACK_CONFIG.url}" target="_blank" class="booking-chip" data-active="true">
                            <span>${SUBSTACK_CONFIG.displayName}</span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        </a>
                    `;
                }
            } else {
                substackSection.style.display = 'none';
            }
        }

        // 6. Podcast
        const podcastSection = document.getElementById('podcastSection');
        const podcastAction = document.getElementById('podcastAction');
        if (podcastSection && typeof PODCAST_CONFIG !== 'undefined') {
            if (PODCAST_CONFIG.enabled) {
                podcastSection.style.display = 'block';
                if (podcastAction) {
                    let html = '';
                    if (PODCAST_CONFIG.links && Array.isArray(PODCAST_CONFIG.links)) {
                        PODCAST_CONFIG.links.forEach(item => {
                            if (!item.enabled) return;
                            html += `
                                <div class="booking-item">
                                    <a href="${item.url}" 
                                       target="_blank" 
                                       class="booking-chip" 
                                       data-active="true">
                                        <span>${item.displayName}</span>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                    </a>
                                </div>
                            `;
                        });
                    }
                    podcastAction.innerHTML = html;
                }
            } else {
                podcastSection.style.display = 'none';
            }
        }

        // Play/Pause Control Logic
        const setupPauseControl = (btnId, targetId) => {
            const btn = document.getElementById(btnId);
            const target = document.getElementById(targetId);
            if (!btn || !target) return;

            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isPaused = target.classList.toggle('pause-anim');
                const pauseIcon = btn.querySelector('.pause-icon');
                const playIcon = btn.querySelector('.play-icon');
                if (isPaused) {
                    pauseIcon.classList.add('hidden');
                    playIcon.classList.remove('hidden');
                } else {
                    pauseIcon.classList.remove('hidden');
                    playIcon.classList.add('hidden');
                }
            });
        };
        setupPauseControl('pauseMeritBtn', 'achievementsGrid');
        setupPauseControl('pauseTestimonialBtn', 'testimonialMarquee');
        setupPauseControl('pauseLiveListBtn', 'liveListMarquee');
    };

    // 3. Pulse Badge Text Looping
    const pulseBadgeText = document.getElementById('pulseBadgeText');
    if (pulseBadgeText) {
        // Fallback array if config missing
        let loopTexts = ["MERITS", "RESUME", "ACHIEVEMENTS", "TESTIMONIALS", "APPOINTMENTS"];
        let speed = 3500;

        if (typeof PULSEBADGE_DATA !== 'undefined' && typeof PULSEBADGE_CONFIG !== 'undefined') {
            if (!PULSEBADGE_CONFIG.enabled) {
                // Completely disabled logic if required
                pulseBadgeText.innerText = "MERITS";
                loopTexts = ["MERITS"];
            } else {
                let activeItems = PULSEBADGE_DATA.filter(item => item.enabled);
                if (activeItems.length > 0) {
                    loopTexts = activeItems.map(item => item.text);
                }
                speed = PULSEBADGE_CONFIG.speedMs || 3500;
            }
        }

        if (loopTexts.length > 0) {
            let loopIdx = 0;
            pulseBadgeText.innerText = loopTexts[0];

            if (loopTexts.length > 1) {
                setInterval(() => {
                    // Fade out
                    pulseBadgeText.style.transition = 'opacity 0.2s ease-in-out';
                    pulseBadgeText.style.opacity = '0';

                    // Swap text and fade back in
                    setTimeout(() => {
                        loopIdx = (loopIdx + 1) % loopTexts.length;
                        pulseBadgeText.innerText = loopTexts[loopIdx];
                        pulseBadgeText.style.opacity = ''; // Restores CSS-controlled hover opacity instantly
                    }, 200);
                }, speed); // Wait defined speed before changing to next word
            }
        }
    }

    // Run Init
    initProfPulse();

    // --- ACCESSIBILITY DRAWER LOGIC ---
    const accBtn = document.getElementById('accessibilityBtn');
    const accDrawer = document.getElementById('accessibilityDrawer');
    const closeAccBtn = document.getElementById('closeAccBtn');
    const accDrawerContent = document.getElementById('accDrawerContent');
    const deviceFrameForAcc = document.querySelector('.device-frame');
    let lastFocusedInput = null;

    const toggleAccDrawer = (isOpen) => {
        if (!accDrawer) return;
        if (isOpen) {
            accDrawer.classList.remove('hidden-drawer');
            if (deviceFrameForAcc) deviceFrameForAcc.classList.add('blur-mode');
        } else {
            accDrawer.classList.add('hidden-drawer');
            if (deviceFrameForAcc) deviceFrameForAcc.classList.remove('blur-mode');
        }
    };

    const triggerPreview = () => {
        if (!accDrawer) return;
        accDrawer.classList.add('no-blur');
        setTimeout(() => {
            accDrawer.classList.remove('no-blur');
        }, 1200);
    };

    if (accBtn && accDrawer) {
        accBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const willOpen = accDrawer.classList.contains('hidden-drawer');
            toggleAccDrawer(willOpen);
        });

        if (closeAccBtn) {
            closeAccBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleAccDrawer(false);
            });
        }
    }

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (accDrawer && !accDrawer.classList.contains('hidden-drawer')) {
            if (!accDrawer.contains(e.target) && !accBtn.contains(e.target) && !e.target.closest('#v-keyboard')) {
                toggleAccDrawer(false);
            }
        }
    });

    const initAccessibility = () => {
        if (typeof ACCESSIBILITY_CONFIG === 'undefined' || !ACCESSIBILITY_CONFIG.enabled) {
            if (accBtn) accBtn.style.display = 'none';
            return;
        }

        renderAccContent();
        applyStoredSettings();
        initReadAloud();
        initVirtualKeyboard();

        // Track focus globally for virtual keyboard
        document.addEventListener('focusin', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                lastFocusedInput = e.target;
            }
        });
    };

    const renderAccContent = () => {
        if (!accDrawerContent) return;
        let html = '';

        ACCESSIBILITY_CONFIG.categories.forEach(cat => {
            html += `<div class="acc-group">`;
            html += `<h3 class="acc-group-title">${cat.title.toUpperCase()}</h3>`;

            cat.items.forEach(item => {
                if (!item.enabled) return;

                html += `<div class="acc-item" id="item-${item.id}">`;
                html += `<span class="acc-label">${item.label}</span>`;

                if (item.type === 'toggle') {
                    html += `
                        <label class="acc-switch">
                            <input type="checkbox" onchange="handleAccAction('${item.action}', this.checked)" data-action="${item.action}">
                            <span class="acc-slider"></span>
                        </label>
                    `;
                } else if (item.type === 'stepper') {
                    html += `
                        <div class="acc-stepper">
                            <button class="acc-step-btn" onclick="handleAccAction('${item.action}', 'minus')">-</button>
                            <button class="acc-step-btn reset-step" onclick="handleAccAction('${item.action}', 'reset')">RST</button>
                            <button class="acc-step-btn" onclick="handleAccAction('${item.action}', 'plus')">+</button>
                        </div>
                    `;
                } else {
                    html += `<button class="acc-btn" onclick="handleAccAction('${item.action}')">RUN</button>`;
                }
                html += `</div>`;
            });
            html += `</div>`;
        });

        accDrawerContent.innerHTML = html;
    };

    window.handleAccAction = (action, value) => {
        console.log(`Accessibility Action: ${action} = ${value}`);

        // Save to localStorage
        const settings = JSON.parse(localStorage.getItem('acc_settings') || '{}');
        settings[action] = value;
        localStorage.setItem('acc_settings', JSON.stringify(settings));

        executeAction(action, value);

        // Preview effect for EVERY action
        if (action !== 'toggleVKeyboard') {
            triggerPreview();
        }
    };

    const executeAction = (action, value) => {
        const b = document.body;
        switch (action) {
            case 'resetAll':
                localStorage.removeItem('acc_settings');
                location.reload();
                break;
            case 'handleTextSize':
                let currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
                if (value === 'plus') currentSize += 2;
                else if (value === 'minus') currentSize -= 2;
                else currentSize = 16;
                document.documentElement.style.fontSize = currentSize + 'px';
                break;
            case 'toggleGrayscale':
                b.classList.toggle('acc-monochrome', value);
                break;
            case 'toggleInvert':
                b.classList.toggle('acc-invert', value);
                break;
            case 'toggleContrast':
                b.classList.toggle('acc-high-contrast', value);
                break;
            case 'toggleImageHide':
                b.classList.toggle('acc-hide-images', value);
                break;
            case 'toggleAnims':
                b.classList.toggle('acc-stop-anims', value);
                break;
            case 'toggleLinks':
                b.classList.toggle('acc-highlight-links', value);
                break;
            case 'toggleHeadings':
                b.classList.toggle('acc-highlight-headings', value);
                break;
            case 'toggleReadAloud':
                window.readAloudEnabled = value;
                break;
            case 'toggleVKeyboard':
                const kb = document.getElementById('v-keyboard');
                if (kb) {
                    const isVisible = kb.classList.contains('show-kb');
                    if (isVisible) {
                        kb.classList.remove('show-kb');
                        setTimeout(() => kb.style.display = 'none', 500);
                    } else {
                        kb.style.display = 'flex';
                        setTimeout(() => kb.classList.add('show-kb'), 10);
                    }
                }
                break;
            case 'toggleMute':
                const volSlider = document.getElementById('volumeSlider');
                if (volSlider) {
                    if (value) {
                        window.prevVolBeforeMute = volSlider.value;
                        volSlider.value = 0;
                    } else {
                        volSlider.value = window.prevVolBeforeMute || 0.5;
                    }
                    volSlider.dispatchEvent(new Event('input'));
                }
                break;
        }
    };

    const duckMusic = (isSpeaking) => {
        const volSlider = document.getElementById('volumeSlider');
        if (!volSlider) return;
        if (isSpeaking) {
            window.preDuckVolume = volSlider.value;
            volSlider.value = volSlider.value * 0.2; // 80% volume reduction
        } else {
            volSlider.value = window.preDuckVolume || 0.5;
        }
        volSlider.dispatchEvent(new Event('input'));
    };

    const initReadAloud = () => {
        document.addEventListener('mouseover', (e) => {
            if (!window.readAloudEnabled) return;
            const target = e.target;
            if (target.innerText && target.innerText.trim().length > 0) {
                target.classList.add('tts-pointing');
                const msg = new SpeechSynthesisUtterance(target.innerText);

                // Audio ducking logic
                msg.onstart = () => duckMusic(true);
                msg.onend = () => duckMusic(false);
                msg.onerror = () => duckMusic(false);

                window.speechSynthesis.cancel();
                window.speechSynthesis.speak(msg);
            }
        });

        // Add Click to Speak ability
        document.addEventListener('click', (e) => {
            if (!window.readAloudEnabled) return;
            const target = e.target;
            if (target.innerText && target.innerText.trim().length > 0) {
                const msg = new SpeechSynthesisUtterance(target.innerText);
                msg.onstart = () => duckMusic(true);
                msg.onend = () => duckMusic(false);
                window.speechSynthesis.cancel();
                window.speechSynthesis.speak(msg);
            }
        });

        document.addEventListener('mouseout', (e) => {
            e.target.classList.remove('tts-pointing');
        });
    };

    const initVirtualKeyboard = () => {
        const kb = document.getElementById('v-keyboard');
        if (!kb) return;

        // Expanded Layout with Arrow Keys
        const layout = [
            ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'BKSP'],
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'ENT'],
            ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', '@'],
            ['UP', 'DOWN', 'LEFT', 'RIGHT', 'SPACE', 'EXIT']
        ];

        let html = '';
        layout.forEach(row => {
            html += `<div class="kb-row">`;
            row.forEach(key => {
                let cls = 'kb-key';
                if (key === 'BKSP' || key === 'ENT') cls += ' wide';
                if (key === 'SPACE') cls += ' space';
                if (key === 'EXIT') cls += ' exit-kb';
                if (['UP', 'DOWN', 'LEFT', 'RIGHT'].includes(key)) cls += ' arrow-key';
                html += `<div class="${cls}" data-key="${key}">${key}</div>`;
            });
            html += `</div>`;
        });
        kb.innerHTML = html;

        // Use mousedown to prevent focus theft
        kb.addEventListener('mousedown', (e) => {
            const keyEl = e.target.closest('.kb-key');
            if (!keyEl) return;

            e.preventDefault();
            // DON'T stop propagation here, let the system hear it if needed
            // e.stopPropagation(); 

            const key = keyEl.getAttribute('data-key');

            if (key === 'EXIT') {
                kb.classList.remove('show-kb');
                setTimeout(() => kb.style.display = 'none', 500);
                return;
            }

            // Map keys to standard JS event values
            let keyMap = {
                'ENT': { key: 'Enter', code: 'Enter' },
                'SPACE': { key: ' ', code: 'Space' },
                'BKSP': { key: 'Backspace', code: 'Backspace' },
                'UP': { key: 'ArrowUp', code: 'ArrowUp' },
                'DOWN': { key: 'ArrowDown', code: 'ArrowDown' },
                'LEFT': { key: 'ArrowLeft', code: 'ArrowLeft' },
                'RIGHT': { key: 'ArrowRight', code: 'ArrowRight' }
            };
            const mapped = keyMap[key] || { key: key.toLowerCase(), code: 'Key' + key.toUpperCase() };

            // 🟢 CRITICAL: Dispatch global Keyboard event for GAMES and NAVIGATION
            // We dispatch on window for maximum compatibility with all game engines
            const dispatchEvent = (type) => {
                const ev = new KeyboardEvent(type, {
                    key: mapped.key,
                    code: mapped.code,
                    bubbles: true,
                    cancelable: true,
                    composed: true
                });
                window.dispatchEvent(ev);
                document.dispatchEvent(ev);
            };

            dispatchEvent('keydown');
            setTimeout(() => dispatchEvent('keyup'), 50); // Simulate release for games

            const activeInput = lastFocusedInput || document.querySelector('input:focus, textarea:focus');
            if (activeInput && activeInput.contains(e.target) === false) {
                const start = activeInput.selectionStart;
                const end = activeInput.selectionEnd;
                const val = activeInput.value;

                if (key === 'BKSP') {
                    if (start > 0) {
                        activeInput.value = val.substring(0, start - 1) + val.substring(end);
                        activeInput.setSelectionRange(start - 1, start - 1);
                    }
                } else if (key === 'ENT') {
                    activeInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
                    activeInput.dispatchEvent(new Event('change', { bubbles: true }));
                } else if (key === 'SPACE') {
                    activeInput.value = val.substring(0, start) + ' ' + val.substring(end);
                    activeInput.setSelectionRange(start + 1, start + 1);
                } else if (['UP', 'DOWN', 'LEFT', 'RIGHT'].includes(key)) {
                    // Navigate within input if focused
                    if (key === 'UP') activeInput.setSelectionRange(0, 0);
                    else if (key === 'DOWN') activeInput.setSelectionRange(val.length, val.length);
                    else if (key === 'LEFT') activeInput.setSelectionRange(Math.max(0, start - 1), Math.max(0, start - 1));
                    else if (key === 'RIGHT') activeInput.setSelectionRange(Math.min(val.length, start + 1), Math.min(val.length, start + 1));
                } else {
                    activeInput.value = val.substring(0, start) + key.toLowerCase() + val.substring(end);
                    activeInput.setSelectionRange(start + 1, start + 1);
                }
                activeInput.dispatchEvent(new Event('input', { bubbles: true }));
                activeInput.focus();
            }
        });
    };

    const applyStoredSettings = () => {
        const settings = JSON.parse(localStorage.getItem('acc_settings') || '{}');
        Object.keys(settings).forEach(action => {
            const value = settings[action];
            executeAction(action, value);

            // Sync checkbox state in UI
            const cb = document.querySelector(`input[data-action="${action}"]`);
            if (cb) cb.checked = value;
        });
    };

    initAccessibility();
});



