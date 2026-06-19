import { createBrowserClient } from "@supabase/auth-helpers-nextjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || supabaseUrl === "https://placeholder.supabase.co") {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL must be configured with the real Supabase project URL.");
}

if (!supabaseAnonKey || supabaseAnonKey === "placeholder") {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY must be configured with the real Supabase anon key.");
}

export const supabase = createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
);
