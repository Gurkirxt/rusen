import * as React from "react"
import { ChevronRight, File, Folder } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
} from "@/components/ui/sidebar"


export function AppSidebar({ directoryTree, onFileClick, ...props }: {
  directoryTree: any[];
  onFileClick: (path: string) => void;
} & React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Files</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {directoryTree.map((item, index) => (
                <Tree
                  key={index}
                  item={item}
                  basePath="."
                  onFileClick={onFileClick}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

function Tree({ item, basePath, onFileClick }: {
  item: string | any[];
  basePath: string;
  onFileClick: (path: string) => void;
}) {
  const [name, ...items] = Array.isArray(item) ? item : [item];

  if (!Array.isArray(item) || items.length === 0) {
    const fullPath = `${basePath}/${name}`;
    return (
      <SidebarMenuButton onClick={() => onFileClick(fullPath)}>
        <File />
        {name}
      </SidebarMenuButton>
    );
  }

  return (
    <SidebarMenuItem>
      <Collapsible className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <ChevronRight className="transition-transform" />
            <Folder />
            {name}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {items.map((subItem, index) => (
              <Tree
                key={index}
                item={subItem}
                basePath={`${basePath}/${name}`}
                onFileClick={onFileClick}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}
