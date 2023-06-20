import React from "react";
import Home from "./Pages/Home/Home";
import Header from "./Pages/Shared/Header";
import { Route, Routes } from "react-router-dom";
import About from "./Pages/About/About";
import SignUp from "./Pages/Auth/SignUp";
import Media from "./Pages/Media/Media";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./Pages/Auth/Login";
import RequireAuth from "./Pages/Auth/RequireAuth";
import Details from "./Pages/Home/Details";

const App = () => {
  return (
    <div>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route
          path="/about"
          element={
            <RequireAuth>
              <About></About>
            </RequireAuth>
          }
        ></Route>
        <Route path="/media" element={<Media></Media>}></Route>
        <Route
          path="/details/:id"
          element={
            <RequireAuth>
              <Details></Details>
            </RequireAuth>
          }
        ></Route>
        <Route path="/signup" element={<SignUp></SignUp>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
      </Routes>
      <ToastContainer></ToastContainer>
    </div>
  );
};

export default App;
