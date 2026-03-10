// Updates/music-playlist.js
// Configuration for Local Music Playlist
// Add your own MP3 files in the 'Music' folder and list them here.

/*
    INSTRUCTIONS:
    1. Place your .mp3 file in the "Music" folder (create if missing).
    2. Add a new line below in the format: 
       { title: "Song Name", src: "Music/filename.mp3", link: "URL", enabled: true },
    3. Ensure each line ends with a comma ",".

    TO HIDE/REMOVE A SONG:
    Set `enabled: false` on the song object you want to hide.
    You can also turn off the whole playlist by setting PLAYLIST_CONFIG.enabled = false.
*/

window.PLAYLIST_CONFIG = {
    enabled: true,
    autoReconnectFM: true // Set to false to disable auto-switching back to FM when internet restores
};

window.LOCAL_PLAYLIST = [
    { title: "FIGHT BACK", src: "Music/Fight Back.mp3", link: "https://pixabay.com/music/", enabled: true },
    { title: "UFO", src: "Music/UFO.mp3", link: "https://pixabay.com/music/", enabled: true }
];

console.log("Local Playlist Loaded:", window.LOCAL_PLAYLIST);
