// Simple PNG generator for extension icons
// Creates solid colored icons with an "R" shape

import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

// Minimal PNG encoder
function createPNG(width, height, pixelData) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // color type (RGBA)
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // IDAT chunk (raw pixel data with zlib wrapper)
  const rawData = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    rawData[y * (1 + width * 4)] = 0; // filter byte
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * 4;
      const dstIdx = y * (1 + width * 4) + 1 + x * 4;
      rawData[dstIdx] = pixelData[srcIdx];
      rawData[dstIdx + 1] = pixelData[srcIdx + 1];
      rawData[dstIdx + 2] = pixelData[srcIdx + 2];
      rawData[dstIdx + 3] = pixelData[srcIdx + 3];
    }
  }

  // Simple deflate (store only, no compression)
  const blocks = [];
  let offset = 0;
  while (offset < rawData.length) {
    const blockSize = Math.min(65535, rawData.length - offset);
    const isLast = offset + blockSize >= rawData.length;
    const block = Buffer.alloc(5 + blockSize);
    block[0] = isLast ? 1 : 0;
    block.writeUInt16LE(blockSize, 1);
    block.writeUInt16LE(blockSize ^ 0xffff, 3);
    rawData.copy(block, 5, offset, offset + blockSize);
    blocks.push(block);
    offset += blockSize;
  }

  // Zlib wrapper
  const zlibHeader = Buffer.from([0x78, 0x01]);
  const compressedData = Buffer.concat([zlibHeader, ...blocks]);

  // Adler32 checksum
  let a = 1, b = 0;
  for (let i = 0; i < rawData.length; i++) {
    a = (a + rawData[i]) % 65521;
    b = (b + a) % 65521;
  }
  const adler32 = Buffer.alloc(4);
  adler32.writeUInt32BE(((b << 16) | a) >>> 0, 0);

  const idatData = Buffer.concat([compressedData, adler32]);

  // IEND chunk
  const iendData = Buffer.alloc(0);

  // CRC32 table
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[n] = c >>> 0;
  }

  function crc32(data) {
    let crc = 0xffffffff >>> 0;
    for (let i = 0; i < data.length; i++) {
      crc = (crcTable[(crc ^ data[i]) & 0xff] ^ (crc >>> 8)) >>> 0;
    }
    return ((crc ^ 0xffffffff) >>> 0);
  }

  function makeChunk(type, data) {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length, 0);
    const typeBuffer = Buffer.from(type);
    const crcData = Buffer.concat([typeBuffer, data]);
    const crcValue = crc32(crcData);
    const crcBuffer = Buffer.alloc(4);
    crcBuffer.writeUInt32BE(crcValue >>> 0, 0);
    return Buffer.concat([length, typeBuffer, data, crcBuffer]);
  }

  return Buffer.concat([
    signature,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', idatData),
    makeChunk('IEND', iendData)
  ]);
}

// Draw an "R" character on the icon
function drawIcon(size) {
  const pixels = Buffer.alloc(size * size * 4);

  // Background: dark blue (#1e3a5f)
  const bgR = 30, bgG = 58, bgB = 95;
  // Foreground: white
  const fgR = 255, fgG = 255, fgB = 255;

  // Fill background
  for (let i = 0; i < size * size; i++) {
    pixels[i * 4] = bgR;
    pixels[i * 4 + 1] = bgG;
    pixels[i * 4 + 2] = bgB;
    pixels[i * 4 + 3] = 255;
  }

  // Draw "R" letter
  const margin = Math.floor(size * 0.15);
  const thickness = Math.max(2, Math.floor(size * 0.15));

  const left = margin;
  const right = size - margin;
  const top = margin;
  const bottom = size - margin;
  const midY = Math.floor((top + bottom) / 2);
  const midX = Math.floor((left + right * 0.7));

  function setPixel(x, y) {
    if (x >= 0 && x < size && y >= 0 && y < size) {
      const i = (y * size + x) * 4;
      pixels[i] = fgR;
      pixels[i + 1] = fgG;
      pixels[i + 2] = fgB;
      pixels[i + 3] = 255;
    }
  }

  function drawRect(x1, y1, x2, y2) {
    for (let y = y1; y <= y2; y++) {
      for (let x = x1; x <= x2; x++) {
        setPixel(x, y);
      }
    }
  }

  // Vertical stroke of R
  drawRect(left, top, left + thickness - 1, bottom);

  // Top horizontal stroke
  drawRect(left, top, midX, top + thickness - 1);

  // Middle horizontal stroke
  drawRect(left, midY - Math.floor(thickness / 2), midX, midY + Math.floor(thickness / 2));

  // Right curved part (simplified as vertical line)
  drawRect(midX - thickness + 1, top, midX, midY);

  // Diagonal leg
  for (let i = 0; i <= bottom - midY; i++) {
    const x = left + thickness + Math.floor(i * (right - left - thickness) / (bottom - midY));
    drawRect(x - Math.floor(thickness / 2), midY + i, x + Math.floor(thickness / 2), midY + i);
  }

  return createPNG(size, size, pixels);
}

// Generate icons
const sizes = [16, 48, 128];
const outputDir = 'extension/icons';

try {
  mkdirSync(outputDir, { recursive: true });
} catch (e) {
  // Directory might already exist
}

for (const size of sizes) {
  const png = drawIcon(size);
  const path = `${outputDir}/icon${size}.png`;
  writeFileSync(path, png);
  console.log(`Generated ${path}`);
}

console.log('All icons generated successfully!');
