import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createWriteStream } from 'fs';

// Node script using tar or zlib to recursively zip directory with forward slashes
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '../frontend/out');
const zipFile = path.resolve(__dirname, '../sarkarijobalerts_linux_clean.tar.gz');

import { execSync } from 'child_process';

console.log('Building clean zip archive for Linux Hostinger server...');

try {
  // Use tar or powershell tar
  execSync(`tar -czf "${zipFile}" -C "${outDir}" .`);
  console.log(`Success! Archive created at: ${zipFile}`);
} catch (e) {
  console.error('Tar failed:', e.message);
}
