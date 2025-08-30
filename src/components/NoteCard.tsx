import { Calendar, Tag, Trash2, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface Note {
  id: string;
  title: string;
  content: string;
  summary?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

const NoteCard = ({ note, onEdit, onDelete }: NoteCardProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="bg-gradient-card p-6 rounded-xl border border-border/50 hover:shadow-card transition-spring group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-semibold text-lg text-foreground line-clamp-2 flex-1">
          {note.title || "Untitled Note"}
        </h3>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-smooth">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(note)}
          >
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(note.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content Preview */}
      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
        {note.content || "No content yet..."}
      </p>

      {/* Summary */}
      {note.summary && (
        <div className="bg-accent/30 p-3 rounded-lg mb-4">
          <p className="text-xs font-medium text-accent-foreground mb-1">AI Summary</p>
          <p className="text-sm text-accent-foreground/80">{note.summary}</p>
        </div>
      )}

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {note.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </Badge>
          ))}
          {note.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{note.tags.length - 3} more
            </Badge>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center text-xs text-muted-foreground">
        <Calendar className="w-3 h-3 mr-1" />
        {formatDate(note.updatedAt)}
      </div>
    </div>
  );
};

export default NoteCard;