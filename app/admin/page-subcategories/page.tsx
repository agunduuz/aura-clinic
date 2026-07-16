// app/admin/page-subcategories/page.tsx
"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import ProtectedPage from "@/components/admin/ProtectedPage";
import { Trash2, Plus, Save, FileText } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

type Locale = "tr" | "en";

interface PageSubcategory {
  id: string;
  parentSlug: string;
  slug: string;
  locale: string;
  title: string;
  content: string;
  imageUrl: string;
  order: number;
  published: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

const AVAILABLE_PAGES = [
  { slug: "anasayfa", name: "Anasayfa", type: "general" },
  { slug: "hakkimizda", name: "Hakkımızda", type: "general" },
  { slug: "iletisim", name: "İletişim", type: "general" },
];

export default function PageSubcategoriesAdmin() {
  const [locale, setLocale] = useState<Locale>("tr");
  const [selectedPage, setSelectedPage] = useState<string>("anasayfa");
  const [subcategories, setSubcategories] = useState<PageSubcategory[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<PageSubcategory | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load subcategories
  const loadSubcategories = async () => {
    const res = await fetch(
      `/api/admin/page-subcategories?parentSlug=${selectedPage}&locale=${locale}`,
    );
    if (res.ok) {
      const data = await res.json();
      setSubcategories(data);
    }
  };

  useEffect(() => {
    loadSubcategories();
    setSelectedSubcategory(null);
    setIsEditing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPage, locale]);

  // Create new subcategory
  const createNew = () => {
    const newSubcategory: PageSubcategory = {
      id: "",
      parentSlug: selectedPage,
      slug: "",
      locale,
      title: "",
      content: "",
      imageUrl: "",
      order: subcategories.length,
      published: false,
    };
    setSelectedSubcategory(newSubcategory);
    setIsEditing(true);
  };

  // Edit subcategory
  const editSubcategory = (subcategory: PageSubcategory) => {
    setSelectedSubcategory(subcategory);
    setIsEditing(true);
  };

  // Save subcategory
  const saveSubcategory = async () => {
    if (!selectedSubcategory) return;

    setLoading(true);
    try {
      const url = selectedSubcategory.id
        ? `/api/admin/page-subcategories/${selectedSubcategory.id}`
        : "/api/admin/page-subcategories";

      const method = selectedSubcategory.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedSubcategory),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        loadSubcategories();
        setIsEditing(false);
        setSelectedSubcategory(null);
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Kaydetme sırasında hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  // Delete subcategory
  const deleteSubcategory = async (id: string, title: string) => {
    if (
      !confirm(`"${title}" alt kategorisini silmek istediğinize emin misiniz?`)
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/page-subcategories/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        loadSubcategories();
        setSelectedSubcategory(null);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Silme sırasında hata oluştu!");
    }
  };

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />

        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Sayfa Alt Kategorileri
              </h1>
              <p className="text-sm md:text-base text-gray-600 mt-1">
                Anasayfa, Hakkımızda gibi sayfalar için alt kategoriler
                oluşturun
              </p>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-2 md:gap-3">
              <label className="text-xs md:text-sm font-medium text-gray-700">
                Dil:
              </label>
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value as Locale)}
                className="px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b2d6a1] focus:border-transparent bg-white"
              >
                <option value="tr">🇹🇷 Türkçe</option>
                <option value="en">🇬🇧 English</option>
              </select>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
              ✅ Başarıyla kaydedildi!
            </div>
          )}

          {/* Main Content - Two Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar - Page List */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-semibold mb-4">📄 Ana Sayfalar</h2>
                <div className="space-y-2">
                  {AVAILABLE_PAGES.map((page) => (
                    <button
                      key={page.slug}
                      onClick={() => setSelectedPage(page.slug)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        selectedPage === page.slug
                          ? "bg-[#b2d6a1] text-white"
                          : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium">{page.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Content - Subcategories */}
            <div className="lg:col-span-9">
              <div className="bg-white rounded-lg shadow-sm p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">
                    {AVAILABLE_PAGES.find((p) => p.slug === selectedPage)?.name}{" "}
                    - Alt Kategoriler
                  </h2>
                  <button
                    onClick={createNew}
                    className="flex items-center gap-2 px-4 py-2 bg-[#b2d6a1] text-white rounded-lg hover:bg-[#68947c] transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Yeni Alt Kategori
                  </button>
                </div>

                {/* Subcategories List */}
                {!isEditing && (
                  <div className="space-y-3">
                    {subcategories.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        Henüz alt kategori yok. &quot;Yeni Alt Kategori&quot;
                        ile başlayın.
                      </div>
                    ) : (
                      subcategories.map((sub) => (
                        <div
                          key={sub.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <h3 className="text-lg font-medium">
                                  {sub.title}
                                </h3>
                                <span
                                  className={`px-2 py-1 text-xs rounded ${
                                    sub.published
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {sub.published ? "Yayında" : "Taslak"}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                /{selectedPage}/{sub.slug}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => editSubcategory(sub)}
                                className="px-3 py-1 text-sm text-[#b2d6a1] border border-[#b2d6a1] rounded hover:bg-[#f0f9ed] transition-colors"
                              >
                                Düzenle
                              </button>
                              <button
                                onClick={() =>
                                  deleteSubcategory(sub.id, sub.title)
                                }
                                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Edit Form */}
                {isEditing && selectedSubcategory && (
                  <div className="space-y-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Başlık *
                      </label>
                      <input
                        type="text"
                        value={selectedSubcategory.title}
                        onChange={(e) =>
                          setSelectedSubcategory({
                            ...selectedSubcategory,
                            title: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b2d6a1] focus:border-transparent"
                        placeholder="Örn: Ekibimiz"
                      />
                    </div>

                    {/* Slug */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Slug (URL) *
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">/{selectedPage}/</span>
                        <input
                          type="text"
                          value={selectedSubcategory.slug}
                          onChange={(e) =>
                            setSelectedSubcategory({
                              ...selectedSubcategory,
                              slug: e.target.value
                                .toLowerCase()
                                .replace(/\s+/g, "-")
                                .replace(/[^a-z0-9-]/g, ""),
                            })
                          }
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b2d6a1] focus:border-transparent"
                          placeholder="ekibimiz"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        İçerik
                      </label>
                      <textarea
                        value={selectedSubcategory.content}
                        onChange={(e) =>
                          setSelectedSubcategory({
                            ...selectedSubcategory,
                            content: e.target.value,
                          })
                        }
                        rows={8}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b2d6a1] focus:border-transparent"
                        placeholder="Alt kategori içeriği..."
                      />
                    </div>

                    {/* Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Görsel
                      </label>
                      <ImageUpload
                        currentImage={selectedSubcategory.imageUrl}
                        onUploadComplete={(url) =>
                          setSelectedSubcategory({
                            ...selectedSubcategory,
                            imageUrl: url,
                          })
                        }
                      />
                    </div>

                    {/* Published */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="published"
                        checked={selectedSubcategory.published}
                        onChange={(e) =>
                          setSelectedSubcategory({
                            ...selectedSubcategory,
                            published: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-[#b2d6a1] rounded focus:ring-2 focus:ring-[#b2d6a1]"
                      />
                      <label
                        htmlFor="published"
                        className="text-sm font-medium text-gray-700"
                      >
                        Yayınla
                      </label>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t">
                      <button
                        onClick={saveSubcategory}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-[#b2d6a1] text-white rounded-lg hover:bg-[#68947c] transition-colors disabled:opacity-50"
                      >
                        <Save className="h-5 w-5" />
                        {loading ? "Kaydediliyor..." : "Kaydet"}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setSelectedSubcategory(null);
                        }}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        İptal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedPage>
  );
}
