import { User } from "@prisma/client";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, useOutletContext } from "@remix-run/react";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData) as Record<string, string>;

  console.log("data", data);

  // Redirect from stripe 💀
  return json({ ok: true });
};

export default function BecomeInstructor() {
  const { user }: { user: User } = useOutletContext();

  return (
    <div>
      <main className="flex flex-col gap-6">
        <h1 className="text-center text-3xl">Se un instructor! 🧙‍♂️</h1>

        <p className="text-xl text-center">
          Configura la opcion de pago para publicar tus cursos en ks web
        </p>

        <p className="text-center">
          KS Web se asocia con stripe para trasnferir tus ganancias a tu cuenta
          de banco.
        </p>

        {!user.roles.includes("INSTRUCTOR") && (
          <Form method="POST" className="flex flex-col items-center">
            <input type="hidden" name="role" value="INSTRUCTOR" />
            <button
              type="submit"
              className="bg-blue-500 rounded-md px-4 py-2 text-white"
            >
              Show button
            </button>
            <p className="text-center">
              Vas a ser redirecionado a la pagina de stripe para completar el
              proceso de onboarding
            </p>
          </Form>
        )}
      </main>
    </div>
  );
}
