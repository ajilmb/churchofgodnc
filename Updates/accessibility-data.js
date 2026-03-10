const ACCESSIBILITY_CONFIG = {
    enabled: true, // Master toggle for the accessibility feature

    categories: [
        {
            id: "visual",
            title: "Visual Settings",
            items: [
                { id: "reset", label: "Reset All Settings", type: "button", action: "resetAll", enabled: true },
                { id: "textSize", label: "Text Resizing", type: "stepper", action: "handleTextSize", enabled: true },
                { id: "monochrome", label: "Monochrome / Grayscale", type: "toggle", action: "toggleGrayscale", enabled: true },
                { id: "darkMode", label: "Dark Mode / Invert Colors", type: "toggle", action: "toggleInvert", enabled: true },
                { id: "colorContrast", label: "High Color Contrast", type: "toggle", action: "toggleContrast", enabled: true },
                { id: "highlightLinks", label: "Highlight All Links", type: "toggle", action: "toggleLinks", enabled: true },
                { id: "highlightHeadings", label: "Highlight Headings", type: "toggle", action: "toggleHeadings", enabled: true },
                { id: "imageHide", label: "Hide All Images", type: "toggle", action: "toggleImageHide", enabled: true }
            ]
        },
        {
            id: "interaction",
            title: "Interaction & Tools",
            items: [
                { id: "readAloud", label: "Read Aloud (Mouse Point)", type: "toggle", action: "toggleReadAloud", enabled: true },
                { id: "stopAnimations", label: "Stop All Animations", type: "toggle", action: "toggleAnims", enabled: true },
                { id: "muteSounds", label: "Mute All Sounds", type: "toggle", action: "toggleMute", enabled: true },
                { id: "virtualKeyboard", label: "Virtual Keyboard", type: "button", action: "toggleVKeyboard", enabled: true }
            ]
        }
    ]
};
