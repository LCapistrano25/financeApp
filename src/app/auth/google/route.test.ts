import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { GET } from "./route";

jest.mock("@supabase/auth-helpers-nextjs", () => ({
    createServerClient: jest.fn(),
}));

jest.mock("next/headers", () => ({
    cookies: jest.fn(),
}));

jest.mock("next/server", () => ({
    NextResponse: {
        next: jest.fn(),
        redirect: jest.fn(),
    },
}));

describe("GET /auth/google", () => {
    const cookieResponse = {
        cookies: {
            set: jest.fn(),
            getAll: jest.fn(),
        },
    };

    const redirectResponse = {
        cookies: {
            set: jest.fn(),
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.NEXT_PUBLIC_SUPABASE_URL = "https://finance-app.supabase.co";
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
        process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL = "http://98.88.77.124:3000/auth/callback";

        cookieResponse.cookies.getAll.mockReturnValue([
            { name: "sb-auth-token-code-verifier", value: "verifier" },
        ]);

        (cookies as jest.Mock).mockResolvedValue({
            getAll: jest.fn().mockReturnValue([]),
        });

        (NextResponse.next as jest.Mock).mockReturnValue(cookieResponse);
        (NextResponse.redirect as jest.Mock).mockReturnValue(redirectResponse);
        (createServerClient as jest.Mock).mockImplementation((_url, _key, options) => ({
            auth: {
                signInWithOAuth: jest.fn(async () => {
                    options.cookies.setAll([
                        {
                            name: "sb-auth-token-code-verifier",
                            value: "verifier",
                            options: { path: "/", httpOnly: true },
                        },
                    ]);

                    return {
                        data: {
                            url: "https://finance-app.supabase.co/auth/v1/authorize?provider=google",
                        },
                        error: null,
                    };
                }),
            },
        }));
    });

    it("redirects to the Supabase Google OAuth URL using the configured public callback", async () => {
        const request = { url: "http://localhost:3000/auth/google" } as Request;
        const result = await GET(request);

        const supabase = (createServerClient as jest.Mock).mock.results[0].value;

        expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
            provider: "google",
            options: {
                redirectTo: "http://98.88.77.124:3000/auth/callback",
            },
        });
        expect(NextResponse.redirect).toHaveBeenCalledWith(
            "https://finance-app.supabase.co/auth/v1/authorize?provider=google"
        );
        expect(redirectResponse.cookies.set).toHaveBeenCalledWith({
            name: "sb-auth-token-code-verifier",
            value: "verifier",
        });
        expect(result).toBe(redirectResponse);
    });
});
