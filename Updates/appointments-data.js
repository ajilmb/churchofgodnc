/**
 * FILE: Updates/appointments-data.js
 * PURPOSE: Configuration for Bookings and Consultations.
 * 
 * INSTRUCTIONS:
 * - Update `enabled: true` to `false` for adpList or topmate to hide those parts.
 * - Set APPOINTMENTS_DATA.enabled = false to hide the entire section.
 */

const APPOINTMENTS_DATA = {
    enabled: true,
    adpList: {
        url: "https://adplist.org/",
        enabled: true, // Set to true to make LIVE, false to FREEZE and mark unavailable
        displayName: "ADPList (Mentorship)"
    },
    topmate: {
        url: "https://topmate.io/",
        enabled: true, // Set to true to make LIVE, false to FREEZE and mark unavailable
        displayName: "Topmate (Consultation)"
    },

    // ADDITIONAL LINKS (5 Dummy things)
    additionalLinks: [
        {
            url: "https://calendly.com/",
            enabled: true,
            displayName: "Calendly (Meeting)"
        },
        {
            url: "https://gumroad.com/",
            enabled: true,
            displayName: "Gumroad (Products)"
        },
        {
            url: "https://buymeacoffee.com/",
            enabled: true,
            displayName: "Buy Me a Coffee"
        },
        {
            url: "https://patreon.com/",
            enabled: true,
            displayName: "Patreon (Support)"
        },
        {
            url: "https://ko-fi.com/",
            enabled: true,
            displayName: "Ko-fi (Tips)"
        }
    ],

    // Message to show when one of the above is 'frozen'
    disabledMessage: "CURRENTLY TAKING A BREAK FROM NEW BOOKINGS. FEEL FREE TO CHAT WITH MY AI ASSISTANT OR LEAVE A MESSAGE BELOW.",

    // The "Right Now" available message box / button callback (Integrated with Buzz AI)
    messageBoxText: "OPEN CHAT BOX",
    messageBoxAvailable: true
};
