# LogicBot: Professional Rule-Based Chatbot & Interactive Utility Sandbox

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.0-blue.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-purple.svg?logo=vite)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind--CSS-4.1-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)

An offline-first, zero-cost, high-fidelity conversational chatbot and interactive utility suite built entirely with pure, deterministic software engineering. By bypassing external Large Language Model (LLM) APIs, LogicBot eliminates latency, API usage bills, hosting dependencies, and response hallucinations, proving that structured rule-based systems can deliver robust, high-performance interactive experiences.

---

## 📖 Project Description

**LogicBot** is a high-fidelity client-side web application containing an interactive rule-based chat companion and four tightly integrated utility sandboxes:
1. **Interactive Calculator**: A scientific math solver featuring trigonometry, powers, logs, and a dynamic local history log.
2. **High-Fidelity Unit Converter**: A rapid metric and imperial conversion utility supporting Length, Weight, and Temperature metrics.
3. **Simulated Weather Station**: A deterministic, string-hash seeded weather engine generating reproducible, rich forecasts and multi-day climate projections.
4. **Quick Notes Scratchpad**: A locally persisting markdown-ready notebook supporting code snippets, lists, and manual entry.

The application serves as a benchmark for high-performance React frontends, emphasizing responsive desktop/mobile responsive UI, elegant typography, structured CSS state-management, and immediate interaction speeds.

---

## 🛠️ Chatbot Architecture: 100% Rule-Based

LogicBot operates **entirely local to the client browser** using deterministic, pattern-matching regex compilers and pre-defined relational lookup stacks.

```
[ User Input ] ---> [ Normalizer / RegEx Matches ] ---> [ Strict Rule Mapping ]
                                                               |
[ Real-Time Client UI ] <--- [ Formatted Response Render ] <---/
```

### What It Does NOT Use:
* ❌ **No OpenAI API** (GPT-3.5/GPT-4/GPT-4o)
* ❌ **No Gemini API** (Gemini Nano/Flash/Pro)
* ❌ **No Claude API**
* ❌ **No LangChain or Semantic Orchestrators**
* ❌ **No Machine Learning, Vector DBs, or Neural Networks**
* ❌ **No Outbound Network Latency or Cloud API Cost**

Every reaction is immediate, structured, predictable, and fully inspectable in the frontend codebase, ensuring total privacy and complete offline readiness.

---

## ✨ Features

* 💬 **Deterministic Chat Companion**: Handles greetings, navigation help, system metadata explanations, programming definitions (HTML, CSS, React, Flask, Python), and developer inspiration quotes.
* 🧮 **Precision Calculator**: Fully interactive scientific panel supporting keyboard shortcuts, trigonometric conversions (Sin, Cos, Tan in degrees), square roots, exponential powers (`^`), negative toggling (`±`), and dynamic, recallable history logs.
* 🔄 **Tactile Unit Converter**: Seamless, instant calculations for multi-tier metrics using base-ratio math conversions.
* 🌦️ **Deterministic Weather Station**: Implements a custom string-hash algorithm based on standard character-code seeding. Any city searched yields a stable, unique, and fully structured weather card (UV index, humidity, wind, 3-day future forecasts) locally.
* 📝 **Notebook Scratchpad**: Create, read, edit, and delete notes. Uses standard `localStorage` APIs to retain checklists, command reference guides, or code fragments.
* ⚙️ **Auto-Trigger Navigation**: Entering phrases like "solve `5 + 5`", "what's the weather in London", or "open converter" in the chat console automatically triggers the underlying UI to transition tabs smoothly.

---

## 🚀 Technologies Used

* **Frontend Framework**: [React 19](https://react.dev/) (Functional Components, Custom Hook State Synchronization)
* **Programming Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Compile-Time Checking)
* **Build System & Bundler**: [Vite 6](https://vite.dev/)
* **CSS Framework**: [Tailwind CSS 4](https://tailwindcss.com/)
* **Icons**: [Lucide React](https://lucide.dev/) (Consistent, performant vector graphics)
* **Animations**: [Motion React](https://motion.dev/) (Smooth route entries, drawer slides, and button presses)
* **Local State Engine**: Core HTML5 `localStorage` APIs

---

## 📂 Folder Structure

```text
/
├── public/                 # Static assets
│   └── static/
│       └── images/         # High-contrast bot/user avatars
├── src/
│   ├── assets/             # Bundled application images
│   ├── components/         # Modular interactive features
│   │   ├── Calculator.tsx  # Interactive scientific calculator
│   │   ├── QuickNotes.tsx  # HTML5 sandboxed notebook
│   │   ├── UnitConverter.tsx # High-fidelity metric converter
│   │   └── WeatherStation.tsx # String-hash climate engine
│   ├── App.tsx             # Main chat terminal shell and router
│   ├── index.css           # Global typography & Tailwind configuration
│   ├── main.tsx            # React application entry-point
│   └── vite-env.d.ts       # TypeScript environmental types
├── package.json            # Simplified production package declarations
├── tsconfig.json           # TypeScript compilation strict guidelines
└── vite.config.ts          # Core Vite plugins & bundler config
```

---

## ⚡ Installation & Local Setup

### Prerequisites
Make sure you have Node.js (v18.0 or higher) and npm installed.

### 1. Clone or Download the Project
```bash
# Extract the files or download the zip package to your workspace root.
cd <project-directory>
```

### 2. Install Dependencies
```bash
npm install
```

---

## 🏃 Running the Project

### Development Server
Run the local Vite development server on port `3000`:
```bash
npm run dev
```
Navigate to `http://localhost:3000` to interact with the application.

### Production Build
Build and optimize the application package for deployment:
```bash
npm run build
```
The optimized web application assets will output inside the `/dist` directory, fully static and ready to host anywhere.

### Code Quality Linters
Ensure TypeScript type correctness and syntax style validation:
```bash
npm run lint
```

---

## 🏆 Project Highlights

* **Desktop & Mobile Responsive Precision**: Engineered using mobile-first Tailwind wrappers, custom height fallbacks (`min-h-full` and `h-full` scaling), and scroll containment parameters (`overflow-y-auto`) to guarantee zero-layout shift on any device.
* **Instantaneous UI**: By removing loading thresholds, external HTTP telemetry hooks, or remote network handshakes, component transition states change instantly under 10 milliseconds.
* **Highly Documented & Type-Safe**: Entirely self-contained codebase structured around pure component modularity to optimize bundler tree-shaking and reduce overall load weight.

---

## 🔮 Future Improvements

1. **Rule Stack Expansion**: Integrate custom user-defined commands directly within the database schema to let users create personalized chat keywords.
2. **Formula Library**: Pre-populate the Interactive Calculator with quick-solve tabs for standard geometry, financial, or engineering equations.
3. **Multi-Format Note Export**: Allow Quick Notes contents to be compiled and downloaded directly as plain text, `.json`, or Markdown files.

---

## 👥 Author

* **Developer**: [Tayyab Asghar](mailto:miantayyab5633@gmail.com)
* **GitHub**: [github.com/tayyabasghar](https://github.com)
* **LinkedIn**: [linkedin.com/in/tayyabasghar](https://linkedin.com)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://opensource.org/licenses/MIT) guidelines for details.
