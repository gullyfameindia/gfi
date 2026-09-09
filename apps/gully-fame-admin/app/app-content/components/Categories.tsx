'use client';

import { useEffect, useState } from 'react';
import type { Category } from '@/lib/categoryApi';
import { createCategory, getCategories, deleteCategory } from '@/lib/categoryApi';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState<File | null>(null);
  const [newCategoryIconPreview, setNewCategoryIconPreview] = useState<string | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    setIsLoadingList(true);
    setError(null);

    const result = await getCategories(1, 100);

    if (!result.success || !result.data) {
      setError(result.message || result.error || 'Failed to load categories.');
      setCategories([]);
      setIsLoadingList(false);
      return;
    }

    const items = result.data.items || [];
    setCategories(items);
    setIsLoadingList(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = async () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      setError('Please enter a category name.');
      return;
    }

    setIsAdding(true);
    setError(null);

    const result = await createCategory(trimmed, newCategoryIcon);

    if (!result.success) {
      setError(result.message || result.error || 'Failed to create category.');
      setIsAdding(false);
      return;
    }

    setNewCategoryName('');
    setNewCategoryIcon(null);
    setNewCategoryIconPreview(null);
    setIsAdding(false);
    loadCategories();
  };

  const handleDeleteCategory = async (id: string) => {
    setDeletingId(id);
    setError(null);

    const result = await deleteCategory(id);

    if (!result.success) {
      setError(result.message || result.error || 'Failed to delete category.');
      setDeletingId(null);
      return;
    }

    setDeletingId(null);
    loadCategories();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-3 space-y-3 lg:space-y-0">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Add new category"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />

          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                {newCategoryIconPreview ? (
                  
                  <img
                    src={newCategoryIconPreview}
                    alt="New category icon preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-[11px] font-semibold text-gray-500 px-1 text-center">
                    Icon
                  </span>
                )}
              </div>
              <div>
                <span className="inline-block rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                  Choose Icon
                </span>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  JPG/PNG, small square
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setNewCategoryIcon(file ?? null);
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setNewCategoryIconPreview(url);
                  } else {
                    setNewCategoryIconPreview(null);
                  }
                }}
              />
            </label>
          </div>

          <button
            type="button"
            onClick={handleAddCategory}
            disabled={isAdding}
            className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isAdding ? 'Adding...' : 'Add'}
          </button>
        </div>
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        )}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        {isLoadingList ? (
          <div className="px-4 py-6 text-sm text-gray-500 text-center">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="px-4 py-6 text-sm text-gray-500 text-center">
            No categories found.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200">
                    {category.icon ? (
                      
                      <img
                        src={category.icon}
                        alt={category.name || 'Category icon'}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-semibold uppercase text-gray-600">
                        {category.name?.charAt(0) || '?'}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-800 truncate">
                    {category.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(category.id)}
                  disabled={deletingId === category.id}
                  className="text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {deletingId === category.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

