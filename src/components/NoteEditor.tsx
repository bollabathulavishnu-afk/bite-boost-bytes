import { useState, useEffect } from "react";
import { X, Save, Sparkles, Tag, FileText, ChevronDown, Brain, HelpCircle, List, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [summaryType, setSummaryType] = useState<string>('concise');
  const [generatedContent, setGeneratedContent] = useState<{[key: string]: string}>({});

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
    
    setTimeout(() => {
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const words = content.split(/\s+/).filter(w => w.length > 3);
      
      let result = '';
      
      switch (summaryType) {
        case 'concise':
          result = sentences.slice(0, 3).join('. ') + (sentences.length > 3 ? '.' : '');
          break;
          
        case 'bullet':
          const keyPoints = sentences.slice(0, 5).map((s, i) => `• ${s.trim()}`).join('\n');
          result = keyPoints;
          break;
          
        case 'simplified':
          result = `In simple terms: ${sentences.slice(0, 2).join('. ')}. This is important because it helps us understand the main idea.`;
          break;
          
        case 'detailed':
          result = `Key Points:\n${sentences.slice(0, 3).map((s, i) => `${i + 1}. ${s.trim()}`).join('\n')}\n\nMain Concepts: ${words.slice(0, 5).join(', ')}`;
          break;
          
        case 'qna':
          result = `Q: What is the main topic?\nA: ${sentences[0] || 'Not specified'}\n\nQ: What are the key points?\nA: ${sentences.slice(1, 3).join('. ')}`;
          break;
          
        case 'flashcards':
          result = `Card 1:\nQ: Main concept?\nA: ${sentences[0] || 'See content'}\n\nCard 2:\nQ: Key details?\nA: ${sentences.slice(1, 2).join('')}`;
          break;
          
        case 'outline':
          result = `I. Main Topic\n   - ${sentences[0] || 'Primary concept'}\nII. Supporting Details\n   - ${sentences[1] || 'Additional info'}\n   - ${sentences[2] || 'Further details'}`;
          break;
          
        case 'keywords':
          const keywords = words.slice(0, 8).join(', ');
          result = `Key Terms: ${keywords}\n\nContext: These terms relate to ${sentences[0]?.substring(0, 50)}...`;
          break;
          
        case 'actionable':
          result = `Action Steps:\n1. ${sentences[0]?.replace(/^.*?([A-Z].*)/s, 'Review $1')}\n2. Apply the concepts mentioned\n3. Practice with examples`;
          break;
          
        default:
          result = sentences.slice(0, 2).join('. ') + '.';
      }
      
      setGeneratedContent(prev => ({ ...prev, [summaryType]: result }));
      setSummary(result || 'No content to summarize.');
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
            <label className="text-sm font-medium text-foreground">Content</label>
            <Textarea
              placeholder="Start writing your note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[300px] resize-none text-sm leading-relaxed"
            />
          </div>

          {/* AI Tools */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Brain className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-medium text-foreground">AI Learning Tools</h3>
            </div>
            
            <Tabs value={summaryType} onValueChange={setSummaryType} className="w-full">
              <TabsList className="grid grid-cols-3 lg:grid-cols-5 h-auto p-1">
                <TabsTrigger value="concise" className="text-xs py-2 px-3">
                  <FileText className="w-3 h-3 mr-1" />
                  Summary
                </TabsTrigger>
                <TabsTrigger value="bullet" className="text-xs py-2 px-3">
                  <List className="w-3 h-3 mr-1" />
                  Bullets
                </TabsTrigger>
                <TabsTrigger value="qna" className="text-xs py-2 px-3">
                  <HelpCircle className="w-3 h-3 mr-1" />
                  Q&A
                </TabsTrigger>
                <TabsTrigger value="flashcards" className="text-xs py-2 px-3">
                  <Tag className="w-3 h-3 mr-1" />
                  Cards
                </TabsTrigger>
                <TabsTrigger value="actionable" className="text-xs py-2 px-3">
                  <Target className="w-3 h-3 mr-1" />
                  Actions
                </TabsTrigger>
              </TabsList>

              <div className="mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Select value={summaryType} onValueChange={setSummaryType}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="concise">Concise Summary</SelectItem>
                      <SelectItem value="bullet">Bullet Points</SelectItem>
                      <SelectItem value="simplified">Simplified (Beginner)</SelectItem>
                      <SelectItem value="detailed">Detailed Notes</SelectItem>
                      <SelectItem value="qna">Q&A Generator</SelectItem>
                      <SelectItem value="flashcards">Flashcards</SelectItem>
                      <SelectItem value="outline">Mind Map/Outline</SelectItem>
                      <SelectItem value="keywords">Key Terms</SelectItem>
                      <SelectItem value="actionable">Action Steps</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    onClick={generateSummary}
                    disabled={!content.trim() || isGeneratingSummary}
                    className="bg-gradient-primary hover:shadow-elegant"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isGeneratingSummary ? 'Generating...' : 'Generate'}
                  </Button>
                </div>

                {generatedContent[summaryType] && (
                  <div className="bg-accent/30 p-4 rounded-lg border border-accent/50">
                    <pre className="text-sm text-accent-foreground whitespace-pre-wrap font-sans">
                      {generatedContent[summaryType]}
                    </pre>
                  </div>
                )}
              </div>
            </Tabs>
          </div>

        </div>
      </Card>
    </div>
  );
};

export default NoteEditor;