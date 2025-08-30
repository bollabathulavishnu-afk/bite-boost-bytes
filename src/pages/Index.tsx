import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import NoteCard, { type Note } from "@/components/NoteCard";
import NoteEditor from "@/components/NoteEditor";
import EmptyState from "@/components/EmptyState";

const Index = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("notesai-notes");
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        }));
        setNotes(parsedNotes);
      } catch (error) {
        console.error("Failed to load notes:", error);
      }
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem("notesai-notes", JSON.stringify(notes));
  }, [notes]);

  const handleCreateNote = () => {
    setIsCreating(true);
    setEditingNote(null);
  };

  const handleSaveNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    
    if (editingNote) {
      // Update existing note
      setNotes(prev => prev.map(note => 
        note.id === editingNote.id 
          ? { ...noteData, id: editingNote.id, createdAt: editingNote.createdAt, updatedAt: now }
          : note
      ));
      toast({
        title: "Note updated",
        description: "Your note has been successfully updated.",
      });
    } else {
      // Create new note
      const newNote: Note = {
        ...noteData,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      };
      setNotes(prev => [newNote, ...prev]);
      toast({
        title: "Note created",
        description: "Your new note has been created successfully.",
      });
    }
    
    setIsCreating(false);
    setEditingNote(null);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsCreating(false);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    toast({
      title: "Note deleted",
      description: "Your note has been deleted.",
      variant: "destructive",
    });
  };

  const handleCloseEditor = () => {
    setIsCreating(false);
    setEditingNote(null);
  };

  // Filter and search notes
  const filteredNotes = notes.filter(note => {
    const matchesSearch = searchQuery === "" || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    if (selectedFilter === "all") return matchesSearch;
    if (selectedFilter === "summarized") return matchesSearch && note.summary;
    if (selectedFilter.startsWith("tag:")) {
      const tag = selectedFilter.replace("tag:", "");
      return matchesSearch && note.tags.includes(tag);
    }
    
    return matchesSearch;
  });

  // Get all unique tags
  const allTags = Array.from(new Set(notes.flatMap(note => note.tags))).sort();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        onCreateNote={handleCreateNote}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <div className="flex-1 flex">
        <Sidebar 
          totalNotes={notes.length}
          activeTags={allTags}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />
        
        <main className="flex-1 p-8">
          {filteredNotes.length === 0 && notes.length === 0 ? (
            <EmptyState onCreateNote={handleCreateNote} />
          ) : filteredNotes.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">No notes found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Note Editor Modal */}
      {(isCreating || editingNote) && (
        <NoteEditor
          note={editingNote || undefined}
          onSave={handleSaveNote}
          onClose={handleCloseEditor}
        />
      )}
    </div>
  );
};

export default Index;
