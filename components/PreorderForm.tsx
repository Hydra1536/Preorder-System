"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatDateForInput } from "@/lib/utils";

interface PreorderFormProps {
  initialData?: {
    id: string;
    name: string;
    products: number;
    preorderWhen: string;
    startsAt: string;
    endsAt: string | null;
    status: boolean;
  };
}

export default function PreorderForm({ initialData }: PreorderFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    products: initialData?.products || 1,
    preorderWhen: initialData?.preorderWhen || "regardless-of-stock",
    startsAt: initialData?.startsAt
      ? formatDateForInput(new Date(initialData.startsAt))
      : "",
    endsAt: initialData?.endsAt
      ? formatDateForInput(new Date(initialData.endsAt))
      : "",
    status: initialData?.status ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (formData.products < 1) {
      newErrors.products = "Products must be at least 1";
    }

    if (!formData.startsAt) {
      newErrors.startsAt = "Start date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        name: formData.name,
        products: parseInt(String(formData.products), 10),
        preorderWhen: formData.preorderWhen,
        startsAt: new Date(formData.startsAt).toISOString(),
        endsAt: formData.endsAt
          ? new Date(formData.endsAt).toISOString()
          : null,
        status: formData.status,
      };

      let response;

      if (initialData?.id) {
        // Update existing preorder
        response = await fetch(`/api/preorders/${initialData.id}/update`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } else {
        // Create new preorder
        response = await fetch("/api/preorders/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save preorder");
      }

      router.push("/preorders");
    } catch (error: any) {
      console.error("Error saving preorder:", error);
      setErrors({
        submit: error.message || "Failed to save preorder",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/preorders");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const finalValue =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : name === "products"
          ? parseInt(value, 10) || 0
          : value;

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {errors.submit && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{errors.submit}</p>
        </div>
      )}

      {/* Form Section */}
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Preorder details
          </h2>
          <p className="text-sm text-gray-600">
            These values appear in the preorders list.
          </p>
        </div>

        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-900"
          >
            Name <span className="text-red-600">*</span>
          </label>
          <p className="text-sm text-gray-600 mb-2">
            A label to recognize this preorder by.
          </p>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="e.g., Multi variant 3"
          />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name}</p>
          )}
        </div>

        {/* Products */}
        <div>
          <label
            htmlFor="products"
            className="block text-sm font-medium text-gray-900"
          >
            Products
          </label>
          <p className="text-sm text-gray-600 mb-2">
            Number of products covered by this preorder.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              id="products"
              name="products"
              value={formData.products}
              onChange={handleChange}
              min="1"
              className={`w-24 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
                errors.products ? "border-red-500" : "border-gray-300"
              }`}
            />
            <span className="text-sm text-gray-600">product(s)</span>
          </div>
          {errors.products && (
            <p className="text-sm text-red-600 mt-1">{errors.products}</p>
          )}
        </div>

        {/* Preorder When */}
        <div>
          <label
            htmlFor="preorderWhen"
            className="block text-sm font-medium text-gray-900"
          >
            Preorder when
          </label>
          <p className="text-sm text-gray-600 mb-2">
            When customers are allowed to preorder.
          </p>
          <select
            id="preorderWhen"
            name="preorderWhen"
            value={formData.preorderWhen}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            <option value="out-of-stock">Out of stock</option>
            <option value="regardless-of-stock">Regardless of stock</option>
          </select>
        </div>

        {/* Starts At */}
        <div>
          <label
            htmlFor="startsAt"
            className="block text-sm font-medium text-gray-900"
          >
            Starts at
          </label>
          <p className="text-sm text-gray-600 mb-2">
            When the preorder window opens.
          </p>
          <input
            type="datetime-local"
            id="startsAt"
            name="startsAt"
            value={formData.startsAt}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
              errors.startsAt ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.startsAt && (
            <p className="text-sm text-red-600 mt-1">{errors.startsAt}</p>
          )}
        </div>

        {/* Ends At */}
        <div>
          <label
            htmlFor="endsAt"
            className="block text-sm font-medium text-gray-900"
          >
            Ends at
          </label>
          <p className="text-sm text-gray-600 mb-2">
            Leave empty for no end date.
          </p>
          <input
            type="datetime-local"
            id="endsAt"
            name="endsAt"
            value={formData.endsAt}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>

        {/* Status */}
        <div className="pt-4 border-t border-gray-200">
          <label className="flex items-center gap-3">
            <div className="toggle-switch">
              <input
                type="checkbox"
                name="status"
                checked={formData.status}
                onChange={handleChange}
              />
              <span className="toggle-slider"></span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {formData.status ? "Active" : "Inactive"}
            </span>
          </label>
          <p className="text-sm text-gray-600 mt-2">
            Active preorders are visible to customers.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={handleCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
