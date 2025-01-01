import { Link } from "react-router-dom"
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { LucideIcon } from "lucide-react"

interface SidebarMenuItemProps {
  title: string
  url: string
  icon: LucideIcon
  isActive: boolean
  openInNewWindow?: boolean
  className?: string
}

export function SidebarMenuItemComponent({
  title,
  url,
  icon: Icon,
  isActive,
  openInNewWindow,
  className,
}: SidebarMenuItemProps) {
  return (
    <SidebarMenuItem className={`px-2 ${className || ''}`}>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={title}
        className="py-2.5"
      >
        {openInNewWindow ? (
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3"
          >
            <Icon className="h-5 w-5" />
            <span>{title}</span>
          </a>
        ) : (
          <Link to={url} className="flex items-center gap-3">
            <Icon className="h-5 w-5" />
            <span>{title}</span>
          </Link>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}