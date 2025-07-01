window.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const preview = document.getElementById("preview");
  const captureBtn = document.getElementById("captureBtn");
  const downloadLink = document.getElementById("downloadLink");
  const importInput = document.getElementById("importInput");

  const context = canvas.getContext("2d");

  // 🔢 Counter for today’s captures
  let captureCount = 1;

  // 🧠 Get today’s date in yyyy-mm-dd format
  function getTodayDate() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  // 🔁 Preview & Download logic
  function setPreviewAndDownload(dataURL, filename) {
    preview.src = dataURL;
    preview.style.display = "block";

    if (downloadLink) {
      downloadLink.href = dataURL;
      downloadLink.download = filename;
      downloadLink.style.display = "block";
    }
  }

  // 📸 Access camera
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
      video.play();
    })
    .catch((error) => {
      console.error("Error accessing camera:", error);
      alert("Camera access failed: " + error.message);
    });

  // ✅ Capture photo logic
  captureBtn.addEventListener("click", () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataURL = canvas.toDataURL("image/png");

    const today = getTodayDate();
    const id = String(captureCount).padStart(3, "0"); // 001, 002, etc.
    const fileName = `captured-${today}_${id}.png`;
    captureCount++;

    setPreviewAndDownload(dataURL, fileName);
  });

  // ✅ Import photo logic
  importInput.addEventListener("change", () => {
    const file = importInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageDataURL = event.target.result;
      const today = getTodayDate();
      const id = String(captureCount).padStart(3, "0");
      const fileName = `imported-${today}_${id}-${file.name}`;
      captureCount++;

      setPreviewAndDownload(imageDataURL, fileName);
    };

    reader.readAsDataURL(file);
  });
});
