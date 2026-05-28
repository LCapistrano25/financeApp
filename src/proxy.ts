import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function proxy(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder",
        {
            cookies: {
                getAll() {
                    return req.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        req.cookies.set(name, value)
                    );
                    cookiesToSet.forEach(({ name, value, options }) =>
                        res.cookies.set({ name, value, ...options })
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user && req.nextUrl.pathname.startsWith('/dashboard')) {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = '/auth/login';
        const response = NextResponse.redirect(redirectUrl);
        res.cookies.getAll().forEach((cookie) => {
            response.cookies.set(cookie.name, cookie.value);
        });
        return response;
    }

    if (user && req.nextUrl.pathname.startsWith('/auth/login')) {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = '/dashboard';
        const response = NextResponse.redirect(redirectUrl);
        // Garante que os cookies sejam passados
        res.cookies.getAll().forEach((cookie) => {
            response.cookies.set(cookie.name, cookie.value);
        });
        return response;
    }

    return res;
}

export const config = {
    matcher: ['/dashboard/:path*', '/auth/login'],
};

export default proxy;
