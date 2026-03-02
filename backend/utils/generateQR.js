import QRCode from "qrcode";

/**
 * Generates QR code as Base64 image
 * @param {string} qrIdentifier - Unique UUID stored in DB
 * @returns {string} Base64 QR image
 */
export const generateQR = async (qrIdentifier) => {
  try {
    // ✅ Store plain UUID (NOT JSON)
    const qrImage = await QRCode.toDataURL(qrIdentifier, {
      errorCorrectionLevel: "H",
      type: "image/png",
      margin: 2,
      width: 300
    });

    return qrImage;

  } catch (error) {
    console.error("QR generation error:", error);
    throw new Error("QR generation failed");
  }
};