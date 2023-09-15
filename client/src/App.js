import { Toaster } from "react-hot-toast";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import "./main.scss";
import { Navigate, Routes, Route } from "react-router-dom";
import Otp from "./components/ResetPassword/Otp";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import EmailFormReset from "./components/ResetPassword/EmailFormReset";
import Landing from "./pages/Landing/Landing";
import NavLayout from "./components/NavLayout";
import EmailVerification from "./components/EmailVerification/EmailVerification";
import ProtectedRoute from "./components/ProtectedRoute";
import { useUser } from "./context/UserContext";
import Test2 from "./pages/Landing/Test2";
import axios from "./api/axios";
import { useEffect } from "react";

function App() {
  const { user, setUser, getUser, fetchUser } = useUser();

  useEffect(() => {
    if (!user) {
      getUser().then((currUser) => {
        // console.log(currUser);
        // console.log(user);
        setUser(currUser);
        // console.log(user);
      });
    }
  }, []);

  return (
    <>
      <Toaster toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/home2" element={<Test2 />} />

        {/* <Route exact path="/" element={<div className="App"><h1>hello begining</h1></div>}/> */}
        <Route path="/register" element={<Register />} />

        {/*re route to homepage if user object is present */}

        <Route
          path="/login"
          element={user ? <Navigate to="/home" /> : <Login />}
        />
        <Route path="/" element={user ? <Navigate to="/home" /> : <Login />} />

        <Route path="/user/:id/verify/:token" element={<EmailVerification />} />

        <Route path="/resetpwd/form" element={<EmailFormReset />} />
        <Route path="/resetpwd/otp/:id/:unique" element={<Otp />} />
        <Route path="/resetpwd/reset/:id/:unique" element={<ResetPassword />} />

        {/* protected, need to login and get the user object */}
        <Route element={<ProtectedRoute />}>
          {/* only those enclose within the layout  have the navbar  */}
          <Route element={<NavLayout />}>
            <Route path="/home" element={<Landing />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
