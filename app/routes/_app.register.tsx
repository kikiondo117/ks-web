import {
  ActionFunction,
  ActionFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useFormik } from "formik";
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

  const userExist = await db.user.findFirst({ where: { email: data.email } });
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

  console.log("registered user", newUser);

  throw redirect("/");
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
    validate: (values: any) => {
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
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            className="max-w-xs"
            value={formik.values.username}
            onChange={formik.handleChange}
          />
          {formik.errors.username && <span>{formik.errors.username}</span>}
        </div>

        {/* <Input
          name="email"
          type="email"
          label="Email"
          className="max-w-xs"
          value={formik.values.email}
          isInvalid={!!formik.errors.email}
          errorMessage={formik.errors.email}
          onChange={formik.handleChange}
        />
        <Input
          name="password"
          type="password"
          label="Password"
          className="max-w-xs"
          value={formik.values.password}
          isInvalid={!!formik.errors.password}
          errorMessage={formik.errors.password}
          onChange={formik.handleChange}
        /> */}
        <button type="submit">Registrarme</button>
        {/* </Form> */}
      </form>
    </div>
  );
}
