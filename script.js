const audioPlayer = document.querySelector('#audio-player');
const trackButtons = [...document.querySelectorAll('.track-select')];
const trackRows = [...document.querySelectorAll('[data-track-row]')];
const likeButtons = [...document.querySelectorAll('.like-button')];
const navLinks = [...document.querySelectorAll('.nav-link[data-view]')];
const nowPlayingCover = document.querySelector('#now-playing-cover');
const nowPlayingTitle = document.querySelector('#now-playing-title');
const nowPlayingArtist = document.querySelector('#now-playing-artist');
const playButton = document.querySelector('#toggle-playback');
const previousButton = document.querySelector('#previous-track');
const nextButton = document.querySelector('#next-track');
const progressSlider = document.querySelector('#track-progress');
const currentTimeLabel = document.querySelector('#current-time');
const durationLabel = document.querySelector('#track-duration');
const tracksKicker = document.querySelector('#tracks-kicker');
const tracksTitle = document.querySelector('#tracks-title');
const trackCount = document.querySelector('#track-count');
const emptyLibrary = document.querySelector('#empty-library');

let currentTrackIndex = -1;
let currentView = 'home';
const likedTracks = new Set();

function formatTime(seconds) {
	if (!Number.isFinite(seconds)) return '0:00';
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
	return `${minutes}:${remainingSeconds}`;
}

function updatePlaybackButton() {
	const isPlaying = !audioPlayer.paused;
	playButton.textContent = isPlaying ? 'Ⅱ' : '▶';
	playButton.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
	playButton.title = isPlaying ? 'Pause' : 'Play';
}

function updateTimeline() {
	const duration = audioPlayer.duration;
	const currentTime = audioPlayer.currentTime || 0;
	currentTimeLabel.textContent = formatTime(currentTime);
	durationLabel.textContent = formatTime(duration);
	progressSlider.value = Number.isFinite(duration) && duration > 0
		? Math.round((currentTime / duration) * Number(progressSlider.max))
		: 0;
	const progress = Number(progressSlider.value) / Number(progressSlider.max) * 100;
	progressSlider.style.setProperty('--progress', `${progress}%`);

	if (currentTrackIndex !== -1 && Number.isFinite(duration)) {
		trackButtons[currentTrackIndex].querySelector('.track-duration').textContent = formatTime(duration);
	}
}

function updateLibrary() {
	trackRows.forEach((row, index) => {
		row.hidden = currentView === 'library' && !likedTracks.has(index);
	});
	emptyLibrary.hidden = currentView !== 'library' || likedTracks.size > 0;
	const visibleCount = currentView === 'library' ? likedTracks.size : trackButtons.length;
	trackCount.textContent = `${visibleCount} TRACK${visibleCount === 1 ? '' : 'S'}`;
}

function showView(view) {
	currentView = view;
	document.body.classList.toggle('library-view', view === 'library');
	tracksKicker.textContent = view === 'library' ? 'SAVED SONGS' : 'PICKED FOR YOU';
	tracksTitle.textContent = view === 'library' ? 'Your library' : 'On rotation';
	navLinks.forEach((link) => {
		const isActive = link.dataset.view === view;
		link.classList.toggle('active', isActive);
		if (isActive) link.setAttribute('aria-current', 'page');
		else link.removeAttribute('aria-current');
	});
	updateLibrary();
}

function toggleLike(index) {
	const likeButton = likeButtons[index];
	const trackName = trackButtons[index].dataset.title;
	const isLiked = likedTracks.has(index);

	if (isLiked) likedTracks.delete(index);
	else likedTracks.add(index);

	likeButton.classList.toggle('is-liked', !isLiked);
	likeButton.textContent = isLiked ? '♡' : '♥';
	likeButton.setAttribute('aria-pressed', String(!isLiked));
	likeButton.setAttribute('aria-label', `${isLiked ? 'Like' : 'Remove'} ${trackName}${isLiked ? '' : ' from Your library'}`);
	likeButton.title = likeButton.getAttribute('aria-label');
	updateLibrary();
}

async function startPlayback() {
	try {
		await audioPlayer.play();
	} catch (error) {
		updatePlaybackButton();
		if (error.name !== 'AbortError') {
			nowPlayingArtist.textContent = 'Audio could not be loaded';
		}
	}
}

function selectTrack(index) {
	const trackButton = trackButtons[index];
	const cover = trackButton.querySelector('.cover');

	currentTrackIndex = index;
	audioPlayer.src = `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${index + 1}.mp3`;
	audioPlayer.load();

	nowPlayingTitle.textContent = trackButton.dataset.title;
	nowPlayingArtist.textContent = trackButton.dataset.artist;
	nowPlayingCover.className = `mini-cover ${[...cover.classList].find((name) => name.startsWith('cover-'))}`;
	nowPlayingCover.innerHTML = cover.innerHTML;
	trackButtons.forEach((button, buttonIndex) => {
		button.classList.toggle('is-current', buttonIndex === index);
		button.setAttribute('aria-current', buttonIndex === index ? 'true' : 'false');
	});
	trackButton.querySelector('.track-duration').textContent = '--:--';
	progressSlider.disabled = false;
	audioPlayer.currentTime = 0;
	updateTimeline();
	startPlayback();
}

trackButtons.forEach((button, index) => {
	button.addEventListener('click', () => {
		if (index === currentTrackIndex && !audioPlayer.paused) return;
		selectTrack(index);
	});
});

likeButtons.forEach((button, index) => {
	button.addEventListener('click', () => toggleLike(index));
});

navLinks.forEach((link) => {
	link.addEventListener('click', (event) => {
		event.preventDefault();
		showView(link.dataset.view);
	});
});

playButton.addEventListener('click', () => {
	if (currentTrackIndex === -1) {
		selectTrack(0);
	} else if (audioPlayer.paused) {
		startPlayback();
	} else {
		audioPlayer.pause();
	}
});

nextButton.addEventListener('click', () => {
	selectTrack((currentTrackIndex + 1) % trackButtons.length);
});

previousButton.addEventListener('click', () => {
	const index = currentTrackIndex === -1 ? 0 : (currentTrackIndex - 1 + trackButtons.length) % trackButtons.length;
	selectTrack(index);
});

progressSlider.addEventListener('input', () => {
	if (Number.isFinite(audioPlayer.duration)) {
		audioPlayer.currentTime = Number(progressSlider.value) / Number(progressSlider.max) * audioPlayer.duration;
	}
});

audioPlayer.addEventListener('timeupdate', updateTimeline);
audioPlayer.addEventListener('loadedmetadata', updateTimeline);
audioPlayer.addEventListener('durationchange', updateTimeline);
audioPlayer.addEventListener('play', updatePlaybackButton);
audioPlayer.addEventListener('pause', updatePlaybackButton);
audioPlayer.addEventListener('ended', () => {
	selectTrack((currentTrackIndex + 1) % trackButtons.length);
});
audioPlayer.addEventListener('error', () => {
	updatePlaybackButton();
	nowPlayingArtist.textContent = 'Audio could not be loaded';
});

updatePlaybackButton();
updateTimeline();
updateLibrary();
