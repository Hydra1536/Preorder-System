"use client";

import React, { useState, useRef, useEffect } from "react";

interface FilterTabsProps {
  activeFilter: "all" | "active" | "inactive";
  onFilterChange: (filter: "all" | "active" | "inactive") => void;
}

export default function FilterTabs({
  activeFilter,
  onFilterChange,
}: FilterTabsProps) {
  return (
    <div className="flex gap-4 mb-6">
      <button
        onClick={() => onFilterChange("all")}
        className={`text-sm font-medium px-4 py-2 rounded transition ${
          activeFilter === "all"
            ? "text-gray-900 border-b-2 border-gray-900"
            : "text-gray-600 border-b-2 border-transparent hover:text-gray-900"
        }`}
      >
        All
      </button>
      <button
        onClick={() => onFilterChange("active")}
        className={`text-sm font-medium px-4 py-2 rounded transition ${
          activeFilter === "active"
            ? "text-gray-900 border-b-2 border-gray-900"
            : "text-gray-600 border-b-2 border-transparent hover:text-gray-900"
        }`}
      >
        Active
      </button>
      <button
        onClick={() => onFilterChange("inactive")}
        className={`text-sm font-medium px-4 py-2 rounded transition ${
          activeFilter === "inactive"
            ? "text-gray-900 border-b-2 border-gray-900"
            : "text-gray-600 border-b-2 border-transparent hover:text-gray-900"
        }`}
      >
        Inactive
      </button>
    </div>
  );
}

interface SortMenuProps {
  sortField: string;
  sortDirection: string;
  onSortChange: (field: string, direction: string) => void;
}

export function SortMenu({
  sortField,
  sortDirection,
  onSortChange,
}: SortMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
        title="Sort options"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <div className="p-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort by
              </label>
              <div className="space-y-2">
                {[
                  { value: "name", label: "Name" },
                  { value: "createdAt", label: "Created At" },
                  { value: "startsAt", label: "Starts At" },
                  { value: "endsAt", label: "Ends At" },
                ].map((option) => (
                  <div key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      id={option.value}
                      name="sortField"
                      value={option.value}
                      checked={sortField === option.value}
                      onChange={() => onSortChange(option.value, sortDirection)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <label
                      htmlFor={option.value}
                      className="ml-2 text-sm text-gray-700 cursor-pointer"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {sortDirection === "asc" ? "↑ Ascending" : "↓ Descending"}
              </label>
              <div className="space-y-2">
                {[
                  { value: "asc", label: "↑ Ascending" },
                  { value: "desc", label: "↓ Descending" },
                ].map((option) => (
                  <div key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      id={`direction-${option.value}`}
                      name="sortDirection"
                      value={option.value}
                      checked={sortDirection === option.value}
                      onChange={() => onSortChange(sortField, option.value)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <label
                      htmlFor={`direction-${option.value}`}
                      className="ml-2 text-sm text-gray-700 cursor-pointer"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
