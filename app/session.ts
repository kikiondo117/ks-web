import { createCookieSessionStorage } from "@remix-run/node";

type TSessionData = {
  userId: string;
};

type TSessionSlashData = {
  error: string;
};

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<TSessionData, TSessionSlashData>({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: "__session", // Nombre de la cookie
      httpOnly: true, // Solo accesible desde el servidor
      path: "/", // Disponible en todo el sitio
      sameSite: "lax", // Protege contra ataques CSRF
      secrets: ["kikis"], // Clave secreta para firmar la cookie
      secure: process.env.NODE_ENV === "production", // Solo en HTTPS en producción
      maxAge: 60 * 60 * 24 * 7, // Expira en una semana
    },
  });
