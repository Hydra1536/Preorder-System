"use client";

import React, { useState } from "react";

interface DeleteButtonProps {
  id: string;
  onDelete?: (id: string) => void;
}

export default function DeleteButton({ id, onDelete }: DeleteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this preorder?")) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/preorders/${id}/delete`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete preorder");
      }

      onDelete?.(id);
    } catch (error: any) {
      console.error("Error deleting preorder:", error);
      setError(error.message || "Failed to delete preorder");
      alert(error.message || "Failed to delete preorder");
      // Clear error after 3 seconds
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isLoading}
      className="text-gray-600 hover:text-red-600 disabled:text-gray-400"
      title="Delete preorder"
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
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    </button>
  );
}
