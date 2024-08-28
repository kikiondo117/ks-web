import {
  ActionFunction,
  ActionFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useFormik } from "formik";
import { commitSession, getSession } from "~/session";
import { hasPassword } from "~/utils/auth";
import { db } from "~/utils/db";

import { registrationSchema } from "~/utils/zod";

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData) as Record<string, string>;

  const validate = registrationSchema.safeParse(data);

  if (!validate.success) {
    return json({ ok: false, error: validate.error }, { status: 400 });
  }

  console.log("data", data);

  const userExist = await db.user.findUnique({ where: { email: data.email } });
  if (userExist) return json({ ok: false, error: "Email is already register" });

  const hashedPassword = await hasPassword(data.password);

  const user = {
    name: data.username,
    email: data.email,
    password: hashedPassword,
  };

  const newUser = await db.user.create({
    data: user,
  });

  if (!newUser) {
    return { ok: false, error: "Error register user" };
  }

  const session = await getSession();
  session.set("userId", newUser.id); // Almacenamos el ID del usuario en la session

  // throw redirect("/");
  // return json("hola c:");

  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function Register() {
  const fetcher = useFetcher();
  const formik = useFormik({
    initialValues: { email: "", password: "", username: "" },
    onSubmit: (values) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });

      fetcher.submit(formData, { method: "post" });
    },
    validate: (values: {
      username: string;
      email: string;
      password: string;
    }) => {
      const result = registrationSchema.safeParse(values);

      if (result.success) return;

      const errors: Record<string, string> = {};

      result.error.issues.forEach((error) => {
        errors[error.path[0]] = error.message;
      });

      return errors;
    },
  });

  return (
    <div className="max-w-xs mx-auto p-4 ">
      <h1 className="text-3xl text-center my-4">¡Registrate!</h1>
      <form
        onSubmit={formik.handleSubmit}
        className="max-w-screen-sm flex flex-col gap-4"
      >
        {/* <Form method="post" className="max-w-screen-sm flex flex-col gap-4"> */}
        <div className="flex flex-col gap-4">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            className="max-w-xs border px-4 py-2 rounded focus:border-blue-500"
            value={formik.values.username}
            onChange={formik.handleChange}
          />
          {formik.errors.username && <span>{formik.errors.username}</span>}
        </div>

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
          {formik.errors.email && <span>{formik.errors.email}</span>}
        </div>

        <div className="flex flex-col gap-4">
          <label htmlFor="password">Password</label>
          <input
            type="text"
            id="password"
            name="password"
            className="max-w-xs border px-4 py-2 rounded focus:border-blue-500"
            value={formik.values.password}
            onChange={formik.handleChange}
          />
          {formik.errors.password && <span>{formik.errors.password}</span>}
        </div>

        <button
          type="submit"
          className="border px-4 py-2 bg-blue-500 text-white focus:border-red-500 focus:text-red-100"
        >
          Registrarme
        </button>
        {/* </Form> */}
      </form>
    </div>
  );
}
