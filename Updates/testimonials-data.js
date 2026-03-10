/**
 * FILE: Updates/testimonials-data.js
 * PURPOSE: Data for Client Testimonials.
 * 
 * INSTRUCTIONS:
 * - Update `enabled: true` to `false` on any item to hide it.
 * - Set TESTIMONIALS_CONFIG.enabled = false to hide the entire section.
 */

const TESTIMONIALS_CONFIG = {
    enabled: true, // Set to true to show testimonials, false to show "Coming Soon"
    message: "TESTIMONIALS: COMING SOON...",
    // Note for Images: The optimal dimension is any square size (e.g., 200x200). 
    // They will automatically securely crop and forcefully display as 30x30px perfect circles.
};

const TESTIMONIALS_DATA = [
    {
        name: "Sarah Johnson",
        designation: "Product Lead @ TechFlow",
        message: "Mathews is one of the most innovative designers I've worked with. His attention to detail is unmatched.",
        socialLink: "https://www.linkedin.com/",
        platform: "linkedin",
        profilePic: "Images/Profiles/sarah.jpg",
        enabled: true
    },
    {
        name: "Arjun Mehta",
        designation: "Founder, Alpha Media",
        message: "The way he integrates brand storytelling into digital interfaces is pure art. Highly recommended!",
        socialLink: "https://www.linkedin.com/",
        platform: "linkedin",
        profilePic: "Images/Profiles/arjun.jpg",
        enabled: false // Example of a disabled individual testimonial
    },
    {
        name: "Elena Rodriguez",
        designation: "Creative Director, Vivid Pixels",
        message: "A true polymath. From motion to code, everything he touches turns into a premium experience.",
        socialLink: "https://www.linkedin.com/",
        platform: "instagram",
        profilePic: "Images/Profiles/elena.jpg",
        enabled: true
    }
];
