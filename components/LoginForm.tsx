"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Phone, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/firebase-auth-context"
import { persistUser } from "@/lib/persist-user"
import { type User } from "firebase/auth"

type AuthTab = "email" | "phone"
type AuthMode = "signin" | "signup"

const FIREBASE_ERROR_MAP: Record<string, string> = {
  "auth/user-not-found": "User not found",
  "auth/wrong-password": "Incorrect password",
  "auth/email-already-in-use": "Email already registered",
  "auth/invalid-email": "Invalid email format",
  "auth/invalid-credential": "Invalid email or password",
  "auth/invalid-login-credentials": "Invalid email or password",
}

function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "code" in err) {
    const code = (err as { code?: string }).code as string | undefined
    if (code && FIREBASE_ERROR_MAP[code]) return FIREBASE_ERROR_MAP[code]
    if (code?.toLowerCase().includes("invalid") && code?.toLowerCase().includes("credential")) {
      return "Invalid email or password"
    }
  }
  if (err instanceof Error) return err.message
  return "Something went wrong"
}

async function handleAuthSuccess(user: User) {
  await persistUser(user)
}

const LoginForm = () => {
  const router = useRouter()
  const {
    signInWithGoogle,
    signInWithFacebook,
    signInWithEmail,
    signUpWithEmail,
  } = useAuth()

  const [tab, setTab] = useState<AuthTab>("email")
  const [mode, setMode] = useState<AuthMode>("signin")
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleOAuth = async (
    fn: () => Promise<User>
  ) => {
    setError("")
    setLoading(true)
    try {
      const user = await fn()
      await handleAuthSuccess(user)
      router.push("/")
      router.refresh()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (tab === "phone") {
      setError("Phone authentication coming soon")
      return
    }

    if (!email || !password) {
      setError("Please enter email and password")
      return
    }

    setLoading(true)
    try {
      const user = mode === "signin"
        ? await signInWithEmail(email, password)
        : await signUpWithEmail(email, password, name || undefined)
      await handleAuthSuccess(user)
      router.push("/")
      router.refresh()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16 bg-[var(--login-bg)]">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-[var(--login-card)] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-[var(--login-border)] overflow-hidden">
          {/* Header */}
          <div className="pt-12 pb-8 px-10 text-center">
            <h1 className="font-serif text-3xl font-bold text-[var(--text)] leading-tight">
              {mode === "signin" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-[#6B7280] text-sm mt-3">
              {mode === "signin"
                ? "Sign in to continue to your bookshelf"
                : "Join our community of readers"}
            </p>
          </div>

          <div className="px-10 pb-10">
            {/* Social Buttons */}
            <div className="space-y-4 mb-8">
              <button
                type="button"
                onClick={() => handleOAuth(signInWithGoogle)}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 h-12 rounded-lg border border-[var(--login-border)] bg-[var(--login-input)] text-[var(--text)] text-sm font-medium transition-all duration-200 hover:bg-[#EDE9E1] active:scale-[0.98] disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
              <button
                type="button"
                onClick={() => handleOAuth(signInWithFacebook)}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 h-12 rounded-lg border border-[var(--login-border)] bg-[var(--login-input)] text-[var(--text)] text-sm font-medium transition-all duration-200 hover:bg-[#EDE9E1] active:scale-[0.98] disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-[var(--login-border)]" />
              <span className="text-xs text-[#9CA3AF] uppercase tracking-[0.12em] font-medium">
                or continue with
              </span>
              <div className="flex-1 h-px bg-[var(--login-border)]" />
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-1 mb-8 bg-[var(--login-input)] rounded-lg p-1.5">
              <button
                type="button"
                onClick={() => { setTab("email"); setError("") }}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium transition-all duration-200",
                  tab === "email"
                    ? "bg-[var(--login-card)] text-[var(--text)] shadow-sm"
                    : "text-[#9CA3AF] hover:text-[var(--text)]"
                )}
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
              <button
                type="button"
                onClick={() => { setTab("phone"); setError("") }}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium transition-all duration-200",
                  tab === "phone"
                    ? "bg-[var(--login-card)] text-[var(--text)] shadow-sm"
                    : "text-[#9CA3AF] hover:text-[var(--text)]"
                )}
              >
                <Phone className="w-4 h-4" />
                Phone
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
                  {error}
                  {error === "Invalid email or password" && mode === "signin" && (
                    <span className="block mt-1.5 text-amber-700/90">
                      New here? Create an account below.
                    </span>
                  )}
                </div>
              )}

              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-medium text-[#6B7280] uppercase tracking-[0.1em]">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 bg-[var(--login-input)] border-[var(--login-border)] focus:border-[var(--primary)] rounded-lg placeholder:text-[#9CA3AF]"
                  />
                </div>
              )}

              {tab === "email" ? (
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-medium text-[#6B7280] uppercase tracking-[0.1em]">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 bg-[var(--login-input)] border-[var(--login-border)] focus:border-[var(--primary)] rounded-lg placeholder:text-[#9CA3AF]"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-medium text-[#6B7280] uppercase tracking-[0.1em]">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-12 bg-[var(--login-input)] border-[var(--login-border)] focus:border-[var(--primary)] rounded-lg placeholder:text-[#9CA3AF]"
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-medium text-[#6B7280] uppercase tracking-[0.1em]">
                    Password
                  </Label>
                  {mode === "signin" && (
                    <button
                      type="button"
                      className="text-xs text-[var(--primary)] hover:opacity-80 font-medium transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-[var(--login-input)] border-[var(--login-border)] focus:border-[var(--primary)] rounded-lg pr-12 placeholder:text-[#9CA3AF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[var(--text)] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-lg bg-[var(--primary)] text-white hover:opacity-90 font-semibold text-sm transition-all duration-200 active:scale-[0.98] mt-4 disabled:opacity-50"
              >
                {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
              </Button>
            </form>

            {/* Toggle mode */}
            <p className="text-center text-sm text-[#6B7280] mt-8">
              {mode === "signin" ? "New here? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError("") }}
                className="text-[var(--primary)] hover:opacity-80 font-semibold transition-colors"
              >
                {mode === "signin" ? "Create an account" : "Sign in"}
              </button>
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-[#9CA3AF] mt-8 px-4">
          By continuing, you agree to our{" "}
          <a href="#" className="underline hover:text-[var(--text)] transition-colors">Terms of Service</a>
          {" "}and{" "}
          <a href="#" className="underline hover:text-[var(--text)] transition-colors">Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}

export default LoginForm
