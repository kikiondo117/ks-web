import { User } from "@prisma/client";
import { useNavigate, useOutletContext } from "@remix-run/react";
import { useEffect } from "react";

export default function Instructor() {
  const { user }: { user: User } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.roles.includes("INSTRUCTOR")) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <div>
      <h1 className="text-3xl">Instructor Dashboard</h1>
    </div>
  );
}
