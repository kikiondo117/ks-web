// import {
//   ActionFunction,
//   ActionFunctionArgs,
//   json,
//   redirect,
// } from "@remix-run/node";

// import { getSession } from "~/session";
// import { db } from "~/utils/db";
// import { stripe } from "~/utils/stripe";

// export const action: ActionFunction = async ({
//   request,
// }: ActionFunctionArgs) => {
//   const session = await getSession(request.headers.get("Cookie"));
//   const userId = session.get("userId");

//   const user = await db.user.findUnique({ where: { id: userId } });

//   if (user) {
//     try {
//       if (!user?.stripe_account_id) {
//         // ! If the user dont have stripe accound id yet, then create new
//         /*!SECTION
//         Creamos una cuenta conectada permitiendo recibir pagos util en aplicaciones
//         donde soy intermediario.
//         */
//         const account = await stripe.accounts.create({ type: "express" }); // Proceso de onboarding mas sencillo y nos da mas control
//         console.log("account", account.id);
//         const userUpdated = await db.user.update({
//           where: { id: user.id },
//           data: { stripe_account_id: account.id },
//         });

//         // ! Create account link based on account id (for frontend to complete onboarding)
//         /*!SECTION
//           Se utiliza para generar enlaces que permiten a los usuarios completar
//           el proceso de onboarding de una cuenta conectada, proporcionar información personal, detalles bancarios, o verificar su identidad.
//         */
//         let accountLink = await stripe.accountLinks.create({
//           account: userUpdated.stripe_account_id as string,
//           refresh_url: process.env.STRIPE_REDIRECT_URL,
//           return_url: process.env.STRIPE_REDIRECT_URL,
//           type: "account_onboarding",
//         });

//         accountLink = Object.assign(accountLink, {
//           "stripe_user[email]": userUpdated.email,
//         });

//         // ! Enviamos la cuenta link como respuesta - en este caso hacemos un redirect a una pagina en especifico
//       }
//     } catch (error) {
//       return json({ ok: false, error: error }, { status: 500 });
//     }
//   }

//   return redirect("/");
// };

export default function StripeCallback() {
  return <div>Todo listo c:</div>;
}
