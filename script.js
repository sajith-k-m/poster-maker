const canvas = document.getElementById('posterCanvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');
const placeholderMsg = document.getElementById('placeholderText');

// Inputs
// Templates are now auto-loaded, no manual input needed.
const photoInput = document.getElementById('photoInput');
const nameInput = document.getElementById('nameInput');
const unitInput = document.getElementById('unitInput');
const dobInput = document.getElementById('dobInput');

// State
let templateImg = null;
let userPhotoImg = null;

// Hardcoded Layout Configuration based on the provided template
const LAYOUT = {
    // The "Purple Box" area for the photo
    // User's custom manual values for photo
    photo: {
        xType: 'ratio', x: 0.2427,
        yType: 'ratio', y: 0.340,
        wType: 'ratio', w: 0.2349,
        hType: 'ratio', h: 0.331
    },

    // Independent Text Configurations
    // "Name" uses the user's manual values (x: 0.62, y: 0.428)
    name: {
        x: 0.62,
        y: 0.428,
        font: {
            family: '"Archivo Black", sans-serif',
            baseSize: 31,
            color: '#000000'
        }
    },
    // "Unit" - Independent Position & Font
    unit: {
        x: 0.6,
        y: 0.471, // Approximate Y offset for next line
        font: {
            family: '"Archivo Black", sans-serif',
            baseSize: 31,
            color: '#000000'
        }
    },
    // "DOB" - Independent Position & Font
    dob: {
        x: 0.6,
        y: 0.5125, // Approximate Y offset for 3rd line
        font: {
            family: '"Archivo Black", sans-serif',
            baseSize: 31,
            color: '#000000'
        }
    }
};

// --- Event Listeners ---

photoInput.addEventListener('change', handlePhotoUpload);

[nameInput, unitInput, dobInput].forEach(input => {
    input.addEventListener('input', drawPoster);
});

downloadBtn.addEventListener('click', downloadPoster);

// Auto-load default template
window.addEventListener('load', () => {
    const defaultTemplate = new Image();
    defaultTemplate.onload = () => {
        templateImg = defaultTemplate;
        canvas.width = templateImg.width;
        canvas.height = templateImg.height;
        placeholderMsg.style.display = 'none';
        downloadBtn.disabled = false;
        drawPoster();
    };
    // Ensure the file exists in the same directory
    defaultTemplate.src = 'template.jpg';
});


// --- Functions ---

function handleTemplateUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        templateImg = new Image();
        templateImg.onload = () => {
            canvas.width = templateImg.width;
            canvas.height = templateImg.height;
            placeholderMsg.style.display = 'none';
            downloadBtn.disabled = false;
            drawPoster();
        };
        templateImg.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        userPhotoImg = new Image();
        userPhotoImg.onload = () => {
            drawPoster();
        };
        userPhotoImg.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function drawPoster() {
    if (!templateImg) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(templateImg, 0, 0);

    // 1. Draw User Photo into the specific box
    if (userPhotoImg) {
        // Calculate exact pixel values based on canvas size
        const px = canvas.width * LAYOUT.photo.x;
        const py = canvas.height * LAYOUT.photo.y;
        const pw = canvas.width * LAYOUT.photo.w;
        const ph = canvas.height * LAYOUT.photo.h;

        ctx.save();
        // Draw the photo to FILL the box (strech or crop?)
        // Better: Aspect Fill (crop)
        drawImageProp(ctx, userPhotoImg, px, py, pw, ph);
        ctx.restore();
    }

    // 2. Draw Text (using separated configs)
    drawTextDetails();
}

function drawTextDetails() {
    const scaleFactor = canvas.width / 1080;

    // Helper to draw a single text item
    function drawItem(textValue, config) {
        if (!textValue) return;

        const fontSize = config.font.baseSize * scaleFactor;
        ctx.font = `600 ${fontSize}px ${config.font.family}`;
        ctx.fillStyle = config.font.color;
        ctx.textAlign = "left";

        const x = canvas.width * config.x;
        const y = canvas.height * config.y;

        ctx.fillText(textValue, x, y);
    }

    const nameVal = nameInput.value || "";
    const unitVal = unitInput.value || "";
    const dobVal = dobInput.value || "";

    // Draw each item independently
    drawItem(nameVal, LAYOUT.name);
    drawItem(unitVal, LAYOUT.unit);
    drawItem(dobVal, LAYOUT.dob);
}

function downloadPoster() {
    if (!templateImg) {
        alert("Template image not loaded yet. Please wait or refresh.");
        return;
    }
    try {
        const link = document.createElement('a');
        link.download = `poster-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (err) {
        console.error(err);
        alert("Error downloading: " + err.message + "\n\n(If you are running this file locally, browser security might block image saving. Try hosting it or using a local server.)");
    }
}

// Helper: Aspect Fill (Crop)
function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {
    if (arguments.length === 2) {
        x = y = 0;
        w = ctx.canvas.width;
        h = ctx.canvas.height;
    }

    offsetX = typeof offsetX === "number" ? offsetX : 0.5;
    offsetY = typeof offsetY === "number" ? offsetY : 0.5;

    if (offsetX < 0) offsetX = 0;
    if (offsetY < 0) offsetY = 0;
    if (offsetX > 1) offsetX = 1;
    if (offsetY > 1) offsetY = 1;

    var iw = img.width,
        ih = img.height,
        r = Math.min(w / iw, h / ih),
        nw = iw * r,   // new prop. width
        nh = ih * r,   // new prop. height
        cx, cy, cw, ch, ar = 1;

    // decide which gap to fill    
    if (nw < w) ar = w / nw;
    if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  // updated
    nw *= ar;
    nh *= ar;

    // calc source rectangle
    cw = iw / (nw / w);
    ch = ih / (nh / h);

    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;

    // make sure source rectangle is valid
    if (cx < 0) cx = 0;
    if (cy < 0) cy = 0;
    if (cw > iw) cw = iw;
    if (ch > ih) ch = ih;

    // fill image in dest. rectangle
    ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
}
