/**
 * FILE: Updates/work-status.js
 * PURPOSE: Configuration for the "Work Status" loop in the header (Works Page).
 * 
 * INSTRUCTIONS:
 * - Set WORK_STATUS_DATA.enabled = false to hide the entire section.
 */

const WORK_STATUS_DATA = {
    enabled: true,
    // interval: Time in milliseconds to toggle between "WORKS" and "STATUS"
    interval: 5000,

    // Text Lines
    topText: "REMOTE: CURRENTLY WORKING @",
    bottomText: "SINCE NOW ENTERTAINMENTS",

    // The pulsing green dot
    dotColor: "#00ff00"
};
