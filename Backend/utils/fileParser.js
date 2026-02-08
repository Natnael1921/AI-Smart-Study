import fs from "fs";
import pdfParse from "pdf-parse";

export const parsePDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdfParse(dataBuffer);

  let text = pdfData.text || "";

  // CLEANING:
  // 1. Replace multiple newlines with a single newline
  text = text.replace(/\n\s*\n/g, "\n");

  // 2. Replace multiple spaces with single space
  text = text.replace(/[ \t]+/g, " ");

  // 3. Trim each line
  text = text.split("\n").map(line => line.trim()).join("\n");

  // 4. Remove any weird invisible characters
  text = text.replace(/[^\x20-\x7E\n]+/g, "");

  return text;
};
