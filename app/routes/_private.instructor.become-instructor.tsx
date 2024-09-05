import { User } from "@prisma/client";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useOutletContext } from "@remix-run/react";
import queryString from "query-string";
import { getSession } from "~/session";
import { db } from "~/utils/db";
import { stripe } from "~/utils/stripe";

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  const user = await db.user.findUnique({ where: { id: userId } });

  if (user) {
    try {
      if (!user?.stripe_account_id) {
        // ! If the user dont have stripe accound id yet, then create new
        /*!SECTION
        Creamos una cuenta conectada permitiendo recibir pagos util en aplicaciones
        donde soy intermediario.
        */
        const account = await stripe.accounts.create({ type: "express" }); // Proceso de onboarding mas sencillo y nos da mas control
        console.log("account", account);
        const userUpdated = await db.user.update({
          where: { id: user.id },
          data: { stripe_account_id: account.id },
        });

        // ! Create account link based on account id (for frontend to complete onboarding)
        /*!SECTION
          Se utiliza para generar enlaces que permiten a los usuarios completar 
          el proceso de onboarding de una cuenta conectada, proporcionar información personal, detalles bancarios, o verificar su identidad.
        */
        let accountLink = await stripe.accountLinks.create({
          account: userUpdated.stripe_account_id as string,
          refresh_url: process.env.STRIPE_REDIRECT_URL,
          return_url: process.env.STRIPE_REDIRECT_URL,
          type: "account_onboarding",
        });

        accountLink = Object.assign(accountLink, {
          "stripe_user[email]": userUpdated.email,
        });
        console.log("accountLink", accountLink);

        // ! Enviamos la cuenta link como respuesta - en este caso hacemos un redirect a una pagina en especifico
        return redirect(
          `${accountLink.url}?${queryString.stringify(accountLink)}`
        );
      }
    } catch (error) {
      return json({ ok: false, error: error }, { status: 500 });
    }
  }

  return json({ ok: false, error: "User not found" }, { status: 404 });
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
