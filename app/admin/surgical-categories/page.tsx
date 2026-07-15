// app/admin/surgical-categories/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import ProtectedPage from "@/components/admin/ProtectedPage";
import AdminHeader from "@/components/admin/AdminHeader";
import MultipleImageUpload from "@/components/admin/MultipleImageUpload";
import ImageUpload from "@/components/admin/ImageUpload";

import { Plus, Trash2, Save, X } from "lucide-react";

interface SurgicalCategory {
  id: string;
  locale: string;
  slug: string;
  title: string;
  description?: string;
  heroImage?: string;
  patientsCount: string;
  clinicImage?: string;
  experienceYears: string;
  rating: string;
  galleryImages: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  seoContent?: string;
  published: boolean;
  order: number;
  advantages: Advantage[];
  processSteps: ProcessStep[];
  faqs: FAQ[];
  features: Feature[];
  whyChooseItems: WhyChooseItem[];
}

interface Advantage {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  order: number;
  active: boolean;
}

interface ProcessStep {
  id: string;
  step: string;
  description: string;
  order: number;
  active: boolean;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
  active: boolean;
}

interface Feature {
  id: string;
  title: string;
  description: string;
  icon?: string;
  order: number;
  active: boolean;
}

// ✅ YENİ: WhyChooseItem interface ekle
interface WhyChooseItem {
  id: string;
  text: string;
  order: number;
  active: boolean;
}

