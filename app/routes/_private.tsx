import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, redirect, useLoaderData } from "@remix-run/react";
import { PrivateNavbar } from "~/components/organims";
import { getSession } from "~/session";
import { db } from "~/utils/db";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!userId) return redirect("/");

  const user = await db.user.findUnique({ where: { id: userId } });
  console.log("usuario c:", user);

  return json({ user });
};

export default function Private() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="p-4">
      <header>
        <PrivateNavbar></PrivateNavbar>
      </header>
      <div className="container mx-auto my-8">
        <Outlet context={data} />
      </div>
    </div>
  );
}
