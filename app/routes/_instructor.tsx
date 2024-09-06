import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, redirect, useLoaderData } from "@remix-run/react";
import { InstructorNavbar } from "~/components/organims";

import { getSession } from "~/session";
import { db } from "~/utils/db";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!userId) return redirect("/");

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      stripe_seller: true,
      email: true,
      picture: true,
      roles: true,
      stripe_account_id: true,
    },
  });

  return json({ user });
};

export default function Private() {
  const data = useLoaderData<typeof loader>();
  const roles = data.user?.roles;

  return (
    <div className="p-4">
      <header>
        <InstructorNavbar roles={roles}></InstructorNavbar>
      </header>
      <div className="container mx-auto my-8">
        <Outlet context={data} />
      </div>
    </div>
  );
}
