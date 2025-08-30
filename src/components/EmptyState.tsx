import { FileText, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onCreateNote: () => void;
}

const EmptyState = ({ onCreateNote }: EmptyStateProps) => {
  return (
    <div className="flex-1 flex items-center justify-center p-12">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
          <FileText className="w-12 h-12 text-primary-foreground" />
        </div>
        
        <h2 className="text-2xl font-bold text-foreground mb-3">
          Welcome to NotesAI
        </h2>
        
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Create your first note and let AI help you summarize and organize your thoughts. 
          Start building your knowledge base today.
        </p>
        
        <div className="space-y-3">
          <Button 
            onClick={onCreateNote}
            className="bg-gradient-primary hover:shadow-elegant transition-spring"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Note
          </Button>
          
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Summaries
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Smart Organization
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;