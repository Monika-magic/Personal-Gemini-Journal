import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Mail, Eye, EyeOff, ShieldCheck, KeyRound, ArrowRight } from "lucide-react";
import { GeminiIcon } from "./GeminiIcon";

export const AuthModal: React.FC = () => {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, error, clearError } = useAuth();
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email || !password) {
      setLocalError("Please provide both your email and password.");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password should be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch {
      // Error handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLocalError(null);
    clearError();
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch {
      // Handled in context
    } finally {
      setLoading(false);
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-amber-50/40 via-purple-50/30 to-rose-50/40 text-slate-800">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl border border-purple-100/80 shadow-xl shadow-purple-500/5 p-6 sm:p-8">
        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-50 via-purple-50 to-pink-50 border border-purple-100 shadow-xs mb-3">
            <GeminiIcon className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-serif font-semibold tracking-tight text-slate-900">
            Personal Gemini Journal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Private, warm, and thoughtful journaling powered by Gemini and Cloud Firestore
          </p>
        </div>

        {/* Security boundary badge */}
        <div className="mb-6 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 flex items-start gap-2.5 text-xs text-emerald-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-emerald-900">Private & Secure:</span> Your journal entries and conversations are strictly isolated under your authenticated identity.
          </div>
        </div>

        {/* Error notification */}
        {displayError && (
          <div className="mb-5 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <span>{displayError}</span>
          </div>
        )}

        {/* Auth form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="email-input">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200/50 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="password-input">
              Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="password-input"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200/50 transition-all placeholder:text-slate-400"
              />
              <button
                type="button"
                id="toggle-password-visibility"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            id="auth-submit-button"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:opacity-95 disabled:opacity-50 text-white font-medium text-sm rounded-xl transition-all shadow-md shadow-purple-500/15 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span>{isSignUp ? "Create Your Private Journal 🌸" : "Sign In to Your Journal ✨"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="text-xs text-slate-400 font-medium">or</span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        {/* Google Sign In option */}
        <button
          type="button"
          id="google-signin-button"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-xl border border-slate-200 shadow-xs transition-all flex items-center justify-center gap-2.5"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.2-1.9.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Toggle sign in / sign up */}
        <div className="mt-6 text-center text-xs text-slate-500">
          {isSignUp ? (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                id="switch-to-signin-button"
                onClick={() => {
                  setIsSignUp(false);
                  setLocalError(null);
                  clearError();
                }}
                className="text-purple-600 hover:text-purple-700 font-semibold ml-1 hover:underline"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account yet?{" "}
              <button
                type="button"
                id="switch-to-signup-button"
                onClick={() => {
                  setIsSignUp(true);
                  setLocalError(null);
                  clearError();
                }}
                className="text-purple-600 hover:text-purple-700 font-semibold ml-1 hover:underline"
              >
                Create Account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
