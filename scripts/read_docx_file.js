const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const originalDocxPath = 'C:\\Users\\JayasuryaM\\Downloads\\YumQuick – Complete Documentation & Phase-wise Build Prompt.docx';
const tempDir = path.join(process.env.TEMP || 'C:\\Temp', 'docx_read_temp');
const tempZipPath = path.join(process.env.TEMP || 'C:\\Temp', 'temp_doc.zip');

if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
if (fs.existsSync(tempZipPath)) {
  fs.unlinkSync(tempZipPath);
}

// Copy docx to .zip
fs.copyFileSync(originalDocxPath, tempZipPath);

// Unzip
execSync(`powershell -Command "Expand-Archive -Path '${tempZipPath}' -DestinationPath '${tempDir}'"`);

const xmlPath = path.join(tempDir, 'word', 'document.xml');
if (fs.existsSync(xmlPath)) {
  const xmlContent = fs.readFileSync(xmlPath, 'utf8');
  // Extract text inside <w:t> tags
  const matches = xmlContent.match(/<w:t[^>]*>(.*?)<\/w:t>/g) || [];
  const text = matches.map(m => m.replace(/<[^>]+>/g, '')).join(' ');

  console.log('=== EXTRACTED DOCX CONTENT ===');
  console.log(text.substring(0, 3000));

  fs.writeFileSync(path.join(__dirname, 'extracted_docx.txt'), text, 'utf8');
} else {
  console.log('document.xml not found');
}
