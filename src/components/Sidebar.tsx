import { BookOpen, Sparkles, Archive, Tag, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  totalNotes: number;
  activeTags: string[];
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const Sidebar = ({ totalNotes, activeTags, selectedFilter, onFilterChange }: SidebarProps) => {
  const navItems = [
    { id: 'all', label: 'All Notes', icon: BookOpen, count: totalNotes },
    { id: 'summarized', label: 'With Summary', icon: Sparkles, count: 0 },
    { id: 'archived', label: 'Archived', icon: Archive, count: 0 },
  ];

  return (
    <aside className="w-64 bg-card/50 backdrop-blur-sm border-r border-border/50 p-6">
      {/* Navigation */}
      <nav className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
          Library
        </h3>
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={selectedFilter === item.id ? "secondary" : "ghost"}
            className="w-full justify-start gap-3 h-10"
            onClick={() => onFilterChange(item.id)}
          >
            <item.icon className="w-4 h-4" />
            <span className="flex-1 text-left">{item.label}</span>
            {item.count > 0 && (
              <Badge variant="outline" className="text-xs">
                {item.count}
              </Badge>
            )}
          </Button>
        ))}
      </nav>

      {/* Tags */}
      {activeTags.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
            Tags
          </h3>
          <div className="space-y-1">
            {activeTags.slice(0, 10).map((tag) => (
              <Button
                key={tag}
                variant="ghost"
                className="w-full justify-start gap-2 h-8 text-sm"
                onClick={() => onFilterChange(`tag:${tag}`)}
              >
                <Tag className="w-3 h-3" />
                {tag}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom */}
      <div className="absolute bottom-6 left-6 right-6">
        <Button variant="ghost" className="w-full justify-start gap-3">
          <Settings className="w-4 h-4" />
          Settings
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;