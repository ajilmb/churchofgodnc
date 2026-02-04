/**
 * FILE: sw.js (Service Worker)
 * PURPOSE: Enables Offline capabilities (PWA) and Caching.
 * 
 * CONNECTED FILES:
 * - Used by: index.html (Registered via script)
 * - Caches: index.html, style.css, script.js, Images/ (Saves these to device)
 * 
 * NOTE: Update `CACHE_NAME` (v1 -> v2) to force users to download new code.
 */

const CACHE_NAME = 'mathews-b-portfolio-v10';

const ASSETS = [
    './',
    './index.html',
    './style.css',
    './modal.css',
    './script.js',
    './pwa-install.js',
    './manifest.json',
    './Images/app-icon.png',
    './Images/favicon.svg'
];

// Install Event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate Event
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
    );
});
