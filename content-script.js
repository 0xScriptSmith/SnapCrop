(async () => {
  console.log("SnapCrop content script injected");

  // Create the overlay
  const overlay = document.createElement("div");
  Object.assign(overlay.style, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0, 0, 0, 0.2)",
    cursor: "crosshair",
    zIndex: 9999999
  });
  document.body.appendChild(overlay);

  let startX, startY, endX, endY;
  let selectionBox = document.createElement("div");
  Object.assign(selectionBox.style, {
    position: "fixed",
    border: "2px dashed red",
    background: "rgba(0, 0, 0, 0.0)", // transparent background to avoid red tint
    zIndex: 10000000
  });
  overlay.appendChild(selectionBox);

  overlay.addEventListener("mousedown", (e) => {
    startX = e.clientX;
    startY = e.clientY;
    selectionBox.style.left = `${startX}px`;
    selectionBox.style.top = `${startY}px`;
    selectionBox.style.width = `0px`;
    selectionBox.style.height = `0px`;
  });

  overlay.addEventListener("mousemove", (e) => {
    if (startX === undefined) return;
    endX = e.clientX;
    endY = e.clientY;
    selectionBox.style.left = `${Math.min(startX, endX)}px`;
    selectionBox.style.top = `${Math.min(startY, endY)}px`;
    selectionBox.style.width = `${Math.abs(endX - startX)}px`;
    selectionBox.style.height = `${Math.abs(endY - startY)}px`;
  });

  overlay.addEventListener("mouseup", async (e) => {
    console.log("SnapCrop: Selection finished.");

    // Remove overlay BEFORE capturing screenshot
    overlay.remove();

    // wait ~50ms for overlay to disappear from the screen render
    await new Promise(resolve => setTimeout(resolve, 50));

    console.log("SnapCrop: Sending message to background for screenshot.");

    chrome.runtime.sendMessage(
      { type: "CAPTURE_SCREENSHOT" },
      async (response) => {
        if (!response || !response.screenshot) {
          const errorMsg = response?.error || "Unknown error";
          alert("Failed to capture screenshot.\n" + errorMsg);
          console.error("SnapCrop: capture failed:", errorMsg);
          return;
        }

        console.log("SnapCrop: Screenshot data received, cropping image...");

        const img = new Image();
        img.src = response.screenshot;
        await img.decode();

        const cropX = Math.min(startX, endX) * window.devicePixelRatio;
        const cropY = Math.min(startY, endY) * window.devicePixelRatio;
        const cropWidth = Math.abs(endX - startX) * window.devicePixelRatio;
        const cropHeight = Math.abs(endY - startY) * window.devicePixelRatio;

        console.log("SnapCrop crop area:", cropX, cropY, cropWidth, cropHeight);

        const canvas = document.createElement("canvas");
        canvas.width = cropWidth;
        canvas.height = cropHeight;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          img,
          cropX,
          cropY,
          cropWidth,
          cropHeight,
          0,
          0,
          cropWidth,
          cropHeight
        );

        const blob = await new Promise(resolve =>
          canvas.toBlob(resolve, "image/png")
        );

        if (!blob) {
          alert("SnapCrop: Failed to create cropped image.");
          console.error("SnapCrop: Canvas blob is null.");
          return;
        }

        console.log("SnapCrop: Cropped image created. Attempting clipboard write...");

        try {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob })
          ]);
       //   alert("Screenshot copied to clipboard!");
          console.log("SnapCrop: Screenshot copied to clipboard successfully.");
        } catch (err) {
          console.error("SnapCrop: Clipboard write failed.", err);
          alert("Failed to copy screenshot to clipboard.");
        }
      }
    );
  });
})();
