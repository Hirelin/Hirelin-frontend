import React from "react";
import { Search, MapPin, Filter, X } from "lucide-react";
import {
  JobFiltersType,
  JobType,
  JOB_TYPE_LABELS,
  EXPERIENCE_LEVELS,
  POPULAR_SKILLS,
} from "~/types/jobs";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Checkbox } from "~/components/ui/checkbox";

interface JobFiltersProps {
  filters: JobFiltersType;
  setFilters: React.Dispatch<React.SetStateAction<JobFiltersType>>;
  applyFilters: () => void;
  resetFilters: () => void;
}

// Available job types for filtering - convert enum to array
const availableJobTypes = Object.values(JobType);

export function JobFilters({
  filters,
  setFilters,
  applyFilters,
  resetFilters,
}: JobFiltersProps) {
  const [isFiltersVisible, setIsFiltersVisible] = React.useState(false);

  // Immediately apply filter when clicking on badge X button
  const handleRemoveJobType = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      jobTypes: prev.jobTypes?.filter((t) => t !== type) || [],
    }));
    // Let the change take effect before applying
    setTimeout(applyFilters, 0);
  };

  const handleRemoveExperienceLevel = (level: string) => {
    setFilters((prev) => ({
      ...prev,
      experienceLevels: prev.experienceLevels?.filter((l) => l !== level) || [],
    }));
    setTimeout(applyFilters, 0);
  };

  const handleRemoveSkill = (skill: string) => {
    setFilters((prev) => ({
      ...prev,
      skills: prev.skills?.filter((s) => s !== skill) || [],
    }));
    setTimeout(applyFilters, 0);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, location: e.target.value }));
  };

  const handleJobTypeChange = (type: string) => {
    setFilters((prev) => {
      const jobTypes = prev.jobTypes || [];

      if (jobTypes.includes(type)) {
        return { ...prev, jobTypes: jobTypes.filter((t) => t !== type) };
      } else {
        return { ...prev, jobTypes: [...jobTypes, type] };
      }
    });
  };

  const handleExperienceChange = (level: string) => {
    setFilters((prev) => {
      const experienceLevels = prev.experienceLevels || [];

      if (experienceLevels.includes(level)) {
        return {
          ...prev,
          experienceLevels: experienceLevels.filter((l) => l !== level),
        };
      } else {
        return { ...prev, experienceLevels: [...experienceLevels, level] };
      }
    });
  };

  const handleSkillChange = (skill: string) => {
    setFilters((prev) => {
      const skills = prev.skills || [];

      if (skills.includes(skill)) {
        return { ...prev, skills: skills.filter((s) => s !== skill) };
      } else {
        return { ...prev, skills: [...skills, skill] };
      }
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      applyFilters();
    }
  };

  return (
    <div className="bg-background border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col gap-4">
        {/* Search and Location - Always visible */}
        <div className="flex flex-col md:flex-row gap-2 md:gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Job title or keyword"
              value={filters.search || ""}
              onChange={handleSearchChange}
              onKeyDown={handleKeyPress}
              className="pl-10"
            />
          </div>
          <div className="relative flex-grow">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Location"
              value={filters.location || ""}
              onChange={handleLocationChange}
              onKeyDown={handleKeyPress}
              className="pl-10"
            />
          </div>
          <Button onClick={applyFilters}>Search</Button>
        </div>

        {/* Active filters display */}
        {((filters.jobTypes && filters.jobTypes.length > 0) ||
          (filters.experienceLevels && filters.experienceLevels.length > 0) ||
          (filters.skills && filters.skills.length > 0)) && (
          <div className="flex flex-wrap gap-2 mt-2">
            {filters.jobTypes?.map((type) => (
              <Badge
                key={type}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {JOB_TYPE_LABELS[type] || type}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleRemoveJobType(type)}
                />
              </Badge>
            ))}
            {filters.experienceLevels?.map((level) => (
              <Badge
                key={level}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {level}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleRemoveExperienceLevel(level)}
                />
              </Badge>
            ))}
            {filters.skills?.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {skill}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleRemoveSkill(skill)}
                />
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-6 text-xs"
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Toggle filters button */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFiltersVisible(!isFiltersVisible)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {isFiltersVisible ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {/* Advanced filters - toggleable */}
        {isFiltersVisible && (
          <div className="border-t pt-4 mt-2">
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="job-type">
                <AccordionTrigger className="text-sm font-medium">
                  Job Type
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-2">
                    {availableJobTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`job-type-${type}`}
                          checked={filters.jobTypes?.includes(type) || false}
                          onCheckedChange={() => handleJobTypeChange(type)}
                        />
                        <label
                          htmlFor={`job-type-${type}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {JOB_TYPE_LABELS[type] || type}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="experience">
                <AccordionTrigger className="text-sm font-medium">
                  Experience Level
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-2">
                    {EXPERIENCE_LEVELS.map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox
                          id={`exp-${level}`}
                          checked={
                            filters.experienceLevels?.includes(level) || false
                          }
                          onCheckedChange={() => handleExperienceChange(level)}
                        />
                        <label
                          htmlFor={`exp-${level}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {level}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="skills">
                <AccordionTrigger className="text-sm font-medium">
                  Skills
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-2">
                    {POPULAR_SKILLS.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={`skill-${skill}`}
                          checked={filters.skills?.includes(skill) || false}
                          onCheckedChange={() => handleSkillChange(skill)}
                        />
                        <label
                          htmlFor={`skill-${skill}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {skill}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="mt-4 flex justify-end">
              <Button onClick={applyFilters} className="ml-auto">
                Apply Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
