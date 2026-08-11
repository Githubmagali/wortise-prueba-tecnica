import type { Context, Next } from "hono";
import { auth } from "../lib/auth.js";

declare module "hono" {
    interface ContextVariableMap {
        user: { id: string; name: string; email: string };
    }
}

export async function requireAuth(c: Context, next: Next) {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
        return c.json({ error: "No autenticado" }, 401);
    }
    c.set("user", {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
    });
    await next();
}