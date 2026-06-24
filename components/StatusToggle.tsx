"use client";

import React, { useState } from "react";

interface StatusToggleProps {
  id: string;
  status: boolean;
  onStatusChange?: (id: string, newStatus: boolean) => void;
}

export default function StatusToggle({
  id,
  status,
  onStatusChange,
}: StatusToggleProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = e.target.checked;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/preorders/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update status");
      }

      onStatusChange?.(id, newStatus);
    } catch (error: any) {
      console.error("Error updating status:", error);
      setError(error.message || "Failed to update status");
      // Reset the toggle on error
      e.target.checked = status;
      // Clear error after 3 seconds
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <label className="toggle-switch">
      <input
        type="checkbox"
        checked={status}
        onChange={handleToggle}
        disabled={isLoading}
      />
      <span className="toggle-slider"></span>
    </label>
  );
}
