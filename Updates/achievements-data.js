/**
 * FILE: Updates/achievements-data.js
 * PURPOSE: Data for Awards and Achievements.
 * 
 * INSTRUCTIONS:
 * - Update `enabled: true` to `false` on any item to hide it.
 * - Set ACHIEVEMENTS_CONFIG.enabled = false to hide the entire section.
 */

const ACHIEVEMENTS_CONFIG = {
    enabled: true, // Set to true to show achievements, false to show "Coming Soon"
    message: "AWARDS & ACHIEVEMENTS: COMING SOON..."
};

const ACHIEVEMENTS_DATA = [
    {
        title: "Behance Featured - UI/UX Design",
        year: "2024",
        link: "https://www.behance.net/gallery/123456",
        enabled: true
    },
    {
        title: "Awwwards Honorable Mention",
        year: "2023",
        link: "https://www.awwwards.com/",
        enabled: true
    },
    {
        title: "Indigo Design Award - Silver",
        year: "2023",
        link: "https://www.indigoaward.com/",
        enabled: true
    },
    {
        title: "The Dot Awards - Site of the Day",
        year: "2022",
        link: "https://www.thedotawards.com/",
        enabled: false // Example set to false to demonstrate specific hiding
    },
    {
        title: "CSS Design Awards - Special Kudos",
        year: "2022",
        link: "https://www.cssdesignawards.com/",
        enabled: true
    }
];
