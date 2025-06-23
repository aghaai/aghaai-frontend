import { Search } from "lucide-react";
import React from "react";
import { Input } from "../ui/input";

const SearchInput = () => {
  return (
    <React.Fragment>
      <div className="relative ">
        <Search className="w-4 h-4  text-muted-foreground absolute left-2 top-1/2 transform -translate-y-1/2 z-10" />
        <Input
          type="text"
          placeholder="What do you want to learn?"
          className="pl-8 w-80"
        />
      </div>
    </React.Fragment>
  );
};

export default SearchInput;
