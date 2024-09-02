import { ActionFunctionArgs } from "@remix-run/node";
import { useNavigation } from "@remix-run/react";
import { useFormik } from "formik";
import { nanoid } from "nanoid";

import { json } from "react-router";
import { useFetcher } from "react-router-dom";
import { db } from "~/utils/db";
import { sentEmail } from "~/utils/email";

import { forgotSchema } from "~/utils/zod";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData) as Record<string, string>;

  const validate = forgotSchema.safeParse(data);

  if (!validate.success) return json({ ok: false, error: validate.error });

  const shortCode = nanoid(6).toUpperCase();
  const email = validate.data.email;

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
        return json({ ok: true });
      })
      .catch((error) => {
        console.log("email error", error);
        return json({ ok: false, error: error });
      });
  }

  return json({ ok: false, error: "User not found" }, { status: 400 });
};

export default function ForgotPassword() {
  const fetcher = useFetcher<typeof action>();
  const navigation = useNavigation();
  const formik = useFormik({
    initialValues: { email: "" },
    onSubmit: (values) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });

      fetcher.submit(formData, { method: "post", action: "/forgot-password" });
    },
    validate: (values: { email: string }) => {
      const result = forgotSchema.safeParse(values);

      if (result.success) return;

      const errors: Record<string, string> = {};

      result.error.issues.forEach((error) => {
        errors[error.path[0]] = error.message;
      });

      return errors;
    },
  });

  console.log("navigate", navigation.location);

  return (
    <main className="max-w-xs mx-auto p-4 flex flex-col gap-8">
      <h1 className="text-center text-3xl">Olvide mi password 🙁</h1>

      <form
        onSubmit={formik.handleSubmit}
        className="max-w-screen-sm flex flex-col gap-4"
      >
        <div className="flex flex-col gap-4">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            className="max-w-xs border px-4 py-2 rounded focus:border-blue-500"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
          {formik.errors.email && (
            <span className="text-red-500">{formik.errors.email}</span>
          )}
        </div>

        <button
          disabled={navigation.state === "submitting"}
          type="submit"
          className="border px-4 py-2 bg-blue-500 text-white focus:border-red-500 focus:text-red-100"
        >
          {navigation.state === "submitting"
            ? "Enviando..."
            : "Enviame mi codigo"}
        </button>
      </form>
      <hr></hr>
    </main>
  );
}
