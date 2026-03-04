let currentPhotoList = [];
let currentPhotoIndex = 0;
let clickTimer = null;

// Page Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
    
    const target = document.getElementById(pageId);
    const link = document.getElementById('link-' + pageId);
    
    if (target) target.classList.add('active');
    if (link) link.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Project Modal Logic
function openProject(title, description, photos) {
    const modal = document.getElementById('project-modal');
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-desc').innerText = description;
    
    currentPhotoList = photos;
    const gallery = document.getElementById('modal-gallery');
    gallery.innerHTML = ''; 

    photos.forEach((src, index) => {
        let element;
        if (src.endsWith('.mp4')) {
            element = document.createElement('video');
            element.src = src;
            element.muted = true;
            element.loop = true;
            element.controls = true;
        } else {
            element = document.createElement('img');
            element.src = src;
            element.onclick = () => openFullscreen(index);
        }
        element.className = "modal-media-item";
        gallery.appendChild(element);
    });

    modal.style.display = "block";
    document.body.style.overflow = "hidden"; 
}

function closeProject() {
    document.getElementById('project-modal').style.display = "none";
    document.body.style.overflow = "auto";
}

// Fullscreen Logic for Photos
function openFullscreen(index) {
    currentPhotoIndex = index;
    const overlay = document.getElementById('fullscreen-overlay');
    const fullImg = document.getElementById('fullscreen-img');
    const fullVid = document.getElementById('fullscreen-video');

    fullVid.style.display = "none";
    fullImg.style.display = "block";
    fullImg.src = currentPhotoList[index];
    overlay.style.display = "flex";
}

// Fullscreen Logic for Videos (Triggered by Double Click)
function openVideoFullscreen(src, vol, muted) {
    const overlay = document.getElementById('fullscreen-overlay');
    const fullVid = document.getElementById('fullscreen-video');
    const fullImg = document.getElementById('fullscreen-img');

    fullImg.style.display = "none";
    fullVid.style.display = "block";
    fullVid.src = src;
    fullVid.volume = vol;
    fullVid.muted = muted;
    
    overlay.style.display = "flex";
    fullVid.play();
}

function closeFullscreen() {
    const overlay = document.getElementById('fullscreen-overlay');
    const video = document.getElementById('fullscreen-video');
    if (video) {
        video.pause();
        video.src = "";
    }
    overlay.style.display = "none";
}

// Video Card Controls (Play, Volume, Mute)
function handleVideoClick(overlay) {
    const container = overlay.closest('.project-item');
    const video = container.querySelector('.project-video');
    
    if (clickTimer === null) {
        clickTimer = setTimeout(() => {
            if (video.paused) {
                video.play();
                video.muted = false;
                container.classList.add('playing');
            } else {
                video.pause();
            }
            clickTimer = null;
        }, 300);
    }
}

function handleVideoDblClick(video) {
    clearTimeout(clickTimer);
    clickTimer = null;
    const src = video.querySelector('source').src;
    openVideoFullscreen(src, video.volume, video.muted);
}
function changeVolume(slider) {
    const video = slider.closest('.project-item').querySelector('.project-video');
    video.volume = slider.value;
    
    // If user moves slider, automatically unmute
    if (slider.value > 0) video.muted = false;
    
    const icon = slider.closest('.project-item').querySelector('#mute-icon');
    icon.className = slider.value == 0 ? "fas fa-volume-mute" : "fas fa-volume-up";
}
function toggleMute(btn) {
    const video = btn.closest('.project-item').querySelector('.project-video');
    video.muted = !video.muted;
    btn.querySelector('i').className = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
}

function stopCardVideo(btn) {
    const container = btn.closest('.project-item');
    const video = container.querySelector('.project-video');
    video.pause();
    video.currentTime = 0;
    container.classList.remove('playing');
}

// Modal closing helpers
window.onclick = (e) => { if (e.target.id === 'project-modal') closeProject(); };

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    const overlay = document.getElementById('fullscreen-overlay');
    if (overlay.style.display === "flex") {
        if (e.key === "ArrowRight") navigatePhotos(1);
        if (e.key === "ArrowLeft") navigatePhotos(-1);
        if (e.key === "Escape") closeFullscreen();
    }
});

function navigatePhotos(dir) {
    currentPhotoIndex = (currentPhotoIndex + dir + currentPhotoList.length) % currentPhotoList.length;
    document.getElementById('fullscreen-img').src = currentPhotoList[currentPhotoIndex];
}
function triggerFullscreenFromBtn(event, btn) {
    // Prevent the click from also triggering the play/pause overlay
    event.stopPropagation(); 
    
    const container = btn.closest('.project-item');
    const cardVideo = container.querySelector('.project-video');
    const videoSrc = cardVideo.querySelector('source').src;
    
    // Capture state
    const currentVol = cardVideo.volume;
    const isMuted = cardVideo.muted;
    const currentTime = cardVideo.currentTime; 

    // STOP the card video immediately to prevent double sound/echo
    cardVideo.pause();
    // Optional: Hide the 'playing' UI on the card since we are going fullscreen
    container.classList.remove('playing');

    // Launch Fullscreen with captured state
    openVideoFullscreen(videoSrc, currentVol, isMuted, currentTime);
}

function openVideoFullscreen(src, vol, muted, time) {
    const overlay = document.getElementById('fullscreen-overlay');
    const fullVid = document.getElementById('fullscreen-video');

    fullVid.src = src;
    fullVid.volume = vol;
    fullVid.muted = muted;
    fullVid.currentTime = time; // Start where we left off
    
    fullVid.style.display = "block";
    overlay.style.display = "flex";
    fullVid.play();
}

// Update the Close function to handle the return
function closeFullscreen() {
    const overlay = document.getElementById('fullscreen-overlay');
    const fullVid = document.getElementById('fullscreen-video');
    
    if (fullVid) {
        fullVid.pause();
        // Optional: If you want the card video to RESUME when closing:
        // const cardVideo = document.querySelector('.project-video');
        // cardVideo.currentTime = fullVid.currentTime;
        // cardVideo.play();
    }
    
    overlay.style.display = "none";
}