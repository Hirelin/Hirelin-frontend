import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

type SortOption = {
  label: string;
  value: string;
};

interface JobSortingProps {
  onSortChange: (value: string) => void;
  currentSort: string;
}

const sortOptions: SortOption[] = [
  { label: "Most Relevant", value: "relevant" },
  { label: "Newest First", value: "newest" },
  { label: "Highest Match Score", value: "match" },
  { label: "Highest Salary", value: "salary" },
];

export function JobSorting({ onSortChange, currentSort }: JobSortingProps) {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-muted-foreground">Sort by:</span>
      <Select value={currentSort} onValueChange={onSortChange}>
        <SelectTrigger className="w-[160px] h-9 text-sm">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="text-sm"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
