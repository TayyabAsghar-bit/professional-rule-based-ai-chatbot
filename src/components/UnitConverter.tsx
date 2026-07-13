import { useState, useEffect } from "react";
import { Scale, RefreshCw } from "lucide-react";

type CategoryType = "length" | "weight" | "temperature";

interface UnitOption {
  value: string;
  label: string;
}

export default function UnitConverter() {
  const [category, setCategory] = useState<CategoryType>("length");
  const [inputValue, setInputValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("ft");
  const [result, setResult] = useState("3.28084");

  // Conversion rates relative to base unit (length: meters, weight: kilograms)
  const lengthRates: Record<string, number> = {
    m: 1,
    km: 1000,
    cm: 0.01,
    mm: 0.001,
    ft: 0.3048,
    yd: 0.9144,
    inch: 0.0254,
    mi: 1609.344,
  };

  const weightRates: Record<string, number> = {
    kg: 1,
    g: 0.001,
    mg: 0.000001,
    lb: 0.45359237,
    oz: 0.028349523,
    ton: 907.18474, // US Short Ton
  };

  const unitLabels: Record<CategoryType, UnitOption[]> = {
    length: [
      { value: "m", label: "Meters (m)" },
      { value: "km", label: "Kilometers (km)" },
      { value: "cm", label: "Centimeters (cm)" },
      { value: "mm", label: "Millimeters (mm)" },
      { value: "ft", label: "Feet (ft)" },
      { value: "inch", label: "Inches (in)" },
      { value: "yd", label: "Yards (yd)" },
      { value: "mi", label: "Miles (mi)" },
    ],
    weight: [
      { value: "kg", label: "Kilograms (kg)" },
      { value: "g", label: "Grams (g)" },
      { value: "mg", label: "Milligrams (mg)" },
      { value: "lb", label: "Pounds (lbs)" },
      { value: "oz", label: "Ounces (oz)" },
      { value: "ton", label: "Tons (tn)" },
    ],
    temperature: [
      { value: "C", label: "Celsius (°C)" },
      { value: "F", label: "Fahrenheit (°F)" },
      { value: "K", label: "Kelvin (K)" },
    ],
  };

  // Switch category defaults
  const handleCategoryChange = (cat: CategoryType) => {
    setCategory(cat);
    if (cat === "length") {
      setFromUnit("m");
      setToUnit("ft");
    } else if (cat === "weight") {
      setFromUnit("kg");
      setToUnit("lb");
    } else if (cat === "temperature") {
      setFromUnit("C");
      setToUnit("F");
    }
  };

  // Perform unit conversion
  useEffect(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) {
      setResult("0");
      return;
    }

    if (category === "length") {
      const meters = val * (lengthRates[fromUnit] || 1);
      const converted = meters / (lengthRates[toUnit] || 1);
      const rounded = Math.round(converted * 100000) / 100000;
      setResult(rounded.toString());
    } else if (category === "weight") {
      const kgs = val * (weightRates[fromUnit] || 1);
      const converted = kgs / (weightRates[toUnit] || 1);
      const rounded = Math.round(converted * 100000) / 100000;
      setResult(rounded.toString());
    } else if (category === "temperature") {
      let converted = val;
      // Convert source to Celsius
      let celsius = val;
      if (fromUnit === "F") {
        celsius = ((val - 32) * 5) / 9;
      } else if (fromUnit === "K") {
        celsius = val - 273.15;
      }

      // Convert Celsius to target
      if (toUnit === "C") {
        converted = celsius;
      } else if (toUnit === "F") {
        converted = (celsius * 9) / 5 + 32;
      } else if (toUnit === "K") {
        converted = celsius + 273.15;
      }

      const rounded = Math.round(converted * 100000) / 100000;
      setResult(rounded.toString());
    }
  }, [category, inputValue, fromUnit, toUnit]);

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-[#0F172A] select-text overflow-y-auto min-h-full w-full">
      <div className="max-w-md w-full my-auto bg-[#1E293B] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
        <div className="flex items-center space-x-3 border-b border-white/5 pb-4">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Scale size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white leading-tight">High-Fidelity Unit Converter</h2>
            <p className="text-xs text-slate-400">Precise, offline-first metric conversions</p>
          </div>
        </div>

        {/* Category selector */}
        <div className="grid grid-cols-3 gap-1 bg-[#0F172A] p-1 rounded-xl border border-white/5">
          {(["length", "weight", "temperature"] as CategoryType[]).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`py-2 px-1 text-xs font-semibold capitalize rounded-lg transition-all cursor-pointer ${
                category === cat
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {/* From unit */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">From Value</label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="col-span-2 w-full bg-[#0F172A] border border-white/10 focus:border-blue-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all font-mono"
                placeholder="Value"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full bg-[#0F172A] border border-white/10 focus:border-blue-500/50 rounded-xl px-3 py-3 text-xs text-slate-300 focus:outline-none transition-all cursor-pointer"
              >
                {unitLabels[category].map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#1E293B] text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button Divider */}
          <div className="flex justify-center">
            <button
              onClick={handleSwap}
              className="p-2.5 rounded-full bg-[#334155]/50 hover:bg-[#334155] border border-white/10 text-blue-400 hover:text-white transition-all cursor-pointer shadow-md transform hover:rotate-180 duration-300"
              title="Swap units"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          {/* To unit */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Converted Result</label>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 w-full bg-[#0F172A]/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-blue-400 font-mono font-bold flex items-center overflow-x-auto whitespace-nowrap">
                {result}
              </div>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full bg-[#0F172A] border border-white/10 focus:border-blue-500/50 rounded-xl px-3 py-3 text-xs text-slate-300 focus:outline-none transition-all cursor-pointer"
              >
                {unitLabels[category].map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#1E293B] text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Informative text */}
        <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-3 text-[10px] leading-relaxed text-slate-400">
          <strong>Note:</strong> All calculations are processed locally within your secure client browser. High-precision rounding ensures accuracy up to 5 decimal points.
        </div>
      </div>
    </div>
  );
}
