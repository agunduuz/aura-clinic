// app/admin/blog/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import ProtectedPage from "@/components/admin/ProtectedPage";
import AdminHeader from "@/components/admin/AdminHeader";
import ImageUpload from "@/components/admin/ImageUpload";
import { Plus, Trash2, Save, X } from "lucide-react";

interface BlogPost {
  id: string;
  locale: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string | null;
  imageUrl: string;
  category?: string | null;
  author?: string | null;
  readTime?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  published: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function BlogAdminPage() {
  const [locale, setLocale] = useState<"tr" | "en">("tr");
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "seo">("basic");

  const [formData, setFormData] = useState<Partial<BlogPost>>({
    locale: "tr",
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    imageUrl: "",
    category: null,
    author: null,
    readTime: null,
    published: false,
    order: 0,
  });

  const fetchBlogPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/blog?locale=${locale}`);
      if (res.ok) {
        const data = await res.json();
        setBlogPosts(data);
      }
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    fetchBlogPosts();
  }, [fetchBlogPosts]);

  const handleCreate = () => {
    setIsCreating(true);
    setIsEditing(false);
    setSelectedPost(null);
    setFormData({
      locale,
      slug: "",
      title: "",
      excerpt: "",
      content: "",
      imageUrl: "",
      category: null,
      author: null,
      readTime: null,
      published: false,
      order: 0,
    });
  };

  const handleEdit = (post: BlogPost) => {
    setIsEditing(true);
    setIsCreating(false);
    setSelectedPost(post);
    setFormData(post);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      if (isCreating) {
        const res = await fetch("/api/admin/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          await fetchBlogPosts();
          setIsCreating(false);
          setFormData({});
          alert("Blog yazısı başarıyla oluşturuldu!");
        }
      } else if (selectedPost) {
        const res = await fetch(`/api/admin/blog/${selectedPost.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          await fetchBlogPosts();
          setIsEditing(false);
          setSelectedPost(null);
          alert("Blog yazısı başarıyla güncellendi!");
        }
      }
    } catch (error) {
      console.error("Failed to save blog post:", error);
      alert("Kaydetme sırasında bir hata oluştu!");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu blog yazısını silmek istediğinizden emin misiniz?"))
      return;

    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchBlogPosts();
        if (selectedPost?.id === id) {
          setSelectedPost(null);
          setIsEditing(false);
        }
        alert("Blog yazısı silindi!");
      }
    } catch (error) {
      console.error("Failed to delete blog post:", error);
      alert("Silme sırasında bir hata oluştu!");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setSelectedPost(null);
    setFormData({});
  };

  return (
    <ProtectedPage>
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Blog Yönetimi
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Blog yazılarını oluşturun ve yönetin
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Locale Switcher */}
                  <div className="flex bg-white rounded-lg shadow-sm border border-gray-200">
                    <button
                      onClick={() => setLocale("tr")}
                      className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                        locale === "tr"
                          ? "bg-primary text-white"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      TR
                    </button>
                    <button
                      onClick={() => setLocale("en")}
                      className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                        locale === "en"
                          ? "bg-primary text-white"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      EN
                    </button>
                  </div>

                  <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Yeni Blog Yazısı
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Blog Posts List */}
                <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h2 className="text-lg font-semibold mb-4">Blog Yazıları</h2>
                  {loading ? (
                    <div className="text-center py-8 text-gray-500">
                      Yükleniyor...
                    </div>
                  ) : blogPosts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Henüz blog yazısı eklenmemiş
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {blogPosts.map((post) => (
                        <div
                          key={post.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedPost?.id === post.id
                              ? "bg-primary/10 border-primary"
                              : "hover:bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div
                              onClick={() => handleEdit(post)}
                              className="flex-1"
                            >
                              <h3 className="font-medium text-gray-900 text-sm">
                                {post.title}
                              </h3>
                              <p className="text-xs text-gray-500 mt-1">
                                {post.slug}
                              </p>
                              {post.category && (
                                <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                                  {post.category === "surgical"
                                    ? "Ameliyatlı"
                                    : post.category === "non-surgical"
                                      ? "Ameliyatsız"
                                      : "Genel"}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  post.published
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {post.published ? "Yayında" : "Taslak"}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(post.id);
                                }}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Editor */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  {!isEditing && !isCreating ? (
                    <div className="text-center py-12 text-gray-500">
                      <p className="text-lg">
                        Düzenlemek için bir blog yazısı seçin veya yeni yazı
                        oluşturun
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Tabs */}
                      <div className="flex border-b border-gray-200 mb-6">
                        {[
                          { id: "basic", label: "Temel Bilgiler" },
                          { id: "seo", label: "SEO" },
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() =>
                              setActiveTab(tab.id as "basic" | "seo")
                            }
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                              activeTab === tab.id
                                ? "border-primary text-primary"
                                : "border-transparent text-gray-600 hover:text-gray-900"
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      {/* Basic Tab */}
                      {activeTab === "basic" && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Başlık *
                            </label>
                            <input
                              type="text"
                              value={formData.title || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  title: e.target.value,
                                })
                              }
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="Blog yazısı başlığı"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Slug *
                            </label>
                            <input
                              type="text"
                              value={formData.slug || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  slug: e.target.value,
                                })
                              }
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="blog-yazisi-slug"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Özet *
                            </label>
                            <textarea
                              value={formData.excerpt || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  excerpt: e.target.value,
                                })
                              }
                              rows={3}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="Kısa özet (liste sayfasında görünür)"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              İçerik
                            </label>
                            <textarea
                              value={formData.content || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  content: e.target.value,
                                })
                              }
                              rows={12}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                              placeholder="Blog yazısı içeriği..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Kapak Görseli *
                            </label>
                            <ImageUpload
                              currentImage={formData.imageUrl}
                              onUploadComplete={(url) =>
                                setFormData({ ...formData, imageUrl: url })
                              }
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Kategori
                              </label>
                              <select
                                value={formData.category || ""}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    category: e.target.value || null,
                                  })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              >
                                <option value="">Seçiniz</option>
                                <option value="surgical">Ameliyatlı</option>
                                <option value="non-surgical">
                                  Ameliyatsız
                                </option>
                                <option value="general">Genel</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Okuma Süresi
                              </label>
                              <input
                                type="text"
                                value={formData.readTime || ""}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    readTime: e.target.value || null,
                                  })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                placeholder="5 dk okuma"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Yazar
                            </label>
                            <input
                              type="text"
                              value={formData.author || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  author: e.target.value || null,
                                })
                              }
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Yazar adı"
                            />
                          </div>

                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.published || false}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    published: e.target.checked,
                                  })
                                }
                                className="w-4 h-4 appearance-none border-2 border-gray-300 rounded bg-white checked:bg-primary checked:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 relative checked:after:content-['✓'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-white checked:after:text-xs checked:after:font-bold"
                              />
                              <span className="text-sm text-gray-700">
                                Yayınla
                              </span>
                            </label>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sıra
                              </label>
                              <input
                                type="number"
                                value={formData.order || 0}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    order: parseInt(e.target.value),
                                  })
                                }
                                className="w-20 px-3 py-1 border border-gray-300 rounded-lg"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SEO Tab */}
                      {activeTab === "seo" && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Meta Başlık
                            </label>
                            <input
                              type="text"
                              value={formData.metaTitle || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  metaTitle: e.target.value,
                                })
                              }
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="SEO başlığı"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Önerilen uzunluk: 50-60 karakter
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Meta Açıklama
                            </label>
                            <textarea
                              value={formData.metaDescription || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  metaDescription: e.target.value,
                                })
                              }
                              rows={3}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="SEO açıklaması"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Önerilen uzunluk: 150-160 karakter
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Meta Anahtar Kelimeler
                            </label>
                            <input
                              type="text"
                              value={formData.metaKeywords || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  metaKeywords: e.target.value,
                                })
                              }
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="anahtar, kelime, virgülle, ayrılmış"
                            />
                          </div>

                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-medium text-blue-900 mb-2">
                              SEO Önizlemesi
                            </h4>
                            <div className="space-y-1">
                              <div className="text-blue-600 text-lg">
                                {formData.metaTitle ||
                                  formData.title ||
                                  "Başlık"}
                              </div>
                              <div className="text-green-600 text-sm">
                                auraclinic.com/blog/
                                {formData.slug || "slug"}
                              </div>
                              <div className="text-gray-600 text-sm">
                                {formData.metaDescription ||
                                  formData.excerpt ||
                                  "Açıklama..."}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <X className="w-5 h-5 inline mr-2" />
                          İptal
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={saving}
                          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                          <Save className="w-5 h-5 inline mr-2" />
                          {saving ? "Kaydediliyor..." : "Kaydet"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedPage>
  );
}
