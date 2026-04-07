import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await authApi.login({ email, password });
      const { token, user } = res.data.data;
      setAuth(token, user);
      navigate("/editor");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[var(--sm-primary)]/5 rounded-full blur-[120px]"></div>
      </div>
      <div className="w-full max-w-md relative">
        <div className="bg-[var(--sm-surface-container-low)] p-8 md:p-12 border border-[var(--sm-outline-variant)]/10 shadow-2xl shadow-[var(--sm-primary)]/5 rounded-lg">
          <div className="text-center mb-8">
            <h2 className="font-label text-xs uppercase tracking-[0.2em] text-[var(--sm-primary)] mb-2">
              Authentication
            </h2>
            <h1 className="text-3xl font-bold tracking-tighter font-headline">
              Welcome Back
            </h1>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-[var(--sm-error)]/10 border border-[var(--sm-error)]/30 text-[var(--sm-error)] text-xs font-label rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block font-label text-[10px] uppercase tracking-[0.15em] text-[var(--sm-outline)]">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--sm-surface-container-lowest)] border-l-2 border-transparent focus:border-[var(--sm-primary)] text-[var(--sm-on-surface)] font-body py-3 px-4 transition-all duration-200 placeholder:text-[var(--sm-outline)]/30 outline-none"
                placeholder="engineer@company.com"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-label text-[10px] uppercase tracking-[0.15em] text-[var(--sm-outline)]">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--sm-surface-container-lowest)] border-l-2 border-transparent focus:border-[var(--sm-primary)] text-[var(--sm-on-surface)] font-body py-3 px-4 transition-all duration-200 placeholder:text-[var(--sm-outline)]/30 outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full code-gradient text-[var(--sm-on-primary)] font-headline font-extrabold py-4 rounded-md hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-[var(--sm-primary)]/10 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-xs text-[var(--sm-outline)] font-label uppercase tracking-widest mt-8">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[var(--sm-primary)] hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
