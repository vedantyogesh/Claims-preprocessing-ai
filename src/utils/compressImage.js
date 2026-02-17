/**
 * Resizes and compresses an image File to a JPEG under the target pixel cap.
 * Returns { base64, mimeType } ready for the Gemini inline_data field.
 *
 * Gemini vision tokens scale with pixel count — keeping the long edge ≤ 1024px
 * cuts token cost by ~95% vs a typical phone photo with no meaningful accuracy loss
 * for text extraction tasks.
 */
const MAX_EDGE_PX = 1024;
const JPEG_QUALITY = 0.82;

export function compressImage(file) {
  return new Promise((resolve, reject) => {
    // PDFs can't be drawn to canvas — pass through as-is
    if (file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = () => resolve({
        base64: reader.result.split(",")[1],
        mimeType: "application/pdf",
      });
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      // Compute scaled dimensions
      let { naturalWidth: w, naturalHeight: h } = img;
      if (w > MAX_EDGE_PX || h > MAX_EDGE_PX) {
        const ratio = Math.min(MAX_EDGE_PX / w, MAX_EDGE_PX / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);

      // toDataURL encodes as data:image/jpeg;base64,...
      const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
      resolve({
        base64: dataUrl.split(",")[1],
        mimeType: "image/jpeg",
      });
    };

    img.onerror = reject;
    img.src = objectUrl;
  });
}
