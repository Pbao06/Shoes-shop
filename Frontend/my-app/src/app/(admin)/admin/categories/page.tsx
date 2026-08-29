'use client';

import { useMemo, useState, useEffect, type FormEvent } from 'react';
import { useAdminCategories } from '@/hooks/admin';
import { adminCategoryService } from '@/services/admin';
import { useToast } from '@/components/ui/Toast';
import { FolderTree, Plus, Search, Trash2, Pencil, RefreshCcw } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import type { AdminCategory } from '@/types/admin/products';

export default function AdminCategoriesPage() {
  const { categories, loading, error, refetch } = useAdminCategories();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: number; name: string } | null>(null);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase();
    return categories.filter((category) => category.name.toLowerCase().includes(q) || category.slug.toLowerCase().includes(q));
  }, [categories, searchQuery]);

  const handleDelete = async (id: number, name: string) => {
    setDeletingId(id);
    try {
      await adminCategoryService.delete(id);
      refetch();
      showToast('Category deleted successfully');
    } catch {
      showToast('Failed to delete category. It may contain products.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="px-6 py-10 md:px-12 md:py-16">
        <div className="mb-10">
          <div className="h-8 w-32 bg-[#1a1714]/10" />
          <div className="mt-2 h-3 w-64 bg-[#1a1714]/10" />
        </div>
        <div className="border border-[#1a1714]/10 bg-[#fcfbf8]">
          <div className="space-y-0">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-16 w-full border-b border-[#1a1714]/10 bg-[#1a1714]/[0.02] animate-pulse" />
            ))}
          </div>
      </div>
    </div>
  );
}

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-16">
        <p className="font-serif text-2xl text-[#1a1714]">Failed to load categories</p>
        <p className="mt-2 text-[13px] tracking-[0.02em] text-[#1a1714]/60">{error}</p>
        <button
          type="button"
          onClick={refetch}
          className="mt-8 flex items-center gap-2 border border-[#1a1714]/10 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#1a1714] transition-colors hover:border-[#1a1714] hover:text-[#1a1714]"
        >
          <RefreshCcw strokeWidth={1.4} className="h-4 w-4" />
          Retry
        </button>
      {deleteModal && (
        <Modal
          isOpen={deleteModal.open}
          onClose={() => setDeleteModal(null)}
          title="Delete Category?"
          message={`Are you sure you want to delete "${deleteModal.name}"? This action cannot be undone.`}
          primaryLabel={deletingId === deleteModal.id ? 'Deleting...' : 'Delete'}
          secondaryLabel="Cancel"
          onPrimary={async () => {
            await handleDelete(deleteModal.id, deleteModal.name);
            setDeleteModal(null);
          }}
        />
      )}
      {deleteModal && (
        <Modal
          isOpen={deleteModal.open}
          onClose={() => setDeleteModal(null)}
          title="Delete Category?"
          message={`Are you sure you want to delete "${deleteModal.name}"? This action cannot be undone.`}
          primaryLabel={deletingId === deleteModal.id ? 'Deleting...' : 'Delete'}
          secondaryLabel="Cancel"
          onPrimary={async () => {
            await handleDelete(deleteModal.id, deleteModal.name);
            setDeleteModal(null);
          }}
        />
      )}
    </div>
  );
}

  return (
    <div className="px-6 py-10 md:px-12 md:py-16">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl tracking-[-0.03em] md:text-4xl">Categories</h1>
          <p className="mt-2 text-[13px] tracking-[0.02em] text-[#1a1714]/60">
            Organize your products with categories.
          </p>
        </div>
        <CategoryFormTrigger />
      </div>

      <div className="border border-[#1a1714]/10 bg-[#fcfbf8]">
        <div className="border-b border-[#1a1714]/10 px-6 py-5 md:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-serif text-xl tracking-[-0.02em]">All Categories</h2>
              <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[#1a1714]/60">
                {filteredCategories.length} {filteredCategories.length === 1 ? 'category' : 'categories'}
              </p>
            </div>
            <div className="relative">
              <Search strokeWidth={1.4} className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1a1714]/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search categories..."
                className="w-full border border-[#1a1714]/10 bg-[#fcfbf8] py-2.5 pl-9 pr-4 text-[13px] outline-none transition-colors focus:border-[#1a1714] placeholder:text-[#1a1714]/40"
              />
            </div>
          </div>
        </div>

        {filteredCategories.length === 0 ? (
          <div className="px-6 py-20 text-center md:px-8">
            <FolderTree strokeWidth={1.4} className="mx-auto h-8 w-8 text-[#1a1714]/30" />
            <p className="mt-4 text-[13px] tracking-[0.02em] text-[#1a1714]/60">
              {searchQuery ? 'No categories match your search.' : 'No categories yet.'}
            </p>
            {!searchQuery && <CategoryFormTrigger />}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#1a1714]/10 text-[11px] uppercase tracking-[0.16em] text-[#1a1714]/60">
                  <th className="px-6 py-4 font-medium md:px-8">Name</th>
                  <th className="px-4 py-4 font-medium">Slug</th>
                  <th className="px-4 py-4 font-medium">Description</th>
                  <th className="px-4 py-4 font-medium">Created At</th>
                  <th className="px-4 py-4 md:px-8" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1714]/10">
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="transition-colors hover:bg-[#1a1714]/[0.02]">
                    <td className="px-6 py-4 md:px-8">
                      <p className="font-medium text-[#1a1714]">{category.name}</p>
                    </td>
                    <td className="px-4 py-4 text-[#1a1714]/70">
                      <span className="text-[11px] uppercase tracking-[0.12em]">{category.slug}</span>
                    </td>
                    <td className="px-4 py-4 text-[#1a1714]/70">
                      <span className="line-clamp-1">{category.description || '—'}</span>
                    </td>
                    <td className="px-4 py-4 text-[#1a1714]/70">
                      {new Date(category.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-4 md:px-8">
                      <div className="flex items-center gap-1">
                        <CategoryFormTrigger category={category} />
                        <button
                          type="button"
                          onClick={() => setDeleteModal({ open: true, id: category.id, name: category.name })}
                          disabled={deletingId === category.id}
                          className="flex h-8 w-8 items-center justify-center text-[#1a1714]/70 transition-colors hover:text-[#1a1714] disabled:opacity-40"
                          aria-label="Delete category"
                        >
                          <Trash2 strokeWidth={1.4} className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deleteModal && (
        <Modal
          isOpen={deleteModal.open}
          onClose={() => setDeleteModal(null)}
          title="Delete Category?"
          message={`Are you sure you want to delete "${deleteModal.name}"? This action cannot be undone.`}
          primaryLabel={deletingId === deleteModal.id ? 'Deleting...' : 'Delete'}
          secondaryLabel="Cancel"
          onPrimary={async () => {
            await handleDelete(deleteModal.id, deleteModal.name);
            setDeleteModal(null);
          }}
        />
      )}
    </div>
  );
}

function CategoryFormTrigger({ category }: { category?: AdminCategory }) {
  const [isOpen, setIsOpen] = useState(false);
  const { showToast } = useToast();
  const isEditing = Boolean(category);

  return (
    <>
      {!category ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center justify-center gap-2 border border-[#1a1714] bg-[#1a1714] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#fcfbf8] transition-opacity hover:opacity-80"
        >
          <Plus strokeWidth={1.4} className="h-4 w-4" />
          Add Category
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex h-8 w-8 items-center justify-center text-[#1a1714]/70 transition-colors hover:text-[#1a1714]"
          aria-label="Edit category"
        >
          <Pencil strokeWidth={1.4} className="h-4 w-4" />
        </button>
      )}

      <CategoryFormModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        category={category}
        onSuccess={() => {
          setIsOpen(false);
          showToast(category ? 'Category updated successfully' : 'Category created successfully');
        }}
      />
    </>
  );
}

function CategoryFormModal({
  isOpen,
  onClose,
  category,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  category?: AdminCategory;
  onSuccess: () => void;
}) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(category);

  useEffect(() => {
    if (isOpen && category) {
      setName(category.name);
      setSlug(category.slug);
      setDescription(category.description || '');
      setError(null);
    }
    if (isOpen && !category) {
      setName('');
      setSlug('');
      setDescription('');
      setError(null);
    }
  }, [isOpen, category]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }

    const payload = {
      name: name.trim(),
      slug: slug.trim() || undefined,
      description: description.trim() || undefined,
    };

    setSaving(true);
    try {
      if (isEditing && category) {
        await adminCategoryService.update(category.id, payload);
      } else {
        await adminCategoryService.create(payload);
      }
      onSuccess();
    } catch {
      setError('Failed to save category. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-[#1a1714]/15 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-[420px] mx-4 bg-[#fcfbf8] border border-[#1a1714]/10 shadow-[0_2px_12px_rgba(26,23,20,0.08)] p-8">
        <h2 className="font-serif text-3xl tracking-[-0.03em] text-[#1a1714]">
          {isEditing ? 'Edit Category' : 'New Category'}
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {error && (
            <p className="text-[13px] text-red-600" role="alert">
              {error}
            </p>
          )}

          <label className="block">
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#1a1714]/60">
              Name <span className="text-red-600">*</span>
            </span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Shoes"
              className="mt-3 w-full border-0 border-b border-[#1a1714]/20 bg-transparent py-3 text-[13px] text-[#1a1714] placeholder:text-[#1a1714]/30 focus:border-[#1a1714] focus:outline-none focus:ring-0 transition-colors"
            />
          </label>

          <label className="block">
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#1a1714]/60">
              Slug
            </span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="auto-generated from name if left blank"
              className="mt-3 w-full border-0 border-b border-[#1a1714]/20 bg-transparent py-3 text-[13px] text-[#1a1714] placeholder:text-[#1a1714]/30 focus:border-[#1a1714] focus:outline-none focus:ring-0 transition-colors"
            />
          </label>

          <label className="block">
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#1a1714]/60">
              Description
            </span>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description..."
              className="mt-3 w-full border border-[#1a1714]/10 bg-transparent px-4 py-3 text-[13px] text-[#1a1714] placeholder:text-[#1a1714]/30 focus:border-[#1a1714] focus:outline-none focus:ring-0 transition-colors"
            />
          </label>

          <div className="flex items-center justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-foreground text-background px-6 py-4 text-[10px] uppercase tracking-[0.24em] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


