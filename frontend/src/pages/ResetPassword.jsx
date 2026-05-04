import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  // Automatically get email from localStorage on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReset = async (e) => {
    e.preventDefault(); // Prevent page refresh

    if (!formData.password || !formData.confirmPassword) {
      toast.info("Fill all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Start loading immediately
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            email: formData.email, 
            password: formData.password, 
            confirmPassword: formData.confirmPassword 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Password reset successful");
        localStorage.removeItem("email"); // Cleanup
        navigate("/login");
      } else {
        toast.error(data.message || "Failed to reset password");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden h-screen flex items-center justify-center ">

      {/* Consistent Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white/80 z-50 flex flex-col items-center justify-center backdrop-blur-sm">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black"></div>
          <p className="mt-4 font-medium text-black">Updating Password...</p>
        </div>
      )}

      <div className="relative z-10 w-full max-w-[380px] bg-white px-8 py-5 ">
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl text-black">
          Reset Password
        </h1>

        <form className="mt-10" onSubmit={handleReset} autoComplete='off'>
          <fieldset className="grid gap-5 border-none p-0 m-0" disabled={loading}>
            
            <div className="w-full">
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-black">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                readOnly // Email should be read-only since it's verified
                value={formData.email}
                className="flex h-9 w-full text-gray-500 rounded-md border border-gray-300 bg-gray-50 px-3 py-1 text-sm outline-none cursor-not-allowed"
              />
            </div>

            <div className="w-full relative">
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-black">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                required
                className="flex h-9 w-full text-black rounded-md border border-gray-400 px-3 py-1 text-sm outline-none focus-visible:ring-[1.5px] focus-visible:ring-black"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 bottom-2 text-gray-600 hover:text-black"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            <div className="w-full relative">
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-black">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="flex h-9 w-full rounded-md text-black border border-gray-400 px-3 py-1 text-sm outline-none focus-visible:ring-[1.5px] focus-visible:ring-black"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 bottom-2 text-gray-600 hover:text-black"
              >
                {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-black/90 active:translate-y-px disabled:opacity-50 transition-all mt-2"
            >
              {loading ? "Processing..." : "Reset Password"}
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
}