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
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalGallery = document.getElementById('modal-gallery');

    // CRITICAL FIX: Save the photos to the global list for fullscreen navigation
    currentPhotoList = photos;

    modalTitle.innerText = title;
    modalDesc.innerHTML = `<i class="fas fa-folder-open" style="color: #6366f1;"></i> documents / ${title} / images <br><br> ${description}`;
    
    modalGallery.innerHTML = '';
    photos.forEach((photoSrc, index) => {
        const img = document.createElement('img');
        img.src = photoSrc;
        img.className = "folder-file-img"; 
        img.onclick = function() { 
            openFullscreen(index); 
        };
        modalGallery.appendChild(img);
    });

    modal.style.display = "block";
    document.body.style.overflow = "hidden"; 
}

function closeProject() {
    document.getElementById('project-modal').style.display = "none";
    document.body.style.overflow = "auto";
}

// Fullscreen Logic
function openFullscreen(index) {
    currentPhotoIndex = index;
    const overlay = document.getElementById('fullscreen-overlay');
    const fullImg = document.getElementById('fullscreen-img');
    const fullVid = document.getElementById('fullscreen-video');
    const src = currentPhotoList[index];

    // Toggle navigation buttons visibility based on list length
    if (currentPhotoList.length <= 1) {
        overlay.classList.add('single-item');
    } else {
        overlay.classList.remove('single-item');
    }

    if (src.toLowerCase().endsWith('.mp4')) {
        fullImg.style.display = "none";
        fullVid.style.display = "block";
        fullVid.src = src;
        fullVid.play();
    } else {
        fullVid.style.display = "none";
        fullVid.pause();
        fullImg.style.display = "block";
        fullImg.src = src;
    }
    
    overlay.style.display = "flex";
}

function navigateFullscreen(dir) {
    if (currentPhotoList.length <= 1) return;
    currentPhotoIndex = (currentPhotoIndex + dir + currentPhotoList.length) % currentPhotoList.length;
    openFullscreen(currentPhotoIndex);
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

// Video Card Controls
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

function stopCardVideo(btn) {
    const container = btn.closest('.project-item');
    const video = container.querySelector('.project-video');
    video.pause();
    video.currentTime = 0;
    container.classList.remove('playing');
}

function triggerFullscreenFromBtn(event, btn) {
    event.stopPropagation(); 
    const container = btn.closest('.project-item');
    const cardVideo = container.querySelector('.project-video');
    const videoSrc = cardVideo.querySelector('source').src;

    // Use a temporary list for single video fullscreen
    currentPhotoList = [videoSrc];
    openFullscreen(0);
}

function changeVolume(slider) {
    const video = slider.closest('.project-item').querySelector('.project-video');
    video.volume = slider.value;
    if (slider.value > 0) video.muted = false;
    const icon = slider.closest('.project-item').querySelector('#mute-icon');
    icon.className = slider.value == 0 ? "fas fa-volume-mute" : "fas fa-volume-up";
}

function toggleMute(btn) {
    const video = btn.closest('.project-item').querySelector('.project-video');
    video.muted = !video.muted;
    btn.querySelector('i').className = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
}

document.getElementById('email-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Change the button text to show it's sending
    const btn = this.querySelector('button');
    const originalText = btn.innerHTML;
    btn.innerText = "Sending...";
    btn.disabled = true;

    // These IDs come from your EmailJS dashboard
    const serviceID = 'service_1xsp56q';
    const templateID = 'template_aeeb2dt';

    emailjs.sendForm(serviceID, templateID, this)
        .then(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            alert('Message sent successfully!');
            this.reset(); // Clears the form
        }, (err) => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            alert('Failed to send message. Please try again.');
            console.error("EmailJS Error:", err);
        });
});
// Create the glow element
const cursorGlow = document.createElement('div');
cursorGlow.className = 'cursor-glow';
document.body.appendChild(cursorGlow);

// Move the glow with mouse
document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});