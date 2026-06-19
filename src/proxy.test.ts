import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import proxy, { config } from "./proxy";

jest.mock("@supabase/auth-helpers-nextjs", () => ({
    createServerClient: jest.fn(),
}));

jest.mock("next/server", () => ({
    NextResponse: {
        next: jest.fn(),
        redirect: jest.fn(),
    },
}));

type MockRequestOptions = {
    pathname: string;
    protocol?: string;
    host?: string;
    headers?: Record<string, string>;
};

describe("Proxy / Middleware", () => {
    const nextResponse = {
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
        delete process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL;

        nextResponse.cookies.getAll.mockReturnValue([
            { name: "sb-access-token", value: "token" },
        ]);

        (NextResponse.next as jest.Mock).mockReturnValue(nextResponse);
        (NextResponse.redirect as jest.Mock).mockReturnValue(redirectResponse);
        mockSupabaseUser(null);
    });

    function mockSupabaseUser(user: unknown) {
        (createServerClient as jest.Mock).mockImplementation((_url, _key, options) => ({
            auth: {
                getUser: jest.fn().mockResolvedValue({
                    data: { user },
                }),
            },
            __cookies: options.cookies,
        }));
    }

    function createRequest({ pathname, protocol = "https:", host = "localhost:8080", headers = {} }: MockRequestOptions) {
        const requestHeaders = new Map(Object.entries(headers));

        return {
            nextUrl: {
                pathname,
                protocol,
                host,
            },
            headers: {
                get: jest.fn((key: string) => requestHeaders.get(key) ?? null),
            },
            cookies: {
                getAll: jest.fn().mockReturnValue([]),
                set: jest.fn(),
            },
        } as unknown as NextRequest;
    }

    it("exports the expected matcher config", () => {
        expect(config).toEqual({
            matcher: ["/dashboard/:path*", "/auth/login"],
        });
    });

    it("redirects unauthenticated dashboard requests to the public login URL from env", async () => {
        process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL = "https://finance-app.example.com/auth/callback";

        const request = createRequest({ pathname: "/dashboard" });
        const result = await proxy(request);

        expect(NextResponse.redirect).toHaveBeenCalledWith(new URL("https://finance-app.example.com/auth/login"));
        expect(redirectResponse.cookies.set).toHaveBeenCalledWith("sb-access-token", "token");
        expect(result).toBe(redirectResponse);
    });

    it("redirects authenticated login requests to dashboard using forwarded Cloud Run headers", async () => {
        mockSupabaseUser({ id: "user-1" });

        const request = createRequest({
            pathname: "/auth/login",
            protocol: "https:",
            host: "localhost:8080",
            headers: {
                "x-forwarded-proto": "https",
                "x-forwarded-host": "finance-app-244561035477.southamerica-east1.run.app",
            },
        });
        const result = await proxy(request);

        expect(NextResponse.redirect).toHaveBeenCalledWith(
            new URL("https://finance-app-244561035477.southamerica-east1.run.app/dashboard")
        );
        expect(result).toBe(redirectResponse);
    });

    it("returns next response when no redirect rule matches", async () => {
        mockSupabaseUser({ id: "user-1" });

        const request = createRequest({ pathname: "/dashboard" });
        const result = await proxy(request);

        expect(NextResponse.redirect).not.toHaveBeenCalled();
        expect(result).toBe(nextResponse);
    });

    it("passes Supabase cookie updates to request and response cookies", async () => {
        const request = createRequest({ pathname: "/dashboard" });
        await proxy(request);

        const cookiesConfig = (createServerClient as jest.Mock).mock.calls[0][2].cookies;
        cookiesConfig.setAll([
            {
                name: "sb-refresh-token",
                value: "refresh",
                options: { path: "/" },
            },
        ]);

        expect(request.cookies.set).toHaveBeenCalledWith("sb-refresh-token", "refresh");
        expect(nextResponse.cookies.set).toHaveBeenCalledWith({
            name: "sb-refresh-token",
            value: "refresh",
            path: "/",
        });
    });
});
