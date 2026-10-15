"use client";

import CountdownTimer from "@/components/shared/CountdownTimer";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const ResetPasswordPage = () => {
  // toggle show password
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [initialTime, setInitialTime] = useState<number | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [fetchingTime, setFetchingTime] = useState(true);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  //   get real time  from database

  useEffect(() => {
    if (token) {
      setFetchingTime(true);
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/reset-token-status/${token}`,
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.timeLeft > 0) {
            setInitialTime(data.timeLeft);
            setIsExpired(false);
          } else {
            setIsExpired(true);
          }
        })
        .catch(() => setIsExpired(true))
        .finally(() => setFetchingTime(false));
    }
  }, [token]);

  // if data is loaded
  if (fetchingTime) {
    return <div className="text-center my-20">Checking token validity...</div>;
  }

  // 2. if data is expired or not
  if (isExpired) {
    return (
      <div className="text-center my-20">
        <h2 className="text-2xl text-red-500 font-bold">Link Expired!</h2>
        <p>This password reset link is no longer valid.</p>
        <button
          onClick={() => (window.location.href = "/forget-password")}
          className="mt-4 text-teal-600 underline"
        >
          Request a new link
        </button>
      </div>
    );
  }

  const onSubmit = async (data: any) => {
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Invalid Request",
        text: "No token found. Please use the link sent to your email.",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/update-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: token,
            newPassword: data.newPassword,
          }),
        },
      );

      const result = await response.json();

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Your password has been updated. You can now login.",
          confirmButtonColor: "#14b8a6",
        }).then(() => {
          router.push("/login");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: result.message || "Failed to update password.",
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire({
        icon: "error",
        title: "Connection Error",
        text: "Could not connect to the server.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-lg">
        <h2 className="text-3xl font-bold text-center text-teal-600">
          Reset Password
        </h2>
        <p className="text-sm text-center text-gray-500">
          Enter your new secure password below.
        </p>

        {/* <CountdownTimer></CountdownTimer> */}
        {initialTime !== null && (
          <CountdownTimer
            initialSeconds={initialTime}
            onExpire={() => setIsExpired(true)}
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* new pass */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                {...register("newPassword", {
                  required: "Password is required",
                  minLength: 6,
                })}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-teal-500 focus:border-teal-500 outline-none"
                placeholder="••••••••"
              />

              {/* eye button */}
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  // Eye-off Icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  // Eye open Icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.644C3.412 7.943 7.244 4.5 12 4.5c4.756 0 8.773 3.162 10.065 7.498a1.01 1.01 0 010 .644C20.588 16.057 16.756 19.5 12 19.5c-4.756 0-8.773-3.162-10.065-7.498z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </button>
            </div>

            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">
                Minimum 6 characters required
              </p>
            )}
          </div>

          {/* confirm new pass */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  validate: (value) =>
                    value === watch("newPassword") || "Passwords do not match",
                })}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-teal-500 focus:border-teal-500 outline-none"
                placeholder="••••••••"
              />

              {/* eye button */}
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  // Eye-off Icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  // Eye open Icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.644C3.412 7.943 7.244 4.5 12 4.5c4.756 0 8.773 3.162 10.065 7.498a1.01 1.01 0 010 .644C20.588 16.057 16.756 19.5 12 19.5c-4.756 0-8.773-3.162-10.065-7.498z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {(errors.confirmPassword as any).message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || isExpired} // if time expired then button is disabled
            className={`w-full py-2 font-bold text-white rounded-md ${
              loading || isExpired
                ? "bg-gray-400"
                : "bg-teal-500 hover:bg-teal-600"
            }`}
          >
            {loading
              ? "Updating..."
              : isExpired
                ? "Link Expired"
                : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

// if useSearchParams() is used then  it should be wrapped with suspense
export default function Page() {
  return (
    <Suspense fallback={<div>Loading Page...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
}
