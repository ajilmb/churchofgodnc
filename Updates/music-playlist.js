// Updates/music-playlist.js
// Configuration for Local Music Playlist
// Add your own MP3 files in the 'Music' folder and list them here.

/*
    INSTRUCTIONS:
    1. Place your .mp3 file in the "Music" folder (create if missing).
    2. Add a new line below in the format: 
       { title: "Song Name", src: "Music/filename.mp3" },
    3. Ensure each line ends with a comma ",".

    TO HIDE/REMOVE A SONG:
    Add "//" at the start of the line.
    Example: // { title: "Hidden Song", src: "..." },
*/

window.LOCAL_PLAYLIST = [
    { title: "FIGHT BACK", src: "Music/Fight Back.mp3" },
    { title: "UFO", src: "Music/UFO.mp3" }
];

console.log("Local Playlist Loaded:", window.LOCAL_PLAYLIST);
