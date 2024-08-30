import { User } from "@prisma/client";
import { useOutletContext } from "@remix-run/react";

export default function Dashboard() {
  const { user }: { user: User } = useOutletContext();

  return (
    <div className="p-4">
      Hola <span className="text-blue-500">{user.name}</span> soy tu dashboard
      c:
    </div>
  );
}
