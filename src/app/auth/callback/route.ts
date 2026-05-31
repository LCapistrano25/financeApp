import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const nextParam = requestUrl.searchParams.get("next");

    const headerStore = await headers();
    const envBaseUrl =
        process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL ??
        null;

    let originFromEnv: string | null = null;
    if (envBaseUrl) {
        try {
            originFromEnv = new URL(envBaseUrl).origin;
        } catch {
            originFromEnv = null;
        }
    }

    const forwardedHost =
        headerStore.get("x-forwarded-host") ?? headerStore.get("host");
    const forwardedProto = headerStore.get("x-forwarded-proto");
    const originFromHeaders = forwardedHost
        ? `${forwardedProto ?? "https"}://${forwardedHost}`
        : null;

    const origin = originFromEnv ?? originFromHeaders ?? requestUrl.origin;

    if (code) {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder",
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                            cookiesToSet.forEach(({ name, value, options }) => {
                                cookieStore.set({ name, value, ...options });
                            });
                    },
                },
            }
        );
        await supabase.auth.exchangeCodeForSession(code);
    }

    const defaultPath = "/dashboard";
    const safeNextPath =
        nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//")
            ? nextParam
            : defaultPath;

    const redirectUrl = new URL(safeNextPath, origin);
    return NextResponse.redirect(redirectUrl);
}
