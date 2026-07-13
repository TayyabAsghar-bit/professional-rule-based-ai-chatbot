import { useState, useEffect } from "react";
import { Trash2, History, Percent, Sparkles } from "lucide-react";

interface CalcHistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: string;
}

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [history, setHistory] = useState<CalcHistoryItem[]>(() => {
    const saved = localStorage.getItem("logicbot_calc_history");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("logicbot_calc_history", JSON.stringify(history));
  }, [history]);

  // Bind physical keyboard keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { key } = e;
      if (/[0-9]/.test(key)) {
        handleDigit(key);
      } else if (["+", "-", "*", "/"].includes(key)) {
        handleOperator(key);
      } else if (key === ".") {
        handleDecimal();
      } else if (key === "Enter" || key === "=") {
        e.preventDefault();
        handleCalculate();
      } else if (key === "Backspace") {
        handleBackspace();
      } else if (key === "Escape") {
        handleClearAll();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [display, expression]);

  const handleDigit = (digit: string) => {
    setDisplay((prev) => {
      if (prev === "0" || prev === "Error") {
        return digit;
      }
      return prev + digit;
    });
  };

  const handleDecimal = () => {
    setDisplay((prev) => {
      if (prev.includes(".")) return prev;
      if (prev === "Error") return "0.";
      return prev + ".";
    });
  };

  const handleBackspace = () => {
    setDisplay((prev) => {
      if (prev.length <= 1 || prev === "Error") return "0";
      return prev.slice(0, -1);
    });
  };

  const handleOperator = (op: string) => {
    if (display === "Error") return;
    setExpression((prev) => {
      const currentVal = parseFloat(display);
      if (isNaN(currentVal)) return prev;
      return `${display} ${op} `;
    });
    setDisplay("0");
  };

  const handleClearAll = () => {
    setDisplay("0");
    setExpression("");
  };

  const handleClearEntry = () => {
    setDisplay("0");
  };

  const handleToggleSign = () => {
    setDisplay((prev) => {
      if (prev === "0" || prev === "Error") return prev;
      if (prev.startsWith("-")) return prev.slice(1);
      return "-" + prev;
    });
  };

  // Safe arithmetic evaluator
  const evalArithmetic = (expr: string): number => {
    // Sanitizes the input to ensure it only contains valid mathematical characters
    const sanitized = expr.replace(/[^0-9+\-*/().\s^]/g, "");
    
    // Parse power operator ^
    let currentExpr = sanitized;
    while (currentExpr.includes("^")) {
      const match = currentExpr.match(/(\d+(?:\.\d+)?)\s*\^\s*(\d+(?:\.\d+)?)/);
      if (!match) break;
      const base = parseFloat(match[1]);
      const exponent = parseFloat(match[2]);
      const result = Math.pow(base, exponent);
      currentExpr = currentExpr.replace(match[0], result.toString());
    }

    // Evaluate using a safe Function parser containing only arithmetic context
    const fn = new Function(`return (${currentExpr})`);
    const val = fn();
    if (typeof val === "number" && !isNaN(val) && isFinite(val)) {
      return val;
    }
    throw new Error("Invalid Math");
  };

  const handleCalculate = () => {
    if (!expression || display === "Error") return;
    const fullExpr = expression + display;
    try {
      // Evaluate basic arithmetic
      const resultVal = evalArithmetic(fullExpr);
      const roundedResult = Math.round(resultVal * 100000) / 100000; // max 5 decimal places
      const finalResult = roundedResult.toString();

      // Add to history log
      const newHistoryItem: CalcHistoryItem = {
        id: `calc-${Date.now()}`,
        expression: fullExpr,
        result: finalResult,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      };
      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 9)]);

      setDisplay(finalResult);
      setExpression("");
    } catch (err) {
      setDisplay("Error");
    }
  };

  const handleScientific = (type: "sqrt" | "sin" | "cos" | "tan" | "pi" | "square") => {
    const currentVal = parseFloat(display);
    if (isNaN(currentVal) && type !== "pi") return;

    try {
      let result = 0;
      let actionName = "";

      switch (type) {
        case "sqrt":
          if (currentVal < 0) throw new Error("Complex Number");
          result = Math.sqrt(currentVal);
          actionName = `√(${currentVal})`;
          break;
        case "sin":
          // convert degrees to radians for easier user understanding
          const radSin = (currentVal * Math.PI) / 180;
          result = Math.sin(radSin);
          actionName = `sin(${currentVal}°)`;
          break;
        case "cos":
          const radCos = (currentVal * Math.PI) / 180;
          result = Math.cos(radCos);
          actionName = `cos(${currentVal}°)`;
          break;
        case "tan":
          const radTan = (currentVal * Math.PI) / 180;
          result = Math.tan(radTan);
          actionName = `tan(${currentVal}°)`;
          break;
        case "square":
          result = currentVal * currentVal;
          actionName = `${currentVal}²`;
          break;
        case "pi":
          result = Math.PI;
          actionName = "π";
          break;
      }

      const roundedResult = Math.round(result * 100000) / 100000;
      const finalResult = roundedResult.toString();

      if (type !== "pi") {
        const newHistoryItem: CalcHistoryItem = {
          id: `calc-${Date.now()}`,
          expression: actionName,
          result: finalResult,
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
        };
        setHistory((prev) => [newHistoryItem, ...prev.slice(0, 9)]);
      }

      setDisplay(finalResult);
    } catch (err) {
      setDisplay("Error");
    }
  };

  const loadHistoryItem = (item: CalcHistoryItem) => {
    setDisplay(item.result);
    setExpression("");
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-full md:h-full w-full bg-[#0F172A] p-4 md:p-8 overflow-y-auto space-y-6 md:space-y-0 md:space-x-8">
      {/* Main Calculator */}
      <div className="flex-none md:flex-1 h-[580px] md:h-full max-w-md mx-auto w-full bg-[#1E293B] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header indicator */}
        <div className="bg-[#111827] px-4 py-2 border-b border-white/5 flex justify-between items-center text-xs text-slate-400">
          <span className="flex items-center space-x-1.5 font-medium">
            <Sparkles size={12} className="text-blue-400" />
            <span>LogicBot Precision Calculator</span>
          </span>
          <span className="font-mono text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">
            FLOAT64
          </span>
        </div>

        {/* Display screen */}
        <div className="bg-[#0F172A]/80 p-6 flex flex-col justify-end items-end min-h-[120px] border-b border-white/5 font-mono select-text">
          <div className="text-slate-500 text-sm h-6 overflow-hidden truncate w-full text-right leading-tight">
            {expression || "\u00a0"}
          </div>
          <div className="text-white text-3xl font-bold tracking-tight h-10 w-full text-right overflow-x-auto whitespace-nowrap scrollbar-none pt-1">
            {display}
          </div>
        </div>

        {/* Keypad */}
        <div className="p-4 grid grid-cols-4 gap-2 bg-[#1E293B] flex-1">
          {/* Scientific Row */}
          <button
            onClick={() => handleScientific("sin")}
            className="p-3 text-xs font-semibold bg-[#334155]/30 hover:bg-[#334155]/60 text-slate-300 rounded-xl transition-all cursor-pointer"
            title="Sine (degrees)"
          >
            sin
          </button>
          <button
            onClick={() => handleScientific("cos")}
            className="p-3 text-xs font-semibold bg-[#334155]/30 hover:bg-[#334155]/60 text-slate-300 rounded-xl transition-all cursor-pointer"
            title="Cosine (degrees)"
          >
            cos
          </button>
          <button
            onClick={() => handleScientific("tan")}
            className="p-3 text-xs font-semibold bg-[#334155]/30 hover:bg-[#334155]/60 text-slate-300 rounded-xl transition-all cursor-pointer"
            title="Tangent (degrees)"
          >
            tan
          </button>
          <button
            onClick={() => handleScientific("sqrt")}
            className="p-3 text-xs font-semibold bg-[#334155]/30 hover:bg-[#334155]/60 text-slate-300 rounded-xl transition-all cursor-pointer"
            title="Square Root"
          >
            √
          </button>

          {/* Controls */}
          <button
            onClick={handleClearAll}
            className="p-3 text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all cursor-pointer"
            title="Clear All"
          >
            C
          </button>
          <button
            onClick={handleClearEntry}
            className="p-3 text-xs font-bold bg-[#334155]/50 hover:bg-[#334155] text-slate-200 rounded-xl transition-all cursor-pointer"
            title="Clear Entry"
          >
            CE
          </button>
          <button
            onClick={handleBackspace}
            className="p-3 text-xs font-bold bg-[#334155]/50 hover:bg-[#334155] text-slate-200 rounded-xl transition-all flex items-center justify-center cursor-pointer"
            title="Backspace"
          >
            ⌫
          </button>
          <button
            onClick={() => handleOperator("/")}
            className="p-3 text-base font-bold bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-all cursor-pointer"
          >
            ÷
          </button>

          {/* Row 2 */}
          <button
            onClick={() => handleDigit("7")}
            className="p-4 text-base font-bold bg-[#334155]/20 hover:bg-[#334155]/40 text-white rounded-xl transition-all cursor-pointer"
          >
            7
          </button>
          <button
            onClick={() => handleDigit("8")}
            className="p-4 text-base font-bold bg-[#334155]/20 hover:bg-[#334155]/40 text-white rounded-xl transition-all cursor-pointer"
          >
            8
          </button>
          <button
            onClick={() => handleDigit("9")}
            className="p-4 text-base font-bold bg-[#334155]/20 hover:bg-[#334155]/40 text-white rounded-xl transition-all cursor-pointer"
          >
            9
          </button>
          <button
            onClick={() => handleOperator("*")}
            className="p-3 text-base font-bold bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-all cursor-pointer"
          >
            ×
          </button>

          {/* Row 3 */}
          <button
            onClick={() => handleDigit("4")}
            className="p-4 text-base font-bold bg-[#334155]/20 hover:bg-[#334155]/40 text-white rounded-xl transition-all cursor-pointer"
          >
            4
          </button>
          <button
            onClick={() => handleDigit("5")}
            className="p-4 text-base font-bold bg-[#334155]/20 hover:bg-[#334155]/40 text-white rounded-xl transition-all cursor-pointer"
          >
            5
          </button>
          <button
            onClick={() => handleDigit("6")}
            className="p-4 text-base font-bold bg-[#334155]/20 hover:bg-[#334155]/40 text-white rounded-xl transition-all cursor-pointer"
          >
            6
          </button>
          <button
            onClick={() => handleOperator("-")}
            className="p-3 text-base font-bold bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-all cursor-pointer"
          >
            −
          </button>

          {/* Row 4 */}
          <button
            onClick={() => handleDigit("1")}
            className="p-4 text-base font-bold bg-[#334155]/20 hover:bg-[#334155]/40 text-white rounded-xl transition-all cursor-pointer"
          >
            1
          </button>
          <button
            onClick={() => handleDigit("2")}
            className="p-4 text-base font-bold bg-[#334155]/20 hover:bg-[#334155]/40 text-white rounded-xl transition-all cursor-pointer"
          >
            2
          </button>
          <button
            onClick={() => handleDigit("3")}
            className="p-4 text-base font-bold bg-[#334155]/20 hover:bg-[#334155]/40 text-white rounded-xl transition-all cursor-pointer"
          >
            3
          </button>
          <button
            onClick={() => handleOperator("+")}
            className="p-3 text-base font-bold bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-all cursor-pointer"
          >
            +
          </button>

          {/* Row 5 */}
          <button
            onClick={handleToggleSign}
            className="p-4 text-sm font-semibold bg-[#334155]/20 hover:bg-[#334155]/40 text-slate-300 rounded-xl transition-all cursor-pointer"
            title="Toggle Positive/Negative"
          >
            ±
          </button>
          <button
            onClick={() => handleDigit("0")}
            className="p-4 text-base font-bold bg-[#334155]/20 hover:bg-[#334155]/40 text-white rounded-xl transition-all cursor-pointer"
          >
            0
          </button>
          <button
            onClick={handleDecimal}
            className="p-4 text-base font-bold bg-[#334155]/20 hover:bg-[#334155]/40 text-white rounded-xl transition-all cursor-pointer"
          >
            .
          </button>
          <button
            onClick={handleCalculate}
            className="p-4 text-xl font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
          >
            =
          </button>
        </div>
      </div>

      {/* History panel */}
      <div className="flex-none md:flex-1 min-h-[320px] md:min-h-0 max-w-sm mx-auto w-full bg-[#1E293B]/60 border border-white/5 rounded-2xl flex flex-col overflow-hidden shadow-xl p-4 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2 text-white">
            <History size={16} className="text-slate-400" />
            <h3 className="font-semibold text-sm">Calculation History</h3>
          </div>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              title="Clear logs"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1 select-text scrollbar-thin">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs py-12 text-center space-y-2">
              <History size={24} className="opacity-30" />
              <p>No recent calculations</p>
              <p className="text-[10px] text-slate-600">Calculations will appear here</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => loadHistoryItem(item)}
                className="p-3 bg-[#0F172A]/40 border border-white/5 rounded-xl hover:border-blue-500/20 hover:bg-[#0F172A]/80 transition-all cursor-pointer text-right font-mono group"
              >
                <div className="text-[10px] text-slate-500 mb-1 flex justify-between items-center">
                  <span>{item.timestamp}</span>
                  <span className="text-blue-500/50 group-hover:text-blue-400 text-[9px] font-sans">Recall Result</span>
                </div>
                <div className="text-xs text-slate-400 truncate tracking-tight">{item.expression}</div>
                <div className="text-sm text-white font-bold tracking-tight mt-0.5">{item.result}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
