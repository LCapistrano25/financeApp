import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function getPublicOrigin(req: NextRequest) {
    const authRedirectUrl = process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL;

    if (authRedirectUrl) {
        return new URL(authRedirectUrl).origin;
    }

    const forwardedProto = req.headers.get("x-forwarded-proto")?.split(",")[0] || req.nextUrl.protocol.replace(":", "");
    const forwardedHost = req.headers.get("x-forwarded-host") || req.headers.get("host") || req.nextUrl.host;

    return `${forwardedProto}://${forwardedHost}`;
}

function createPublicRedirect(req: NextRequest, pathname: string) {
    return NextResponse.redirect(new URL(pathname, getPublicOrigin(req)));
}

function getSupabaseConfig() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || supabaseUrl === "https://placeholder.supabase.co") {
        throw new Error("NEXT_PUBLIC_SUPABASE_URL must be configured with the real Supabase project URL.");
    }

    if (!supabaseAnonKey || supabaseAnonKey === "placeholder") {
        throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY must be configured with the real Supabase anon key.");
    }

    return { supabaseUrl, supabaseAnonKey };
}

async function proxy(req: NextRequest) {
    const res = NextResponse.next();
    const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
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
        const response = createPublicRedirect(req, '/auth/login');
        res.cookies.getAll().forEach((cookie) => {
            response.cookies.set(cookie.name, cookie.value);
        });
        return response;
    }

    if (user && req.nextUrl.pathname.startsWith('/auth/login')) {
        const response = createPublicRedirect(req, '/dashboard');
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
