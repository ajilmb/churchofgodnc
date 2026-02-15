// Updates/ad-popup.js
// Purpose: Content for the "Startup Ad Popup"
// This file can be updated to change the Ad Image/Link without touching index.html

/*
    INSTRUCTIONS:
    1. Update the 'href' in the <a> tag to change the destination link.
    2. Update the 'src' in the <img> tag to change the ad image.
    3. Ensure the image is square (1:1) for best results.

    -------------------------------------------------------------
    HOW TO HIDE / DISABLE POPUP:
    -------------------------------------------------------------
    To stop the popup from showing, add "//" (two slashes) at the start of the last line:
    
    // document.body.insertAdjacentHTML('beforeend', adPopupHTML);
    
    (This "comments out" the code so it won't run).
*/

const adPopupHTML = `
<!-- POPUP AD BOX -->
<div id="popupAd" class="popup-overlay hidden-popup">
    <div class="popup-box">
        <!-- Window Controls -->
        <div class="window-controls">
            <button id="closePopupBtn" class="window-btn close-drive-btn"><span class="close-icon-x">X</span></button>
        </div>

        <!-- Content Wrapper -->
        <div class="popup-content-wrapper">
            <!-- 1:1 IMAGE HREF -->
            <a href="https://google.com" target="_blank" class="popup-image-link">
                <img src="Images/me.png" alt="Ad" class="popup-image-content">
            </a>
        </div>
    </div>
</div>
`;

// Inject into DOM
//document.body.insertAdjacentHTML('beforeend', adPopupHTML);
console.log("Ad Popup Loaded from Updates/ad-popup.js");
