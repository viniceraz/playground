// calculateRanks.js

const fs = require("fs");
const path = require("path");
const { rarityData } = require("./src/rarityData");

const METADATA_DIR = path.join(__dirname, "metadata");
const OUTPUT_FILE = path.join(__dirname, "rankedOutput.json");

function calculateRarityScore(metadata) {
  let totalScore = 0;

  for (const attr of metadata.attributes) {
    const traitType = attr.trait_type;
    const value = attr.value;

    const rarity = rarityData?.[traitType]?.[value];

    if (rarity) {
      totalScore += 100 - rarity.percent; // quanto mais raro, maior a pontuação
    }
  }

  return totalScore;
}

function main() {
  const files = fs.readdirSync(METADATA_DIR).filter(f => f.endsWith(".json"));

  const all = files.map(file => {
    const fullPath = path.join(METADATA_DIR, file);
    const metadata = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
    const score = calculateRarityScore(metadata);

    return {
      id: parseInt(file.replace(".json", "")),
      name: metadata.name,
      score,
    };
  });

  const ranked = all.sort((a, b) => b.score - a.score).map((item, index) => ({
    ...item,
    rank: index + 1,
  }));

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(ranked, null, 2));
  console.log("✅ Rank calculado e salvo em rankedOutput.json");
}

main();
