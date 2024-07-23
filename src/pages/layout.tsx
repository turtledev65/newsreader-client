import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <main className="h-svh">
      <Outlet />
    </main>
  );
};

export default Layout;
