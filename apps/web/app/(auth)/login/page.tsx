import { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/app/(auth)/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login | Haako",
  description: "Login to your Haako account",
};

export default function LoginPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="flex w-full flex-col justify-center space-y-6 sm:w-[35vw]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to sign in to your account
          </p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="underline underline-offset-4 hover:text-primary">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}