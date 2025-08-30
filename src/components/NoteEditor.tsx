import { useState, useEffect } from "react";
import { X, Save, Sparkles, Tag, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Note } from "./NoteCard";

interface NoteEditorProps {
  note?: Note;
  onSave: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

const NoteEditor = ({ note, onSave, onClose }: NoteEditorProps) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [summary, setSummary] = useState(note?.summary || '');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags);
      setSummary(note.summary || '');
    }
  }, [note]);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const generateSummary = () => {
    if (!content.trim()) return;
    
    setIsGeneratingSummary(true);
    
    // Simple extractive summarization (first few sentences)
    setTimeout(() => {
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const summaryText = sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? '.' : '');
      setSummary(summaryText || 'No content to summarize.');
      setIsGeneratingSummary(false);
    }, 1500);
  };

  const handleSave = () => {
    onSave({
      title: title.trim() || 'Untitled Note',
      content,
      summary,
      tags
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-gradient-card shadow-elegant">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary-foreground" />
            </div>
            <h2 className="text-lg font-semibold">
              {note ? 'Edit Note' : 'Create New Note'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleSave} className="bg-gradient-primary hover:shadow-elegant transition-spring">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Title */}
          <div>
            <Input
              placeholder="Note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-semibold border-none bg-transparent px-0 focus-visible:ring-0 placeholder:text-muted-foreground"
            />
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  <Tag className="w-3 h-3" />
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-destructive transition-colors"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button onClick={handleAddTag} variant="outline" disabled={!newTag.trim()}>
                Add
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Content</label>
              <Button
                onClick={generateSummary}
                disabled={!content.trim() || isGeneratingSummary}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                {isGeneratingSummary ? 'Generating...' : 'AI Summary'}
              </Button>
            </div>
            <Textarea
              placeholder="Start writing your note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[300px] resize-none text-sm leading-relaxed"
            />
          </div>

          {/* Summary */}
          {summary && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">AI Summary</label>
              <div className="bg-accent/30 p-4 rounded-lg border border-accent/50">
                <p className="text-sm text-accent-foreground">{summary}</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default NoteEditor;