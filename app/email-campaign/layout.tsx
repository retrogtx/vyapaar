import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
    <SidebarTrigger />
      <main className="flex-1 flex items-center justify-center">
        {children}
      </main>
    </SidebarProvider>
  )
}
