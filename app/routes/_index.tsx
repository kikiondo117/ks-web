import {
  redirect,
  type LoaderFunction,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Navbar } from "~/components/organims";
import { getSession } from "~/session";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

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

export default function Index() {
  return (
    <div className="font-sans p-4">
      <header>
        <Navbar></Navbar>
      </header>
      <h1 className="text-3xl">KS DEV</h1>

      <main className="max-w-md container mx-auto">
        <div className="flex flex-col gap-4">
          <p>
            Hola querido desarollador, este es un pequeño espacio donde les
            comparto un poco de mi conocimiento adquirido en diversas empresas y
            proyectos.
          </p>

          <p>
            De igual manera de forma gratuita estan mis blogs, donde comparto
            diferentes opiniones respecto al desarrollo web y algunas
            herramientas especificas 🤪
          </p>
        </div>
      </main>
    </div>
  );
}
