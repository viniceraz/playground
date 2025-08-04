import React, { useState, useEffect } from "react";
import rankedData from "./rankedOutputWithTraits.json";

const Gallery = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;
  const [searchId, setSearchId] = useState("");
  const [searchRank, setSearchRank] = useState("");
  const [filters, setFilters] = useState({});
  const [traits, setTraits] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const temp = {};
    rankedData.forEach((item) => {
      item.attributes.forEach(({ trait_type, value }) => {
        if (!temp[trait_type]) temp[trait_type] = new Set();
        temp[trait_type].add(value.replace(".png", ""));
      });
    });

    const obj = {};
    for (let key in temp) {
      obj[key] = Array.from(temp[key]).sort();
    }
    setTraits(obj);
  }, []);

  const handleFilterChange = (trait, value) => {
    setFilters((prev) => ({
      ...prev,
      [trait]: value === "-- Select --" ? null : value,
    }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({});
    setSearchId("");
    setSearchRank("");
    setCurrentPage(1);
  };

  const applyFilters = (data) => {
    let result = [...data];

    if (searchId) {
      const numericId = parseInt(searchId.replace("#", ""), 10) - 1;
      result = result.filter((item) => item.id === numericId);
    }

    if (searchRank) {
      const rankNum = parseInt(searchRank.replace("#", ""), 10);
      result = result.filter((item) => item.rank === rankNum);
    }

    Object.entries(filters).forEach(([trait, value]) => {
      if (value) {
        result = result.filter((item) =>
          item.attributes.some((attr) => attr.trait_type === trait && attr.value.replace(".png", "") === value)
        );
      }
    });

    return result.sort((a, b) => a.rank - b.rank);
  };

  const filteredData = applyFilters(rankedData);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginated = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="bg-neutral-900 text-white min-h-screen p-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => window.history.back()}
          className="text-white border border-white px-3 py-1 rounded hover:bg-white hover:text-black transition"
        >
          ← Back
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center">Alkangelos Gallery</h1>

      <div className="flex flex-wrap gap-3 items-center mb-6 justify-center">
        <input
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Search by ID"
          className="px-2 py-1 text-black rounded border"
        />
        <input
          type="text"
          value={searchRank}
          onChange={(e) => setSearchRank(e.target.value)}
          placeholder="Search by Rank"
          className="px-2 py-1 text-black rounded border"
        />
        {Object.entries(traits).map(([traitType, values]) => (
          <div key={traitType} className="flex flex-col text-white text-xs">
            <label className="mb-1">{traitType}</label>
            <select
              value={filters[traitType] || ""}
              onChange={(e) => handleFilterChange(traitType, e.target.value)}
              className="px-2 py-1 text-black rounded border"
            >
              <option value="">All</option>
              {values.map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button onClick={resetFilters} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">
          Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {paginated.map((item) => {
          const isLegendary = item.attributes.some(
            (attr) => attr.trait_type === "Legendary" && attr.value !== "None"
          );

          return (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`p-2 rounded hover:scale-105 transition-transform cursor-pointer ${
                item.rank <= 100
                  ? "border-2 border-yellow-400 bg-[#1c1c1c]"
                  : item.rank <= 500
                  ? "border-2 border-purple-500 bg-[#1c1c1c]"
                  : item.rank <= 1000
                  ? "border-2 border-blue-500 bg-[#1c1c1c]"
                  : "border border-gray-700 bg-[#1c1c1c]"
              } ${isLegendary ? "shadow-[0_0_10px_3px_gold]" : ""}`}
            >
              <img
                src={`/images/${item.id.toString().padStart(4, "0")}.png`}
                alt={item.name}
                className="w-full h-64 object-contain rounded"
                title={item.attributes.map((attr) => `${attr.trait_type}: ${attr.value}`).join("\n")}
              />

              <div className="mt-2 text-xs text-center">
                <p className="font-bold text-white">Alkangelos #{item.id + 1}</p>
                <p className="text-gray-300">Rank: #{item.rank}</p>
                <p className="text-gray-400">Score: {item.score.toFixed(2)}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Paginação manual elegante */}
      <div className="flex justify-center mt-6 gap-2 flex-wrap">
        {currentPage > 3 && (
          <>
            <button
              onClick={() => setCurrentPage(1)}
              className="px-3 py-1 rounded bg-gray-700 text-white"
            >
              1
            </button>
            <span className="text-white">...</span>
          </>
        )}

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((num) => Math.abs(num - currentPage) <= 2)
          .map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`px-3 py-1 rounded ${
                num === currentPage ? "bg-white text-black" : "bg-gray-700 text-white"
              }`}
            >
              {num}
            </button>
          ))}

        {currentPage < totalPages - 2 && (
          <>
            <span className="text-white">...</span>
            <button
              onClick={() => setCurrentPage(totalPages)}
              className="px-3 py-1 rounded bg-gray-700 text-white"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-neutral-900 p-4 rounded relative max-w-sm w-full text-center">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-2 right-2 text-white text-xl"
            >
              ✕
            </button>
            <img
              src={`/images/${selectedItem.id.toString().padStart(4, "0")}.png`}
              alt={selectedItem.name}
              className="w-full h-auto mb-2 rounded"
            />
            <p className="text-lg font-bold">{selectedItem.name}</p>
            <p>Rank: #{selectedItem.rank}</p>
            <p>Score: {selectedItem.score.toFixed(2)}</p>
            <div className="text-left mt-2">
              {selectedItem.attributes.map((attr) => (
                <div key={attr.trait_type} className="text-sm">
                  <strong>{attr.trait_type}:</strong> {attr.value}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
