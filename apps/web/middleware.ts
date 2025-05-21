import { NextRequest, NextResponse } from "next/server";

export const weburl = process.env.ENVIRONNEMENT === 'production' ? process.env.URL_PROD : process.env.BASE_URL;

export default async function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.getAll().find(cookie => cookie.name === "session")?.value
    
    if (!sessionCookie) {
        return NextResponse.redirect(`${weburl}/login`);
    }
    // const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || 'unknown-ip';
    const routePath = request.nextUrl.pathname;
    
    if (routePath === "/login"  || routePath === "/" 
        || routePath === "/register" ||  /^\/reset-password(\/[a-zA-Z0-9_-]+)?$/.test(routePath) || routePath === "/") {
        return NextResponse.next();
      }
    
      // Allow access to static files (like CSS, JS, images, etc.)
      if (routePath.startsWith("/_next") || // Next.js internal files
        routePath.startsWith("/static") || // Static files directory
        routePath.startsWith("/api") ||
        routePath.startsWith("/src") 
      ) {
        return NextResponse.next(); // Allow access
      }
    
      
}

export const config = {
    matcher: ['/dashboard/:path*']
};