# Report: Live Insect Taskbar Icon

## Objective
Replace the static taskbar icon for the "Insect AI" with the animated "Cyber Fly" visual when minimized.

## Changes Made

### 1. `style.css`

**Added**: Line 2521
```css
/* --- Taskbar Insect Icon Override --- */
.cyber-fly.taskbar-icon {
    position: absolute;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    margin: 0;
    pointer-events: none; /* Let clicks pass to taskbar item */
    animation: glitch-opacity 0.2s steps(2) infinite; /* Keep glitch */
}

/* Hide buzz text in taskbar */
.cyber-fly.taskbar-icon .buzz-text {
    display: none !important;
}

/* --- Fixed Flight Animation (Transition) --- */
.cyber-fly.fixed-flight {
    position: fixed !important;
    z-index: 9999 !important;
    pointer-events: none;
    margin: 0;
    transition: top 0.8s ease-in-out, left 0.8s ease-in-out, transform 0.5s linear;
}
```

### 2. `script.js`

**Added**: Helper Function `animateFlyTransfer` (Line 2241)
```javascript
// --- INSECT FLIGHT ANIMATION HELPER ---
function animateFlyTransfer(startX, startY, endX, endY, callback) {
    // ... [See script.js for full implementation] ...
    // Creates temporary .cyber-fly.fixed-flight element and animates it
}
```

**Modified**: `minimizeInsectModal` function (Lines 2268-2325)
- Added logic to calculate Start/End coordinates.
- Added call to `animateFlyTransfer`.
- Updated `taskItem.innerHTML` to include `.cyber-fly` structure.

**Modified**: `restoreInsectModal` function (Lines 2327-2370)
- Added logic to animate fly back from taskbar to modal.
- Added call to `animateFlyTransfer`.

### 3. `script.js` (Bug Fix: Contact Page Insect)

**Modified**: `renderContact` function (Lines 517-518)
- Added missing initialization call to `moveFly()` which was causing the insect to remain static.
- Added initial position setting (center of container) to prevent animation jump from (0,0).

```javascript
            // Initial Start
            // Set initial position to center to avoid 0,0 jump
            fly.style.left = (container.clientWidth / 2) + 'px';
            fly.style.top = (container.clientHeight / 2) + 'px';
### 4. `script.js` (Feature: Multi-Stage Flight Path)

**Added**: Helper Function `animateMultiStageFlight` (replaces direct call in loop)
- Enables the insect to visit multiple points in sequence.

**Modified**: `minimizeInsectModal` function
- Added "Intelligence Check": Checks if the `#cyberFly` (Contact Page Insect) is currently in the DOM and visible.
- **Paths**:
    - **Friend Exists**: `Start -> Friend Description -> Taskbar`
    - **No Friend**: `Start -> Taskbar` (Direct)
- This creates the requested behavior where the minimized insect visits its friend on the contact page before minimizing to the taskbar.

```javascript
                // --- INTELLIGENCE CHECK: Is there a friend? ---
                const friendFly = document.getElementById('cyberFly'); // Contact page insect
                let flightPath = [];

                if (friendFly && document.body.contains(friendFly) && friendFly.offsetParent !== null) {
                    // Friend exists and is visible!
                    const friendRect = friendFly.getBoundingClientRect();
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
```
**Refinement**: Added a pause/hover effect at the "Friend" location to visually emphasize the visit.
- The insect now buzzes for 0.8s at the intermediate point before continuing to the taskbar.

### 5. `style.css` & `script.js` (Bug Fix: Empty Taskbar Item)

**Problem**: The Keyframe animation `glitch-opacity` was overriding the inline `opacity: 0`, making the insect visible immediately upon creation.
**Fix**:
- **CSS**: Added `.waiting-to-land` class to force `opacity: 0 !important` and `animation: none !important`.
- **JS**: Applied this class on creation and removed it only when the flight animation callback triggers (landing).

```css
/* Ensure it is hidden initially before landing */
.cyber-fly.taskbar-icon.waiting-to-land {
    opacity: 0 !important;
    animation: none !important;
}
```

