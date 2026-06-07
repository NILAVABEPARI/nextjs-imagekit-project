"use client";
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterPage = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const router = useRouter();

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        // TODO -- implement proper validation checks using zod

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            // TODO -- implement tanstack query -- loading, error, debouncing
            const params = {
                email,
                password
            }
            const response = await axios.post<{ message: string }>("/api/auth/register", params);
            console.log(response);
            toast.success("Account created! Redirecting to login...");
            // setTimeout(() => router.push("/login"), 2000);
            router.push("/login");

        } catch (error) {
            console.error("Error while submitting registration: ", error);
            if (axios.isAxiosError<{ error: string }>(error)) {
                // the below line is not required because in a React event handler, an uncaught throw just crashes silently or triggers an error boundary. The toast handles the user feedback instead.
                // throw new Error(error.response?.data?.error || "Registration failed"); 
                toast.error(error.response?.data?.error || "Registration failed");
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
            />

            <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-10">
                <h1 className="text-2xl font-medium text-gray-900 mb-1">Create an account</h1>
                <p className="text-sm text-gray-500 mb-8">Start uploading and sharing videos</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5 tracking-wide">
                            Email address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5 tracking-wide">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            placeholder="Min. 8 characters"
                            required
                            className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5 tracking-wide">
                            Confirm password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                            placeholder="Repeat your password"
                            required
                            className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full h-10 mt-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition"
                    >
                        Create account
                    </button>
                </form>
                <div className="border-t border-gray-100 mt-6 pt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link href="/login" className="text-gray-900 font-medium border-b border-gray-300 hover:border-gray-900 transition">
                            Sign in
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
}

export default RegisterPage;
