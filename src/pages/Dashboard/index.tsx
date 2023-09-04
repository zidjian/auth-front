import { useAuth } from "../../auth/AuthProvider";

export function DashboardPage() {
    const auth = useAuth();

    return <div>Dashboard de {auth.getUserName()?.name}</div>;
}
