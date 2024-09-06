import { $Enums } from "@prisma/client";
import { Form, NavLink } from "@remix-run/react";

type props = {
  roles: $Enums.Role[] | undefined;
};

export function InstructorNavbar(props: props) {
  return (
    <nav className="flex justify-between">
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          !isActive ? "text-black" : "text-fuchsia-700"
        }
      >
        KS - WEB
      </NavLink>

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

        {props.roles &&
        props.roles.length &&
        props.roles.includes("INSTRUCTOR") ? (
          <li>
            <NavLink
              to="/instructor/course/create"
              className={({ isActive }) =>
                !isActive ? "text-black" : "text-fuchsia-700"
              }
            >
              Crea un curso
            </NavLink>
          </li>
        ) : (
          <li>
            <NavLink
              to="/instructor/become-instructor"
              className={({ isActive }) =>
                !isActive ? "text-black" : "text-fuchsia-700"
              }
            >
              Se un instructor
            </NavLink>
          </li>
        )}

        <li>
          <Form method="post" action="/logout">
            <button type="submit">Cerrar Sesión</button>
          </Form>
        </li>
      </ul>
    </nav>
  );
}
