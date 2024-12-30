import { Link } from "react-router-dom"
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { LucideIcon } from "lucide-react"
import { useState } from "react"

interface SubItem {
  title: string
  url: string
  icon: LucideIcon
}

interface SidebarMenuItemProps {
  title: string
  url: string
  icon: LucideIcon
  isActive: boolean
  openInNewWindow?: boolean
  className?: string
  subItems?: SubItem[]
}

export function SidebarMenuItemComponent({
  title,
  url,
  icon: Icon,
  isActive,
  openInNewWindow,
  className,
  subItems,
}: SidebarMenuItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    if (subItems?.length) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <SidebarMenuItem className={`px-2 ${className || ''}`}>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={title}
        className="py-2.5"
        onClick={handleClick}
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

      {subItems && isExpanded && (
        <div className="ml-6 mt-2 space-y-2">
          {subItems.map((subItem) => (
            <Link
              key={subItem.url}
              to={subItem.url}
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              <subItem.icon className="h-4 w-4" />
              <span>{subItem.title}</span>
            </Link>
          ))}
        </div>
      )}
    </SidebarMenuItem>
  )
}