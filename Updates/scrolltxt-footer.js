/**
 * ==========================================
 *        FOOTER ANIMATION CONTROLLER
 * ==========================================
 */

const FOOTER_CONFIG = {
    enabled: true,
    // Text for the middle trim-path animation (The "Separator" Event)
    animationText: "COMPOSE ◯ DESIGN ◯ DELIVER",

    // Sentences to scroll ONE BY ONE between animations.
    // The user can add infinite sentences here.
    /*
        HOW TO ADD NEW LINE:
        Add a comma "," after the last line, then add your new text object.
        Example: { text: "MY NEW TEXT HERE", enabled: true }

        HOW TO HIDE/REMOVE:
        Set `enabled: false` on the text line you want to hide.
    */
    scrollItems: [
        // --- Added: MAR 08, 2026 | Topic: CREATIVE CODING ---
        { text: "<span style='background:#00ff00; color:black; padding:0 5px; border-radius: 0 5px 0 5px;'>CREATIVE CODING:</span> MERGING TECHNOLOGY AND ART TO CRAFT IMMERSIVE DIGITAL EXPERIENCES", enabled: true },

        // --- Added: MAR 08, 2026 | Topic: INTERFACE DESIGN ---
        { text: "<span style='background:#00ff00; color:black; padding:0 5px; border-radius: 0 5px 0 5px;'>INTERFACE DESIGN:</span> SCULPTING PIXELS INTO INTUITIVE AND ENGAGING USER JOURNEYS", enabled: true },

        // --- Added: MAR 08, 2026 | Topic: FRONTEND ARCHITECTURE ---
        { text: "<span style='background:#00ff00; color:black; padding:0 5px; border-radius: 0 5px 0 5px;'>FRONTEND ARCHITECTURE:</span> BUILDING SCALABLE AND ROBUST WEBSITES FOR THE MODERN WEB", enabled: true },

        // --- Added: MAR 08, 2026 | Topic: WEB ANIMATION ---
        { text: "<span style='background:#00ff00; color:black; padding:0 5px; border-radius: 0 5px 0 5px;'>WEB ANIMATION:</span> BREATHING LIFE INTO STATIC LAYOUTS WITH FLUID MOTION RESPONSES", enabled: true },

        // --- Added: MAR 08, 2026 | Topic: USER EXPERIENCE ---
        { text: "<span style='background:#00ff00; color:black; padding:0 5px; border-radius: 0 5px 0 5px;'>USER EXPERIENCE:</span> EMPATHY DRIVEN DESIGN ENSURING SEAMLESS INTERACTION FOR ALL", enabled: true },

        // --- Added: MAR 08, 2026 | Topic: PERFORMANCE TUNING ---
        { text: "<span style='background:#00ff00; color:black; padding:0 5px; border-radius: 0 5px 0 5px;'>PERFORMANCE TUNING:</span> OPTIMIZING EVERY MILLISECOND TO DELIVER LIGHTNING FAST SPEEDS", enabled: true },

        // --- Added: MAR 08, 2026 | Topic: RESPONSIVE LAYOUTS ---
        { text: "<span style='background:#00ff00; color:black; padding:0 5px; border-radius: 0 5px 0 5px;'>RESPONSIVE LAYOUTS:</span> ADAPTING CONTENT FLUIDLY ACROSS ALL DEVICE SCREENS AND ORIENTATIONS", enabled: true },

        // --- Added: MAR 08, 2026 | Topic: INNOVATION LAB ---
        { text: "<span style='background:#00ff00; color:black; padding:0 5px; border-radius: 0 5px 0 5px;'>INNOVATION LAB:</span> PUSHING THE BOUNDARIES OF BROWSER CAPABILITIES AND AESTHETICS", enabled: true },

        // --- Added: MAR 08, 2026 | Topic: ACCESSIBILITY ---
        { text: "<span style='background:#00ff00; color:black; padding:0 5px; border-radius: 0 5px 0 5px;'>ACCESSIBILITY:</span> ENSURING INCLUSIVE WEB ACCESS FOR USERS OF ALL ABILITIES", enabled: true },

        // --- Added: MAR 08, 2026 | Topic: PROBLEM SOLVING ---
        { text: "<span style='background:#00ff00; color:black; padding:0 5px; border-radius: 0 5px 0 5px;'>PROBLEM SOLVING:</span> TRANSFORMING COMPLEX REQUIREMENTS INTO ELEGANT DIGITAL SOLUTIONS", enabled: true }
    ],

    // Timings
    animationHoldDuration: 1200 // Time for the trim path sequence
};

