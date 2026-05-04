import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function VerifyOtp() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(300); 
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleVerify = async (e) => {
    // Prevent default form submission behavior
    if (e) e.preventDefault(); 

    if (timer === 0) {
      toast.error("OTP expired. Please resend.");
      return;
    }

    const finalOtp = otp.join("");
    if (finalOtp.length !== 4) {
      toast.error("Please enter a 4-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: finalOtp }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("OTP Verified");
        navigate("/reset-password");
      } else {
        toast.error(data.message || "Verification failed");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error");
      setLoading(false);
    }
  };

  const handleResend = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("OTP Resent Successfully");
        setTimer(300);
        setOtp(["", "", "", ""]);
      } else {
        toast.error(data.message || "OTP Resend Failed");
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden z-10 min-h-screen flex items-center justify-center bg-white px-4">
      
      {loading && (
        <div className="fixed inset-0 bg-white/80 z-50 flex flex-col items-center justify-center backdrop-blur-sm">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black"></div>
          <p className="mt-4 font-medium text-black">Processing...</p>
        </div>
      )}

      {/* ✅ Use a <form> tag instead of a <div> for onSubmit support */}
      <form 
        className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8 border" 
        onSubmit={handleVerify}
      >
        <h2 className="text-2xl font-bold text-center mb-3">Enter OTP</h2>

        <p className="text-center text-gray-500 text-sm mb-2">
          OTP sent to <br />
          <span className="text-black font-semibold">{email || "your email"}</span>
        </p>

        <p className={`text-center text-sm font-medium mb-6 ${timer < 30 ? 'text-red-500' : 'text-gray-600'}`}>
          {timer > 0 ? `OTP expires in: ${formatTime()}` : "OTP Expired"}
        </p>

        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              autoComplete="one-time-code"
              maxLength="1"
              value={digit}
              disabled={loading || timer === 0}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !otp[index] && index > 0) {
                  document.getElementById(`otp-${index - 1}`)?.focus();
                }
              }}
              className="w-12 h-12 rounded-xl bg-gray-100 text-center text-xl font-bold outline-none focus:ring-2 focus:ring-black transition-all disabled:opacity-50"
            />
          ))}
        </div>

        <button
          type="submit" // ✅ This allows 'Enter' to submit the form
          disabled={loading || timer === 0}
          className="inline-flex w-full items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-black/90 active:translate-y-px disabled:opacity-50 transition-all"
        >
          {loading ? "Verifying..." : "Continue"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-6">
          Didn’t get OTP?{" "}
          <button
            type="button" // ✅ Explicitly set to 'button' so it doesn't trigger the form's onSubmit
            onClick={handleResend}
            disabled={loading}
            className="text-black font-semibold hover:underline cursor-pointer disabled:opacity-30"
          >
            Resend OTP
          </button>
        </p>
      </form>
    </div>
  );
}