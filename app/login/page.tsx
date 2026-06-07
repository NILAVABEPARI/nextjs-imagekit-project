"use client";
import { signIn, SignInResponse } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const router = useRouter();

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        /*
            * What SignInResponse is?
            * It's a TypeScript type exported by next-auth/react that describes the shape of the object returned by signIn() when you pass redirect: false.
            * Its shape -- 
            type SignInResponse = {
                error: string | undefined;  // error message if sign in failed
                status: number;             // HTTP status code (200, 401, etc.)
                ok: boolean;                // true if sign in succeeded
                url: string | null;         // redirect URL if sign in succeeded
            }
        */
        const result: SignInResponse | undefined = await signIn("credentials", {
            email,
            password,
            redirect: false
        });

        if (result?.error) {
            toast.error("Invalid email or password");
        } else {
            toast.success("Welcome back! Redirecting...");
            // setTimeout(() => router.push("/"), 2000);
            router.push("/");
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
                <h1 className="text-2xl font-medium text-gray-900 mb-1">Welcome back</h1>
                <p className="text-sm text-gray-500 mb-8">Sign in to your account to continue</p>

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
                            placeholder="Your password"
                            required
                            className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full h-10 mt-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition"
                    >
                        Sign in
                    </button>
                </form>
                <div className="border-t border-gray-100 mt-6 pt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-gray-900 font-medium border-b border-gray-300 hover:border-gray-900 transition">
                            Create one
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
}

export default LoginPage;
