"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

export type FormValues = {
  email: string;
  password: string;
};

const LoginPage = () => {
  // toggle show password
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const router = useRouter();

  const onSubmit = async (data: FormValues) => {
    try {
      // 1. NextAuth-er signIn called by "credentials"
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false, //for manually error handling
      });

      if (result?.ok) {
        router.push("/dashboard");
        router.refresh();
      }

      if (result?.error) {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "Wrong Password!",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Logged in successfully!",
          confirmButtonColor: "#14b8a6",
        }).then(() => {
          router.push("/dashboard");
        });
        // 2. Refresh/Redirect: IMPORTANT!
      }
    } catch (err: any) {
      console.error(err.message);
      throw new Error(err.message);
    }
  };

  return (
    <div className="my-10 w-[90%] mx-auto">
      <h1 className="text-center text-4xl mb-5 font-bold">
        Login <span className="text-teal-500">Here</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
        <div>
          <Image
            src="https://img.freepik.com/free-vector/login-concept-illustration_114360-739.jpg?t=st=1710130697~exp=1710134297~hmac=f1b21d9c1823a0657d339c256a1c4ad8301168480e35b35aeba5106568a21010&w=740"
            width={500}
            height={200}
            alt="login page"
            className="w-full h-auto"
          />
        </div>

        <div className="w-[80%] mx-auto bg-white p-6 shadow-lg rounded-lg">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* email */}
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
                {...register("email")}
                placeholder="Email"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm  sm:text-sm"
                required
              />
            </div>
            {/* password */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Password"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm  sm:text-sm"
                  required
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
            </div>

            <div>
              <button
                type="submit"
                className="w-full border border-teal-500 text-teal-500 font-semibold py-2 px-4 rounded-md shadow-md hover:bg-teal-500 hover:text-black"
              >
                Login
              </button>
            </div>
          </form>

          <p className="text-center mt-4 text-sm text-gray-600">
            Don&apos;t have an account?
            <Link href="/register" className="text-teal-500 hover:underline">
              Create an account
            </Link>
          </p>

          <p className="text-center mt-4 text-sm text-gray-600">
            Forgot Password?
            <Link
              href="/forget-password"
              className="text-teal-500 hover:underline"
            >
              Reset Password
            </Link>
          </p>

          <p className="text-center mt-6 text-sm text-gray-500">
            Or Sign Up Using
          </p>

          {/* Social Login Buttons */}
          <div className="flex justify-center gap-4 mt-4">
            {/* google */}
            <button
              className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full shadow-md hover:bg-gray-200"
              onClick={() =>
                // google
                signIn("google", {
                  callbackUrl: "http://localhost:3000/dashboard",
                })
              }
            >
              <Image
                src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png"
                width={30}
                height={30}
                alt="Google logo"
              />
            </button>

            {/* github */}
            <button
              className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full shadow-md hover:bg-gray-200"
              onClick={() =>
                signIn("github", {
                  callbackUrl: "http://localhost:3000/dashboard",
                })
              }
            >
              <Image
                src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                width={25}
                height={25}
                alt="GitHub logo"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
