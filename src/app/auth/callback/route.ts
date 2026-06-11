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

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const response = NextResponse.redirect(new URL("/dashboard", getPublicOrigin(requestUrl)));

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
                            response.cookies.set({ name, value, ...options });
                        });
                    },
                },
            }
        );

        await supabase.auth.exchangeCodeForSession(code);
    }

    return response;
}
