"use client";

import React, { Suspense, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PreorderTable from "@/components/PreorderTable";
import FilterTabs from "@/components/FilterTabs";
import { SortMenu } from "@/components/FilterTabs";

interface Preorder {
  id: string;
  name: string;
  products: number;
  preorderWhen: string;
  startsAt: string;
  endsAt: string | null;
  status: boolean;
  createdAt: string;
}

function PreordersContent() {
  const searchParams = useSearchParams();
  const [preorders, setPreorders] = useState<Preorder[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"all" | "active" | "inactive">(
    (searchParams.get("filter") as any) || "all",
  );
  const [sortField, setSortField] = useState<string>(
    searchParams.get("sort") || "createdAt",
  );
  const [sortDirection, setSortDirection] = useState<string>(
    searchParams.get("direction") || "desc",
  );
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPreorders = useCallback(
    async (cursor: string | null = null) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          filter,
          sort: sortField,
          direction: sortDirection,
          limit: "10",
        });

        if (cursor) {
          params.append("cursor", cursor);
        }

        const response = await fetch(`/api/preorders?${params}`);
        if (!response.ok) {
          throw new Error("Failed to fetch preorders");
        }

        const data = await response.json();
        setPreorders(data.data || []);
        setHasMore(data.hasMore || false);
        setTotal(data.total || 0);
        setSelectedIds(new Set());
      } catch (error) {
        console.error("Error fetching preorders:", error);
        setPreorders([]);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    },
    [filter, sortField, sortDirection],
  );

  // Fetch preorders when filter or sort changes
  useEffect(() => {
    setCurrentCursor(null);
    setCurrentPage(1);
    fetchPreorders(null);
  }, [filter, sortField, sortDirection, fetchPreorders]);

  const handleSelectChange = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(preorders.map((p) => p.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleStatusChange = (id: string, newStatus: boolean) => {
    setPreorders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)),
    );
  };

  const handleDelete = (id: string) => {
    setPreorders((prev) => prev.filter((p) => p.id !== id));
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleFilterChange = (newFilter: "all" | "active" | "inactive") => {
    setFilter(newFilter);
  };

  const handleSortChange = (field: string, direction: string) => {
    setSortField(field);
    setSortDirection(direction);
  };

  const startItem = currentCursor ? (currentPage - 1) * 10 + 1 : 1;
  const endItem = Math.min(startItem + preorders.length - 1, total);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Preorders</h1>
        <Link
          href="/preorders/create"
          className="px-6 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition"
        >
          Create Preorder
        </Link>
      </div>

      {/* Filters and Sort */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
        <FilterTabs activeFilter={filter} onFilterChange={handleFilterChange} />
        <SortMenu
          sortField={sortField}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500">Loading preorders...</div>
        </div>
      ) : (
        <>
          <PreorderTable
            preorders={preorders}
            selectedIds={selectedIds}
            onSelectChange={handleSelectChange}
            onSelectAll={handleSelectAll}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />

          {/* Pagination Info */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {preorders.length > 0 ? startItem : 0} to {endItem} from{" "}
              {total}
            </div>
            <div className="flex gap-2">
              <button
                disabled={!currentCursor}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                disabled={!hasMore}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function PreordersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500">Loading preorders...</div>
        </div>
      }
    >
      <PreordersContent />
    </Suspense>
  );
}
