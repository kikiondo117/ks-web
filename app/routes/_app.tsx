import { Link, Outlet } from "@remix-run/react";

export default function App() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>
      <div className="container mx-auto my-16">
        <Outlet></Outlet>
      </div>
    </div>
  );
}
