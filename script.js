const download = document.querySelector(".download");
const dark = document.querySelector(".dark");
const light = document.querySelector(".light");
const qrContainer = document.querySelector("#qr-code");
const qrTextInputs = document.querySelectorAll(".qr-text");
const shareBtn = document.querySelector(".share-btn");
const sizes = document.querySelector(".sizes");

dark.addEventListener("input", handleDarkColor);
light.addEventListener("input", handleLightColor);
qrTextInputs.forEach(input => input.addEventListener("input", handleQRText));
sizes.addEventListener("change", handleSize);
shareBtn.addEventListener("click", handleShare);

const defaultUrl = "https://github.com/Zakaria-Achgar/Zikovitch-website";
let colorLight = "#fff",
  colorDark = "#000",
  text = defaultUrl,
  size = 300;

function handleDarkColor(e) {
  colorDark = e.target.value;
  generateQRCode();
}

function handleLightColor(e) {
  colorLight = e.target.value;
  generateQRCode();
}

function handleQRText() {
  const values = [];
  qrTextInputs.forEach(input => {
    if (input.value) {
      values.push(input.value);
    }
  });
  text = values.length ? values.join("\n") : defaultUrl;
  generateQRCode();
}

async function generateQRCode() {
  qrContainer.innerHTML = "";
  const qrcode = new QRCode(qrContainer, {
    text,
    height: size,
    width: size,
    colorLight,
    colorDark
  });
  download.href = await resolveDataUrl(qrcode);
}

async function handleShare() {
  setTimeout(async () => {
    try {
      const qrcode = new QRCode(qrContainer, {
        text,
        height: size,
        width: size,
        colorLight,
        colorDark
      });
      const base64url = await resolveDataUrl(qrcode);
      const blob = await (await fetch(base64url)).blob();
      const file = new File([blob], "QRCode.png", {
        type: blob.type
      });
      await navigator.share({
        files: [file],
        title: text
      });
    } catch (error) {
      alert("Your browser doesn't support sharing.");
    }
  }, 100);
}

function handleSize(e) {
  size = parseInt(e.target.value);
  generateQRCode();
}

function resolveDataUrl(qrcode) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const canvas = qrcode._oDrawing._el;
      resolve(canvas.toDataURL());
    }, 50);
  });
}

generateQRCode();
