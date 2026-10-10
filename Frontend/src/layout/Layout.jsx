import { Footer } from "./footer";
import { Header } from "./Header";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <>
      <Header />
      <div className="main-container">
        <Outlet />
      </div>
      {/* <Footer /> */}
    </>
  );
}
