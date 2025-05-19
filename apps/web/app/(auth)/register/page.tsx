import { Metadata } from "next";
import Link from "next/link";
import RegisterForm from "@/app/(auth)/components/auth/register-form";

export const metadata: Metadata = {
  title: "Register | Haako",
  description: "Create a new Haako account",
};

export default function RegisterPage() {
  return (
    <div className="flex w-screen h-screen flex-col items-center justify-center">
      <div className="flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your details to create your account
          </p>
        </div>
        <RegisterForm />
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4 hover:text-primary">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}