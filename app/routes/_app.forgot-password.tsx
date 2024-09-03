import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { useNavigation, useSearchParams, useNavigate } from "@remix-run/react";
import { useFormik } from "formik";
import { nanoid } from "nanoid";
import { useEffect } from "react";

import { json } from "react-router";
import { useFetcher } from "react-router-dom";
import { CodeAndPasswordForm, EmailForm } from "~/components/organims";
import { db } from "~/utils/db";
import { sentEmail } from "~/utils/email";

import { emailCodeSchema, forgotSchema } from "~/utils/zod";

type FormType = "email" | "code";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData) as Record<string, string>;

  const formType = formData.get("formType") as FormType;

  console.log("data", data);

  switch (formType) {
    case "email":
      const validateEmail = forgotSchema.safeParse(data);

      if (!validateEmail.success)
        return json({ ok: false, error: validateEmail.error });

      const shortCode = nanoid(6).toUpperCase();
      const email = validateEmail.data.email;

      const user = await db.user.findUnique({
        where: { email },
      });

      if (user) {
        const userUpdated = await db.user.update({
          where: { email },
          data: {
            passwordResetCode: shortCode,
          },
        });
        console.log("userUpdated", userUpdated);
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
        console.log("params", params);
        return sentEmail({ params })
          .then((data) => {
            console.log("email data", data);
            return redirect("/forgot-password?form=email");
          })
          .catch((error) => {
            console.log("email error", error);
            return json({ ok: false, error: error });
          });
      }

      return json({ ok: false, error: "User not found" }, { status: 400 });

    case "code":
      const validateCode = emailCodeSchema.safeParse(data);

      if (!validateCode.success)
        return json({ ok: false, error: validateCode.error });

      return json({ ok: false, error: "Formulario 2 procesado." });

    default:
      return json({ ok: false, error: "Formulario no reconocido." });
  }
};

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const form = searchParams.get("form") as "email" | "code";
  const email = searchParams.get("email") as string;

  useEffect(() => {
    if (form !== "email" && form !== "code") {
      navigate("/forgot-password?form=email");
    }
  }, []);

  return (
    <main className="max-w-xs mx-auto p-4 flex flex-col gap-8">
      <h1 className="text-center text-3xl">Olvide mi password 🙁</h1>

      {form === "email" && <EmailForm />}

      {form === "code" && <CodeAndPasswordForm />}
    </main>
  );
}
