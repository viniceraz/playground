const fs = require("fs");
const path = require("path");

const METADATA_DIR = "./metadata";
const rankedFile = "./src/rankedOutput.json";
const outputFile = "./src/rankedOutputWithTraits.json";

function main() {
  const rankedData = JSON.parse(fs.readFileSync(rankedFile, "utf-8"));

  const merged = rankedData.map((item) => {
    const idStr = item.id.toString().padStart(4, "0");
    const metadataPath = path.join(METADATA_DIR, `${idStr}.json`);

    if (!fs.existsSync(metadataPath)) {
      console.warn(`Metadata not found for ID ${idStr}`);
      return item;
    }

    const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
    return {
      ...item,
      attributes: metadata.attributes || [],
    };
  });

  fs.writeFileSync(outputFile, JSON.stringify(merged, null, 2), "utf-8");
  console.log(`✅ Merged output saved to ${outputFile}`);
}

main();