class FooterAnimator {
    constructor() {
        this.currentIndex = 0;

        // Wait for DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        this.statusBox = document.querySelector('.status-box');
        this.scrollingContent = document.querySelector('.scrolling-content');

        if (!this.statusBox || !this.scrollingContent) {
            console.warn("FooterAnimator: Required elements not found.");
            return;
        }

        if (!FOOTER_CONFIG.enabled) {
            this.statusBox.style.display = 'none';
            return;
        }

        this.startSequence();
    }

    startSequence() {
        console.log("FooterAnimator: Starting Sequence");
        // Start scrolling immediately
        this.playScrollItem();
    }

    updateScrollContent(text) {
        // We duplicate the text to ensure the marquee effect works correctly with translateX(-50%)
        // The first copy scrolls off, the second copy finishes at the start position.
        // This triggers the 'animationiteration' event exactly when the "Loop" finishes.
        const repeatedText = `${text} &nbsp; &nbsp; &nbsp; &nbsp; ${text}`;

        this.scrollingContent.innerHTML = `
            <span class="scrolling-text-item">${repeatedText}</span>
        `;
    }

    playScrollItem() {
        if (!FOOTER_CONFIG.enabled) return;

        // Skip disabled items
        let loopCount = 0;
        let item = FOOTER_CONFIG.scrollItems[this.currentIndex];

        while ((!item || !item.enabled) && loopCount < FOOTER_CONFIG.scrollItems.length) {
            this.currentIndex = (this.currentIndex + 1) % FOOTER_CONFIG.scrollItems.length;
            item = FOOTER_CONFIG.scrollItems[this.currentIndex];
            loopCount++;
        }

        if (loopCount >= FOOTER_CONFIG.scrollItems.length) return; // All disabled

        // 1. Get current text
        const text = item.text;
        console.log(`FooterAnimator: Scrolling Item ${this.currentIndex}: ${text}`);

        // 2. Set Content
        this.updateScrollContent(text);

        // 3. Reset & Start Scroll Animation
        this.scrollingContent.style.display = 'flex';
        this.scrollingContent.classList.remove('hidden-scroll'); // Make visible

        // Reset animation to ensure it starts from 0%
        this.scrollingContent.style.animation = 'none';
        this.scrollingContent.offsetHeight; /* Trigger Reflow */


        this.scrollingContent.style.animation = ''; // Remove inline override to use CSS 6s
        // Wait, if I remove inline, it uses CSS 'scrollText 6s linear infinite'.
        // That is perfect.

        // 4. Listen for completion (One Loop)
        const handleIteration = (e) => {
            if (e.animationName === 'scrollText') {
                console.log("FooterAnimator: Loop Finished (Text reached left border).");
                this.scrollingContent.removeEventListener('animationiteration', handleIteration);

                // Advance Index
                this.currentIndex = (this.currentIndex + 1) % FOOTER_CONFIG.scrollItems.length;

                // Trigger Animation Separator
                this.runTrimPathAnimation();
            }
        };

        this.scrollingContent.addEventListener('animationiteration', handleIteration);
    }

    runTrimPathAnimation() {
        // Phase 2: Show Animation
        console.log("FooterAnimator: Playing Separator Animation");

        // 1. Hide Scroll Logic
        // We pause the animation so it doesn't jump while fading out
        this.scrollingContent.style.animationPlayState = 'paused';
        this.scrollingContent.classList.add('hidden-scroll'); // Opacity 0

        // After fade out (0.5s), hide display
        setTimeout(() => {
            this.scrollingContent.style.display = 'none';
        }, 500);

        // 2. Insert Animation UI
        const animContainer = document.createElement('div');
        animContainer.className = 'footer-anim-container';

        animContainer.innerHTML = `
            <div class="rush-line"></div>
            <div class="trim-wrapper">
                <svg class="trim-svg" viewBox="0 0 300 30">
                    <text x="50%" y="19" text-anchor="middle" class="trim-text">${FOOTER_CONFIG.animationText}</text>
                </svg>
            </div>
        `;

        this.statusBox.appendChild(animContainer);

        // 3. Wait for Animation to complete, then Resume
        setTimeout(() => {
            // Fade out animation container
            animContainer.style.opacity = '0';

            setTimeout(() => {
                // Remove container
                if (animContainer.parentNode) animContainer.parentNode.removeChild(animContainer);

                // Resume Scrolling (Next Item)
                this.playScrollItem();
            }, 500);

        }, FOOTER_CONFIG.animationHoldDuration);
    }
}

// Start
new FooterAnimator();
