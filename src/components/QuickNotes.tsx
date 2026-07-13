import React, { useState, useEffect } from "react";
import { FileText, Plus, Trash2, Edit3, Save, Sparkles } from "lucide-react";

interface QuickNote {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export default function QuickNotes() {
  const [notes, setNotes] = useState<QuickNote[]>(() => {
    const saved = localStorage.getItem("logicbot_quick_notes");
    if (saved) return JSON.parse(saved);

    // Default welcome notes
    return [
      {
        id: "note-1",
        title: "💡 Interactive Commands",
        content: "Here are some of the best commands you can type into LogicBot:\n\n• 'menu' - Displays all interactive tools.\n• 'tell me a joke' - Triggers humorous logic rules.\n• 'what is react' - Explains React engineering.\n• 'motivate me' - Provides inspiring quotes.",
        updatedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      },
      {
        id: "note-2",
        title: "🐍 Python Setup Guide",
        content: "Steps to boot up Flask locally:\n\n1. Ensure Python 3.8+ is installed.\n2. Install flask using pip:\n   pip install flask\n3. Run the entry point:\n   python app.py\n4. Access http://127.0.0.1:5000",
        updatedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      }
    ];
  });

  const [selectedNoteId, setSelectedNoteId] = useState<string>("note-1");
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    localStorage.setItem("logicbot_quick_notes", JSON.stringify(notes));
  }, [notes]);

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || notes[0];

  const handleCreateNote = () => {
    const newNote: QuickNote = {
      id: `note-${Date.now()}`,
      title: "New Code Note",
      content: "Type your notes or custom commands here...",
      updatedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    setNotes((prev) => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
    setEditTitle(newNote.title);
    setEditContent(newNote.content);
    setIsEditing(true);
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedNotes = notes.filter((n) => n.id !== id);
    setNotes(updatedNotes);
    if (selectedNoteId === id && updatedNotes.length > 0) {
      setSelectedNoteId(updatedNotes[0].id);
    }
  };

  const handleStartEdit = () => {
    if (!selectedNote) return;
    setEditTitle(selectedNote.title);
    setEditContent(selectedNote.content);
    setIsEditing(true);
  };

  const handleSaveNote = () => {
    if (!selectedNote) return;
    const updated = notes.map((n) => {
      if (n.id === selectedNoteId) {
        return {
          ...n,
          title: editTitle.trim() || "Untitled Note",
          content: editContent,
          updatedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        };
      }
      return n;
    });

    setNotes(updated);
    setIsEditing(false);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-full md:h-full w-full bg-[#0F172A] p-4 md:p-8 overflow-y-auto space-y-6 md:space-y-0 md:space-x-8 select-text">
      {/* Sidebar notes list */}
      <div className="w-full md:w-72 min-h-[220px] md:min-h-0 bg-[#1E293B] border border-white/10 rounded-2xl p-4 flex flex-col space-y-4 shadow-xl shrink-0">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center space-x-2 text-white">
            <FileText size={18} className="text-blue-400" />
            <span className="font-bold text-sm">Quick Notes</span>
          </div>
          <button
            onClick={handleCreateNote}
            className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer flex items-center justify-center"
            title="Create new note"
          >
            <Plus size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
          {notes.length === 0 ? (
            <div className="text-center text-slate-500 text-xs py-8">
              No notes saved. Click "+" to create one!
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                onClick={() => {
                  setSelectedNoteId(note.id);
                  setIsEditing(false);
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                  selectedNoteId === note.id
                    ? "bg-blue-600/10 border-blue-500/35 text-white"
                    : "bg-[#0F172A]/40 border-white/5 text-slate-400 hover:border-white/10 hover:bg-[#0F172A]/80"
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-semibold text-xs truncate text-slate-100 flex-1">{note.title}</h4>
                  <button
                    onClick={(e) => handleDeleteNote(note.id, e)}
                    className="text-slate-500 hover:text-red-400 p-0.5 rounded transition-colors"
                    title="Delete Note"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 truncate">{note.content}</p>
                <span className="text-[9px] text-slate-500 mt-2 block font-mono">{note.updatedAt}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Editor/Reader Pane */}
      <div className="flex-none md:flex-1 min-h-[400px] md:min-h-0 bg-[#1E293B] border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col shadow-2xl relative">
        {selectedNote ? (
          <>
            {isEditing ? (
              <div className="flex-1 flex flex-col space-y-4 h-full">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-[#0F172A] border border-white/10 focus:border-blue-500/50 rounded-xl px-4 py-2.5 text-sm text-white font-semibold focus:outline-none transition-all"
                  placeholder="Note Title"
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full flex-1 bg-[#0F172A] border border-white/10 focus:border-blue-500/50 rounded-xl p-4 text-xs text-slate-300 focus:outline-none transition-all resize-none font-mono leading-relaxed"
                  placeholder="Write your note markdown or tasks here..."
                />
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNote}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Save size={13} />
                    <span>Save Note</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col h-full space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white leading-tight">{selectedNote.title}</h2>
                    <span className="text-[10px] text-slate-500 font-mono mt-1 block">Last updated: {selectedNote.updatedAt}</span>
                  </div>
                  <button
                    onClick={handleStartEdit}
                    className="p-2 bg-blue-600/10 border border-blue-500/20 hover:bg-blue-600/20 text-blue-400 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 text-xs font-semibold"
                  >
                    <Edit3 size={14} />
                    <span className="hidden sm:inline">Edit Note</span>
                  </button>
                </div>
                <div className="flex-1 text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap overflow-y-auto pr-2 bg-[#0F172A]/30 p-4 rounded-xl border border-white/5">
                  {selectedNote.content}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2 py-12 text-slate-500">
            <Sparkles size={32} className="opacity-30 text-slate-400" />
            <h3 className="font-bold text-sm text-slate-400">Notebook Sandbox</h3>
            <p className="text-xs max-w-xs leading-relaxed">Create a note from the left sidebar panel to begin jotting down instructions, commands, or documentation snippets.</p>
          </div>
        )}
      </div>
    </div>
  );
}
