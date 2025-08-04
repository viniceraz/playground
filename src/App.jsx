import { useState, useEffect, useRef } from "react";
import { rarityData } from "./rarityData";


const categories = [
  "Background", "Wings", "Skins", "Eyebrows", "Eyes", "Mouths",
  "HeadWear", "Drip", "Earrings", "Chains", "Legendary", "Accessories"
];

const traitPaths = {
  Accessories: [ "Black Mirror.png", "Digital Grimoire.png", "Ethereal Lantern.png", "Eyeless Mask.png", "None.png", "Shattered Cross.png", "Shattered Cyber Cross.png", "Shattered Glass.png" ],
  Background: [ "Champagn Raunch.png", "Climsy Road.png", "Control Room.png", "Crimson Eclipse.png", "Csgo Hunt.png", "Cyber Garden.png", "Digital Altar.png", "Final Dreams.png", "Final Level.png", "Glitched Heaven.png", "Green Road.png", "High Miles Pool.png", "Home Town.png", "Los Santos.png", "Og Collin.png", "Pink Bath.png", "Static Aura.png", "Stoned River.png", "Terminal.png", "Void Purple.png", "Voided Pool.png", "Waiting Home.png" ],
  Chains: [ "Chrome Blue.png", "Double Gold.png", "Double Pearls.png", "None.png", "Saturn Chain.png", "Siko Chain.png" ],
  Drip: [ "Air Head Walter.png", "Air Tracksuit.png", "Alkan Vest.png", "Alkan X-treme.png", "B-shirt.png", "Bitcoin Monk.png", "Chrome Hoodie.png", "Chrome Leather.png", "Cult Seifuku.png", "Hacker Cloak.png", "Hell General.png", "None.png", "Oyl Bomber.png", "Oyl Colored Leather.png", "Oyl Swag Jacket.png", "Oyl Ford.png", "Oyl Speed Shirt.png", "Punisher V.png", "Swoko.png", "Techno Monk Robes.png", "Zero Trenches Hoodie.png" ],
  Earrings: [ "Double Silver.png", "Gold Cross.png", "Golden Star.png", "None.png", "Plus Cross Gold.png", "Plus Cross Silver.png", "Silver Cross.png" ],
  Eyebrows: [ "Cuts.png", "Cuts T.png", "Flamed.png", "Stand.png" ],
  Eyes: [ "Angelcore Shine.png", "Black Spiral.png", "Flamed.png", "Green Brown.png", "Hollow.png", "Out.png", "Red Dot Matrix.png", "River Blue.png" ],
  HeadWear: [ "Hooded Locks.png", "Long Flow.png", "Long Pale.png", "None.png", "Oyl Brown.png", "Oyl Corp Cap.png", "Short Bob.png", "Twin Tails.png" ],
  Legendary: [ "Angel Of Silence.png", "Binary Prophet.png", "Binary Prophet Simbiote.png", "Blood Angel.png", "Dark Nun.png", "Ethereal Judge.png", "Hoodied Hair.png", "Mother Oracle.png", "None.png", "Pale Warden.png", "Phantom Hijab.png" ],
  Mouths: [ "Fangbyte.png", "Glitched Smile.png", "Silent.png", "Stand.png", "Vamo.png" ],
  Skins: [ "Burnt Wax.png", "Nesquick.png", "Pale Possessed.png", "Pink Possessed.png", "Porcelain.png", "Porcelain Doll.png", "Seraphic Veil.png", "Static Skin.png" ],
  Wings: [ "Angel Lift.png", "Death Stranding.png", "None.png", "Phoenix.png" ]
};

const Clock = () => {
  const [time, setTime] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <span className="text-black pr-2">{time}</span>;
};

