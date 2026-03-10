/**
 * ==========================================
 *        MY BLOG DATA (FRESH DESIGN)
 * ==========================================
 * 
 *  -------------------------------------------------------------
 *  HOW TO ADD A NEW BLOG POST:
 *  -------------------------------------------------------------
 *  1. Copy an existing code block (starting from "{" and ending with "},").
 *  2. Paste it at the top of the list (after "const BLOG_DATA = [").
 *  3. Update "id", "title", "content", etc.
 *  
 *  -------------------------------------------------------------
 *  HOW TO HIDE A BLOG POST:
 *  -------------------------------------------------------------
 *  Set `enabled: false` on the blog post object you want to hide.
 *  You can also set `enabled: false` in BLOG_CONFIG to hide the entire blog section.
 *  
 *  Example 1: LOCAL BLOG (Standard)
 *  {
 *      id: 1,
 *      enabled: true,
 *      type: "image",
 *      title: "LOCAL ARTICLE TITLE",
 *      category: "DESIGN",
 *      date: "2024-03-08",
 *      media: "Images/blog/your-image.jpg",
 *      source: "local",
 *      preview: "Brief summary of the article...",
 *      content: `<div>Your HTML content here</div>`
 *  },
 *
 *  Example 2: SUBSTACK BLOG (External)
 *  {
 *      id: 2,
 *      enabled: true,
 *      type: "image",
 *      title: "SUBSTACK ARTICLE TITLE",
 *      category: "NEWSLETTER",
 *      date: "2024-03-08",
 *      media: "Images/blog/substack-hero.jpg",
 *      source: "substack",
 *      externalLink: "https://yourname.substack.com/p/your-post",
 *      preview: "This article is on Substack..."
 *  },
 *
 *  Example 3: PREMIUM SUBSTACK (With Badge)
 *  {
 *      id: 3,
 *      enabled: true,
 *      type: "image",
 *      title: "PREMIUM ARTICLE TITLE",
 *      category: "INSIGHTS",
 *      date: "2024-03-08",
 *      media: "Images/blog/premium.jpg",
 *      source: "substack",
 *      isPremium: true, // Shows the PREMIUM badge
 *      externalLink: "https://yourname.substack.com/p/premium-post",
 *      preview: "Exclusive content for subscribers..."
 *  },
 */

const BLOG_CONFIG = {
    enabled: true
};

