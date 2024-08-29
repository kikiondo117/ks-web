import { Form, NavLink } from "@remix-run/react";
import { destroySession } from "~/session";

export function PrivateNavbar() {
  return (
    <nav>
      <ul className="flex justify-end gap-4">
        <li>
          <NavLink
            to="blogs"
            className={({ isActive }) =>
              !isActive ? "text-black" : "text-fuchsia-700"
            }
          >
            Blogs
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/courses"
            className={({ isActive }) =>
              !isActive ? "text-black" : "text-fuchsia-700"
            }
          >
            Cursos
          </NavLink>
        </li>
        <li>
          <Form method="post" action="/logout">
            <button type="submit">Cerrar Sesión</button>
          </Form>
        </li>
      </ul>
    </nav>
  );
}