function App() {
  const [selectedTraits, setSelectedTraits] = useState({});
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const drawTraits = async () => {
      setLoading(true);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const category of categories) {
        const trait = selectedTraits[category];
        if (trait && !trait.includes("None")) {
          const img = new Image();
          img.src = `/traits/${category}/${trait}`;
          await new Promise((res) => { img.onload = res; });
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
      }

      setLoading(false);
    };

    drawTraits();
  }, [selectedTraits]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setStartMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const exportImage = () => {
    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "alkangelos.png";
    a.click();
  };

  const randomizeTraits = () => {
    const newTraits = {};

    const mandatoryCategories = [
      "Background", "Eyebrows", "HeadWear", "Mouths",
      "Earrings", "Drip", "Eyes", "Chains", "Skins"
    ];

    const legendaryTraits = traitPaths["Legendary"];
    const includeLegendary = Math.random() < 0.1;
    if (includeLegendary && legendaryTraits.length > 0) {
      const randomLegendary = legendaryTraits[Math.floor(Math.random() * legendaryTraits.length)];
      newTraits["Legendary"] = randomLegendary;
    }

    categories.forEach((category) => {
      if (category === "Legendary") return;
      if (["HeadWear", "Drip"].includes(category) && newTraits["Legendary"]) return;

      const traits = traitPaths[category];
      if (!traits || traits.length === 0) return;

      const isMandatory = mandatoryCategories.includes(category);
      const includeNone = !isMandatory && Math.random() < 0.2;

      if (!includeNone) {
        const randomTrait = traits[Math.floor(Math.random() * traits.length)];
        newTraits[category] = randomTrait;
      }
    });

    setSelectedTraits(newTraits);
  };

  return (
    <div className="min-h-screen bg-neutral-800 text-white font-mono p-4 pb-12 flex flex-col items-center">
      <div className="mb-6">
        <img src="/logoalkangelos.png" alt="Logo" className="mx-auto h-[200px] object-contain" />
      </div>

      <canvas
        ref={canvasRef}
        width={1000}
        height={1000}
        className="border border-black w-[300px] h-[300px] mb-6 bg-white"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-gray-100 border border-gray-400 p-4 mb-4 w-full max-w-5xl">
        {categories.map((category) => {
          const selectedTrait = selectedTraits[category] || "";
          const traitName = selectedTrait.replace(".png", "");
          const rarity = rarityData?.[category]?.[traitName];
          const rarityClass =
            rarity?.percent < 1 ? "text-red-600" :
            rarity?.percent < 5 ? "text-yellow-600" :
            rarity?.percent < 10 ? "text-blue-600" :
            "text-black";

          return (
            <div key={category} className="flex flex-col text-black">
              <label className="text-sm mb-1">{category}</label>
              <select
                value={selectedTrait}
                onChange={(e) => setSelectedTraits((prev) => ({
                  ...prev,
                  [category]: e.target.value
                }))}
                className={`bg-white border border-black p-1 text-sm ${rarityClass}`}
              >
                <option value="">-- Select --</option>
                {traitPaths[category]?.map((trait) => {
                  const tName = trait.replace(".png", "");
                  const r = rarityData?.[category]?.[tName];
                  const optionClass =
                    r?.percent < 1 ? "text-red-600" :
                    r?.percent < 5 ? "text-yellow-600" :
                    r?.percent < 10 ? "text-blue-600" :
                    "text-black";

                  return (
                    <option key={trait} value={trait} className={optionClass}>
                      {tName} — {r?.count ?? 0} ({r?.percent?.toFixed(2) ?? "0.00"}%)
                    </option>
                  );
                })}
              </select>
            </div>
          );
        })}
      </div>

      <div className="flex gap-4">
        <button
          onClick={exportImage}
          className="bg-gray-300 text-black border border-black px-4 py-2 text-sm hover:bg-gray-400"
        >
          💾 Download
        </button>
        <button
          onClick={randomizeTraits}
          disabled={loading}
          className={`text-black border border-black px-4 py-2 text-sm ${loading ? "bg-gray-400" : "bg-gray-200 hover:bg-gray-300"}`}
        >
          🎲 {loading ? "Loading..." : "Randomize"}
        </button>
      </div>

    {startMenuOpen && (
  <div
    ref={menuRef}
    className="fixed bottom-10 left-2 w-48 bg-[#C0C0C0] border border-black shadow-lg font-sans text-sm z-50"
  >
    <div className="border-b border-gray-500 px-2 py-1 bg-blue-700 text-white font-bold">
      Alkangelos Cult
    </div>
    <ul>
      <li>
        <a
          href="https://alkangelos.xyz/"
          target="_blank"
          rel="noopener noreferrer"
          className="block px-2 py-1 hover:bg-blue-500 hover:text-white"
        >
          🌐 Website
        </a>
      </li>
      <li>
        <a
          href="https://x.com/alkangelos"
          target="_blank"
          rel="noopener noreferrer"
          className="block px-2 py-1 hover:bg-blue-500 hover:text-white"
        >
          🐦 Twitter
        </a>
      </li>
      <li>
        <a
          href="https://discord.gg/alkangeloscult"
          target="_blank"
          rel="noopener noreferrer"
          className="block px-2 py-1 hover:bg-blue-500 hover:text-white"
        >
          💬 Discord
        </a>
      </li>
      <li>
        <a
          href="/gallery"
          className="block px-2 py-1 hover:bg-blue-500 hover:text-white"
        >
          🖼️ Gallery
        </a>
      </li>
    </ul>
  </div>
)}
      <footer className="fixed bottom-0 left-0 w-full h-10 bg-[#C0C0C0] border-t border-black flex items-center justify-between px-2 font-sans text-sm">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setStartMenuOpen((prev) => !prev)}
            className="bg-[#C0C0C0] border border-t-white border-l-white border-b-gray-800 border-r-gray-800 px-2 py-0.5 font-bold hover:bg-white"
          >
            Start
          </button>
          <img src="/logoalkangelos.png" alt="App Icon" className="h-6 w-6 ml-2" />
          <span className="ml-1">Playground</span>
        </div>
        <div className="text-right">
          <Clock />
        </div>
      </footer>
    </div>
  );
}

export default App;