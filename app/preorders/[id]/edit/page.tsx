"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import Link from "next/link";
import PreorderForm from "@/components/PreorderForm";

interface Preorder {
  id: string;
  name: string;
  products: number;
  preorderWhen: string;
  startsAt: string;
  endsAt: string | null;
  status: boolean;
}

export default function EditPreorderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [preorder, setPreorder] = useState<Preorder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreorder = async () => {
      try {
        const response = await fetch(`/api/preorders/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch preorder");
        }
        const data = await response.json();
        setPreorder(data);
      } catch (err: any) {
        console.error("Error fetching preorder:", err);
        setError(err.message || "Failed to fetch preorder");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreorder();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Loading preorder...</div>
      </div>
    );
  }

  if (error || !preorder) {
    return (
      <div className="space-y-4">
        <Link
          href="/preorders"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </Link>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">
            {error || "Preorder not found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/preorders"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </Link>
      </div>

      {/* Form */}
      <PreorderForm initialData={preorder} />
    </div>
  );
}
