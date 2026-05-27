import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");

    // Redirecionamento correto para ambientes hospedados (Vercel, etc)
    // Se estivermos em produção, precisamos garantir que o redirecionamento não vá para localhost
    const origin = requestUrl.origin;

    if (code) {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_API_URL || "https://placeholder.supabase.co",
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

    return NextResponse.redirect(`${origin}/dashboard`);
}
