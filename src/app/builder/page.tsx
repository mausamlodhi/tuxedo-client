"use client";

import { useState } from "react";
import { ChevronRight, RotateCcw, RotateCw } from "lucide-react";

interface Item {
  id: number;
  label: string;
  icon: React.ReactNode;
}

const items: Item[] = [
  { id: 1, label: "Jacket & Pants", icon: "🧥" },
  { id: 2, label: "Shirt", icon: "👕" },
  { id: 3, label: "Tie", icon: "👔" },
  { id: 4, label: "Vest & Cummerbund", icon: "🦺" },
  { id: 5, label: "Pocket Square", icon: "🧻" },
  { id: 6, label: "Lapel Pin", icon: "📌" },
  { id: 7, label: "Cufflinks", icon: "⚙️" },
  { id: 8, label: "Belt & Suspenders", icon: "🩳" },
  { id: 9, label: "Shoes", icon: "👞" },
  { id: 10, label: "Socks", icon: "🧦" },
];

export default function LookBuilderPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");

  return (
    <div className="min-h-screen bg-[#1f1f1f] flex flex-col">
      {/* Header */}
      <header className="bg-gray-100 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold">LOOK BUILDER</h1>
          <p className="text-xs text-gray-600">HOME / CUSTOMIZE SIZE</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span className="font-medium">John Doe</span>
          <span>|</span>
          <span>Doe Wedding - Aug 30, 2025 ✏️</span>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex bg-white border-b">
        <button className="px-6 py-3 font-medium border-b-2 border-black">
          Look Builder
        </button>
        <button className="px-6 py-3 text-gray-500">Recommendations</button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Left - Sketch + Controls */}
        <div className="flex-1 bg-white flex flex-col justify-between p-6">
          {/* Undo/Redo */}
          <div className="flex gap-6 items-center text-sm">
            <button className="flex items-center gap-2 text-black">
              <RotateCcw size={16} /> Undo
            </button>
            <button className="flex items-center gap-2 text-gray-400">
              Redo <RotateCw size={16} />
            </button>
          </div>

          {/* Sketch placeholder */}
          <div className="flex-1 flex items-center justify-center">
            <div className="border-2 border-dashed border-gray-300 rounded-lg w-[250px] h-[350px] flex items-center justify-center text-gray-400">
              Suit Sketch Placeholder
            </div>
          </div>
        </div>

        {/* Right - Controls */}
        <div className="w-[350px] bg-white border-l p-6 flex flex-col">
          {/* Form */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="border px-3 py-2 rounded w-full text-sm"
            />
            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="border px-3 py-2 rounded w-full text-sm"
            />
          </div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border px-3 py-2 rounded w-full mb-6 text-sm"
          >
            <option value="">Select role</option>
            <option value="groom">Groom</option>
            <option value="groomsman">Groomsman</option>
            <option value="guest">Guest</option>
          </select>

          {/* Price + Actions */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">LOOK – $0.00</h2>
            <div className="flex gap-2">
              <button className="bg-orange-400 text-white px-4 py-2 rounded text-sm">
                Save Outfit
              </button>
              <button className="bg-gray-200 text-gray-600 px-4 py-2 rounded text-sm">
                Cancel
              </button>
            </div>
          </div>

          {/* Items */}
          <div className="flex flex-col gap-2 overflow-y-auto">
            {items.map((item) => (
              <button
                key={item.id}
                className="flex justify-between items-center border px-4 py-3 rounded text-left hover:bg-gray-50"
              >
                <span className="flex items-center gap-2">
                  <span>{item.icon}</span>
                  {item.label}
                </span>
                <ChevronRight size={18} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1f1f1f] text-gray-400 text-xs text-center py-2">
        vipformalwear ©2025 | All Rights Reserved
      </footer>
    </div>
  );
}
