const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const originalDocxPath = 'C:\\Users\\JayasuryaM\\Downloads\\YumQuick v3 – UI UX Redesign, Navigation, Location & Remaining APIs.docx';
const tempDir = path.join(process.env.TEMP || 'C:\\Temp', 'docx_v3_temp');
const tempZipPath = path.join(process.env.TEMP || 'C:\\Temp', 'temp_v3_doc.zip');

if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
if (fs.existsSync(tempZipPath)) {
  fs.unlinkSync(tempZipPath);
}

fs.copyFileSync(originalDocxPath, tempZipPath);

execSync(`powershell -Command "Expand-Archive -Path '${tempZipPath}' -DestinationPath '${tempDir}'"`);

const xmlPath = path.join(tempDir, 'word', 'document.xml');
if (fs.existsSync(xmlPath)) {
  const xmlContent = fs.readFileSync(xmlPath, 'utf8');
  const matches = xmlContent.match(/<w:t[^>]*>(.*?)<\/w:t>/g) || [];
  const text = matches.map(m => m.replace(/<[^>]+>/g, '')).join(' ');

  console.log('=== V3 DOCX CONTENT ===');
  console.log(text);

  fs.writeFileSync(path.join(__dirname, 'extracted_v3_docx.txt'), text, 'utf8');
} else {
  console.log('document.xml not found');
}
