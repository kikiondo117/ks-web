import { useNavigation } from "@remix-run/react";
import { useFormik } from "formik";
import { useFetcher } from "react-router-dom";
import { codeSchema } from "~/utils/zod";

export function CodeAndPasswordForm() {
  const fetcher = useFetcher();
  const navigation = useNavigation();
  const formik = useFormik({
    initialValues: { code: "", formType: "code", password: "" },
    onSubmit: (values) => {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });

      fetcher.submit(formData, { method: "post", action: "/forgot-password" });
    },
    validate: (values) => {
      const validation = codeSchema.safeParse(values);

      if (validation.success) return;

      const errors: Record<string, string> = {};

      validation.error.issues.forEach((error) => {
        errors[error.path[0]] = error.message;
      });

      return errors;
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="max-w-screen-sm flex flex-col gap-4"
    >
      <input
        type="hidden"
        name="formType"
        value={formik.values.formType}
        onChange={formik.handleChange}
      />

      <div className="flex flex-col gap-4">
        <label htmlFor="email">Code</label>
        <input
          type="text"
          id="code"
          name="code"
          className="max-w-xs border px-4 py-2 rounded focus:border-blue-500"
          value={formik.values.code}
          onChange={formik.handleChange}
        />
        {formik.errors.code && (
          <span className="text-red-500">{formik.errors.code}</span>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <label htmlFor="password">Nueva password</label>
        <input
          type="text"
          id="password"
          name="password"
          className="max-w-xs border px-4 py-2 rounded focus:border-blue-500"
          value={formik.values.password}
          onChange={formik.handleChange}
        />
        {formik.errors.code && (
          <span className="text-red-500">{formik.errors.password}</span>
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
  );
}
