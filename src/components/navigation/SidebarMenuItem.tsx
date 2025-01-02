import { useState } from "react"
import { Link } from "react-router-dom"
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { LucideIcon, ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarMenuItemProps {
  title: string
  url: string
  icon: LucideIcon
  isActive: boolean
  openInNewWindow?: boolean
  className?: string
  subItems?: {
    title: string
    url: string
    icon: LucideIcon
    subItems?: {
      title: string
      url: string
      icon: LucideIcon
    }[]
  }[]
}

export function SidebarMenuItemComponent({
  title,
  url,
  icon: Icon,
  isActive,
  openInNewWindow,
  className,
  subItems
}: SidebarMenuItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  const hasSubItems = subItems && subItems.length > 0
  
  return (
    <>
      <SidebarMenuItem className={`px-2 ${className || ''}`}>
        <SidebarMenuButton
          asChild
          isActive={isActive}
          tooltip={title}
          className="py-2.5"
          onClick={() => hasSubItems && setIsOpen(!isOpen)}
        >
          {hasSubItems ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5" />
                <span>{title}</span>
              </div>
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
          ) : openInNewWindow ? (
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

      {hasSubItems && isOpen && (
        <div className="ml-4 space-y-1">
          {subItems.map((subItem) => (
            <div key={subItem.url}>
              <SidebarMenuItem className="px-2">
                <SidebarMenuButton
                  asChild
                  isActive={false}
                  tooltip={subItem.title}
                  className="py-2"
                >
                  <Link to={subItem.url} className="flex items-center gap-3">
                    <subItem.icon className="h-4 w-4" />
                    <span className="text-sm">{subItem.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {subItem.subItems?.map((nestedItem) => (
                <SidebarMenuItem key={nestedItem.url} className="px-2 ml-4">
                  <SidebarMenuButton
                    asChild
                    isActive={false}
                    tooltip={nestedItem.title}
                    className="py-1.5"
                  >
                    <Link 
                      to={nestedItem.url} 
                      className={cn(
                        "flex items-center gap-3",
                        nestedItem.title.startsWith("+") && "text-primary hover:text-primary/90"
                      )}
                    >
                      <nestedItem.icon className="h-4 w-4" />
                      <span className="text-sm">{nestedItem.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  )
}