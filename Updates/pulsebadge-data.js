/**
 * FILE: Updates/pulsebadge-data.js
 * PURPOSE: Data Source for the looping pulse badge text.
 *
 * HOW TO USE:
 * - Update 'enabled' to true or false to show/hide specific items.
 * - Add as many text rows as you want to the array.
 */

const PULSEBADGE_CONFIG = {
    enabled: true,         // Toggle the entire pulse badge text loop feature
    speedMs: 3500          // Time per word in milliseconds
};

const PULSEBADGE_DATA = [
    { text: "MERITS", enabled: false },
    { text: "RESUME", enabled: true },
    { text: "ACHIEVEMENTS", enabled: true },
    { text: "APPOINTMENTS", enabled: true },
    { text: "TESTIMONIALS", enabled: false },
    { text: "SUBSTACK", enabled: true },
    { text: "PODCAST", enabled: true }
];