export default function SurgicalCategoriesPage() {
  const [locale, setLocale] = useState<"tr" | "en">("tr");
  const [categories, setCategories] = useState<SurgicalCategory[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<SurgicalCategory | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<
    | "basic"
    | "features"
    | "advantages"
    | "process"
    | "faqs"
    | "whyChoose"
    | "seo"
  >("basic");

  // Form states
  const [formData, setFormData] = useState<Partial<SurgicalCategory>>({
    locale: "tr",
    slug: "",
    title: "",
    description: "",
    heroImage: "",
    patientsCount: "15,000+",
    experienceYears: "15+",
    rating: "4.9/5",
    galleryImages: [],
    published: false,
    order: 0,
  });

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/admin/surgical-categories?locale=${locale}`
      );
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreate = () => {
    setIsCreating(true);
    setIsEditing(false);
    setSelectedCategory(null);
    setFormData({
      locale,
      slug: "",
      title: "",
      description: "",
      heroImage: "",
      patientsCount: "15,000+",
      experienceYears: "15+",
      rating: "4.9/5",
      galleryImages: [],
      published: false,
      order: 0,
    });
  };

  const handleEdit = (category: SurgicalCategory) => {
    setIsEditing(true);
    setIsCreating(false);
    setSelectedCategory(category);
    setFormData(category);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      if (isCreating) {
        const res = await fetch("/api/admin/surgical-categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          const createdCategory = await res.json();
          await fetchCategories();
          setIsCreating(false);
          setIsEditing(true);
          setSelectedCategory(createdCategory);
          setFormData(createdCategory);
          alert(
            "Kategori başarıyla oluşturuldu! Artık diğer bölümleri ekleyebilirsiniz."
          );
        }
      } else if (selectedCategory) {
        const res = await fetch(
          `/api/admin/surgical-categories/${selectedCategory.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );

        if (res.ok) {
          await fetchCategories();
          setIsEditing(false);
          setSelectedCategory(null);
          alert("Kategori başarıyla güncellendi!");
        }
      }
    } catch (error) {
      console.error("Failed to save category:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")) return;

    try {
      const res = await fetch(`/api/admin/surgical-categories/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchCategories();
        if (selectedCategory?.id === id) {
          setSelectedCategory(null);
          setIsEditing(false);
        }
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setSelectedCategory(null);
    setFormData({});
  };

  // app/admin/surgical-categories/page.tsx - Handler functions

  // Advantage handlers
  const handleAddAdvantage = async () => {
    if (!selectedCategory) return;

    try {
      const res = await fetch(
        `/api/admin/surgical-categories/${selectedCategory.id}/advantages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "Yeni Avantaj",
            description: "",
            order: selectedCategory.advantages.length,
            active: true,
          }),
        }
      );

      if (res.ok) {
        await fetchCategories();
        const updated = categories.find((c) => c.id === selectedCategory.id);
        if (updated) setSelectedCategory(updated);
      }
    } catch (error) {
      console.error("Failed to add advantage:", error);
    }
  };

  const updateAdvantage = (
    id: string,
    field: string,
    value: string | number | boolean
  ) => {
    if (!selectedCategory) return;

    const updated = {
      ...selectedCategory,
      advantages: selectedCategory.advantages.map((adv) =>
        adv.id === id ? { ...adv, [field]: value } : adv
      ),
    };
    setSelectedCategory(updated);
  };

  const deleteAdvantage = async (id: string) => {
    if (!confirm("Bu avantajı silmek istediğinizden emin misiniz?")) return;

    try {
      const res = await fetch(
        `/api/admin/surgical-categories/advantages/${id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        await fetchCategories();
        const updated = categories.find((c) => c.id === selectedCategory?.id);
        if (updated) setSelectedCategory(updated);
      }
    } catch (error) {
      console.error("Failed to delete advantage:", error);
    }
  };

  const saveAdvantages = async () => {
    if (!selectedCategory) return;

    try {
      setSaving(true);

      // Update all advantages
      await Promise.all(
        selectedCategory.advantages.map((advantage) =>
          fetch(`/api/admin/surgical-categories/advantages/${advantage.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(advantage),
          })
        )
      );

      await fetchCategories();
      alert("Avantajlar kaydedildi!");
    } catch (error) {
      console.error("Failed to save advantages:", error);
      alert("Kaydederken bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  // Process Step handlers (similar pattern)
  const handleAddProcessStep = async () => {
    if (!selectedCategory) return;

    try {
      const res = await fetch(
        `/api/admin/surgical-categories/${selectedCategory.id}/process-steps`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            step: "Yeni Adım",
            description: "",
            order: selectedCategory.processSteps.length,
            active: true,
          }),
        }
      );

      if (res.ok) {
        await fetchCategories();
        const updated = categories.find((c) => c.id === selectedCategory.id);
        if (updated) setSelectedCategory(updated);
      }
    } catch (error) {
      console.error("Failed to add process step:", error);
    }
  };

  const updateProcessStep = (
    id: string,
    field: string,
    value: string | number | boolean
  ) => {
    if (!selectedCategory) return;

    const updated = {
      ...selectedCategory,
      processSteps: selectedCategory.processSteps.map((step) =>
        step.id === id ? { ...step, [field]: value } : step
      ),
    };
    setSelectedCategory(updated);
  };

  const deleteProcessStep = async (id: string) => {
    if (!confirm("Bu adımı silmek istediğinizden emin misiniz?")) return;

    try {
      const res = await fetch(
        `/api/admin/surgical-categories/process-steps/${id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        await fetchCategories();
        const updated = categories.find((c) => c.id === selectedCategory?.id);
        if (updated) setSelectedCategory(updated);
      }
    } catch (error) {
      console.error("Failed to delete process step:", error);
    }
  };

  const saveProcessSteps = async () => {
    if (!selectedCategory) return;

    try {
      setSaving(true);

      await Promise.all(
        selectedCategory.processSteps.map((step) =>
          fetch(`/api/admin/surgical-categories/process-steps/${step.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(step),
          })
        )
      );

      await fetchCategories();
      alert("Süreç adımları kaydedildi!");
    } catch (error) {
      console.error("Failed to save process steps:", error);
      alert("Kaydederken bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  // FAQ handlers (similar pattern)
  const handleAddFAQ = async () => {
    if (!selectedCategory) return;

    try {
      const res = await fetch(
        `/api/admin/surgical-categories/${selectedCategory.id}/faqs`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: "Yeni Soru",
            answer: "",
            order: selectedCategory.faqs.length,
            active: true,
          }),
        }
      );

      if (res.ok) {
        await fetchCategories();
        const updated = categories.find((c) => c.id === selectedCategory.id);
        if (updated) setSelectedCategory(updated);
      }
    } catch (error) {
      console.error("Failed to add FAQ:", error);
    }
  };

  const updateFAQ = (
    id: string,
    field: string,
    value: string | number | boolean
  ) => {
    if (!selectedCategory) return;

    const updated = {
      ...selectedCategory,
      faqs: selectedCategory.faqs.map((faq) =>
        faq.id === id ? { ...faq, [field]: value } : faq
      ),
    };
    setSelectedCategory(updated);
  };

  const deleteFAQ = async (id: string) => {
    if (!confirm("Bu soruyu silmek istediğinizden emin misiniz?")) return;

    try {
      const res = await fetch(`/api/admin/surgical-categories/faqs/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchCategories();
        const updated = categories.find((c) => c.id === selectedCategory?.id);
        if (updated) setSelectedCategory(updated);
      }
    } catch (error) {
      console.error("Failed to delete FAQ:", error);
    }
  };

  const saveFAQs = async () => {
    if (!selectedCategory) return;

    try {
      setSaving(true);

      await Promise.all(
        selectedCategory.faqs.map((faq) =>
          fetch(`/api/admin/surgical-categories/faqs/${faq.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(faq),
          })
        )
      );

      await fetchCategories();
      alert("Sorular kaydedildi!");
    } catch (error) {
      console.error("Failed to save FAQs:", error);
      alert("Kaydederken bir hata oluştu");
    } finally {
      setSaving(false);
    }
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
                    Ameliyatlı Estetik Kategorileri
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Ameliyatlı estetik kategorilerini yönetin
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
                    Yeni Kategori
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Categories List */}
                <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h2 className="text-lg font-semibold mb-4">Kategoriler</h2>
                  {loading ? (
                    <div className="text-center py-8 text-gray-500">
                      Yükleniyor...
                    </div>
                  ) : categories.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Henüz kategori eklenmemiş
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div
                          key={category.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedCategory?.id === category.id
                              ? "bg-primary/10 border-primary"
                              : "hover:bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div
                              onClick={() => handleEdit(category)}
                              className="flex-1"
                            >
                              <h3 className="font-medium text-gray-900">
                                {category.title}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {category.slug}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  category.published
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {category.published ? "Yayında" : "Taslak"}
                              </span>
                              <button
                                onClick={() => handleDelete(category.id)}
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
                        Düzenlemek için bir kategori seçin veya yeni kategori
                        oluşturun
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Tabs */}
                      <div className="flex border-b border-gray-200 mb-6">
                        {[
                          { id: "basic", label: "Temel Bilgiler" },
                          { id: "features", label: "Özellikler" },
                          { id: "advantages", label: "Avantajlar" },
                          { id: "process", label: "Süreç Adımları" },
                          { id: "faqs", label: "SSS" },
                          { id: "whyChoose", label: "Neden Biz?" },
                          { id: "seo", label: "SEO" },
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() =>
                              setActiveTab(
                                tab.id as
                                  | "basic"
                                  | "features"
                                  | "advantages"
                                  | "process"
                                  | "faqs"
                                  | "whyChoose"
                                  | "seo"
                              )
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

                      {/* Tab Content - Basic */}
                      {activeTab === "basic" && (
                        <div className="space-y-4">
                          {/* ✅ YENİ: Yeni kategori uyarısı */}
                          {isCreating && (
                            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-4">
                              <p className="text-sm font-medium">
                                ℹ️ Önce temel bilgileri kaydedip kategoriyi
                                oluşturun. Sonra Özellikler, Avantajlar, SSS
                                gibi bölümleri ekleyebilirsiniz.
                              </p>
                            </div>
                          )}
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
                              placeholder="Burun Estetiği"
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
                              placeholder="burun-estetigi"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Açıklama
                            </label>
                            <textarea
                              value={formData.description || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  description: e.target.value,
                                })
                              }
                              rows={4}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="Kategori açıklaması..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Hero Görseli
                            </label>
                            <ImageUpload
                              currentImage={formData.heroImage}
                              onUploadComplete={(url) =>
                                setFormData({ ...formData, heroImage: url })
                              }
                            />
                          </div>
                          {/* ✅ YENİ: Klinik Görseli */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Klinik Görseli
                            </label>
                            <ImageUpload
                              currentImage={formData.clinicImage}
                              onUploadComplete={(url) =>
                                setFormData({ ...formData, clinicImage: url })
                              }
                            />
                          </div>
                          {/* ✅ YENİ: Galeri Görselleri */}
                          <div>
                            <MultipleImageUpload
                              currentImages={formData.galleryImages || []}
                              onImagesChange={(urls) =>
                                setFormData({
                                  ...formData,
                                  galleryImages: urls,
                                })
                              }
                              label="Galeri Görselleri"
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hasta Sayısı
                              </label>
                              <input
                                type="text"
                                value={formData.patientsCount || ""}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    patientsCount: e.target.value,
                                  })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                placeholder="15,000+"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Deneyim Yılı
                              </label>
                              <input
                                type="text"
                                value={formData.experienceYears || ""}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    experienceYears: e.target.value,
                                  })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                placeholder="15+"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Puan
                              </label>
                              <input
                                type="text"
                                value={formData.rating || ""}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    rating: e.target.value,
                                  })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                placeholder="4.9/5"
                              />
                            </div>
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

                      {/* Features Tab */}
                      {activeTab === "features" && (
                        <>
                          {isCreating ? (
                            <div className="text-center py-12">
                              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-lg inline-block">
                                <p className="text-sm font-medium mb-2">
                                  ⚠️ Özellik eklemek için önce kategoriyi
                                  kaydedin
                                </p>
                                <p className="text-xs text-yellow-700">
                                  Temel Bilgiler tab`ına dönün ve
                                  &quot;Kaydet&quot; butonuna tıklayın.
                                </p>
                              </div>
                            </div>
                          ) : selectedCategory ? (
                            <div className="space-y-6">
                              <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  Özellikler
                                </h3>
                                <button
                                  onClick={async () => {
                                    const newFeature = {
                                      title: "Yeni Özellik",
                                      description: "Açıklama",
                                      icon: "Zap",
                                      order:
                                        (selectedCategory.features?.length ||
                                          0) + 1,
                                      active: true,
                                    };

                                    try {
                                      const response = await fetch(
                                        `/api/admin/surgical-categories/${selectedCategory.id}/features`,
                                        {
                                          method: "POST",
                                          headers: {
                                            "Content-Type": "application/json",
                                          },
                                          body: JSON.stringify(newFeature),
                                        }
                                      );

                                      if (response.ok) {
                                        const created = await response.json();
                                        setSelectedCategory({
                                          ...selectedCategory,
                                          features: [
                                            ...(selectedCategory.features ||
                                              []),
                                            created,
                                          ],
                                        });
                                      }
                                    } catch (error) {
                                      console.error(
                                        "Failed to create feature:",
                                        error
                                      );
                                      alert("Özellik eklenemedi!");
                                    }
                                  }}
                                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                  + Özellik Ekle
                                </button>
                              </div>

                              <div className="space-y-4">
                                {selectedCategory.features?.map(
                                  (feature, index) => (
                                    <div
                                      key={feature.id}
                                      className="bg-white border border-gray-200 rounded-lg p-6"
                                    >
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Başlık
                                          </label>
                                          <input
                                            type="text"
                                            value={feature.title}
                                            onChange={(e) => {
                                              const updated = [
                                                ...(selectedCategory.features ||
                                                  []),
                                              ];
                                              updated[index] = {
                                                ...updated[index],
                                                title: e.target.value,
                                              };
                                              setSelectedCategory({
                                                ...selectedCategory,
                                                features: updated,
                                              });
                                            }}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                          />
                                        </div>

                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">
                                            İkon
                                          </label>
                                          <select
                                            value={feature.icon || "Zap"}
                                            onChange={(e) => {
                                              const updated = [
                                                ...(selectedCategory.features ||
                                                  []),
                                              ];
                                              updated[index] = {
                                                ...updated[index],
                                                icon: e.target.value,
                                              };
                                              setSelectedCategory({
                                                ...selectedCategory,
                                                features: updated,
                                              });
                                            }}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                          >
                                            <option value="Zap">
                                              ⚡ Zap (Modern Teknoloji)
                                            </option>
                                            <option value="Heart">
                                              ❤️ Heart (Hasta Odaklı)
                                            </option>
                                            <option value="Clock">
                                              🕐 Clock (Hızlı İyileşme)
                                            </option>
                                            <option value="TrendingUp">
                                              📈 TrendingUp (Kanıtlanmış)
                                            </option>
                                            <option value="Shield">
                                              🛡️ Shield (Güvenlik)
                                            </option>
                                            <option value="Award">
                                              🏆 Award (Ödül)
                                            </option>
                                            <option value="Star">
                                              ⭐ Star (Yıldız)
                                            </option>
                                            <option value="CheckCircle">
                                              ✅ CheckCircle (Onay)
                                            </option>
                                          </select>
                                        </div>

                                        <div className="md:col-span-2">
                                          <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Açıklama
                                          </label>
                                          <textarea
                                            value={feature.description}
                                            onChange={(e) => {
                                              const updated = [
                                                ...(selectedCategory.features ||
                                                  []),
                                              ];
                                              updated[index] = {
                                                ...updated[index],
                                                description: e.target.value,
                                              };
                                              setSelectedCategory({
                                                ...selectedCategory,
                                                features: updated,
                                              });
                                            }}
                                            rows={2}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                          />
                                        </div>

                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Sıra
                                          </label>
                                          <input
                                            type="number"
                                            value={feature.order}
                                            onChange={(e) => {
                                              const updated = [
                                                ...(selectedCategory.features ||
                                                  []),
                                              ];
                                              updated[index] = {
                                                ...updated[index],
                                                order: parseInt(e.target.value),
                                              };
                                              setSelectedCategory({
                                                ...selectedCategory,
                                                features: updated,
                                              });
                                            }}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                          />
                                        </div>

                                        <div className="flex items-center gap-4">
                                          <label className="flex items-center gap-2">
                                            <input
                                              type="checkbox"
                                              checked={feature.active}
                                              onChange={(e) => {
                                                const updated = [
                                                  ...(selectedCategory.features ||
                                                    []),
                                                ];
                                                updated[index] = {
                                                  ...updated[index],
                                                  active: e.target.checked,
                                                };
                                                setSelectedCategory({
                                                  ...selectedCategory,
                                                  features: updated,
                                                });
                                              }}
                                              className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
                                            />
                                            <span className="text-sm text-gray-700">
                                              Aktif
                                            </span>
                                          </label>

                                          <button
                                            onClick={async () => {
                                              if (
                                                !confirm(
                                                  "Bu özelliği silmek istediğinizden emin misiniz?"
                                                )
                                              )
                                                return;

                                              try {
                                                const response = await fetch(
                                                  `/api/admin/surgical-categories/${selectedCategory.id}/features/${feature.id}`,
                                                  { method: "DELETE" }
                                                );

                                                if (response.ok) {
                                                  setSelectedCategory({
                                                    ...selectedCategory,
                                                    features:
                                                      selectedCategory.features?.filter(
                                                        (a) =>
                                                          a.id !== feature.id
                                                      ),
                                                  });
                                                }
                                              } catch (error) {
                                                console.error(
                                                  "Failed to delete feature:",
                                                  error
                                                );
                                                alert("Özellik silinemedi!");
                                              }
                                            }}
                                            className="ml-auto text-red-600 hover:text-red-700"
                                          >
                                            <svg
                                              className="h-5 w-5"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                              />
                                            </svg>
                                          </button>
                                        </div>
                                      </div>

                                      {/* Kaydet Butonu */}
                                      <div className="mt-4 pt-4 border-t border-gray-200">
                                        <button
                                          onClick={async () => {
                                            try {
                                              const response = await fetch(
                                                `/api/admin/surgical-categories/${selectedCategory.id}/features/${feature.id}`,
                                                {
                                                  method: "PUT",
                                                  headers: {
                                                    "Content-Type":
                                                      "application/json",
                                                  },
                                                  body: JSON.stringify(feature),
                                                }
                                              );

                                              if (response.ok) {
                                                alert("Özellik kaydedildi!");
                                              }
                                            } catch (error) {
                                              console.error(
                                                "Failed to update feature:",
                                                error
                                              );
                                              alert("Kaydetme başarısız!");
                                            }
                                          }}
                                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                          Kaydet
                                        </button>
                                      </div>
                                    </div>
                                  )
                                )}

                                {(!selectedCategory.features ||
                                  selectedCategory.features.length === 0) && (
                                  <div className="text-center py-12 text-gray-500">
                                    Henüz özellik eklenmemiş. Yukarıdaki butona
                                    tıklayarak ekleyin.
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : null}
                        </>
                      )}

                      {/* Advantages, Process, FAQs, SEO tabs burada devam edecek */}
                      {/* Tab Content - Advantages */}
                      {activeTab === "advantages" && (
                        <>
                          {isCreating ? (
                            <div className="text-center py-12">
                              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-lg inline-block">
                                <p className="text-sm font-medium mb-2">
                                  ⚠️ Avantaj eklemek için önce kategoriyi
                                  kaydedin
                                </p>
                                <p className="text-xs text-yellow-700">
                                  Temel Bilgiler tab`ına dönün ve
                                  &quot;Kaydet&quot; butonuna tıklayın.
                                </p>
                              </div>
                            </div>
                          ) : selectedCategory ? (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">
                                  Avantajlar
                                </h3>
                                <button
                                  onClick={() => handleAddAdvantage()}
                                  className="flex items-center gap-2 text-sm bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90"
                                >
                                  <Plus className="w-4 h-4" />
                                  Avantaj Ekle
                                </button>
                              </div>

                              {selectedCategory.advantages.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                                  Henüz avantaj eklenmemiş
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  {selectedCategory.advantages.map(
                                    (advantage, index) => (
                                      console.log(index),
                                      (
                                        <div
                                          key={advantage.id}
                                          className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors"
                                        >
                                          <div className="flex items-start gap-4">
                                            <div className="flex-1 space-y-3">
                                              <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                  Başlık
                                                </label>
                                                <input
                                                  type="text"
                                                  value={advantage.title}
                                                  onChange={(e) =>
                                                    updateAdvantage(
                                                      advantage.id,
                                                      "title",
                                                      e.target.value
                                                    )
                                                  }
                                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                  placeholder="Güvenli Teknoloji"
                                                />
                                              </div>

                                              <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                  Açıklama
                                                </label>
                                                <textarea
                                                  value={
                                                    advantage.description || ""
                                                  }
                                                  onChange={(e) =>
                                                    updateAdvantage(
                                                      advantage.id,
                                                      "description",
                                                      e.target.value
                                                    )
                                                  }
                                                  rows={2}
                                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                  placeholder="En son teknolojik cihazlar..."
                                                />
                                              </div>

                                              <div className="flex items-center gap-4">
                                                <div className="flex-1">
                                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    İkon (opsiyonel)
                                                  </label>
                                                  <input
                                                    type="text"
                                                    value={advantage.icon || ""}
                                                    onChange={(e) =>
                                                      updateAdvantage(
                                                        advantage.id,
                                                        "icon",
                                                        e.target.value
                                                      )
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                    placeholder="Zap"
                                                  />
                                                </div>

                                                <div>
                                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Sıra
                                                  </label>
                                                  <input
                                                    type="number"
                                                    value={advantage.order}
                                                    onChange={(e) =>
                                                      updateAdvantage(
                                                        advantage.id,
                                                        "order",
                                                        parseInt(e.target.value)
                                                      )
                                                    }
                                                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                  />
                                                </div>

                                                <label className="flex items-center gap-2 mt-5 cursor-pointer">
                                                  <input
                                                    type="checkbox"
                                                    checked={advantage.active}
                                                    onChange={(e) =>
                                                      updateAdvantage(
                                                        advantage.id,
                                                        "active",
                                                        e.target.checked
                                                      )
                                                    }
                                                    className="w-4 h-4 appearance-none border-2 border-gray-300 rounded bg-white checked:bg-primary checked:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 relative checked:after:content-['✓'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-white checked:after:text-xs checked:after:font-bold"
                                                  />
                                                  <span className="text-xs text-gray-700">
                                                    Aktif
                                                  </span>
                                                </label>
                                              </div>
                                            </div>

                                            <button
                                              onClick={() =>
                                                deleteAdvantage(advantage.id)
                                              }
                                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                              <Trash2 className="w-4 h-4" />
                                            </button>
                                          </div>
                                        </div>
                                      )
                                    )
                                  )}
                                </div>
                              )}

                              <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                                <button
                                  onClick={() => saveAdvantages()}
                                  disabled={saving}
                                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                                >
                                  {saving
                                    ? "Kaydediliyor..."
                                    : "Avantajları Kaydet"}
                                </button>
                              </div>
                            </div>
                          ) : null}
                        </>
                      )}

                      {/* Tab Content - Process Steps */}
                      {activeTab === "process" && (
                        <>
                          {isCreating ? (
                            <div className="text-center py-12">
                              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-lg inline-block">
                                <p className="text-sm font-medium mb-2">
                                  ⚠️ Süreç adımı eklemek için önce kategoriyi
                                  kaydedin
                                </p>
                                <p className="text-xs text-yellow-700">
                                  Temel Bilgiler tab`ına dönün ve
                                  &quot;Kaydet&quot; butonuna tıklayın.
                                </p>
                              </div>
                            </div>
                          ) : selectedCategory ? (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">
                                  Süreç Adımları
                                </h3>
                                <button
                                  onClick={() => handleAddProcessStep()}
                                  className="flex items-center gap-2 text-sm bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90"
                                >
                                  <Plus className="w-4 h-4" />
                                  Adım Ekle
                                </button>
                              </div>

                              {selectedCategory.processSteps.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                                  Henüz süreç adımı eklenmemiş
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  {selectedCategory.processSteps.map(
                                    (step, index) => (
                                      <div
                                        key={step.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors"
                                      >
                                        <div className="flex items-start gap-4">
                                          <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                            {index + 1}
                                          </div>

                                          <div className="flex-1 space-y-3">
                                            <div>
                                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Adım Başlığı
                                              </label>
                                              <input
                                                type="text"
                                                value={step.step}
                                                onChange={(e) =>
                                                  updateProcessStep(
                                                    step.id,
                                                    "step",
                                                    e.target.value
                                                  )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                placeholder="İlk Konsültasyon"
                                              />
                                            </div>

                                            <div>
                                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Açıklama
                                              </label>
                                              <textarea
                                                value={step.description}
                                                onChange={(e) =>
                                                  updateProcessStep(
                                                    step.id,
                                                    "description",
                                                    e.target.value
                                                  )
                                                }
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                placeholder="Uzman doktorumuzla detaylı görüşme..."
                                              />
                                            </div>

                                            <div className="flex items-center gap-4">
                                              <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                  Sıra
                                                </label>
                                                <input
                                                  type="number"
                                                  value={step.order}
                                                  onChange={(e) =>
                                                    updateProcessStep(
                                                      step.id,
                                                      "order",
                                                      parseInt(e.target.value)
                                                    )
                                                  }
                                                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                />
                                              </div>

                                              <label className="flex items-center gap-2 mt-5 cursor-pointer">
                                                <input
                                                  type="checkbox"
                                                  checked={step.active}
                                                  onChange={(e) =>
                                                    updateProcessStep(
                                                      step.id,
                                                      "active",
                                                      e.target.checked
                                                    )
                                                  }
                                                  className="w-4 h-4 appearance-none border-2 border-gray-300 rounded bg-white checked:bg-primary checked:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 relative checked:after:content-['✓'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-white checked:after:text-xs checked:after:font-bold"
                                                />
                                                <span className="text-xs text-gray-700">
                                                  Aktif
                                                </span>
                                              </label>
                                            </div>
                                          </div>

                                          <button
                                            onClick={() =>
                                              deleteProcessStep(step.id)
                                            }
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              )}

                              <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                                <button
                                  onClick={() => saveProcessSteps()}
                                  disabled={saving}
                                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                                >
                                  {saving
                                    ? "Kaydediliyor..."
                                    : "Adımları Kaydet"}
                                </button>
                              </div>
                            </div>
                          ) : null}
                        </>
                      )}

                      {/* Tab Content - FAQs */}
                      {activeTab === "faqs" && (
                        <>
                          {isCreating ? (
                            <div className="text-center py-12">
                              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-lg inline-block">
                                <p className="text-sm font-medium mb-2">
                                  ⚠️ Soru eklemek için önce kategoriyi kaydedin
                                </p>
                                <p className="text-xs text-yellow-700">
                                  Temel Bilgiler tab`ına dönün ve
                                  &quot;Kaydet&quot; butonuna tıklayın.
                                </p>
                              </div>
                            </div>
                          ) : selectedCategory ? (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">
                                  Sık Sorulan Sorular
                                </h3>
                                <button
                                  onClick={() => handleAddFAQ()}
                                  className="flex items-center gap-2 text-sm bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90"
                                >
                                  <Plus className="w-4 h-4" />
                                  Soru Ekle
                                </button>
                              </div>

                              {selectedCategory.faqs.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                                  Henüz soru eklenmemiş
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  {selectedCategory.faqs.map(
                                    (faq, index) => (
                                      console.log(index),
                                      (
                                        <div
                                          key={faq.id}
                                          className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors"
                                        >
                                          <div className="flex items-start gap-4">
                                            <div className="flex-1 space-y-3">
                                              <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                  Soru
                                                </label>
                                                <input
                                                  type="text"
                                                  value={faq.question}
                                                  onChange={(e) =>
                                                    updateFAQ(
                                                      faq.id,
                                                      "question",
                                                      e.target.value
                                                    )
                                                  }
                                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                  placeholder="İşlem ne kadar sürer?"
                                                />
                                              </div>

                                              <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                  Cevap
                                                </label>
                                                <textarea
                                                  value={faq.answer}
                                                  onChange={(e) =>
                                                    updateFAQ(
                                                      faq.id,
                                                      "answer",
                                                      e.target.value
                                                    )
                                                  }
                                                  rows={3}
                                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                  placeholder="Operasyon süresi..."
                                                />
                                              </div>

                                              <div className="flex items-center gap-4">
                                                <div>
                                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Sıra
                                                  </label>
                                                  <input
                                                    type="number"
                                                    value={faq.order}
                                                    onChange={(e) =>
                                                      updateFAQ(
                                                        faq.id,
                                                        "order",
                                                        parseInt(e.target.value)
                                                      )
                                                    }
                                                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                  />
                                                </div>

                                                <label className="flex items-center gap-2 mt-5 cursor-pointer">
                                                  <input
                                                    type="checkbox"
                                                    checked={faq.active}
                                                    onChange={(e) =>
                                                      updateFAQ(
                                                        faq.id,
                                                        "active",
                                                        e.target.checked
                                                      )
                                                    }
                                                    className="w-4 h-4 appearance-none border-2 border-gray-300 rounded bg-white checked:bg-primary checked:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 relative checked:after:content-['✓'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-white checked:after:text-xs checked:after:font-bold"
                                                  />
                                                  <span className="text-xs text-gray-700">
                                                    Aktif
                                                  </span>
                                                </label>
                                              </div>
                                            </div>

                                            <button
                                              onClick={() => deleteFAQ(faq.id)}
                                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                              <Trash2 className="w-4 h-4" />
                                            </button>
                                          </div>
                                        </div>
                                      )
                                    )
                                  )}
                                </div>
                              )}

                              <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                                <button
                                  onClick={() => saveFAQs()}
                                  disabled={saving}
                                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                                >
                                  {saving
                                    ? "Kaydediliyor..."
                                    : "Soruları Kaydet"}
                                </button>
                              </div>
                            </div>
                          ) : null}
                        </>
                      )}

                      {/* Why Choose Tab */}
                      {activeTab === "whyChoose" && (
                        <>
                          {isCreating ? (
                            <div className="text-center py-12">
                              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-lg inline-block">
                                <p className="text-sm font-medium mb-2">
                                  ⚠️ &quot;Neden Biz?&quot; maddesi eklemek için
                                  önce kategoriyi kaydedin
                                </p>
                                <p className="text-xs text-yellow-700">
                                  Temel Bilgiler tab`ına dönün ve
                                  &quot;Kaydet&quot; butonuna tıklayın.
                                </p>
                              </div>
                            </div>
                          ) : selectedCategory ? (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">
                                  Neden Bizi Seçmelisiniz?
                                </h3>
                                <button
                                  onClick={async () => {
                                    try {
                                      const res = await fetch(
                                        `/api/admin/surgical-categories/${selectedCategory.id}/why-choose-items`,
                                        {
                                          method: "POST",
                                          headers: {
                                            "Content-Type": "application/json",
                                          },
                                          body: JSON.stringify({
                                            text: "Yeni Madde",
                                            order:
                                              (selectedCategory.whyChooseItems
                                                ?.length || 0) + 1,
                                            active: true,
                                          }),
                                        }
                                      );

                                      if (res.ok) {
                                        await fetchCategories();
                                        const updated = categories.find(
                                          (c) => c.id === selectedCategory.id
                                        );
                                        if (updated)
                                          setSelectedCategory(updated);
                                      }
                                    } catch (error) {
                                      console.error(
                                        "Failed to add why choose item:",
                                        error
                                      );
                                    }
                                  }}
                                  className="flex items-center gap-2 text-sm bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90"
                                >
                                  <Plus className="w-4 h-4" />
                                  Madde Ekle
                                </button>
                              </div>

                              {selectedCategory.whyChooseItems?.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                                  Henüz madde eklenmemiş
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  {selectedCategory.whyChooseItems?.map(
                                    (item, index) => (
                                      console.log(index),
                                      (
                                        <div
                                          key={item.id}
                                          className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors"
                                        >
                                          <div className="flex items-start gap-4">
                                            <div className="flex-1 space-y-3">
                                              <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                  Metin
                                                </label>
                                                <input
                                                  type="text"
                                                  value={item.text}
                                                  onChange={(e) => {
                                                    const updated = {
                                                      ...selectedCategory,
                                                      whyChooseItems:
                                                        selectedCategory.whyChooseItems?.map(
                                                          (i) =>
                                                            i.id === item.id
                                                              ? {
                                                                  ...i,
                                                                  text: e.target
                                                                    .value,
                                                                }
                                                              : i
                                                        ),
                                                    };
                                                    setSelectedCategory(
                                                      updated
                                                    );
                                                  }}
                                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                  placeholder="Uzman ve deneyimli doktor kadrosu"
                                                />
                                              </div>

                                              <div className="flex items-center gap-4">
                                                <div>
                                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Sıra
                                                  </label>
                                                  <input
                                                    type="number"
                                                    value={item.order}
                                                    onChange={(e) => {
                                                      const updated = {
                                                        ...selectedCategory,
                                                        whyChooseItems:
                                                          selectedCategory.whyChooseItems?.map(
                                                            (i) =>
                                                              i.id === item.id
                                                                ? {
                                                                    ...i,
                                                                    order:
                                                                      parseInt(
                                                                        e.target
                                                                          .value
                                                                      ),
                                                                  }
                                                                : i
                                                          ),
                                                      };
                                                      setSelectedCategory(
                                                        updated
                                                      );
                                                    }}
                                                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                  />
                                                </div>

                                                <label className="flex items-center gap-2 mt-5 cursor-pointer">
                                                  <input
                                                    type="checkbox"
                                                    checked={item.active}
                                                    onChange={(e) => {
                                                      const updated = {
                                                        ...selectedCategory,
                                                        whyChooseItems:
                                                          selectedCategory.whyChooseItems?.map(
                                                            (i) =>
                                                              i.id === item.id
                                                                ? {
                                                                    ...i,
                                                                    active:
                                                                      e.target
                                                                        .checked,
                                                                  }
                                                                : i
                                                          ),
                                                      };
                                                      setSelectedCategory(
                                                        updated
                                                      );
                                                    }}
                                                    className="w-4 h-4 appearance-none border-2 border-gray-300 rounded bg-white checked:bg-primary checked:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 relative checked:after:content-['✓'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-white checked:after:text-xs checked:after:font-bold"
                                                  />
                                                  <span className="text-xs text-gray-700">
                                                    Aktif
                                                  </span>
                                                </label>
                                              </div>
                                            </div>

                                            <button
                                              onClick={async () => {
                                                if (
                                                  !confirm(
                                                    "Bu maddeyi silmek istediğinizden emin misiniz?"
                                                  )
                                                )
                                                  return;

                                                try {
                                                  const res = await fetch(
                                                    `/api/admin/surgical-categories/${selectedCategory.id}/why-choose-items/${item.id}`,
                                                    { method: "DELETE" }
                                                  );

                                                  if (res.ok) {
                                                    await fetchCategories();
                                                    const updated =
                                                      categories.find(
                                                        (c) =>
                                                          c.id ===
                                                          selectedCategory.id
                                                      );
                                                    if (updated)
                                                      setSelectedCategory(
                                                        updated
                                                      );
                                                  }
                                                } catch (error) {
                                                  console.error(
                                                    "Failed to delete item:",
                                                    error
                                                  );
                                                }
                                              }}
                                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                              <Trash2 className="w-4 h-4" />
                                            </button>
                                          </div>

                                          {/* Kaydet Butonu */}
                                          <div className="mt-3 pt-3 border-t border-gray-200">
                                            <button
                                              onClick={async () => {
                                                try {
                                                  const res = await fetch(
                                                    `/api/admin/surgical-categories/${selectedCategory.id}/why-choose-items/${item.id}`,
                                                    {
                                                      method: "PUT",
                                                      headers: {
                                                        "Content-Type":
                                                          "application/json",
                                                      },
                                                      body: JSON.stringify(
                                                        item
                                                      ),
                                                    }
                                                  );

                                                  if (res.ok) {
                                                    alert("Madde kaydedildi!");
                                                  }
                                                } catch (error) {
                                                  console.error(
                                                    "Failed to update item:",
                                                    error
                                                  );
                                                  alert("Kaydetme başarısız!");
                                                }
                                              }}
                                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                              Kaydet
                                            </button>
                                          </div>
                                        </div>
                                      )
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          ) : null}
                        </>
                      )}

                      {/* Tab Content - SEO */}
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
                              placeholder="Burun Estetiği İstanbul | Aura Clinic"
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
                              placeholder="Burun estetiği konusunda Türkiye'nin lider estetik kliniği..."
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
                              placeholder="burun estetiği, rinoplasti, estetik cerrahi, istanbul"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Virgülle ayırarak yazın
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              SEO İçerik Metni
                            </label>
                            <textarea
                              value={formData.seoContent || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  seoContent: e.target.value,
                                })
                              }
                              rows={6}
                              maxLength={700}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Sayfanın en altında görünecek SEO metni (600-700 karakter)..."
                            />
                            <div className="flex justify-between items-center mt-1">
                              <p className="text-xs text-gray-500">
                                Önerilen uzunluk: 600-700 karakter
                              </p>
                              <p
                                className={`text-xs font-medium ${
                                  (formData.seoContent?.length || 0) >= 600 &&
                                  (formData.seoContent?.length || 0) <= 700
                                    ? "text-green-600"
                                    : "text-gray-500"
                                }`}
                              >
                                {formData.seoContent?.length || 0} / 700
                              </p>
                            </div>
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
                                auraclinic.com/ameliyatli-estetik/
                                {formData.slug || "slug"}
                              </div>
                              <div className="text-gray-600 text-sm">
                                {formData.metaDescription ||
                                  formData.description ||
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
