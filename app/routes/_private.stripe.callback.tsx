import { type LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { getSession } from "~/session";
import { db } from "~/utils/db";
import { stripe } from "~/utils/stripe";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { stripe_seller: true, id: true, stripe_account_id: true },
    });
    if (!user)
      return json({ ok: false, error: "User not found" }, { status: 404 });

    if (user.stripe_seller === null) {
      // ! Obtenemos informacion de una cuenta de stripe
      const account = await stripe.accounts.retrieve(
        user.stripe_account_id as string
      );

      // Cuando el onboarding proces esta completo esto deberia de ser true
      if (!account.charges_enabled)
        return json({ ok: false, error: "Unauthorized" }, { status: 401 });

      const userUpdated = await db.user.update({
        where: { id: user.id },
        data: {
          stripe_seller: JSON.stringify(account),
          roles: {
            push: "INSTRUCTOR",
          },
        },
        select: { stripe_seller: true, email: true, name: true },
      });

      return json({
        ok: true,
        user: {
          ...userUpdated,
          stripe_seller: JSON.parse(userUpdated.stripe_seller as string),
        },
      });
    }

    // return json({
    //   ok: true,
    //   user: {
    //     ...user,
    //     stripe_seller: JSON.parse(user.stripe_seller as string),
    //   },
    // });
    return redirect("/dashboard");
  } catch (error) {
    return json({ ok: false, error: error }, { status: 500 });
  }
};
export default function StripeCallback() {
  return (
    <main className="flex flex-col gap-4">
      <h1 className="text-3xl text-center">
        ¡Felicidades ya eres instructuro! 🎉
      </h1>

      <p className="inline-block w-fit mx-auto text-center bg-yellow-500">
        Puedes empezar a crear tu <span className="text-purple-700">curso</span>{" "}
        y ganar dinero de pormedio.
      </p>

      <h2 className="text-xl">
        Estos son algunos de los terminos que debes de conocer:
      </h2>

      <ul>
        <li>Hola c:</li>
      </ul>
    </main>
  );
}
