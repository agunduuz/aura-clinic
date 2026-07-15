// components/admin/AdminHeader.tsx
"use client";

import { useSession } from "next-auth/react";

export default function AdminHeader() {
  const { data: session } = useSession();

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Sol taraf - Başlık */}
        <div className="flex-1 ml-12 md:ml-0">
          <h2 className="text-xl hidden md:block md:text-2xl font-bold text-gray-900">
            Dashboard
          </h2>
          <p className="text-xs md:text-sm text-gray-500 hidden sm:block">
            Aura Clinic Yönetim Paneli
          </p>
        </div>

        {/* Sağ taraf - User Info */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Desktop - Tam bilgi */}
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">
              {session?.user?.name || "Admin User"}
            </p>
            <p className="text-xs text-gray-500">{session?.user?.email}</p>
          </div>

          {/* Avatar - Her zaman görünür */}
          <div className="h-8 w-8 md:h-10 md:w-10 bg-gradient-to-br from-[#b2d6a1] to-[#68947c] rounded-full flex items-center justify-center text-white font-semibold text-sm md:text-base">
            {session?.user?.name?.charAt(0) || "A"}
          </div>
        </div>
      </div>
    </header>
  );
}
