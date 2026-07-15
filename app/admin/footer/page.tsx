// app/admin/footer/page.tsx
"use client";

import AdminHeader from "@/components/admin/AdminHeader";
import ProtectedPage from "@/components/admin/ProtectedPage";
import { Plus, Save, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type Locale = "tr" | "en";

interface FooterContent {
  phone: string;
  phoneSecondary: string | null;
  email: string;
  address: string;
  mapLink: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  twitterUrl: string | null;
  linkedinUrl: string | null;
  youtubeUrl: string | null;
  copyrightText: string;
}

interface FooterLink {
  id: string;
  title: string;
  href: string;
  order: number;
  active: boolean;
}

interface FooterGroup {
  id: string;
  title: string;
  slug: string;
  order: number;
  active: boolean;
  links: FooterLink[];
}

export default function FooterEditor() {
  const [locale, setLocale] = useState<Locale>("tr");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Footer Content State
  const [content, setContent] = useState<FooterContent>({
    phone: "",
    phoneSecondary: null,
    email: "",
    address: "",
    mapLink: null,
    facebookUrl: null,
    instagramUrl: null,
    twitterUrl: null,
    linkedinUrl: null,
    youtubeUrl: null,
    copyrightText: "",
  });

  // Footer Groups State
  const [groups, setGroups] = useState<FooterGroup[]>([]);

  // Load Footer Content
  const loadContent = useCallback(async () => {
    const res = await fetch(`/api/footer/content?locale=${locale}`);
    if (res.ok) {
      const data = await res.json();
      setContent(data);
    }
  }, [locale]);

  // Load Footer Groups
  const loadGroups = useCallback(async () => {
    const res = await fetch(`/api/footer/groups?locale=${locale}`);
    if (res.ok) {
      const data = await res.json();
      setGroups(data);
    }
  }, [locale]);

  // Load data when locale changes
  useEffect(() => {
    loadContent();
    loadGroups();
  }, [locale, loadContent, loadGroups]);

  // Save Footer Content
  const saveContent = async () => {
    setLoading(true);
    setSuccess(false);
    const res = await fetch("/api/footer/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...content, locale }),
    });
    setLoading(false);
    if (res.ok) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  // Add New Link to Group
  const addLink = async (groupId: string) => {
    const newLink = {
      groupId,
      title: "Yeni Link",
      href: "/",
      order: groups.find((g) => g.id === groupId)?.links.length || 0,
      active: true,
    };

    const res = await fetch("/api/footer/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLink),
    });

    if (res.ok) {
      loadGroups();
    }
  };

  // Update Link
  const updateLink = async (linkId: string, data: Partial<FooterLink>) => {
    const res = await fetch(`/api/footer/links/${linkId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      loadGroups();
    }
  };

  // Delete Link
  const deleteLink = async (linkId: string) => {
    if (!confirm("Bu linki silmek istediğinize emin misiniz?")) return;

    const res = await fetch(`/api/footer/links/${linkId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      loadGroups();
    }
  };

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />

        <div className="p-4 md:p-8">
          {/* Header with Language Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Footer Yönetimi
              </h1>
              <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">
                Footer içeriğini ve linklerini düzenleyin
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
            <div className="mb-4 md:mb-6 bg-green-50 border border-green-200 text-green-800 px-3 md:px-4 py-2 md:py-3 rounded-lg text-sm">
              ✅ Değişiklikler başarıyla kaydedildi!
            </div>
          )}

          <div className="space-y-6">
            {/* İletişim Bilgileri */}
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                📞 İletişim Bilgileri
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon 1
                  </label>
                  <input
                    type="text"
                    value={content.phone}
                    onChange={(e) =>
                      setContent({ ...content, phone: e.target.value })
                    }
                    className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b2d6a1] focus:border-transparent"
                    placeholder="+90 212 111 11 11"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon 2 (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    value={content.phoneSecondary || ""}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        phoneSecondary: e.target.value || null,
                      })
                    }
                    className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b2d6a1] focus:border-transparent"
                    placeholder="+90 212 561 23 23"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={content.email}
                    onChange={(e) =>
                      setContent({ ...content, email: e.target.value })
                    }
                    className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b2d6a1] focus:border-transparent"
                    placeholder="info@auraclinic.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adres
                  </label>
                  <input
                    type="text"
                    value={content.address}
                    onChange={(e) =>
                      setContent({ ...content, address: e.target.value })
                    }
                    className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b2d6a1] focus:border-transparent"
                    placeholder="İstanbul, Türkiye"
                  />
                </div>
              </div>
            </div>

            {/* Sosyal Medya */}
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                🌐 Sosyal Medya
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facebook
                  </label>
                  <input
                    type="url"
                    value={content.facebookUrl || ""}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        facebookUrl: e.target.value || null,
                      })
                    }
                    className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b2d6a1] focus:border-transparent"
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={content.instagramUrl || ""}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        instagramUrl: e.target.value || null,
                      })
                    }
                    className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b2d6a1] focus:border-transparent"
                    placeholder="https://instagram.com/yourpage"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter
                  </label>
                  <input
                    type="url"
                    value={content.twitterUrl || ""}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        twitterUrl: e.target.value || null,
                      })
                    }
                    className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b2d6a1] focus:border-transparent"
                    placeholder="https://twitter.com/yourpage"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={content.linkedinUrl || ""}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        linkedinUrl: e.target.value || null,
                      })
                    }
                    className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b2d6a1] focus:border-transparent"
                    placeholder="https://linkedin.com/company/yourpage"
                  />
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                © Copyright Metni
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Copyright
                </label>
                <input
                  type="text"
                  value={content.copyrightText}
                  onChange={(e) =>
                    setContent({ ...content, copyrightText: e.target.value })
                  }
                  className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b2d6a1] focus:border-transparent"
                  placeholder="© 2024 Aura Clinic. Tüm hakları saklıdır."
                />
              </div>
            </div>

            {/* Link Grupları */}
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                📋 Link Grupları
              </h2>

              <div className="space-y-6">
                {groups.map((group) => (
                  <div
                    key={group.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base md:text-lg font-medium text-gray-900">
                        {group.title}
                      </h3>
                      <button
                        onClick={() => addLink(group.id)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[#b2d6a1] text-white rounded-lg hover:bg-[#68947c] transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        Link Ekle
                      </button>
                    </div>

                    <div className="space-y-3">
                      {group.links.map((link) => (
                        <div
                          key={link.id}
                          className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 items-end"
                        >
                          <div className="md:col-span-5">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Başlık
                            </label>
                            <input
                              type="text"
                              value={link.title}
                              onChange={(e) =>
                                updateLink(link.id, { title: e.target.value })
                              }
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b2d6a1] focus:border-transparent"
                            />
                          </div>

                          <div className="md:col-span-5">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Link
                            </label>
                            <input
                              type="text"
                              value={link.href}
                              onChange={(e) =>
                                updateLink(link.id, { href: e.target.value })
                              }
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b2d6a1] focus:border-transparent"
                            />
                          </div>

                          <div className="md:col-span-1">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Aktif
                            </label>
                            <input
                              type="checkbox"
                              checked={link.active}
                              onChange={(e) =>
                                updateLink(link.id, {
                                  active: e.target.checked,
                                })
                              }
                              className="w-5 h-5 text-[#b2d6a1] rounded focus:ring-2 focus:ring-[#b2d6a1]"
                            />
                          </div>

                          <div className="md:col-span-1">
                            <button
                              onClick={() => deleteLink(link.id)}
                              className="w-full md:w-auto p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={saveContent}
                disabled={loading}
                className="flex items-center gap-2 w-full sm:w-auto px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-base bg-gradient-to-r from-[#b2d6a1] to-[#68947c] text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                <Save className="h-5 w-5" />
                {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedPage>
  );
}
