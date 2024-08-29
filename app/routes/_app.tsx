import { Outlet } from "@remix-run/react";
import { ToastContainer } from "react-toastify";
import { Navbar } from "~/components/organims";

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
