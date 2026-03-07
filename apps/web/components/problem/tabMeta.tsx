import {
  BarChart3,
  BookOpenText,
  Bot,
  Code2,
  FileText,
  History,
  NotebookPen,
  type LucideIcon,
} from "lucide-react";
import type { TabId } from "@/lib/store/panelStore";

export const TAB_ICONS: Record<TabId, LucideIcon> = {
  question: FileText,
  editorial: BookOpenText,
  submissions: History,
  ai: Bot,
  editor: Code2,
  results: BarChart3,
  notes: NotebookPen,
};