const BLOG_DATA = [


    // --- Premium Substack---
    {
        id: 104,
        enabled: true,
        type: "image",
        title: "PREMIUM ARTICLE",
        category: "NEWSLETTER",
        date: "STAY TUNED",
        media: "Images/blog/herocoming.jpg",
        source: "substack",
        isPremium: true,
        externalLink: "https://mathewsb.substack.com/",
        preview: "This is a premium Substack article. Click to read more.",
    },
    // --- Added: STAY TUNED | Topic: NEWSLETTER ---
    {
        id: 101,
        enabled: true,
        type: "image",
        title: "SUBSTACK ARTICLE (EXTERNAL)", // Example title
        category: "NEWSLETTER",
        date: "STAY TUNED",
        media: "Images/blog/herocoming.jpg",
        source: "substack", // This will show the Substack Icon
        externalLink: "https://mathewsb.substack.com/", // Provide the actual Substack article link here
        preview: "This article is hosted on Substack. Click to read more.", // Briefly explain
        // No local 'content' needed since we are redirecting using externalLink
    },
    // --- Added: STAY TUNED | Topic: NEWSLETTER ---
    {
        id: 102,
        enabled: true,
        type: "image",
        title: "SUBSTACK ARTICLE (EXTERNAL)", // Example title
        category: "NEWSLETTER",
        date: "STAY TUNED",
        media: "Images/blog/herocoming.jpg",
        source: "substack", // This will show the Substack Icon
        externalLink: "https://mathewsb.substack.com/", // Provide the actual Substack article link here
        preview: "This article is hosted on Substack. Click to read more.", // Briefly explain
        // No local 'content' needed since we are redirecting using externalLink
    },
    // --- Added: STAY TUNED | Topic: UPDATE ---
    {
        id: 103,
        enabled: true,
        type: "image",
        title: "COMING SOON!",
        category: "UPDATE",
        date: "STAY TUNED",
        media: "Images/blog/herocoming.jpg",
        source: "local",
        preview: "We are crafting something amazing. Check back later!",
        content: `
             <div class="blog-intro-text" style="text-align: center; padding: 50px 0;">
                 <h2 style="color: var(--primary-green);">COMING SOON</h2>
                 <p>We are working on some exciting new articles.<br>Please check back soon!</p>
             </div>
         `
    },
    // --- Added: FUTURE | Topic: DRAFT ---
    {
        id: 999,
        enabled: false,
        type: "image",
        title: "HIDDEN DRAFT POST",
        category: "DRAFT",
        date: "FUTURE",
        media: "Images/blog/hero.png",
        preview: "This post is hidden. Set enabled: true to show it.",
        content: `Hidden content`
    },
    // --- Added: DATE | Topic: CATEGORY ---
    {
        id: 1,
        enabled: false,
        type: "image",
        title: "HERO IMAGE IN FULL",
        category: "CATEGORY",
        date: "DATE",
        media: "Images/blog/hero.png",
        preview: "Hero Heading, Category, Subheading, Date.",
        content: `
            <!-- INTRO TEXT -->
            <div class="blog-intro-text">
                <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.<br>
                Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.</p>
            </div>

            <!-- SPLIT SECTION: IMAGE LEFT / TEXT RIGHT -->
            <div class="blog-row">
                <div class="blog-col">
                    <div class="img-wrapper">
                         <img src="Images/blog/02.png" class="blog-content-img" alt="Fig 1.1">
                    </div>
                    <span class="blog-caption">FIG 1.1</span>
                </div>
                <div class="blog-col">
                    <h3>FORMATTING SHOWCASE</h3>
                    <p>This paragraph demonstrates various text styles:</p>
                    
                    <ul>
                        <li>This is a sentence with a <b>Next Line</b>.<br>See, it continues below.</li>
                        <li><b>Bold text</b> for emphasis.</li>
                        <li><i>Italic text</i> for style.</li>
                        <li><u>Underlined text</u> for attention.</li>
                        <li><mark>Highlighted text</mark> pop out.</li>
                        <li>Scientific formulas: H<sub>2</sub>O (Subscript) and E=mc<sup>2</sup> (Superscript).</li>
                    </ul>

                    <p>You can mix them <b><i><u>inside text also show</u></i></b> easily.</p>
                </div>
            </div>

            <!-- SPLIT SECTION: TEXT LEFT / IMAGE RIGHT -->
            <div class="blog-row reverse">
                <div class="blog-col">
                    <div class="img-wrapper">
                        <img src="Images/blog/03.png" class="blog-content-img" alt="Fig 1.2">
                    </div>
                    <span class="blog-caption">FIG 1.2</span>
                </div>
                <div class="blog-col">
                    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.</p>
                </div>
            </div>

            <!-- 2x2 IMAGE GRID -->
            <div class="img-grid-4">
                <div class="img-item">
                    <div class="img-wrapper">
                        <img src="Images/blog/02.png" class="blog-content-img">
                    </div>
                    <span class="blog-caption">FIG 1.1</span>
                </div>
                <div class="img-item">
                    <div class="img-wrapper">
                        <img src="Images/blog/03.png" class="blog-content-img">
                    </div>
                    <span class="blog-caption">FIG 1.1</span>
                </div>
                 <div class="img-item">
                    <div class="img-wrapper">
                        <img src="Images/blog/03.png" class="blog-content-img">
                    </div>
                    <span class="blog-caption">FIG 1.1</span>
                </div>
                <div class="img-item">
                    <div class="img-wrapper">
                        <img src="Images/blog/02.png" class="blog-content-img">
                    </div>
                    <span class="blog-caption">FIG 1.1</span>
                </div>
            </div>

            <!-- CONCLUSION SECTION -->
            <div class="blog-conclusion">
                <h3>CONCLUSION</h3>
                <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam.</p>
            </div>
        `
    },
    // --- Added: JAN 25, 2026 | Topic: DESIGN ---
    {
        id: 2,
        enabled: false,
        type: "image",
        title: "THE ART OF TYPOGRAPHY",
        category: "DESIGN",
        date: "JAN 25, 2026",
        media: "Images/blog/hero.png",
        preview: "Fonts, Pairing, Readability, Hierarchy.",
        content: `
            <!-- INTRO TEXT -->
            <div class="blog-intro-text">
                <p>Typography is the voice of your design. It speaks before the user even reads the text. Choosing the right typeface can define the entire mood of your project.</p>
            </div>

            <!-- SPLIT SECTION: IMAGE LEFT / TEXT RIGHT -->
            <div class="blog-row">
                <div class="blog-col">
                    <div class="img-wrapper">
                         <img src="Images/blog/02.png" class="blog-content-img" alt="Fig 2.1">
                    </div>
                    <span class="blog-caption">FIG 2.1: SERIF VS SANS</span>
                </div>
                <div class="blog-col">
                    <h3>CHOOSING FONTS</h3>
                    <p>When selecting fonts, consider readability and personality:</p>
                    
                    <ul>
                        <li><b>Serif fonts</b> are traditional and reliable.</li>
                        <li><b>Sans-serif fonts</b> are modern and clean.</li>
                        <li><i>Display fonts</i> are best for large headings.</li>
                    </ul>
                </div>
            </div>

            <!-- CONCLUSION SECTION -->
            <div class="blog-conclusion">
                <h3>CONCLUSION</h3>
                <p>Mastering typography takes time, but it is the most robust skill a designer can have.</p>
            </div>
        `
    },
    // --- Added: JAN 20, 2026 | Topic: THEORY ---
    {
        id: 3,
        enabled: false,
        type: "image",
        title: "COLOR PSYCHOLOGY 101",
        category: "THEORY",
        date: "JAN 20, 2026",
        media: "Images/blog/hero.png",
        preview: "Emotions, Palettes, Harmony, Contrast.",
        content: `
            <!-- INTRO TEXT -->
            <div class="blog-intro-text">
                <p>Colors evoke emotions and drive user actions. Understanding color theory is essential for creating effective and aesthetically pleasing designs.</p>
            </div>

            <div class="img-grid-4">
                <div class="img-item">
                    <div class="img-wrapper">
                        <img src="Images/blog/02.png" class="blog-content-img">
                    </div>
                    <span class="blog-caption">WARM TONES</span>
                </div>
                <div class="img-item">
                    <div class="img-wrapper">
                        <img src="Images/blog/03.png" class="blog-content-img">
                    </div>
                    <span class="blog-caption">COOL TONES</span>
                </div>
                 <div class="img-item">
                    <div class="img-wrapper">
                        <img src="Images/blog/03.png" class="blog-content-img">
                    </div>
                    <span class="blog-caption">PASTEL</span>
                </div>
                <div class="img-item">
                    <div class="img-wrapper">
                        <img src="Images/blog/02.png" class="blog-content-img">
                    </div>
                    <span class="blog-caption">NEON</span>
                </div>
            </div>

            <!-- CONCLUSION SECTION -->
            <div class="blog-conclusion">
                <h3>CONCLUSION</h3>
                <p>Use color wisely to guide the user's eye and create the right atmosphere.</p>
            </div>
        `
    },
    // --- Added: JAN 15, 2026 | Topic: UI / UX ---
    {
        id: 4,
        enabled: false,
        type: "image",
        title: "MODERN UI PATTERNS",
        category: "UI / UX",
        date: "JAN 15, 2026",
        media: "Images/blog/hero.png",
        preview: "Bento Grids, Glassmorphism, Dark Mode.",
        content: `
            <!-- INTRO TEXT -->
            <div class="blog-intro-text">
                <p>User Interface design is constantly evolving. From skeletal wireframes to high-fidelity prototypes, staying updated with trends is key.</p>
            </div>

            <!-- SPLIT SECTION: TEXT LEFT / IMAGE RIGHT -->
            <div class="blog-row reverse">
                <div class="blog-col">
                    <div class="img-wrapper">
                        <img src="Images/blog/03.png" class="blog-content-img" alt="Fig 4.1">
                    </div>
                    <span class="blog-caption">FIG 4.1: BENTO UI</span>
                </div>
                <div class="blog-col">
                    <p>Bento grids are excellent for organizing complex information in a digestible, modular way. They work perfectly responsive.</p>
                </div>
            </div>

            <!-- CONCLUSION SECTION -->
            <div class="blog-conclusion">
                <h3>CONCLUSION</h3>
                <p>Trends come and go, but good usability is forever.</p>
            </div>
        `
    },
    // --- Added: JAN 10, 2026 | Topic: DEV ---
    {
        id: 5,
        enabled: false,
        type: "image",
        title: "JAVASCRIPT PERFORMANCE",
        category: "DEV",
        date: "JAN 10, 2026",
        media: "Images/blog/hero.png",
        preview: "Optimization, Async, Memory, DOM.",
        content: `
            <!-- INTRO TEXT -->
            <div class="blog-intro-text">
                <p>Performance is a feature. Optimizing your JavaScript code ensures a smooth 60fps experience for your users, even on mobile devices.</p>
            </div>

            <!-- SPLIT SECTION: IMAGE LEFT / TEXT RIGHT -->
            <div class="blog-row">
                <div class="blog-col">
                    <div class="img-wrapper">
                         <img src="Images/blog/02.png" class="blog-content-img" alt="Fig 5.1">
                    </div>
                    <span class="blog-caption">FIG 5.1: V8 ENGINE</span>
                </div>
                <div class="blog-col">
                    <h3>KEY TIPS</h3>
                    <ul>
                        <li><b>Debounce</b> expensive events like scroll.</li>
                        <li>Use <i>requestAnimationFrame</i> for animations.</li>
                        <li>Avoid layout thrashing.</li>
                    </ul>
                </div>
            </div>

            <!-- CONCLUSION SECTION -->
            <div class="blog-conclusion">
                <h3>CONCLUSION</h3>
                <p>Clean code leads to fast apps. Always profile before you optimize.</p>
            </div>
        `
    },
    // --- Added: STAY TUNED | Topic: UPDATE ---
    {
        id: 0,
        enabled: true,
        type: "image",
        title: "COMING SOON!",
        category: "UPDATE",
        date: "STAY TUNED",
        media: "Images/blog/herocoming.jpg",
        source: "local",
        preview: "We are crafting something amazing. Check back later!",
        content: `
             <div class="blog-intro-text" style="text-align: center; padding: 50px 0;">
                 <h2 style="color: var(--primary-green);">COMING SOON</h2>
                 <p>We are working on some exciting new articles.<br>Please check back soon!</p>
             </div>
         `
    },
];
