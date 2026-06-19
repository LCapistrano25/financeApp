import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function getPublicOrigin(requestUrl: URL) {
    const authRedirectUrl = process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL;

    if (authRedirectUrl) {
        return new URL(authRedirectUrl).origin;
    }

    return requestUrl.origin;
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

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const publicOrigin = getPublicOrigin(requestUrl);
    const redirectTo = new URL("/auth/callback", publicOrigin).toString();
    const cookieStore = await cookies();
    const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();

    const cookieResponse = NextResponse.next();
    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        cookieResponse.cookies.set({ name, value, ...options });
                    });
                },
            },
        }
    );

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo,
        },
    });

    if (error || !data.url) {
        return NextResponse.redirect(new URL("/auth/login", publicOrigin));
    }

    const redirectResponse = NextResponse.redirect(data.url);
    cookieResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie);
    });

    return redirectResponse;
}
