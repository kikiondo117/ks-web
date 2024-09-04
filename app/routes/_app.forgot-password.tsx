import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { useSearchParams, useNavigate } from "@remix-run/react";

import { nanoid } from "nanoid";
import { useEffect } from "react";
import variant from "tiny-invariant";

import { json } from "react-router";

import { CodeAndPasswordForm, EmailForm } from "~/components/organims";
import { hasPassword } from "~/utils/auth";
import { db } from "~/utils/db";
import { sentEmail } from "~/utils/email";

import { codeSchema, emailSchema } from "~/utils/zod";
import { assertNever } from "~/types/email";
import { commitSession, getSession } from "~/session";

type FormType = "email" | "code";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData) as Record<string, string>;
  const formType = formData.get("formType") as FormType;

  try {
    switch (formType) {
      case "email": {
        const validateEmail = emailSchema.safeParse(data);

        if (!validateEmail.success)
          return json(
            { ok: false, error: validateEmail.error.errors },
            { status: 400 }
          );

        const shortCode = nanoid(6).toUpperCase();
        const email = validateEmail.data.email;

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user)
          return json({ ok: false, error: "User not found" }, { status: 404 });

        await db.user.update({
          where: { email },
          data: {
            passwordResetCode: shortCode,
          },
        });

        const params = {
          Source: process.env.EMAIL_FROM,
          Destination: {
            ToAddresses: [email],
          },
          Message: {
            Body: {
              Html: {
                Charset: "UTF-8",
                Data: `
                <html>
                  <h1> Reset password code</h1>
                  <p>Pls use the following code to reset your password</p>
                  <h2 style="color: red;">${shortCode}</h2>
                  <i>ks-web.com</i>
                </html>
                `,
              },
            },
            Subject: {
              Charset: "UTF-8",
              Data: "Reset password",
            },
          },
        };

        try {
          await sentEmail({ params });
          return redirect(`/forgot-password?form=code&email=${email}`);
        } catch (error) {
          console.log("Email sending error:", error);
          return json(
            { ok: false, error: "Failed to send email" },
            { status: 500 }
          );
        }
      }
      case "code": {
        const validateCode = codeSchema.safeParse(data);
        const url = new URL(request.url);
        const email = url.searchParams.get("email");

        variant(email, "Invalid email");

        if (!validateCode.success)
          return json(
            { ok: false, error: validateCode.error.errors },
            { status: 400 }
          );

        const user = await db.user.findUnique({ where: { email } });

        if (!user)
          return json({ ok: false, error: "User not found" }, { status: 404 });

        if (user.passwordResetCode !== validateCode.data.code) {
          return json({ ok: false, error: "Invalid code" }, { status: 400 });
        }

        const hashedPassword = await hasPassword(validateCode.data.password);
        const userUpdated = await db.user.update({
          where: { email },
          data: {
            password: hashedPassword,
            passwordResetCode: "",
          },
        });

        const session = await getSession();
        session.set("userId", userUpdated.id);
        return redirect("/dashboard", {
          headers: {
            "Set-Cookie": await commitSession(session),
          },
        });
      }
      default: {
        assertNever(formType);
      }
    }
  } catch (error) {
    console.error("Action error:", error);
    return json({ ok: false, error: "Something went wrong" }, { status: 500 });
  }
};

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const form = searchParams.get("form") as "emailForm" | "codeForm";

  useEffect(() => {
    if (form !== "emailForm" && form !== "codeForm") {
      navigate("/forgot-password?form=emailForm");
    }
  }, [form, navigate]);

  return (
    <main className="max-w-xs mx-auto p-4 flex flex-col gap-8">
      <h1 className="text-center text-3xl">Olvide mi password 🙁</h1>

      {form === "emailForm" && <EmailForm />}

      {form === "codeForm" && (
        <div className="flex flex-col gap-6">
          <p className="text-blue-500">
            Ingresa el codigo que se te ha enviado a tu correo electronico 🧙‍♀️
          </p>

          <CodeAndPasswordForm />
        </div>
      )}
    </main>
  );
}
