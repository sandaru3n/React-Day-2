import { useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { adminLogin_API } from "../services/admin.api"

export default function Login() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!form.email.trim() || !form.password.trim()) {
      toast.error("Email and password are required")
      return
    }

    setLoading(true)

    try {
      const res = await adminLogin_API({
        email: form.email.trim(),
        password: form.password,
      })

      if (!res || !res.data?.success) {
        toast.error(res?.data?.message || "Invalid credentials")
        return
      }

      localStorage.setItem(
        "admin",
        JSON.stringify(res.data.data)
      )

      toast.success(
        res.data.message || "Logged in successfully"
      )

      navigate("/students")
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Failed to login, please try again")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh w-full flex items-center justify-center bg-[#0a0b0f] px-4">
      <div className="w-full max-w-sm bg-[#111318] border border-white/8 rounded-xl p-6">

        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-base font-semibold text-zinc-100">
            EduTrack
          </h1>

          <p className="text-xs text-zinc-500">
            Sign in with email and password
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400">
              Email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              className="w-full bg-white/4 border border-white/8 rounded-md px-3 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              className="w-full bg-white/4 border border-white/8 rounded-md px-3 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full justify-center mt-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-sm rounded-md font-medium flex items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? "Loading ..." : "Login"}
          </button>

        </form>
      </div>
    </div>
  )
}