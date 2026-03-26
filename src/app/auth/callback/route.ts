import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");

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

    return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
}
