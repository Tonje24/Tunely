# Tunely

Tunely is a lightweight music player that brings a small, curated playlist into a clean, responsive listening interface. It runs directly in your browser and is built with HTML, CSS, and vanilla JavaScript; no framework or build step is required.

## Features

- Play five sample tracks with play/pause, next, and previous controls.
- View the current track and duration, and seek through playback with the progress slider.
- Like or unlike tracks with the heart button.
- Browse liked tracks in **Your library**, with an empty state when no songs are saved.
- Use the responsive dark-themed interface on desktop and mobile.

Audio is streamed from SoundHelix. An active internet connection is required to listen to tracks.

## Getting Started

Clone the repository and open the project folder:

```sh
git clone https://github.com/Tonje24/Tunely.git
cd Tunely
```

Open `index.html` in a web browser. Alternatively, in Visual Studio Code, install the **Live Server** extension, open the Tunely folder, then right-click `index.html` and select **Open with Live Server**.

There are no dependencies to install or build commands to run.

## Usage

- Select a song in the list to start playback. The player bar shows its title and artist.
- Use the play/pause button to control the current track. Previous and next move through the playlist.
- Drag or click the progress slider to seek within the current song.
- Select a heart to like a song; it fills green. Select it again to unlike the song.
- Open **Your library** in the sidebar to see only liked songs. Use **Home** to return to the full playlist.
