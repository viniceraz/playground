const fs = require("fs");
const path = require("path");

const traitsDir = "./public/traits";

function titleCase(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function processFolder(folderPath) {
  const items = fs.readdirSync(folderPath);
  for (const item of items) {
    const itemPath = path.join(folderPath, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      // Recursivo para subpastas
      processFolder(itemPath);
    } else if (stat.isFile() && path.extname(item) === ".png") {
      const ext = path.extname(item);
      const base = path.basename(item, ext);
      const titleCased = titleCase(base);
      const newFileName = `${titleCased}${ext}`;
      const newPath = path.join(folderPath, newFileName);

      if (item !== newFileName) {
        fs.renameSync(itemPath, newPath);
        console.log(`Renamed: ${item} → ${newFileName}`);
      }
    }
  }
}

processFolder(traitsDir);
