/**
 * 🎵 Global Music Player — Dashboard Data Madha
 * Spotify-style floating player with localStorage persistence
 * Author: Kugatsu-Amorata
 */

(function () {
  'use strict';

  // ─── CONFIG ───────────────────────────────────────────────────────────────
  const PLAYLIST_URL = 'assets/music/playlist.json';
  const LS_INDEX     = 'mdp_index';
  const LS_TIME      = 'mdp_time';
  const LS_PLAYING   = 'mdp_playing';

  // ─── STATE ────────────────────────────────────────────────────────────────
  let playlist  = [];
  let audio     = new Audio();
  let currentIndex = parseInt(localStorage.getItem(LS_INDEX) || '0', 10);
  let isSeeking    = false;
  let isInitialized = false;

  // ─── DOM INJECT ───────────────────────────────────────────────────────────
  function injectPlayer() {
    const style = document.createElement('style');
    style.textContent = `
      /* ── IMPORT FONT ── */
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

      /* ── PLAYER SHELL ── */
      #mdp-bar {
        position: fixed;
        bottom: 0; left: 0; right: 0;
        z-index: 99999;
        height: 76px;
        background: rgba(10, 10, 14, 0.96);
        backdrop-filter: blur(24px) saturate(180%);
        -webkit-backdrop-filter: blur(24px) saturate(180%);
        border-top: 1px solid rgba(255,255,255,0.07);
        display: flex;
        align-items: center;
        padding: 0 24px;
        gap: 0;
        font-family: 'DM Sans', sans-serif;
        box-shadow: 0 -8px 40px rgba(0,0,0,0.5);
        transform: translateY(100%);
        transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      #mdp-bar.mdp-visible {
        transform: translateY(0);
      }

      /* ── LEFT: TRACK INFO ── */
      #mdp-left {
        display: flex;
        align-items: center;
        gap: 14px;
        width: 280px;
        flex-shrink: 0;
        overflow: hidden;
      }
      #mdp-cover-wrap {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        overflow: hidden;
        flex-shrink: 0;
        position: relative;
        box-shadow: 0 4px 16px rgba(0,0,0,0.5);
        cursor: pointer;
      }
      #mdp-cover {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }
      #mdp-cover-wrap.spinning #mdp-cover {
        animation: mdp-spin 8s linear infinite;
      }
      @keyframes mdp-spin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
      #mdp-track-info {
        overflow: hidden;
      }
      #mdp-title {
        font-family: 'Syne', sans-serif;
        font-size: 13.5px;
        font-weight: 600;
        color: #fff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 200px;
        letter-spacing: 0.01em;
      }
      #mdp-artist {
        font-size: 11.5px;
        color: rgba(255,255,255,0.4);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 200px;
        margin-top: 2px;
        font-weight: 300;
      }

      /* ── CENTER: CONTROLS ── */
      #mdp-center {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
      }
      #mdp-controls {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .mdp-btn {
        background: none;
        border: none;
        cursor: pointer;
        color: rgba(255,255,255,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: color 0.2s, transform 0.15s, background 0.2s;
        padding: 6px;
        flex-shrink: 0;
      }
      .mdp-btn:hover {
        color: #fff;
        transform: scale(1.12);
        background: rgba(255,255,255,0.08);
      }
      .mdp-btn:active { transform: scale(0.95); }
      .mdp-btn svg { display: block; }

      #mdp-play-btn {
        width: 38px;
        height: 38px;
        background: #1DB954;
        color: #000;
        border-radius: 50%;
        padding: 0;
        box-shadow: 0 2px 12px rgba(29,185,84,0.4);
      }
      #mdp-play-btn:hover {
        background: #1ed760;
        color: #000;
        transform: scale(1.08);
      }

      /* ── PROGRESS ── */
      #mdp-progress-row {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        max-width: 440px;
      }
      #mdp-time-cur, #mdp-time-tot {
        font-size: 10px;
        color: rgba(255,255,255,0.35);
        font-variant-numeric: tabular-nums;
        min-width: 32px;
        text-align: center;
        font-weight: 300;
      }
      #mdp-seek {
        flex: 1;
        -webkit-appearance: none;
        appearance: none;
        height: 4px;
        border-radius: 2px;
        background: rgba(255,255,255,0.15);
        outline: none;
        cursor: pointer;
        transition: height 0.15s;
        position: relative;
      }
      #mdp-seek:hover { height: 6px; }
      #mdp-seek::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #fff;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s;
        box-shadow: 0 0 4px rgba(0,0,0,0.5);
      }
      #mdp-seek:hover::-webkit-slider-thumb { opacity: 1; }
      #mdp-seek::-moz-range-thumb {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #fff;
        cursor: pointer;
        border: none;
      }

      /* ── RIGHT: VOLUME ── */
      #mdp-right {
        width: 200px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 10px;
      }
      #mdp-vol-wrap {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      #mdp-vol-icon {
        color: rgba(255,255,255,0.5);
        cursor: pointer;
        transition: color 0.2s;
        flex-shrink: 0;
      }
      #mdp-vol-icon:hover { color: #fff; }
      #mdp-volume {
        -webkit-appearance: none;
        appearance: none;
        width: 80px;
        height: 4px;
        border-radius: 2px;
        background: rgba(255,255,255,0.15);
        outline: none;
        cursor: pointer;
        transition: height 0.15s;
      }
      #mdp-volume:hover { height: 6px; }
      #mdp-volume::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #fff;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s;
      }
      #mdp-volume:hover::-webkit-slider-thumb { opacity: 1; }
      #mdp-volume::-moz-range-thumb {
        width: 12px; height: 12px;
        border-radius: 50%;
        background: #fff;
        cursor: pointer;
        border: none;
      }

      /* ── ACTIVE TRACK HIGHLIGHT (for music.html) ── */
      .mdp-track-item.mdp-active {
        background: rgba(29,185,84,0.12) !important;
        border-left: 3px solid #1DB954;
      }
      .mdp-track-item.mdp-active .mdp-track-num {
        color: #1DB954 !important;
      }

      /* ── BODY PADDING ── */
      body { padding-bottom: 76px !important; }

      /* ── MOBILE ── */
      @media (max-width: 640px) {
        #mdp-bar { padding: 0 12px; gap: 0; height: 70px; }
        #mdp-left { width: 140px; gap: 10px; }
        #mdp-title { font-size: 12px; max-width: 120px; }
        #mdp-artist { font-size: 10px; }
        #mdp-right { display: none; }
        #mdp-progress-row { max-width: 260px; }
        #mdp-time-cur, #mdp-time-tot { display: none; }
      }
      @media (max-width: 400px) {
        #mdp-left { width: 110px; }
        #mdp-title { max-width: 90px; }
      }
    `;
    document.head.appendChild(style);

    const bar = document.createElement('div');
    bar.id = 'mdp-bar';
    bar.innerHTML = `
      <!-- LEFT -->
      <div id="mdp-left">
        <div id="mdp-cover-wrap">
          <img id="mdp-cover" src="" alt="Cover" />
        </div>
        <div id="mdp-track-info">
          <div id="mdp-title">—</div>
          <div id="mdp-artist">Dashboard Data Madha</div>
        </div>
      </div>

      <!-- CENTER -->
      <div id="mdp-center">
        <div id="mdp-controls">
          <button class="mdp-btn" id="mdp-prev-btn" title="Sebelumnya">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/>
            </svg>
          </button>
          <button class="mdp-btn" id="mdp-play-btn" title="Play/Pause">
            <svg id="mdp-play-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
          <button class="mdp-btn" id="mdp-next-btn" title="Berikutnya">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18l8.5-6L6 6v12zm8.5-6v6h2V6h-2v6z"/>
            </svg>
          </button>
        </div>
        <div id="mdp-progress-row">
          <span id="mdp-time-cur">0:00</span>
          <input type="range" id="mdp-seek" min="0" max="100" value="0" step="0.1" />
          <span id="mdp-time-tot">0:00</span>
        </div>
      </div>

      <!-- RIGHT -->
      <div id="mdp-right">
        <div id="mdp-vol-wrap">
          <svg id="mdp-vol-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
          </svg>
          <input type="range" id="mdp-volume" min="0" max="100" value="70" step="1" />
        </div>
      </div>
    `;
    document.body.appendChild(bar);
  }

  // ─── UTILS ────────────────────────────────────────────────────────────────
  function fmtTime(s) {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const ss = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${ss}`;
  }

  function updateProgressBar() {
    const seek = document.getElementById('mdp-seek');
    if (!seek || isSeeking || !audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    seek.value = pct;
    // gradient fill
    seek.style.background = `linear-gradient(to right, #1DB954 ${pct}%, rgba(255,255,255,0.15) ${pct}%)`;
    document.getElementById('mdp-time-cur').textContent = fmtTime(audio.currentTime);
    document.getElementById('mdp-time-tot').textContent = fmtTime(audio.duration);
  }

  function updateVolumeBar(val) {
    const vol = document.getElementById('mdp-volume');
    if (!vol) return;
    vol.style.background = `linear-gradient(to right, rgba(255,255,255,0.7) ${val}%, rgba(255,255,255,0.15) ${val}%)`;
  }

  function updatePlayIcon(playing) {
    const icon = document.getElementById('mdp-play-icon');
    if (!icon) return;
    if (playing) {
      icon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
    } else {
      icon.innerHTML = '<path d="M8 5v14l11-7z"/>';
    }
    // cover spin
    const wrap = document.getElementById('mdp-cover-wrap');
    if (wrap) wrap.classList.toggle('spinning', playing);
  }

  function highlightActiveTrack() {
    document.querySelectorAll('.mdp-track-item').forEach((el, i) => {
      el.classList.toggle('mdp-active', i === currentIndex);
    });
  }

  // ─── LOAD TRACK ───────────────────────────────────────────────────────────
  function loadTrack(index, autoPlay = false) {
    if (!playlist.length) return;
    index = ((index % playlist.length) + playlist.length) % playlist.length;
    currentIndex = index;
    const track = playlist[currentIndex];

    audio.src = track.file;
    audio.load();

    document.getElementById('mdp-title').textContent    = track.title;
    document.getElementById('mdp-artist').textContent   = track.artist || 'Dashboard Data Madha';
    document.getElementById('mdp-cover').src            = track.cover || 'assets/music/default-cover.jpg';

    localStorage.setItem(LS_INDEX, currentIndex);
    localStorage.removeItem(LS_TIME);
    highlightActiveTrack();

    if (autoPlay) {
      audio.play().then(() => {
        updatePlayIcon(true);
        localStorage.setItem(LS_PLAYING, '1');
      }).catch(() => {});
    } else {
      updatePlayIcon(false);
    }
  }

  function togglePlay() {
    if (!playlist.length) return;
    if (audio.paused) {
      audio.play().then(() => {
        updatePlayIcon(true);
        localStorage.setItem(LS_PLAYING, '1');
      }).catch(() => {});
    } else {
      audio.pause();
      updatePlayIcon(false);
      localStorage.setItem(LS_PLAYING, '0');
    }
  }

  // ─── EVENTS ───────────────────────────────────────────────────────────────
  function bindEvents() {
    document.getElementById('mdp-play-btn').addEventListener('click', togglePlay);
    document.getElementById('mdp-next-btn').addEventListener('click', () => loadTrack(currentIndex + 1, true));
    document.getElementById('mdp-prev-btn').addEventListener('click', () => loadTrack(currentIndex - 1, true));

    // Seek
    const seek = document.getElementById('mdp-seek');
    seek.addEventListener('mousedown', () => { isSeeking = true; });
    seek.addEventListener('touchstart', () => { isSeeking = true; }, {passive: true});
    seek.addEventListener('input', () => {
      if (!audio.duration) return;
      const t = (seek.value / 100) * audio.duration;
      document.getElementById('mdp-time-cur').textContent = fmtTime(t);
      seek.style.background = `linear-gradient(to right, #1DB954 ${seek.value}%, rgba(255,255,255,0.15) ${seek.value}%)`;
    });
    seek.addEventListener('change', () => {
      if (!audio.duration) return;
      audio.currentTime = (seek.value / 100) * audio.duration;
      isSeeking = false;
    });

    // Volume
    const vol = document.getElementById('mdp-volume');
    vol.addEventListener('input', () => {
      audio.volume = vol.value / 100;
      updateVolumeBar(vol.value);
    });
    audio.volume = vol.value / 100;
    updateVolumeBar(vol.value);

    // Audio events
    audio.addEventListener('timeupdate', () => {
      updateProgressBar();
      localStorage.setItem(LS_TIME, audio.currentTime);
    });
    audio.addEventListener('ended', () => {
      loadTrack(currentIndex + 1, true);
    });
    audio.addEventListener('loadedmetadata', () => {
      document.getElementById('mdp-time-tot').textContent = fmtTime(audio.duration);
      // Restore position
      const savedTime = parseFloat(localStorage.getItem(LS_TIME) || '0');
      if (savedTime > 0 && savedTime < audio.duration) {
        audio.currentTime = savedTime;
      }
    });
  }

  // ─── INIT ─────────────────────────────────────────────────────────────────
  async function init() {
    if (isInitialized) return;
    isInitialized = true;

    injectPlayer();
    bindEvents();

    try {
      const res = await fetch(PLAYLIST_URL);
      if (!res.ok) throw new Error('Playlist tidak ditemukan');
      playlist = await res.json();

      if (!playlist.length) return;

      // Show bar
      setTimeout(() => {
        document.getElementById('mdp-bar').classList.add('mdp-visible');
      }, 300);

      // Restore state
      const savedIndex = parseInt(localStorage.getItem(LS_INDEX) || '0', 10);
      const validIndex = savedIndex < playlist.length ? savedIndex : 0;
      const wasPlaying = localStorage.getItem(LS_PLAYING) === '1';

      loadTrack(validIndex, false);

      // Dispatch event so music.html can build its list
      window.dispatchEvent(new CustomEvent('mdp:ready', { detail: { playlist } }));

      // Attempt resume if was playing (browsers may block autoplay)
      if (wasPlaying) {
        audio.play().then(() => updatePlayIcon(true)).catch(() => {});
      }

    } catch (e) {
      console.warn('[MDP] Could not load playlist:', e.message);
    }
  }

  // ─── PUBLIC API ───────────────────────────────────────────────────────────
  window.MDP = {
    play: () => { if (audio.paused) togglePlay(); },
    pause: () => { if (!audio.paused) togglePlay(); },
    next: () => loadTrack(currentIndex + 1, true),
    prev: () => loadTrack(currentIndex - 1, true),
    playAt: (i) => loadTrack(i, true),
    getIndex: () => currentIndex,
    getPlaylist: () => playlist,
  };

  // ─── BOOT ─────────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
