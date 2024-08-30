import { ActionFunctionArgs, json } from "@remix-run/node";
import {
  Link,
  redirect,
  useActionData,
  useFetcher,
  useNavigation,
} from "@remix-run/react";
import { useFormik } from "formik";
import { commitSession, getSession } from "~/session";
import { comparePassword } from "~/utils/auth";
import { db } from "~/utils/db";
import { loginSchema } from "~/utils/zod";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData) as Record<string, string>;

  const validate = loginSchema.safeParse(data);

  if (!validate.success) {
    return json({ ok: false, error: validate.error }, { status: 400 });
  }

  console.log("data", data);

  const userExist = await db.user.findUnique({ where: { email: data.email } });
  if (!userExist) return json({ ok: false, error: "User no register" });

  const match = await comparePassword(data.password, userExist.password);

  if (!match) {
    return json({
      ok: false,
      error: "Invalid data, pls check the email and password",
    });
  }

  // Creamos una nueva session
  const session = await getSession();
  session.set("userId", userExist.id); // Almacenamos el ID del usuario en la session

  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function Login() {
  const fetcher = useFetcher<typeof action>();
  const navigation = useNavigation();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    onSubmit: (values) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });

      fetcher.submit(formData, { method: "post", action: "/login" });
    },
    validate: (values: { email: string; password: string }) => {
      const result = loginSchema.safeParse(values);

      if (result.success) return;

      const errors: Record<string, string> = {};

      result.error.issues.forEach((error) => {
        errors[error.path[0]] = error.message;
      });

      return errors;
    },
  });

  return (
    <div className="max-w-xs mx-auto p-4 flex flex-col gap-8">
      <h1 className="text-3xl text-center">Login</h1>

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

        {fetcher && fetcher.data?.ok === false && (
          <div className="text-red-500">
            Usuario o contraseña incorrectos, por favor revisa los datos.
          </div>
        )}

        <button
          disabled={navigation.state === "submitting"}
          type="submit"
          className="border px-4 py-2 bg-blue-500 text-white focus:border-red-500 focus:text-red-100"
        >
          {navigation.state === "submitting" ? "Enviando..." : "Registrarme"}
        </button>
      </form>

      <span className="flex justify-center gap-2">
        No estás registrado?
        <Link to="/register" className="text-blue-500">
          Register
        </Link>
      </span>
    </div>
  );
}
