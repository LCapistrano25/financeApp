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
        redirect: jest.fn(),
    },
}));

describe("GET /auth/callback", () => {
    const response = {
        cookies: {
            set: jest.fn(),
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
        delete process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL;

        (NextResponse.redirect as jest.Mock).mockReturnValue(response);
        (cookies as jest.Mock).mockResolvedValue({
            getAll: jest.fn().mockReturnValue([]),
        });

        (createServerClient as jest.Mock).mockImplementation((_url, _key, options) => ({
            auth: {
                exchangeCodeForSession: jest.fn(async () => {
                    options.cookies.setAll([
                        {
                            name: "sb-access-token",
                            value: "token",
                            options: { path: "/", httpOnly: true },
                        },
                    ]);
                }),
            },
        }));
    });

    it("redirects to dashboard and writes auth cookies to the redirect response", async () => {
        const request = { url: "https://finance-app.example.com/auth/callback?code=abc" } as Request;
        const result = await GET(request);

        expect(NextResponse.redirect).toHaveBeenCalledWith(new URL("https://finance-app.example.com/dashboard"));
        expect(createServerClient).toHaveBeenCalled();
        expect(response.cookies.set).toHaveBeenCalledWith({
            name: "sb-access-token",
            value: "token",
            path: "/",
            httpOnly: true,
        });
        expect(result).toBe(response);
    });

    it("redirects to dashboard without exchanging a session when code is missing", async () => {
        const request = { url: "https://finance-app.example.com/auth/callback" } as Request;
        const result = await GET(request);

        expect(NextResponse.redirect).toHaveBeenCalledWith(new URL("https://finance-app.example.com/dashboard"));
        expect(createServerClient).not.toHaveBeenCalled();
        expect(result).toBe(response);
    });

    it("uses the configured public origin instead of the internal request origin", async () => {
        process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL = "https://finance-app.example.com/auth/callback";

        const request = { url: "https://localhost:8080/auth/callback?code=abc" } as Request;
        await GET(request);

        expect(NextResponse.redirect).toHaveBeenCalledWith(new URL("https://finance-app.example.com/dashboard"));
    });
});
