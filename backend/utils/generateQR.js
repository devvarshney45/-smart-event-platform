import QRCode from "qrcode";

/**
 * Generates a secure QR code string (Base64 Image)
 * @param {string} qrIdentifier - Unique UUID stored in DB
 * @returns {string} Base64 QR image
 */
export const generateQR = async (qrIdentifier) => {
  try {
    const qrData = JSON.stringify({
      id: qrIdentifier
    });

    const qrImage = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: "H",
      type: "image/png",
      margin: 2,
      width: 300
    });

    return qrImage;
  } catch (error) {
    throw new Error("QR generation failed");
  }
};