import PDFDocument from "pdfkit";
import fs from "fs";

export const generateCertificate = (user, event, certId) => {
  const path = `certificates/${certId}.pdf`;
  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(path));

  doc.fontSize(20).text("Certificate of Participation", { align: "center" });
  doc.moveDown();
  doc.text(`This certifies that ${user.name}`);
  doc.text(`Attended event: ${event.title}`);
  doc.text(`Date: ${event.date}`);
  doc.text(`Certificate ID: ${certId}`);

  doc.end();

  return path;
};