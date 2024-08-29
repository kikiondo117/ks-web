import { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, redirect } from "@remix-run/react";
import { PrivateNavbar } from "~/components/organims";
import { getSession } from "~/session";

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));

  const userId = session.get("userId");

  if (!userId) return redirect("/");

  return null;
};

export default function Private() {
  return (
    <div className="p-4">
      <header>
        <PrivateNavbar></PrivateNavbar>
      </header>
      <div className="container mx-auto my-8">
        <Outlet />
      </div>
    </div>
  );
}
