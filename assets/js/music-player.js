/**
 * 🎵 Global Music Player — Dashboard Data Madha
 * Spotify-style floating player | localStorage persistence
 * Supports: .mp3, .m4a, .MP3, .M4A
 * Author: Kugatsu-Amorata
 */

(function () {
  'use strict';

  const PLAYLIST_URL = 'assets/music/playlist.json';
  const LS_INDEX     = 'mdp_index';
  const LS_TIME      = 'mdp_time';
  const LS_PLAYING   = 'mdp_playing';

  let playlist      = [];
  let audio         = new Audio();
  let currentIndex  = parseInt(localStorage.getItem(LS_INDEX) || '0', 10);
  let isSeeking     = false;
  let isInitialized = false;

  // Encode path agar nama file dengan spasi bisa dibaca browser
  function encodePath(path) {
    if (!path) return '';
    return path.split('/').map(function(seg) {
      return seg.indexOf('%') !== -1 ? seg : encodeURIComponent(seg);
    }).join('/');
  }

  function injectPlayer() {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');
      #mdp-bar {
        position:fixed; bottom:0; left:0; right:0; z-index:99999;
        height:76px; background:rgba(9,9,13,0.97);
        backdrop-filter:blur(28px) saturate(180%);
        -webkit-backdrop-filter:blur(28px) saturate(180%);
        border-top:1px solid rgba(255,255,255,0.08);
        display:flex; align-items:center; padding:0 24px;
        font-family:'DM Sans',sans-serif;
        box-shadow:0 -10px 48px rgba(0,0,0,0.55);
        transform:translateY(100%);
        transition:transform .5s cubic-bezier(.34,1.56,.64,1);
        user-select:none;
      }
      #mdp-bar.mdp-visible { transform:translateY(0); }
      #mdp-left { display:flex; align-items:center; gap:13px; width:270px; flex-shrink:0; overflow:hidden; }
      #mdp-cover-wrap {
        width:48px; height:48px; border-radius:8px; overflow:hidden;
        flex-shrink:0; background:#1c1c26;
        display:flex; align-items:center; justify-content:center; font-size:22px;
        box-shadow:0 4px 18px rgba(0,0,0,0.55);
      }
      #mdp-cover { width:100%; height:100%; object-fit:cover; display:none; }
      #mdp-cover.mdp-loaded { display:block; }
      #mdp-cover-wrap.mdp-spinning #mdp-cover { animation:mdp-rot 8s linear infinite; }
      @keyframes mdp-rot { to { transform:rotate(360deg); } }
      #mdp-track-info { overflow:hidden; min-width:0; }
      #mdp-title {
        font-family:'Syne',sans-serif; font-size:13px; font-weight:700;
        color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
        max-width:196px; letter-spacing:.01em;
      }
      #mdp-artist {
        font-size:11.5px; font-weight:300; color:rgba(255,255,255,0.38);
        white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
        max-width:196px; margin-top:3px;
      }
      #mdp-err { font-size:10px; color:#ff6b6b; display:none; margin-top:2px;
        white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:196px; }
      #mdp-center { flex:1; display:flex; flex-direction:column; align-items:center; gap:7px; }
      #mdp-controls { display:flex; align-items:center; gap:6px; }
      .mdp-btn {
        background:none; border:none; cursor:pointer; color:rgba(255,255,255,0.65);
        display:flex; align-items:center; justify-content:center; border-radius:50%; padding:6px;
        transition:color .2s, transform .15s, background .2s;
      }
      .mdp-btn:hover { color:#fff; transform:scale(1.13); background:rgba(255,255,255,0.09); }
      .mdp-btn:active { transform:scale(0.94); }
      .mdp-btn svg { display:block; pointer-events:none; }
      #mdp-play-btn {
        width:38px; height:38px; padding:0;
        background:#1DB954; color:#000; border-radius:50%;
        box-shadow:0 2px 14px rgba(29,185,84,.45);
      }
      #mdp-play-btn:hover { background:#1ed760; color:#000; transform:scale(1.08); }
      #mdp-prog-row { display:flex; align-items:center; gap:10px; width:100%; max-width:440px; }
      #mdp-cur, #mdp-tot {
        font-size:10px; color:rgba(255,255,255,0.3);
        font-variant-numeric:tabular-nums; min-width:30px; text-align:center; font-weight:300;
      }
      #mdp-seek {
        flex:1; -webkit-appearance:none; appearance:none;
        height:3px; border-radius:2px; background:rgba(255,255,255,0.14);
        outline:none; cursor:pointer; transition:height .15s;
      }
      #mdp-seek:hover { height:5px; }
      #mdp-seek::-webkit-slider-thumb {
        -webkit-appearance:none; width:12px; height:12px; border-radius:50%;
        background:#fff; cursor:pointer; opacity:0; transition:opacity .2s;
      }
      #mdp-seek:hover::-webkit-slider-thumb { opacity:1; }
      #mdp-seek::-moz-range-thumb { width:12px; height:12px; border-radius:50%; background:#fff; cursor:pointer; border:none; }
      #mdp-right { width:190px; flex-shrink:0; display:flex; align-items:center; justify-content:flex-end; gap:9px; }
      #mdp-vol-wrap { display:flex; align-items:center; gap:8px; }
      #mdp-vol-ico { color:rgba(255,255,255,0.45); cursor:pointer; transition:color .2s; flex-shrink:0; }
      #mdp-vol-ico:hover { color:#fff; }
      #mdp-vol {
        -webkit-appearance:none; appearance:none; width:78px; height:3px;
        border-radius:2px; background:rgba(255,255,255,0.14); outline:none; cursor:pointer; transition:height .15s;
      }
      #mdp-vol:hover { height:5px; }
      #mdp-vol::-webkit-slider-thumb {
        -webkit-appearance:none; width:12px; height:12px; border-radius:50%;
        background:#fff; cursor:pointer; opacity:0; transition:opacity .2s;
      }
      #mdp-vol:hover::-webkit-slider-thumb { opacity:1; }
      #mdp-vol::-moz-range-thumb { width:12px; height:12px; border-radius:50%; background:#fff; cursor:pointer; border:none; }
      .mdp-track-item.mdp-active { background:rgba(29,185,84,0.11)!important; border-left:3px solid #1DB954!important; }
      .mdp-track-item.mdp-active .mdp-track-num { color:#1DB954!important; }
      body { padding-bottom:76px!important; }
      @media(max-width:640px){
        #mdp-bar { padding:0 12px; height:68px; }
        #mdp-left { width:140px; gap:10px; }
        #mdp-title { font-size:12px; max-width:108px; }
        #mdp-artist { display:none; }
        #mdp-right { display:none; }
        #mdp-prog-row { max-width:230px; }
        #mdp-cur, #mdp-tot { display:none; }
      }
    `;
    document.head.appendChild(style);

    const bar = document.createElement('div');
    bar.id = 'mdp-bar';
    bar.innerHTML = `
      <div id="mdp-left">
        <div id="mdp-cover-wrap">
          <img id="mdp-cover" alt="cover" />
          <span id="mdp-emoji">🎵</span>
        </div>
        <div id="mdp-track-info">
          <div id="mdp-title">— Memuat —</div>
          <div id="mdp-artist">Dashboard Data Madha</div>
          <div id="mdp-err"></div>
        </div>
      </div>
      <div id="mdp-center">
        <div id="mdp-controls">
          <button class="mdp-btn" id="mdp-prev-btn" title="Sebelumnya">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>
          </button>
          <button class="mdp-btn" id="mdp-play-btn" title="Play/Pause">
            <svg id="mdp-play-ico" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </button>
          <button class="mdp-btn" id="mdp-next-btn" title="Berikutnya">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zm8.5-6v6h2V6h-2v6z"/></svg>
          </button>
        </div>
        <div id="mdp-prog-row">
          <span id="mdp-cur">0:00</span>
          <input type="range" id="mdp-seek" min="0" max="100" value="0" step="0.1" />
          <span id="mdp-tot">0:00</span>
        </div>
      </div>
      <div id="mdp-right">
        <div id="mdp-vol-wrap">
          <svg id="mdp-vol-ico" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
          </svg>
          <input type="range" id="mdp-vol" min="0" max="100" value="70" step="1" />
        </div>
      </div>
    `;
    document.body.appendChild(bar);
  }

  function fmt(s) {
    if (!s || isNaN(s) || !isFinite(s)) return '0:00';
    return Math.floor(s/60) + ':' + String(Math.floor(s%60)).padStart(2,'0');
  }

  function setGrad(val, el) {
    el.style.background = 'linear-gradient(to right,#1DB954 '+val+'%,rgba(255,255,255,0.14) '+val+'%)';
  }

  function refreshProgress() {
    if (isSeeking || !audio.duration || !isFinite(audio.duration)) return;
    var pct = (audio.currentTime / audio.duration) * 100;
    var seek = document.getElementById('mdp-seek');
    if (seek) { seek.value = pct; setGrad(pct, seek); }
    document.getElementById('mdp-cur').textContent = fmt(audio.currentTime);
    document.getElementById('mdp-tot').textContent = fmt(audio.duration);
  }

  function setPlayIcon(playing) {
    var ico = document.getElementById('mdp-play-ico');
    if (!ico) return;
    ico.innerHTML = playing
      ? '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>'
      : '<path d="M8 5v14l11-7z"/>';
    var wrap = document.getElementById('mdp-cover-wrap');
    if (wrap) wrap.classList.toggle('mdp-spinning', playing);
  }

  function showErr(msg) {
    var el = document.getElementById('mdp-err');
    if (!el) return;
    el.textContent = msg || '';
    el.style.display = msg ? 'block' : 'none';
  }

  function highlightTrack() {
    document.querySelectorAll('.mdp-track-item').forEach(function(el, i) {
      el.classList.toggle('mdp-active', i === currentIndex);
    });
  }

  function loadTrack(idx, autoPlay) {
    if (!playlist.length) return;
    idx = ((idx % playlist.length) + playlist.length) % playlist.length;
    currentIndex = idx;
    var t = playlist[idx];

    showErr(null);
    audio.src = encodePath(t.file);
    audio.load();

    document.getElementById('mdp-title').textContent  = t.title  || 'Lagu';
    document.getElementById('mdp-artist').textContent = t.artist || 'Dashboard Data Madha';

    var img   = document.getElementById('mdp-cover');
    var emoji = document.getElementById('mdp-emoji');
    if (t.cover && t.cover.trim()) {
      img.onload  = function() { img.classList.add('mdp-loaded'); emoji.style.display='none'; };
      img.onerror = function() { img.classList.remove('mdp-loaded'); emoji.style.display='block'; };
      img.src = encodePath(t.cover);
    } else {
      img.classList.remove('mdp-loaded');
      emoji.style.display = 'block';
    }

    localStorage.setItem(LS_INDEX, idx);
    localStorage.removeItem(LS_TIME);
    highlightTrack();

    if (autoPlay) {
      audio.play()
        .then(function() { setPlayIcon(true); localStorage.setItem(LS_PLAYING,'1'); })
        .catch(function(e) { showErr('⚠ Gagal putar lagu ini'); setPlayIcon(false); });
    } else {
      setPlayIcon(false);
    }
  }

  function togglePlay() {
    if (!playlist.length) return;
    if (audio.paused) {
      audio.play()
        .then(function() { setPlayIcon(true); localStorage.setItem(LS_PLAYING,'1'); })
        .catch(function() { showErr('⚠ Format tidak didukung browser ini'); setPlayIcon(false); });
    } else {
      audio.pause();
      setPlayIcon(false);
      localStorage.setItem(LS_PLAYING,'0');
    }
  }

  function bindEvents() {
    document.getElementById('mdp-play-btn').addEventListener('click', togglePlay);
    document.getElementById('mdp-next-btn').addEventListener('click', function(){ loadTrack(currentIndex+1,true); });
    document.getElementById('mdp-prev-btn').addEventListener('click', function(){ loadTrack(currentIndex-1,true); });

    var seek = document.getElementById('mdp-seek');
    seek.addEventListener('mousedown',  function(){ isSeeking=true; });
    seek.addEventListener('touchstart', function(){ isSeeking=true; },{passive:true});
    seek.addEventListener('input', function(){
      if (!audio.duration) return;
      document.getElementById('mdp-cur').textContent = fmt((seek.value/100)*audio.duration);
      setGrad(seek.value, seek);
    });
    seek.addEventListener('change', function(){
      if (audio.duration && isFinite(audio.duration)) audio.currentTime=(seek.value/100)*audio.duration;
      isSeeking=false;
    });

    var vol = document.getElementById('mdp-vol');
    vol.addEventListener('input', function(){ audio.volume=vol.value/100; setGrad(vol.value,vol); });
    audio.volume = vol.value/100;
    setGrad(vol.value, vol);

    audio.addEventListener('timeupdate', function(){ refreshProgress(); if(!isSeeking) localStorage.setItem(LS_TIME,audio.currentTime); });
    audio.addEventListener('loadedmetadata', function(){
      document.getElementById('mdp-tot').textContent = fmt(audio.duration);
      var t = parseFloat(localStorage.getItem(LS_TIME)||'0');
      if (t>1 && t<audio.duration-1) audio.currentTime=t;
    });
    audio.addEventListener('ended', function(){ loadTrack(currentIndex+1,true); });
    audio.addEventListener('error', function(){
      showErr('⚠ Gagal memuat: '+(playlist[currentIndex]&&playlist[currentIndex].title||'lagu'));
      setPlayIcon(false);
    });
  }

  async function init() {
    if (isInitialized) return;
    isInitialized = true;
    injectPlayer();
    bindEvents();
    try {
      var res = await fetch(PLAYLIST_URL);
      if (!res.ok) throw new Error('HTTP '+res.status);
      playlist = await res.json();
      if (!Array.isArray(playlist)||!playlist.length) return;

      setTimeout(function(){
        var bar=document.getElementById('mdp-bar');
        if(bar) bar.classList.add('mdp-visible');
      },350);

      var savedIdx = parseInt(localStorage.getItem(LS_INDEX)||'0',10);
      var validIdx = (savedIdx>=0&&savedIdx<playlist.length)?savedIdx:0;
      var wasPlay  = localStorage.getItem(LS_PLAYING)==='1';

      loadTrack(validIdx, false);
      window.dispatchEvent(new CustomEvent('mdp:ready',{detail:{playlist:playlist}}));
      if (wasPlay) audio.play().then(function(){setPlayIcon(true);}).catch(function(){});
    } catch(e) {
      console.warn('[MDP] Gagal load playlist:', e.message);
    }
  }

  window.MDP = {
    play:        function(){ if(audio.paused) togglePlay(); },
    pause:       function(){ if(!audio.paused) togglePlay(); },
    next:        function(){ loadTrack(currentIndex+1,true); },
    prev:        function(){ loadTrack(currentIndex-1,true); },
    playAt:      function(i){ loadTrack(i,true); },
    getIndex:    function(){ return currentIndex; },
    getPlaylist: function(){ return playlist; },
  };

  if (document.readyState==='loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
