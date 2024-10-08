import { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, redirect } from "@remix-run/react";
import { ToastContainer } from "react-toastify";
import { Navbar } from "~/components/organims";
import { getSession } from "~/session";

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  // Verificamos que la cookie tenga datos validos
  const userId = session.get("userId");

  if (userId) {
    return redirect("/dashboard");
  }

  return null;
};

export default function App() {
  return (
    <div className="p-4">
      <Navbar></Navbar>
      <div className="container mx-auto my-8">
        <ToastContainer position="top-center" />
        <Outlet></Outlet>
      </div>
    </div>
  );
}
