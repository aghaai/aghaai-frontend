import React from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { BellIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import Image from "next/image";
import { ScrollArea } from "../ui/scroll-area";
const NotificationDropdown = () => {
  return (
    <React.Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <BellIcon className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] max-w-[380px] rounded-lg"
          sideOffset={5}
          align="end"
        >
          <div className="grid gap-4 p-2">
            <h4 className="font-medium leading-none text-muted-foreground">
              Notifications
            </h4>
            <Separator />
            <ScrollArea className="h-[300px] max-w-[380px]">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  className="mb-2 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                  key={index}
                >
                  <Image
                    src="/announcement.svg"
                    width={25}
                    height={25}
                    alt="CodeDay"
                    className="h-5 w-5 rounded-full"
                  />
                  <div className="ml-2 grid gap-1">
                    <p className="text-sm font-medium">
                      Code day is live [80% OFF] 🎉 get interview kits, daily
                      challenge and more.
                    </p>
                    <p className="text-sm text-gray-500">5 min ago</p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </React.Fragment>
  );
};

export default NotificationDropdown;
