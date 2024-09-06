import { User } from "@prisma/client";
import { useNavigate, useOutletContext } from "@remix-run/react";
import { useEffect } from "react";

export default function CreateCourse() {
  const { user }: { user: User } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.roles.includes("INSTRUCTOR")) {
      navigate("/dashboard");
    }
  }, []);
  return <div>Create course</div>;
}
