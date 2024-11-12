import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function AppLayout() {
  return (
    <div>
      <Header />
      <main className="min-h-screen container">
        <Outlet />
      </main>

      <div className="p-10 text-center bg-grey-800 mt-10">
        Made By Martin Romano
      </div>
    </div>
  );
}
