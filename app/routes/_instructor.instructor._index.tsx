import { User } from "@prisma/client";
import { useOutletContext } from "@remix-run/react";

export default function Instructor() {
  const { user }: { user: User } = useOutletContext();

  return (
    <div>
      <h1 className="text-3xl">Instructor Dashboard</h1>
    </div>
  );
}
