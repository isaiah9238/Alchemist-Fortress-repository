const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const directory = process.argv[2] || '.';
const seenHashes = new Map();

function getFileHash(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    const hash = crypto.createHash('sha256');
    hash.update(buffer);
    return hash.digest('hex');
  } catch (e) {
    console.error(`Error reading file ${filePath}: ${e.message}`);
    return null;
  }
}

function scanAndClean(dir) {
  let files = [];
  try {
    files = fs.readdirSync(dir);
  } catch (e) {
    console.error(`Error reading directory ${dir}: ${e.message}`);
    return;
  }

  for (const file of files) {
    const fullPath = path.join(dir, file);
    let stat;
    try {
      stat = fs.statSync(fullPath);
    } catch (e) {
      continue;
    }

    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        scanAndClean(fullPath);
      }
    } else {
      const hash = getFileHash(fullPath);
      if (hash) {
        if (seenHashes.has(hash)) {
          console.log(`Removing duplicate: ${fullPath} (Duplicate of ${seenHashes.get(hash)})`);
          try {
            fs.unlinkSync(fullPath);
          } catch (e) {
            console.error(`Could not delete ${fullPath}: ${e.message}`);
          }
        } else {
          seenHashes.set(hash, fullPath);
        }
      }
    }
  }
}

console.log(`Starting cleanup in: ${path.resolve(directory)}`);
scanAndClean(directory);
console.log('Cleanup complete.');