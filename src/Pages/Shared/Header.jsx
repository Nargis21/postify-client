import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import auth from "../../firebase.init";
import { signOut } from "firebase/auth";

const Header = () => {
  const [user] = useAuthState(auth);
  const handleSignout = () => {
    signOut(auth);
    localStorage.removeItem("accessToken");
  };
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="/media">Media</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              {user && (
                <p className="text-secondary font-bold font-mono text-xl">
                  {user.displayName}
                </p>
              )}
            </li>
            <li>
              {user ? (
                <button onClick={handleSignout} className="btn btn-primary">
                  Sign Out
                </button>
              ) : (
                <Link to="/login">Login</Link>
              )}
            </li>
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost normal-case text-xl ml-16">
          POSTIFY
        </Link>
      </div>
      <div className="navbar-end hidden lg:flex mr-16">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/media">Media</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            {user && (
              <p className="text-yellow-500 font-bold font-mono text-xl">
                {user.displayName}
              </p>
            )}
          </li>
          <li>
            {user ? (
              <button onClick={handleSignout} className="btn btn-primary pt-4">
                Sign Out
              </button>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
