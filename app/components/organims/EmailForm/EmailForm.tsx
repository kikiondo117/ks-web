import { useFetcher } from "@remix-run/react";
import { useFormik } from "formik";
import { emailSchema } from "~/utils/zod";

export function EmailForm() {
  const fetcher = useFetcher();

  const formik = useFormik({
    initialValues: { email: "", formType: "email" },
    onSubmit: (values) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });

      fetcher.submit(formData, { method: "post", action: "/forgot-password" });
    },
    validate: (values: { email: string }) => {
      const result = emailSchema.safeParse(values);

      if (result.success) return;

      const errors: Record<string, string> = {};

      result.error.issues.forEach((error) => {
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
        disabled={fetcher.state === "submitting"}
        type="submit"
        className="border px-4 py-2 bg-blue-500 text-white focus:border-red-500 focus:text-red-100"
      >
        {fetcher.state === "submitting" ? "Enviando..." : "Enviame mi codigo"}
      </button>
    </form>
  );
}
