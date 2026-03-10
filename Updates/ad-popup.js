// Updates/ad-popup.js
// Purpose: Content for the "Startup Ad Popup"
// This file can be updated to change the Ad Image/Link without touching index.html

/*
    INSTRUCTIONS:
    1. Update the 'enabled' configuration to true or false.
    2. Add as many images and links as you want to the AD_POPUP_DATA array.
    3. Ensure images are square (1:1) for best results.
*/

const AD_POPUP_CONFIG = {
    enabled: false,       // Set to true to enable the Ad popup
    loopSpeedMs: 5000     // Loop speed in milliseconds
};

const AD_POPUP_DATA = [
    {
        image: "Images/me.png",
        link: "https://google.com",
        enabled: true
    },
    {
        image: "Images/blog/hero.png",
        link: "https://apple.com",
        enabled: true
    }
];

if (AD_POPUP_CONFIG.enabled) {
    const activeAds = AD_POPUP_DATA.filter(ad => ad.enabled);

    if (activeAds.length > 0) {
        const adPopupHTML = `
<!-- POPUP AD BOX -->
<div id="popupAd" class="popup-overlay hidden-popup">
    <div class="popup-box">
        <!-- Window Controls -->
        <div class="window-controls">
            <button id="closePopupBtn" class="window-btn close-drive-btn"><span class="close-icon-x">X</span></button>
        </div>

        <!-- Content Wrapper -->
        <div class="popup-content-wrapper" style="position: relative;">
            ${activeAds.length > 1 ? `
            <button id="adPopupPrevBtn" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); background: rgba(0, 0, 0, 0.7); color: var(--primary-green, #00ff00); border: 1px solid var(--primary-green, #00ff00); border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10; font-weight: bold; font-family: monospace; transition: all 0.2s; padding-bottom: 2px;">&#10094;</button>
            <button id="adPopupNextBtn" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: rgba(0, 0, 0, 0.7); color: var(--primary-green, #00ff00); border: 1px solid var(--primary-green, #00ff00); border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10; font-weight: bold; font-family: monospace; transition: all 0.2s; padding-bottom: 2px;">&#10095;</button>
            ` : ''}
            <!-- 1:1 IMAGE HREF -->
            <a id="adPopupLink" href="${activeAds[0].link}" target="_blank" class="popup-image-link">
                <img id="adPopupImage" src="${activeAds[0].image}" alt="Ad" class="popup-image-content" style="transition: opacity 0.3s ease-in-out;">
            </a>
        </div>
    </div>
</div>
        `;

        document.body.insertAdjacentHTML('beforeend', adPopupHTML);
        console.log("Ad Popup Loaded from Updates/ad-popup.js");

        if (activeAds.length > 1) {
            let adIndex = 0;
            let loopTimer = null;

            // Wait a small moment to ensure DOM elements are accessible
            setTimeout(() => {
                const linkElement = document.getElementById('adPopupLink');
                const imgElement = document.getElementById('adPopupImage');
                const prevBtn = document.getElementById('adPopupPrevBtn');
                const nextBtn = document.getElementById('adPopupNextBtn');

                function showAd(index) {
                    imgElement.style.opacity = '0';

                    setTimeout(() => {
                        linkElement.href = activeAds[index].link;
                        imgElement.src = activeAds[index].image;
                        imgElement.style.opacity = '1';
                    }, 300);
                }

                function startLoop() {
                    if (loopTimer) clearInterval(loopTimer);
                    loopTimer = setInterval(() => {
                        adIndex = (adIndex + 1) % activeAds.length;
                        showAd(adIndex);
                    }, AD_POPUP_CONFIG.loopSpeedMs);
                }

                if (linkElement && imgElement) {
                    if (prevBtn) {
                        prevBtn.addEventListener('click', (e) => {
                            e.preventDefault(); // Prevent following the ad link
                            e.stopPropagation();
                            adIndex = (adIndex - 1 + activeAds.length) % activeAds.length;
                            showAd(adIndex);
                            startLoop(); // Reset loop timer
                        });
                    }
                    if (nextBtn) {
                        nextBtn.addEventListener('click', (e) => {
                            e.preventDefault(); // Prevent following the ad link
                            e.stopPropagation();
                            adIndex = (adIndex + 1) % activeAds.length;
                            showAd(adIndex);
                            startLoop(); // Reset loop timer
                        });
                    }

                    // Start the automatic loop
                    startLoop();
                }
            }, 100);
        }
    }
}
