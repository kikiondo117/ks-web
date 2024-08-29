import { ActionFunction, ActionFunctionArgs, redirect } from "@remix-run/node";
import { destroySession, getSession } from "~/session";

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));

  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};
