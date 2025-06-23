import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Separator } from "@/components/ui/separator";
import ThemeChange from "../Buttons/theme-change";
import UserProfile from "./user-profile";
import NotificationDropdown from "./notification-dropdown";
import SearchInput from "./search-input";

const SideBar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <SearchInput/>
            </div>
            <div className="px-4 flex items-center ">
              <NotificationDropdown />
              <ThemeChange />
              <UserProfile />
            </div>
          </header>
          <div className="p-4 ">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default SideBar;
