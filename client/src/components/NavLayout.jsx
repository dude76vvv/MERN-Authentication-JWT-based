import { Outlet } from "react-router-dom";
import Navbar from "./Navbar/Navbar";

// acts as partial where the children enclose within will have navbar

const NavLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

export default NavLayout;