### 6. `script.js` (Feature: Autonomous Socialization)

**Added**: `initTaskbarInsectBehavior` function
- Gives the taskbar insect a "lifecycle".
- **Behaviors**:
    - **Sit/Blink**: Standard state.
    - **Roam**: Flies outside the taskbar icon border (Range: +/- 35px).
    - **Talk**: Buzzes in place.
- This creates the requested "Live" feel where the insect doesn't just stay inside the border.

**Modified**: `initModalFly` (Contact Page)
- Added **"Social Visit"** logic.
- If the Taskbar Insect exists (minimized), the Contact Insect has a 20% chance to fly down and "visit" it.
- **Sequence**: Fly to Taskbar -> Buzz for 1.5s -> Fly back to Contact Form.

### 7. `script.js` (Bug Fix: Autonomous Behavior)

**Problem**: 
1. **Roaming Clipping**: The taskbar insect's "Roam" behavior was failing because CSS `!important` styles on `.taskbar-icon` (top/left 50%) and potential container cloning/clipping prevented it from moving outside the box.
2. **Low Visit Frequency**: The 20% chance for the Contact Insect to visit was too low to be easily observed.

**Fix**:
- **Roaming Logic**: Switched to a **"Fixed Position Escape"** strategy.
    - When roaming starts, the insect coordinates are calculated relative to the viewport.
    - It switches to `position: fixed`, breaking free from the taskbar item's layout constraints.
    - It animates to a random spot (+/- 60px range), waits, and then flies back to the center before reverting to `position: absolute`.
- **Visit Logic**: Increased the probability of a "Social Visit" from 20% to **60%** per move cycle.

```javascript
                // Switch to FIXED to escape container clipping
                const rect = fly.getBoundingClientRect();
                fly.classList.add('fixed-flight'); 
                fly.style.position = 'fixed';
                // ... (Animate to random screen coordinates) ...
```

### 8. `script.js` (Refinement: Re-parenting Strategy & Blinking)

**Refinement**:
1.  **Re-parenting Strategy**: Per user request to "Not Clone" and ensure the icon border is truly empty, the code now **physically moves** the `.cyber-fly` DOM element.
    -   **Roaming Start**: The element is appended to `document.body` with `position: fixed`, maintaining its visual coordinates but breaking free from the taskbar container.
    -   **Roaming End**: The element flies back and is **re-appended** to the `.taskbar-item` container, resetting its styles to relative positioning.
2.  **Sit & Blink**: Added a blinking effect (toggling opacity) to the "Talk" state and the "Sit" state to make the insect feel more alive and robotic.

```javascript
                // 1. Promote to Body (Fixed)
                fly.classList.add('fixed-flight'); 
                fly.style.position = 'fixed';
                document.body.appendChild(fly); // MOVE it out
                // ... Fly Logic ...
                // ... On Return: taskbarItem.appendChild(fly);
```

### 9. `script.js` (Bug Fix: Ghost Clones & Behavior Refinement)

**Problem**: 
- **Ghost Clones**: The high probability (60%) of "Social Visits" combined with the lack of a "Busy" check allowed multiple contact flies to spawn and visit the taskbar simultaneously, creating "ghosts".
- **Behavior**: User requested strict "Sit and Blink" behavior when inside the taskbar (no flying around inside).

**Fix**:
1.  **Busy Flag**: Added `isVisiting` state to the Contact Insect. It now checks this flag before starting a visit and sets it to `true` during the visit, checking it back to `false` only upon return.
2.  **Probability**: Reduced visit chance to **30%** to prevent chaos.
3.  **Strict Sit**: Adjusted the taskbar insect's decision loop to favor "Sitting" (60%) where it strictly centers itself (`translate(-50%, -50%)`) and blinks, rather than flying around inside the box.

```javascript
// Busy Check
if (isVisiting) return; 

// Strict Sit
if (action < 0.6) {
    fly.style.transform = 'translate(-50%, -50%)'; // Reset to center
    // ... Blink Logic ...
}
```

