import PDFDocument from "pdfkit";
import QRCode from "qrcode";

export const generateCertificate = async (user, event, certId) => {

  return new Promise(async (resolve) => {

    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margin: 0
    });

    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));

    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });

    const width = doc.page.width;
    const height = doc.page.height;

    /* Background */

    doc.rect(0, 0, width, height).fill("#f9fafb");

    /* Gold Border */

    doc.lineWidth(10)
       .strokeColor("#d4af37")
       .rect(30, 30, width - 60, height - 60)
       .stroke();

    doc.lineWidth(2)
       .strokeColor("#f5d67b")
       .rect(50, 50, width - 100, height - 100)
       .stroke();

    /* Title */

    doc.font("Helvetica-Bold")
       .fontSize(40)
       .fillColor("#111827")
       .text(
         "CERTIFICATE OF PARTICIPATION",
         0,
         100,
         { align: "center" }
       );

    /* Subtitle */

    doc.font("Helvetica")
       .fontSize(20)
       .fillColor("#6b7280")
       .text(
         "This certificate is proudly presented to",
         0,
         230,
         { align: "center" }
       );

    /* Name */

    doc.font("Helvetica-Bold")
       .fontSize(42)
       .fillColor("#2563eb")
       .text(
         user.name.toUpperCase(),
         0,
         280,
         { align: "center" }
       );

    /* Event */

    doc.font("Helvetica")
       .fontSize(20)
       .fillColor("#374151")
       .text(
         "For successfully attending the event",
         0,
         350,
         { align: "center" }
       );

    doc.font("Helvetica-Bold")
       .fontSize(26)
       .fillColor("#111827")
       .text(
         `"${event.title}"`,
         0,
         390,
         { align: "center" }
       );

    doc.font("Helvetica")
       .fontSize(16)
       .fillColor("#6b7280")
       .text(
         `Held on ${new Date(event.date).toDateString()}`,
         0,
         430,
         { align: "center" }
       );

    /* Certificate ID */

    doc.fontSize(12)
       .fillColor("#6b7280")
       .text(
         `Certificate ID: ${certId}`,
         width / 2 - 150,
         height - 120
       );

    /* QR Code */

    const verifyURL = `${process.env.FRONTEND_URL}/verify/${certId}`;

    const qr = await QRCode.toDataURL(verifyURL);

    const qrBuffer = Buffer.from(
      qr.replace(/^data:image\/png;base64,/, ""),
      "base64"
    );

    doc.image(qrBuffer, width - 150, height - 160, {
      width: 100
    });

    doc.end();

  });

};