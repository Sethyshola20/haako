import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Haako",
  description: "Centralize your banking information and manage your money effectively with Haako",
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Welcome to <span className="text-primary">Haako</span></h1>
        <p className="mb-8 text-xl text-muted-foreground">
          Centralize your banking information and take control of your finances in one place
        </p>
        
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 justify-center">
          <Link 
            href="/login" 
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Login
          </Link>
          <Link 
            href="/register" 
            className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Register
          </Link>
        </div>
      </div>
      
      <div className="mt-16 grid gap-8 md:grid-cols-3 max-w-5xl">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-2 text-xl font-semibold">All Your Accounts</h3>
          <p className="text-muted-foreground">Connect all your bank accounts in one secure dashboard for a complete financial overview.</p>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-2 text-xl font-semibold">Smart Insights</h3>
          <p className="text-muted-foreground">Get personalized insights and recommendations to help you save money and reach your financial goals.</p>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-2 text-xl font-semibold">Secure & Private</h3>
          <p className="text-muted-foreground">Your financial data is encrypted and secure. We never share your information with third parties.</p>
        </div>
      </div>
    </div>
  );
}
