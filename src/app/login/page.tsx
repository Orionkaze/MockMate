"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { signIn } from "next-auth/react"
import { identify, track, EVENTS } from "@/lib/analytics"
import { isMockAuthEnabled } from "@/lib/env"

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  auth_failed: "We couldn't complete that sign-in. Please try again.",
  default: "Something went wrong signing you in. Please try again.",
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const code = params.get("code")
      if (code) {
        window.location.href = `/auth/callback?code=${code}&next=/dashboard`
      }
      const errParam = params.get("error")
      if (errParam) {
        setError(AUTH_ERROR_MESSAGES[errParam] ?? AUTH_ERROR_MESSAGES.default)
      }
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        setLoading(false)
      } else {
        if (!isMockAuthEnabled()) {
          document.cookie = "mockmate-demo-session=; path=/; max-age=0"
        }
        const { data } = await supabase.auth.getUser()
        if (data.user?.id) identify(data.user.id)
        track(EVENTS.LOGIN, { method: "email" })
        window.location.href = "/dashboard"
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred."
      setError(errorMsg)
      setLoading(false)
    }
  }

  return (
    <div className="almaprep-theme min-h-screen">
      <div className="auth-split-layout">
        {/* Left Hero / Branding Panel - Desktop Only */}
        <div className="auth-left-panel">
          {/* Logo Header */}
          <div>
            <Link href="/" className="brand inline-flex items-center gap-2.5 text-white no-underline text-xl font-bold">
              <svg className="mark" viewBox="0 0 80 80" aria-hidden="true" style={{ width: "36px", height: "36px" }}>
                <rect width="80" height="80" rx="18" fill="#059669" />
                <path d="M40 12 L16 67 L29 67 L36 50 L44 50 L51 67 L64 67 Z" fill="white" />
                <rect x="30" y="40" width="20" height="8" fill="#059669" />
              </svg>
              <span>Almaprep</span>
            </Link>
          </div>

          {/* Hero Value Proposition */}
          <div className="my-auto py-12 max-w-lg">
            <h1 className="text-3xl lg:text-4xl font-bold leading-tight text-white mb-4">
              Master Your Next <span style={{ color: "#34d399" }}>AI Interview</span> with Confidence
            </h1>
            <p className="text-emerald-100/80 text-base lg:text-lg mb-8 leading-relaxed">
              Practice real-time technical & behavioral mock interviews with instant AI-powered feedback tailored for college & engineering roles.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2.5">
              <Link href="/features" className="auth-pill-tag">
                <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                AI Resume Analysis
              </Link>
              <Link href="/features" className="auth-pill-tag">
                <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m12 14 4-2 4 2M12 14l-4-2-4 2M12 14v8"/>
                  <path d="M20 10V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v4"/>
                </svg>
                Mock Interviews
              </Link>
              <Link href="/features" className="auth-pill-tag">
                <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                Instant Scoring
              </Link>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-xs text-emerald-200/60 flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Encrypted & Secure • Trusted by candidates nationwide
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="auth-right-panel">
          {/* Top Bar Navigation */}
          <div className="flex justify-between items-center w-full">
            {/* Mobile Logo */}
            <Link href="/" className="brand flex items-center gap-2 lg:hidden no-underline text-lg font-bold text-[var(--ink)]">
              <svg className="mark" viewBox="0 0 80 80" aria-hidden="true" style={{ width: "28px", height: "28px" }}>
                <rect width="80" height="80" rx="18" fill="#059669" />
                <path d="M40 12 L16 67 L29 67 L36 50 L44 50 L51 67 L64 67 Z" fill="white" />
                <rect x="30" y="40" width="20" height="8" fill="#059669" />
              </svg>
              Almaprep
            </Link>
            <div className="ml-auto text-sm text-[var(--muted)]">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-semibold text-[var(--emerald-600)] hover:underline">
                Sign up
              </Link>
            </div>
          </div>

          {/* Form Container */}
          <div className="w-full max-w-[420px] mx-auto my-auto py-8">
            <div className="auth-eyebrow">WELCOME BACK</div>
            <h1 className="text-2xl lg:text-3xl font-bold text-[var(--ink)] mt-1 mb-2">Sign in to your account</h1>
            <p className="text-sm text-[var(--muted)] mb-6">Enter your credentials below to access your interview dashboard.</p>

            {error && (
              <div className="auth-note mb-4" style={{ background: "#fef2f2", borderColor: "#fca5a5", color: "#b91c1c" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="field">
                <label htmlFor="email">Email address</label>
                <div className="input-icon-wrapper">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="field">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="password" style={{ marginBottom: 0 }}>Password</label>
                  <Link href="/forgot-password" style={{ fontSize: "0.8rem", color: "var(--emerald-600)", fontWeight: 500 }}>
                    Forgot password?
                  </Link>
                </div>
                <div className="input-icon-wrapper">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "8px" }}>
                {loading ? "Signing In..." : "Sign In"}
              </button>

              <div style={{ display: "flex", alignItems: "center", margin: "8px 0" }}>
                <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
                <span style={{ padding: "0 12px", fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", fontWeight: 600 }}>Or continue with</span>
                <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
              </div>

              <button
                type="button"
                onClick={() => { track(EVENTS.LOGIN, { method: "google" }); signIn("google", { callbackUrl: "/dashboard" }) }}
                className="btn btn-ghost"
                style={{ width: "100%", justifyContent: "center", gap: "10px" }}
              >
                <svg style={{ width: "20px", height: "20px" }} viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  setError(null)
                  track(EVENTS.LOGIN, { method: "github" })
                  const { error } = await supabase.auth.signInWithOAuth({
                    provider: "github",
                    options: {
                      scopes: "repo read:user",
                      redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`
                    }
                  })
                  if (error) {
                    setError(error.message)
                  }
                }}
                className="btn btn-ghost"
                style={{ width: "100%", justifyContent: "center", gap: "10px", marginTop: "4px" }}
              >
                <svg style={{ width: "20px", height: "20px" }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span>Continue with GitHub</span>
              </button>
            </form>
          </div>

          {/* Footer Line */}
          <div className="text-center text-xs text-[var(--muted)] py-4 border-t border-[var(--border)] mt-auto">
            © {new Date().getFullYear()} Almaprep. All rights reserved. •{" "}
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link> •{" "}
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
