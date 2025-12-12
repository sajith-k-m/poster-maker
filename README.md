# Poster Making Web App

This is a ready-to-use web application for creating posters. Only one thing is needed: the **Blank Template Image**.

## 1. How to Test Locally
1. Simply double-click on `index.html` to open it in your browser.
2. **First Step**: Upload the "Poster Template" (Use a blank version of the poster).
3. **Second Step**: Upload your Photo.
4. **Third Step**: Enter Name, Unit, and DOB.
5. Use the sliders to position the Photo and Text exactly where you want them.
6. Click "Download High Quality" to save the result.

## 2. Dependencies
- **Font**: The app uses "Archivo Black" and "Inter" from Google Fonts. You need an internet connection for the fonts to load correctly.
- **Images**: All processing happens in your browser. No images are uploaded to any server.

## 3. How to Host on GitHub (Free)
Since you want to share this with others via a link, GitHub Pages is the best option.

### Prerequisites
- A GitHub account.

### Steps
1. **Create a New Repository**:
   - Go to [github.com/new](https://github.com/new).
   - Repository Name: `poster-maker` (or anything you differ).
   - Make it **Public**.
   - Click "Create repository".

2. **Upload Files**:
   - In the new repository, click on the **"uploading an existing file"** link.
   - Drag and drop these 3 files from your folder:
     - `index.html`
     - `style.css`
     - `script.js`
   - Click "Commit changes".

3. **Enable Website**:
   - Go to the repository **Settings** tab.
   - On the left sidebar, click **Pages**.
   - Under "Build and deployment", select **Source** -> **Deploy from a branch**.
   - under "Branch", select **main** and folder **/(root)**.
   - Click **Save**.

4. **Done!**
   - Wait about 1-2 minutes.
   - Refresh the page. You will see a link like: `https://your-username.github.io/poster-maker/`.
   - Share this link!

## 4. Optional: Embed the Template
If you don't want users to upload the template every time, you can:
1. Rename your blank template image to `template.png`.
2. Upload it to the GitHub repository with the other files.
3. Edit `script.js` to load it automatically (ask me if you want this change!).
