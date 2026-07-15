// app/admin/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// Şifre gücü hesaplama fonksiyonu
function calculatePasswordStrength(password: string) {
  let strength = 0;
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  if (checks.length) strength++;
  if (checks.uppercase) strength++;
  if (checks.lowercase) strength++;
  if (checks.number) strength++;
  if (checks.special) strength++;

  return { strength, checks };
}

// Email validasyonu
function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const { strength, checks } = calculatePasswordStrength(password);
  const isEmailValid = isValidEmail(email);

  const getStrengthColor = () => {
    if (strength <= 2) return "bg-red-500";
    if (strength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (strength <= 2) return "Zayıf";
    if (strength <= 3) return "Orta";
    return "Güçlü";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setEmailTouched(true);
    setPasswordTouched(true);

    // Email validasyonu
    if (!isEmailValid) {
      setError("Lütfen geçerli bir email adresi girin");
      return;
    }

    // Şifre validasyonu
    if (!checks.length) {
      setError("Şifre en az 8 karakter olmalıdır");
      return;
    }

    if (!checks.uppercase) {
      setError("Şifre en az bir büyük harf içermelidir");
      return;
    }

    if (!checks.lowercase) {
      setError("Şifre en az bir küçük harf içermelidir");
      return;
    }

    if (!checks.number) {
      setError("Şifre en az bir rakam içermelidir");
      return;
    }

    if (!checks.special) {
      setError("Şifre en az bir özel karakter içermelidir (!@#$%^&* vb.)");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email veya şifre hatalı");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      console.error("Login error:", err);
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f9ed] via-white to-[#e8f5e2] px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fadeIn">
        {/* Logo ve Başlık */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-[#b2d6a1] to-[#68947c] rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <svg
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="mt-6 text-4xl font-bold bg-gradient-to-r from-[#b2d6a1] to-[#68947c] bg-clip-text text-transparent font-playfair">
            Aura Clinic
          </h1>
          <p className="mt-2 text-base text-[#2d3436] font-medium">
            Admin Panel Girişi
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 sm:p-10 space-y-6 border border-[#dcebd5]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#2d3436] mb-2"
              >
                Email Adresi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-[#68947c]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  className={`w-full pl-12 pr-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-[#b2d6a1] focus:border-transparent transition-all outline-none text-[#2d3436] placeholder-[#68947c]/50 bg-[#f5f9f3] ${
                    emailTouched && !isEmailValid
                      ? "border-red-500"
                      : "border-[#dcebd5]"
                  }`}
                  placeholder="admin@auraclinic.com"
                />
                {emailTouched && email && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    {isEmailValid ? (
                      <svg
                        className="h-5 w-5 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                  </div>
                )}
              </div>
              {emailTouched && !isEmailValid && email && (
                <p className="mt-2 text-sm text-red-600">
                  Lütfen geçerli bir email adresi girin
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-[#2d3436] mb-2"
              >
                Şifre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-[#68947c]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setPasswordTouched(true)}
                  className="w-full pl-12 pr-12 py-3.5 border border-[#dcebd5] rounded-xl focus:ring-2 focus:ring-[#b2d6a1] focus:border-transparent transition-all outline-none text-[#2d3436] placeholder-[#68947c]/50 bg-[#f5f9f3]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#68947c] hover:text-[#b2d6a1] transition-colors"
                >
                  {showPassword ? (
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
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Şifre Gücü Göstergesi */}
              {passwordTouched && password && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#2d3436]">Şifre Gücü:</span>
                    <span
                      className={`text-sm font-semibold ${
                        strength <= 2
                          ? "text-red-600"
                          : strength <= 3
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {getStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                      style={{ width: `${(strength / 5) * 100}%` }}
                    ></div>
                  </div>

                  {/* Şifre Kuralları */}
                  <div className="space-y-1 mt-3">
                    <div className="flex items-center text-xs">
                      <svg
                        className={`h-4 w-4 mr-2 ${
                          checks.length ? "text-green-500" : "text-gray-400"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span
                        className={
                          checks.length ? "text-green-700" : "text-gray-600"
                        }
                      >
                        En az 8 karakter
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      <svg
                        className={`h-4 w-4 mr-2 ${
                          checks.uppercase ? "text-green-500" : "text-gray-400"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span
                        className={
                          checks.uppercase ? "text-green-700" : "text-gray-600"
                        }
                      >
                        En az bir büyük harf (A-Z)
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      <svg
                        className={`h-4 w-4 mr-2 ${
                          checks.lowercase ? "text-green-500" : "text-gray-400"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span
                        className={
                          checks.lowercase ? "text-green-700" : "text-gray-600"
                        }
                      >
                        En az bir küçük harf (a-z)
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      <svg
                        className={`h-4 w-4 mr-2 ${
                          checks.number ? "text-green-500" : "text-gray-400"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span
                        className={
                          checks.number ? "text-green-700" : "text-gray-600"
                        }
                      >
                        En az bir rakam (0-9)
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      <svg
                        className={`h-4 w-4 mr-2 ${
                          checks.special ? "text-green-500" : "text-gray-400"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span
                        className={
                          checks.special ? "text-green-700" : "text-gray-600"
                        }
                      >
                        En az bir özel karakter (!@#$%^&*)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-[#e74c3c] text-[#e74c3c] px-4 py-3 rounded-lg text-sm flex items-start animate-shake">
                <svg
                  className="h-5 w-5 text-[#e74c3c] mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#b2d6a1] to-[#68947c] text-white py-3.5 px-6 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#b2d6a1] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Giriş yapılıyor...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Giriş Yap
                  <svg
                    className="ml-2 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-[#68947c]">
            © 2024 Aura Clinic. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </div>
  );
}
