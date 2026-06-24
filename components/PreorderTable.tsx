"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import StatusToggle from "./StatusToggle";
import DeleteButton from "./DeleteButton";

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

interface PreorderTableProps {
  preorders: Preorder[];
  selectedIds: Set<string>;
  onSelectChange: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onStatusChange?: (id: string, newStatus: boolean) => void;
  onDelete?: (id: string) => void;
}

export default function PreorderTable({
  preorders,
  selectedIds,
  onSelectChange,
  onSelectAll,
  onStatusChange,
  onDelete,
}: PreorderTableProps) {
  const allSelected =
    preorders.length > 0 && selectedIds.size === preorders.length;

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Name
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Products
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Preorder when
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Starts at
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Ends at
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {preorders.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                No preorders found
              </td>
            </tr>
          ) : (
            preorders.map((preorder) => (
              <tr
                key={preorder.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(preorder.id)}
                    onChange={(e) =>
                      onSelectChange(preorder.id, e.target.checked)
                    }
                    className="w-4 h-4 cursor-pointer"
                  />
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {preorder.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {preorder.products}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {preorder.preorderWhen}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {formatDate(new Date(preorder.startsAt))}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {preorder.endsAt
                    ? formatDate(new Date(preorder.endsAt))
                    : "-"}
                </td>
                <td className="px-6 py-4">
                  <StatusToggle
                    id={preorder.id}
                    status={preorder.status}
                    onStatusChange={onStatusChange}
                  />
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/preorders/${preorder.id}/edit`}
                      className="text-gray-600 hover:text-gray-900"
                      title="Edit preorder"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </Link>
                    <DeleteButton id={preorder.id} onDelete={onDelete} />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
