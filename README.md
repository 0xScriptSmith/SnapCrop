# SnapCrop
# SnapCrop Chrome Extension

**SnapCrop** is a Chrome extension that lets you select any area of a webpage, take a screenshot, and automatically copy it to your clipboard for easy pasting anywhere.

---

## 🚀 Features

✅ Click the extension icon to start capturing.  
✅ Draw a rectangle around the area you want to capture.  
✅ Screenshot is automatically copied to your clipboard.  
✅ Works on most websites (except some protected pages like DRM video).  
✅ No need to save files manually — just paste!

---

## ⚙️ How It Works

1. Click the SnapCrop icon in your Chrome toolbar.
2. A transparent overlay appears.
3. Drag to select any part of the visible page.
4. The extension:
   - Captures the screen.
   - Crops the image to your selection.
   - Copies the cropped image directly to your clipboard.

You can then paste it into:
- Chat apps
- Documents
- Image editors
- Anywhere that accepts image pasting!

---

## 🔧 Installation

1. Clone this repository:

    ```bash
    git clone https://github.com/YOUR_USERNAME/snapcrop-extension.git
    ```

2. Open Chrome and go to:

    ```
    chrome://extensions/
    ```

3. Enable **Developer Mode** (top right).

4. Click **Load unpacked** and select the folder:

    ```
    snapcrop-extension/
    ```

5. The SnapCrop icon should appear in your toolbar.

---

## 💡 Notes

- Some pages (like YouTube video playback) may block screenshot capture due to DRM restrictions.
- Clipboard access requires a user gesture (e.g. mouse click or drag).
- The extension does not store screenshots permanently—it only copies them to your clipboard.

---

## 🛠️ Project Structure

snapcrop-extension/
├── manifest.json
├── background.js
├── content-script.js
├── icons/
│     └── icon.png
└── README.md
