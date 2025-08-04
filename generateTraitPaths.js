const fs = require("fs");
const path = require("path");

const baseDir = "./public/traits";
const traitPaths = {};

fs.readdirSync(baseDir).forEach((folder) => {
  const folderPath = path.join(baseDir, folder);
  const stats = fs.statSync(folderPath);

  if (stats.isDirectory()) {
    const files = fs
      .readdirSync(folderPath)
      .filter((f) => f.endsWith(".png"))
      .sort();

    traitPaths[folder] = files;
  }
});

console.log("const traitPaths = ", JSON.stringify(traitPaths, null, 2), ";");
