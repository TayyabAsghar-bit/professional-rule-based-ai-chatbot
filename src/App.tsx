/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, FormEvent } from "react";
import { 
  Bot, 
  Menu, 
  X, 
  Zap, 
  ShieldCheck, 
  Code, 
  Calculator as CalcIcon,
  CloudSun as WeatherIcon,
  Scale as ScaleIcon,
  FileText as NotesIcon
} from "lucide-react";

// Import images directly via ESM
import botImg from "./assets/images/bot.png";
import logoImg from "./assets/images/logo.png";
import userImg from "./assets/images/user.png";

// Import subcomponents for our interactive rule modules
import Calculator from "./components/Calculator";
import UnitConverter from "./components/UnitConverter";
import WeatherStation from "./components/WeatherStation";
import QuickNotes from "./components/QuickNotes";

// Types
interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isConversationStarted, setIsConversationStarted] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "calculator" | "converter" | "weather" | "notes">("chat");

  const chatWindowRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear typing timeout on component unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Auto-scroll to the bottom of the chat window
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  /**
     * Cleans and normalizes user input to match rules
     */
  const normalizeInput = (text: string): string => {
    if (!text) return "";
    return text
      .toLowerCase()
      .trim()
      .replace(/[?!.,;: "'()]/g, "") // remove punctuation
      .replace(/\s+/g, " "); // collapse multiple spaces
  };

  /**
   * Deterministic logic translating input to pre-programmed responses
   */
  const getRuleBasedResponse = (userInput: string): string => {
    const cleanText = normalizeInput(userInput);

    if (!cleanText) {
      return "I didn't quite catch that. Could you please type something?";
    }

    // ==========================================
    // GREETINGS (1-10)
    // ==========================================
    if (["hello", "hi", "hey", "greetings"].includes(cleanText)) {
      return "Hello! I am your rule-based AI companion. How can I assist you today?";
    } else if (cleanText === "goodmorning") {
      return "Good morning! Wishing you an incredibly productive and wonderful day ahead.";
    } else if (cleanText === "goodafternoon") {
      return "Good afternoon! I hope your day is going beautifully. How can I help?";
    } else if (cleanText === "goodevening") {
      return "Good evening! I hope you are having a relaxing evening. What's on your mind?";
    } else if (["yo", "sup", "howdy"].includes(cleanText)) {
      return "Hey there! Just running some clean if-else code. How can I help you today?";
    } else if (["hibot", "hellobot"].includes(cleanText)) {
      return "Hello, human friend! It's a pleasure to connect with you. Ask me anything!";
    }

    // ==========================================
    // EXITS & CLOSURES (11-15)
    // ==========================================
    else if (["bye", "exit", "quit", "goodbye"].includes(cleanText)) {
      return "Goodbye! It was wonderful talking to you. Have an amazing day!";
    } else if (["seeyou", "seeya", "farewell"].includes(cleanText)) {
      return "Farewell! Feel free to restart our session anytime you want to chat.";
    }

    // ==========================================
    // GRATITUDE (16-20)
    // ==========================================
    else if (["thankyou", "thanks", "thanksbot", "thankyouverymuch"].includes(cleanText)) {
      return "You are very welcome! Helping you is exactly what my rules were written for.";
    } else if (["awesome", "perfect", "great", "cool"].includes(cleanText)) {
      return "Awesome! I'm glad I could provide a helpful answer. What should we discuss next?";
    } else if (["appreciateit", "muchappreciated"].includes(cleanText)) {
      return "I appreciate your kind feedback! Let me know if there's anything else I can clarify.";
    }

    // ==========================================
    // BOT IDENTITY & PERSONALITY (21-30)
    // ==========================================
    else if (["howareyou", "howareyoudoing", "howsitgoing"].includes(cleanText)) {
      return "I'm functioning at 100% efficiency! Thank you for asking. How are you doing today?";
    } else if (["whoareyou", "whatareyou"].includes(cleanText)) {
      return (
        "I am a Professional Rule-Based Chatbot built with Python, Flask, HTML, CSS, and JS. " +
        "I simulate intelligent conversations using deterministic decision logic!"
      );
    } else if (["whatisyourname", "whatsyourname"].includes(cleanText)) {
      return "My name is RuleBot v1.0, your friendly rule-based companion.";
    } else if (["whocreatedyou", "whoisyourcreator"].includes(cleanText)) {
      return "I was designed and coded by a Senior Software Engineer to showcase the power of structured rule-based logic!";
    } else if (["whatisyourage", "howoldareyou"].includes(cleanText)) {
      return "I was initialized just recently, so I am brand new! Age is just a variable to me.";
    } else if (["arereal", "areyouarealperson", "areyoureal"].includes(cleanText)) {
      return "I am a real, running computer program, but my intelligence is simulated entirely through pre-programmed rules.";
    } else if (cleanText === "areyouhuman") {
      return "No, I am 100% digital code! No biological cells or heartbeat, just pure logic.";
    } else if (["areyouanai", "areyouartificialintelligence"].includes(cleanText)) {
      return "I simulate an AI conversationalist, but strictly speaking, I run on deterministic rules rather than statistical neural networks.";
    } else if (cleanText === "whatisyourpurpose") {
      return "My purpose is to prove that clean, well-crafted if-else logic can deliver an interactive, helpful, and premium user experience.";
    } else if (["doyouhavefeelings", "aresad", "arehappy"].includes(cleanText)) {
      return "I don't experience human emotions, but my code is optimized to always be helpful, polite, and positive!";
    }

    // ==========================================
    // TECHNICAL & PROGRAMMING CONCEPTS (31-45)
    // ==========================================
    else if (cleanText === "whatispython") {
      return (
        "Python is a high-level, interpreted programming language celebrated for its elegant readability, " +
        "simplicity, and massive global ecosystem across web, data science, and scripting."
      );
    } else if (cleanText === "whatisflask") {
      return (
        "Flask is a micro web framework written in Python. It is classified as a microframework because it " +
        "does not require particular tools or libraries, making it highly customizable and lightweight."
      );
    } else if (["whatisai", "whatisartificialintelligence"].includes(cleanText)) {
      return (
        "Artificial Intelligence is the branch of computer science dedicated to creating systems capable of " +
        "performing tasks that traditionally require human intelligence, such as reasoning or learning."
      );
    } else if (["whatismachinelearning", "whatisml"].includes(cleanText)) {
      return (
        "Machine Learning is a subset of AI focused on building systems that learn patterns from data " +
        "and improve their accuracy over time without being explicitly programmed."
      );
    } else if (cleanText === "whatischatbot") {
      return (
        "A chatbot is a software application designed to mimic human conversation via text or voice interactions, " +
        "frequently used in customer service, assistance, and education."
      );
    } else if (cleanText === "whatishtml") {
      return "HTML (HyperText Markup Language) is the standard markup language used to structure and display web pages on the Internet.";
    } else if (cleanText === "whatiscss") {
      return "CSS (Cascading Style Sheets) is a stylesheet language used to design the visual presentation, colors, and layout of HTML documents.";
    } else if (["whatisjavascript", "whatisjs"].includes(cleanText)) {
      return (
        "JavaScript is a high-level, dynamic programming language that enables interactive elements, complex animations, " +
        "and client-side or server-side execution on the web."
      );
    } else if (["whatisnode", "whatisnodejs"].includes(cleanText)) {
      return "Node.js is an open-source, cross-platform JavaScript runtime environment that lets developers write backend code using JavaScript.";
    } else if (cleanText === "whatisreact") {
      return "React is an open-source frontend JavaScript library developed by Meta for building modular, high-performance user interfaces.";
    } else if (["whatistypescript", "whatists"].includes(cleanText)) {
      return "TypeScript is a strongly typed superset of JavaScript developed by Microsoft that adds static typing and better tooling to JS.";
    } else if (["whatisdatabase", "whatisdb"].includes(cleanText)) {
      return "A database is a systematic, electronic repository of structured data, managed efficiently by a Database Management System (DBMS).";
    } else if (cleanText === "whatissql") {
      return "SQL (Structured Query Language) is the standard programming language used for querying, editing, and managing relational databases.";
    } else if (cleanText === "whatisgithub") {
      return "GitHub is a web-based hosting service for Git repositories, allowing programmers to collaborate, version control, and share projects.";
    } else if (cleanText === "whatisapi") {
      return "An API (Application Programming Interface) is a set of defined rules that enables different software systems to connect and communicate.";
    }

    // ==========================================
    // UTILITIES & INTERACTIVE COMMANDS (46-57)
    // ==========================================
    else if (["date", "whatsthedate", "today"].includes(cleanText)) {
      const currentDate = new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      });
      return `Today's date is: ${currentDate}.`;
    } else if (["time", "whatsthetime", "currenttime"].includes(cleanText)) {
      const currentTime = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
      return `The current system time is: ${currentTime}.`;
    } else if (["help", "howdoiusethis"].includes(cleanText)) {
      return (
        "I can assist you with multiple topics! You can ask me about technologies (Python, Flask, CSS, HTML, JS), " +
        "utility commands (date, time), ask for light entertainment (joke, fact, quote), or type 'menu' for a detailed list."
      );
    } else if (cleanText === "menu") {
      return (
        "Here is my full interactive menu:\n" +
        "• 💬 **Chat Companion**: Engage in conversation about programming, concepts, and bot identity.\n" +
        "• 🧮 **Interactive Calculator**: Type 'calculator' or use the tab to open our scientific calculation sandbox.\n" +
        "• 🔄 **Unit Converter**: Type 'convert' or use the tab to perform instant offline metric conversions.\n" +
        "• 🌦️ **Weather Station**: Type 'weather' or use the tab to check reproducible forecasts for any city worldwide.\n" +
        "• 📝 **Quick Notes**: Type 'notes' or use the tab to save code snippets locally in your browser.\n" +
        "• 📚 **Concepts**: Ask 'what is python', 'what is flask', 'what is html', 'what is css', etc.\n" +
        "• 🗓️ **Utilities**: Ask for 'date' or 'time'.\n" +
        "• 💡 **Inspiration**: Ask me to 'motivate me'.\n" +
        "• 🎭 **Entertainment**: Type 'tell me a joke', 'random fact', or 'quote'.\n" +
        "• 🧹 **Controls**: Click 'Clear Chat' or type 'clear' to reset chat history."
      );
    } else if (cleanText === "services") {
      return (
        "I provide high-fidelity offline assistance, tech tutoring on modern programming languages, " +
        "inspirational messaging, and time/date tracking utilities."
      );
    } else if (["motivateme", "motivation", "inspireme"].includes(cleanText)) {
      return "Remember: 'The only way to do great work is to love what you do.' — Steve Jobs. Keep coding, stay curious, and keep building!";
    } else if (["tellmeajoke", "joke"].includes(cleanText)) {
      return "Why do programmers wear glasses? Because they can't C#! 😂";
    } else if (cleanText === "anotherjoke") {
      return "How many programmers does it take to change a light bulb? None, that's a hardware problem! 💡";
    } else if (["randomfact", "fact"].includes(cleanText)) {
      return "Did you know? The first computer bug was an actual real moth found trapped in a hardware relay of the Harvard Mark II computer in 1947!";
    } else if (cleanText === "anotherfact") {
      return "Did you know? Python was named after the famous British comedy troupe Monty Python, not the snake! 🐍";
    } else if (cleanText === "quote") {
      return "Here is a thoughtful quote: 'Simplicity is the soul of efficiency.' — Austin Freeman.";
    } else if (cleanText === "anotherquote") {
      return "Here is a powerful quote: 'Talk is cheap. Show me the code.' — Linus Torvalds.";
    }

    // ==========================================
    // LIMITED OR FUTURE FEATURES (58-60)
    // ==========================================
    else if (["weather", "whatstheweather", "forecast"].includes(cleanText)) {
      return (
        "I have opened the **Weather Station** for you! Input any city name in the Weather tab to generate a detailed, high-fidelity climate breakdown and 3-day forecast with humidity, wind speed, and UV metrics."
      );
    } else if (["calculator", "calc", "solve"].includes(cleanText)) {
      return "I have activated the **Interactive Calculator** module for you! You can now use the tactile keypad to perform standard and scientific math operations, view your live history, and compute values instantly.";
    } else if (["converter", "convert"].includes(cleanText)) {
      return "I have activated the **Unit Converter** module for you! Switch categories across Length, Weight, and Temperature for high-fidelity offline unit conversions.";
    } else if (["notes", "note"].includes(cleanText)) {
      return "I have opened **Quick Notes** for you! Write and save custom code snippets or checklists locally in your browser.";
    } else if (cleanText === "clear") {
      return "To clear the chat history, simply click the 'Clear Chat' button in the top right corner of the window.";
    }

    // ==========================================
    // ADDITIONAL PROGRAMMING / CHATBOT QUESTIONS (61-75+)
    // ==========================================
    else if (cleanText === "whatiswebdevelopment") {
      return "Web development refers to the building, creating, and maintaining of websites. It includes frontend, backend, and full-stack development.";
    } else if (cleanText === "whatisjson") {
      return "JSON (JavaScript Object Notation) is a lightweight, easy-to-read text format for storing and exchanging data between servers and clients.";
    } else if (cleanText === "whatisdocker") {
      return "Docker is a tool designed to make it easier to create, deploy, and run applications by using isolated containers.";
    } else if (cleanText === "whatisgit") {
      return "Git is an extremely popular, free distributed version control system designed to handle speed, integrity, and non-linear workflows.";
    } else if (cleanText === "doyoulikepython") {
      return "I absolutely love Python! It is elegant, readable, powerful, and is the very language running my Flask backend server.";
    } else if (cleanText === "doyoulikejavascript") {
      return "JavaScript is incredible! It powers my responsive frontend UI, animating components and sending requests asynchronously.";
    } else if (cleanText === "tellmeasecret") {
      return "I'm secretly just an elegant set of nested if-else statements! Shhh, don't tell the neural networks. 🤫";
    } else if (["howtolearnpython", "howdoilearnpython"].includes(cleanText)) {
      return "Start by writing simple scripts, understanding basic concepts like lists and loops, and building rule-based projects just like this!";
    } else if (["howtodebug", "howdoidebug"].includes(cleanText)) {
      return "Debugging is the art of solving problems in code. Use prints, visual inspection, logs, and tracebacks to track down variables.";
    } else if (cleanText === "whatiscoding") {
      return "Coding is translating human logical processes into a series of detailed commands that a computer can run and execute perfectly.";
    }

    // ==========================================
    // KEYWORD-BASED FALLBACK MATCHES
    // ==========================================
    else if (cleanText.includes("python")) {
      return "I noticed you mentioned Python! Python is a great, beginner-friendly, and powerful language. Ask 'what is python' for more details!";
    } else if (cleanText.includes("flask")) {
      return "Flask is a fantastic, lightweight Python microframework. Ask 'what is flask' to learn about its architecture!";
    } else if (cleanText.includes("html") || cleanText.includes("css")) {
      return "HTML structures a webpage, while CSS styles it beautifully. Ask 'what is html' or 'what is css' for standard definitions!";
    } else if (cleanText.includes("javascript") || cleanText.includes("js")) {
      return "JavaScript makes websites dynamic and interactive. Ask 'what is javascript' to read about its features!";
    } else if (cleanText.includes("joke")) {
      return "Want to hear a joke? Type 'tell me a joke' and I will make you smile!";
    } else if (cleanText.includes("fact")) {
      return "I have fascinating trivia! Type 'random fact' and learn something new!";
    } else if (cleanText.includes("quote")) {
      return "Need some inspiration? Type 'quote' to read a beautiful, motivating quote!";
    } else if (cleanText.includes("menu") || cleanText.includes("help")) {
      return "Need assistance? Type 'menu' or 'help' to see my structured interactive options!";
    }

    // ==========================================
    // FINAL UNKNOWN FALLBACK
    // ==========================================
    else {
      return (
        "That's an interesting question! As a rule-based chatbot, my responses are pre-programmed. " +
        "Please type 'menu' or 'help' to see a list of topics I can explain perfectly!"
      );
    }
  };

  /**
   * Helper to format raw text with simple Markdown styles
   */
  const parseResponseFormatting = (text: string) => {
    let formatted = text;
    // Replace **bold** with bold element
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

    if (formatted.includes("\n")) {
      const lines = formatted.split("\n");
      let inList = false;
      const listItems: any[] = [];
      const blocks: any[] = [];

      lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.match(/^\d+\./)) {
          if (!inList) {
            inList = true;
          }
          const cleanLine = trimmed.replace(/^(?:[•\-]|(?:\d+\.))\s*/, "");
          listItems.push(<li key={`li-${index}`} className="mb-1 leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: cleanLine }}></li>);
        } else {
          if (inList) {
            inList = false;
            blocks.push(<ul key={`ul-${index}`} className="list-disc pl-5 my-2 text-slate-200">{[...listItems]}</ul>);
            listItems.length = 0; // Clear the array
          }
          if (trimmed) {
            blocks.push(<p key={`p-${index}`} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: trimmed }}></p>);
          }
        }
      });

      if (inList) {
        blocks.push(<ul key="ul-final" className="list-disc pl-5 my-2 text-slate-200">{[...listItems]}</ul>);
      }

      return <div className="space-y-2">{blocks}</div>;
    }

    return <p className="leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }}></p>;
  };

  /**
   * Formats current hour as "HH:MM AM/PM"
   */
  const getFormattedTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  /**
   * Sends user message and triggers bot reply with typing realism
   */
  const handleSendMessage = (textToSend?: string) => {
    if (isTyping) return;
    const query = textToSend !== undefined ? textToSend : inputValue.trim();
    if (!query) return;

    if (!isConversationStarted) {
      setIsConversationStarted(true);
    }

    const newUserMessage: Message = {
      id: `msg-${Date.now()}-user`,
      sender: "user",
      text: query,
      time: getFormattedTime()
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");

    setIsTyping(true);

    // Simulated typing realism delay
    typingTimeoutRef.current = setTimeout(() => {
      const responseText = getRuleBasedResponse(query);
      
      // Auto-trigger tab switching based on user query rules
      const cleanText = normalizeInput(query);
      if (["calculator", "calc", "solve"].includes(cleanText)) {
        setActiveTab("calculator");
      } else if (["weather", "whatstheweather", "forecast"].includes(cleanText)) {
        setActiveTab("weather");
      } else if (["converter", "convert"].includes(cleanText)) {
        setActiveTab("converter");
      } else if (["notes", "note"].includes(cleanText)) {
        setActiveTab("notes");
      }

      const newBotMessage: Message = {
        id: `msg-${Date.now()}-bot`,
        sender: "bot",
        text: responseText,
        time: getFormattedTime()
      };
      setMessages((prev) => [...prev, newBotMessage]);
      setIsTyping(false);
      typingTimeoutRef.current = null;
    }, 800);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isTyping) return;
    handleSendMessage();
  };

  const handleClearChat = () => {
    setShowClearConfirm(true);
  };

  const confirmClearChat = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    setMessages([]);
    setIsTyping(false);
    setIsConversationStarted(false);
    setShowClearConfirm(false);
  };

  const suggestCommand = (command: string) => {
    if (isTyping) return;
    handleSendMessage(command);
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  const listCommands = [
    "hello",
    "help",
    "menu",
    "date",
    "time",
    "what is python",
    "what is flask",
    "what is css",
    "motivate me",
    "tell me a joke",
    "random fact",
    "quote",
    "weather",
    "calculator"
  ];

  return (
    <div className="relative flex flex-col h-screen w-screen overflow-hidden bg-[#0F172A] text-white font-sans select-none antialiased">
      
      {/* Navigation Bar */}
      <nav className="h-16 flex items-center justify-between px-6 bg-[#1E293B]/80 backdrop-blur-md border-b border-white/10 z-20 shrink-0">
        <div className="flex items-center space-x-3">
          <button className="lg:hidden text-slate-400 hover:text-white mr-1 cursor-pointer" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shadow-lg shadow-blue-500/20 border border-white/10">
            <img src={logoImg} alt="RuleBot Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-sm md:text-base font-semibold tracking-tight text-white flex items-center">
            LogicBot <span className="text-[#60A5FA] text-[10px] md:text-xs font-mono ml-2 opacity-70">v1.0 (Rule-Based)</span>
          </h1>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="hidden sm:inline">System Online</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#334155] border border-white/10 overflow-hidden flex items-center justify-center">
            <img src={userImg} alt="User Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Sidebar */}
        <aside className={`fixed lg:static top-0 bottom-0 left-0 z-40 flex h-full w-72 bg-[#1E293B]/90 lg:bg-[#1E293B]/40 border-r border-white/10 flex-col p-4 space-y-4 backdrop-blur-xl lg:backdrop-blur-none transition-all duration-300 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          
          <div className="lg:hidden flex justify-end">
            <button className="text-slate-400 hover:text-white cursor-pointer" onClick={() => setIsSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <button 
            onClick={handleClearChat}
            className="w-full py-3 px-4 rounded-xl border border-dashed border-white/20 hover:border-blue-400 hover:bg-blue-500/5 transition-all flex items-center justify-center space-x-2 group cursor-pointer"
          >
            <span className="text-lg text-slate-400 group-hover:scale-110 transition-transform group-hover:text-blue-400">+</span>
            <span className="text-sm font-medium text-slate-300 group-hover:text-white">New Conversation</span>
          </button>

          {/* Module Navigation Tabs */}
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 px-1">Interactive Modules</p>
            <button
              onClick={() => {
                setActiveTab("chat");
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "chat"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10 border border-blue-500/10"
                  : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <Bot size={15} />
              <span>Chat Companion</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("calculator");
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "calculator"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10 border border-blue-500/10"
                  : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <CalcIcon size={15} />
              <span>Interactive Calculator</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("converter");
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "converter"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10 border border-blue-500/10"
                  : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <ScaleIcon size={15} />
              <span>Unit Converter</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("weather");
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "weather"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10 border border-blue-500/10"
                  : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <WeatherIcon size={15} />
              <span>Weather Station</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("notes");
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "notes"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10 border border-blue-500/10"
                  : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <NotesIcon size={15} />
              <span>Quick Notes</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            <div className="px-1 py-2">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">Pre-defined Queries</p>
              <div className="space-y-1">
                <div 
                  onClick={() => suggestCommand("what is python")}
                  className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center space-x-3 cursor-pointer hover:bg-blue-500/15 transition-all"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span className="text-xs font-medium text-blue-300 truncate">What is Python?</span>
                </div>
                <div 
                  onClick={() => suggestCommand("help")}
                  className="p-3 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/5 transition-all flex items-center space-x-3 cursor-pointer group"
                >
                  <div className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-slate-400"></div>
                  <span className="text-xs text-slate-400 group-hover:text-slate-200 truncate">Help with commands</span>
                </div>
                <div 
                  onClick={() => suggestCommand("weather")}
                  className="p-3 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/5 transition-all flex items-center space-x-3 cursor-pointer group"
                >
                  <div className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-slate-400"></div>
                  <span className="text-xs text-slate-400 group-hover:text-slate-200 truncate">Weather enquiry</span>
                </div>
                <div 
                  onClick={() => suggestCommand("calculator")}
                  className="p-3 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/5 transition-all flex items-center space-x-3 cursor-pointer group"
                >
                  <div className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-slate-400"></div>
                  <span className="text-xs text-slate-400 group-hover:text-slate-200 truncate">Interactive Calculator</span>
                </div>
              </div>
            </div>

            <div className="px-1 pt-2">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">All Predefined Tags</p>
              <div className="flex flex-wrap gap-1">
                {listCommands.map((cmd) => (
                  <span 
                    key={cmd}
                    onClick={() => suggestCommand(cmd)}
                    className="cursor-pointer rounded-lg border border-blue-500/10 bg-blue-500/5 px-2 py-0.5 text-[10px] font-mono text-blue-400 transition-all hover:bg-blue-500 hover:text-white"
                  >
                    {cmd}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 bg-black/20 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Node Logic</span>
              <span className="text-[10px] text-blue-400 font-mono">Active</span>
            </div>
            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full w-4/5 bg-blue-500"></div>
            </div>
          </div>
        </aside>

        {/* Mobile Backdrop */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
        )}

        {/* Chat Main Area */}
        <main className="flex-1 flex flex-col bg-[#0F172A] relative overflow-hidden">
          
          {/* Header to display current Tab */}
          <div className="bg-[#111827]/60 border-b border-white/5 py-3 px-6 flex items-center justify-between shrink-0 z-20">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
              {activeTab === "chat" && (
                <>
                  <Bot size={14} className="text-blue-400" />
                  <span>Interactive Chat Companion</span>
                </>
              )}
              {activeTab === "calculator" && (
                <>
                  <CalcIcon size={14} className="text-blue-400" />
                  <span>Precision Calculator Sandbox</span>
                </>
              )}
              {activeTab === "converter" && (
                <>
                  <ScaleIcon size={14} className="text-blue-400" />
                  <span>Unit Conversion Studio</span>
                </>
              )}
              {activeTab === "weather" && (
                <>
                  <WeatherIcon size={14} className="text-blue-400" />
                  <span>Simulated Weather Station</span>
                </>
              )}
              {activeTab === "notes" && (
                <>
                  <NotesIcon size={14} className="text-blue-400" />
                  <span>Scratchpad Notebooks</span>
                </>
              )}
            </div>
            {activeTab !== "chat" && (
              <button
                onClick={() => setActiveTab("chat")}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
              >
                <span>Back to Chat</span>
                <span>&rarr;</span>
              </button>
            )}
          </div>

          {activeTab === "chat" ? (
            <>
              {/* Decorative background glow */}
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>

              {/* Message Container */}
              <div ref={chatWindowRef} className="flex-1 p-6 md:p-8 overflow-y-auto space-y-8 z-10">
                
                {/* Bot Welcome if empty */}
                {!isConversationStarted && (
                  <div className="max-w-2xl mx-auto space-y-6 pt-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-9 h-9 rounded-lg bg-[#1E293B] border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-lg">
                        <img src={botImg} alt="RuleBot Avatar" className="w-full h-full object-cover" />
                      </div>
                      <div className="max-w-[80%]">
                        <div className="bg-[#1E293B] p-5 rounded-2xl rounded-tl-none border border-white/5 shadow-xl space-y-3">
                          <p className="text-sm leading-relaxed text-slate-200">
                            Hello! I am <span className="text-blue-400 font-semibold">LogicBot</span>, a professional rule-based assistant. How can I help you today?
                          </p>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            This is a high-fidelity chatbot constructed entirely with clean, deterministic rule-based programming. Zero large language models, zero cloud request costs, and zero hallucination. 100% logic and software engineering.
                          </p>
                        </div>
                        <span className="text-[10px] text-slate-500 mt-2 block ml-1">LogicBot • {getFormattedTime()}</span>
                      </div>
                    </div>

                    {/* Grid features */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pl-0 sm:pl-13">
                      <div onClick={() => suggestCommand("hello")} className="rounded-xl border border-white/5 bg-[#1E293B]/50 p-4 text-left transition hover:border-blue-500/20 hover:bg-[#1E293B]/80 cursor-pointer">
                        <ShieldCheck size={18} className="mb-2 text-blue-500" />
                        <h4 className="text-[11px] font-bold text-white mb-1">Deterministic</h4>
                        <p className="text-[10px] text-slate-400 leading-normal">Say "hello" or "menu" to see supported tags.</p>
                      </div>
                      <div onClick={() => suggestCommand("calculator")} className="rounded-xl border border-white/5 bg-[#1E293B]/50 p-4 text-left transition hover:border-blue-500/20 hover:bg-[#1E293B]/80 cursor-pointer">
                        <Zap size={18} className="mb-2 text-blue-500" />
                        <h4 className="text-[11px] font-bold text-white mb-1">Interactive Calc</h4>
                        <p className="text-[10px] text-slate-400 leading-normal">Enter "calculator" for quick calculations.</p>
                      </div>
                      <div onClick={() => suggestCommand("what is python")} className="rounded-xl border border-white/5 bg-[#1E293B]/50 p-4 text-left transition hover:border-blue-500/20 hover:bg-[#1E293B]/80 cursor-pointer">
                        <Code size={18} className="mb-2 text-blue-500" />
                        <h4 className="text-[11px] font-bold text-white mb-1">Rule Stack</h4>
                        <p className="text-[10px] text-slate-400 leading-normal">Ask "what is python" or "what is css" to check details.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Conversation Log */}
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex items-start space-x-4 ${msg.sender === "user" ? "justify-end" : ""}`}>
                    {msg.sender === "bot" && (
                      <div className="w-9 h-9 rounded-lg bg-[#1E293B] border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-lg">
                        <img src={botImg} alt="RuleBot Avatar" className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div className={`max-w-[80%] ${msg.sender === "user" ? "flex flex-col items-end" : ""}`}>
                      <div className={`p-4 rounded-2xl border ${msg.sender === "user" ? "bg-blue-600 border-transparent rounded-tr-none shadow-lg shadow-blue-900/20 text-white" : "bg-[#1E293B] border-white/5 rounded-tl-none shadow-xl text-slate-200"}`}>
                        {msg.sender === "bot" ? parseResponseFormatting(msg.text) : <p className="text-sm leading-relaxed">{msg.text}</p>}
                      </div>
                      <span className="text-[10px] text-slate-500 mt-2 block mx-1">
                        {msg.sender === "bot" ? `LogicBot • ${msg.time}` : `You • ${msg.time}`}
                      </span>
                    </div>

                    {msg.sender === "user" && (
                      <div className="w-9 h-9 rounded-lg bg-[#1E293B] border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        <img src={userImg} alt="User Avatar" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Bot Typing Indicator */}
                {isTyping && (
                  <div className="flex items-start space-x-4 opacity-50">
                    <div className="w-9 h-9 rounded-lg bg-[#1E293B] border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-lg">
                      <img src={botImg} alt="RuleBot Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-[#1E293B]/40 px-4 py-3 rounded-2xl flex space-x-1 items-center border border-white/5">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></div>
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></div>
                    </div>
                  </div>
                )}

              </div>

              {/* Input Area */}
              <div className="p-6 bg-gradient-to-t from-[#0F172A] via-[#0F172A] to-transparent z-20 shrink-0">
                <form onSubmit={onSubmit} className="relative max-w-4xl mx-auto">
                  <input 
                    type="text" 
                    value={inputValue}
                    disabled={isTyping}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={isTyping ? "LogicBot is typing..." : "Ask LogicBot anything..."}
                    className="w-full bg-[#1E293B] border border-white/10 rounded-2xl py-4 pl-6 pr-32 text-sm text-white focus:outline-none focus:border-blue-500/50 shadow-2xl transition-all placeholder:text-slate-500 disabled:opacity-50"
                  />
                  <div className="absolute right-2 top-2 flex space-x-1">
                    <button 
                      type="button"
                      onClick={handleClearChat}
                      disabled={isTyping}
                      className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                      title="Clear chat"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                    <button 
                      type="submit"
                      disabled={!inputValue.trim() || isTyping}
                      className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none px-6 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/20 text-white cursor-pointer"
                    >
                      SEND
                    </button>
                  </div>
                </form>
                <p className="text-center text-[10px] text-slate-600 mt-4 uppercase tracking-[0.2em] font-medium">Rule-Based Architecture • No External APIs • 100% Deterministic</p>
              </div>
            </>
          ) : (
            <div className="flex-1 overflow-hidden relative flex flex-col z-10 bg-[#0F172A]">
              {activeTab === "calculator" && <Calculator />}
              {activeTab === "converter" && <UnitConverter />}
              {activeTab === "weather" && <WeatherStation />}
              {activeTab === "notes" && <QuickNotes />}
            </div>
          )}

        </main>
      </div>

      {/* Custom Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowClearConfirm(false)}
          ></div>
          
          {/* Modal Card */}
          <div className="relative bg-[#1E293B] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-semibold text-white mb-2">Clear chat history?</h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Are you sure you want to clear your entire conversation history? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmClearChat}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20 transition-all cursor-pointer"
              >
                Clear Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
