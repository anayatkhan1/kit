import { Bot, FileText, Settings } from "lucide-react"

export const categoryIcons = {
  "Get Started": Settings,
  Agents: Bot,
  Documentation: FileText,
} as const

export function getCategoryIcon(categoryName: string) {
  return categoryIcons[categoryName as keyof typeof categoryIcons] || Settings
}
