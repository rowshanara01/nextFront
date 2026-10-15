"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

export type FormEmail = {
  email: string;
};

const ForgetPassPage = () => {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormEmail>();

  const router = useRouter();
  if (!mounted) return null; // avoiding Hydration mismatch

  const onSubmit = async (data: FormEmail) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Email Sent!",
          text: "Please check your inbox for the reset link.",
          confirmButtonColor: "#14b8a6",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message || "User not found!",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Connection Failed",
        text: "Make sure your backend server is running.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-lg">
        <h1 className="text-center text-4xl mb-5 font-bold">
          Enter your <span className="text-teal-500"> Email </span>
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-teal-500 focus:border-teal-500 outline-none"
              placeholder="example@gmail.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white font-bold transition-all duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-500 hover:bg-teal-600 shadow-md"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
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
                Processing...
              </span>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassPage;
