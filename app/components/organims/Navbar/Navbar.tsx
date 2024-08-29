import { NavLink } from "@remix-run/react";

export function Navbar() {
  return (
    <nav>
      <ul className="flex justify-end gap-4">
        <li>
          <NavLink
            to="/register"
            className={({ isActive }) =>
              !isActive ? "text-black" : "text-fuchsia-700"
            }
          >
            Register
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              !isActive ? "text-black" : "text-fuchsia-700"
            }
          >
            Login
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
