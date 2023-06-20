import React, { useEffect } from "react";
import {
  useSendPasswordResetEmail,
  useSignInWithEmailAndPassword,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import auth from "../../firebase.init";
import useToken from "../hooks/useToken";
import Loading from "../Shared/Loading";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useForm();
  const onSubmit = (data) => {
    signInWithEmailAndPassword(data.email, data.password);
  };
  const [signInWithGoogle, googleUser, googleLoading, googleError] =
    useSignInWithGoogle(auth);

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const [sendPasswordResetEmail, sending, resetError] =
    useSendPasswordResetEmail(auth);

  const [token] = useToken(user || googleUser);

  const handleResetPassword = async () => {
    const email = getValues("email");
    if (email) {
      await sendPasswordResetEmail(email);
      toast.success("Email Send!");
    }
  };

  useEffect(() => {
    if (token) {
      navigate(from, { replace: true });
    }
  }, [token, from, navigate]);

  let signInError;
  if (error || googleError || resetError) {
    signInError = (
      <span className="text-red-500">
        {error?.message || googleError?.message}
      </span>
    );
  }
  if (loading || googleLoading || sending) {
    return <Loading></Loading>;
  }

  return (
    <div className="flex lg:h-screen justify-center items-center">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body items-center ">
          <h2 className="card-title text-2xl">Login</h2>

          <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Email Address"
                className="input input-bordered w-full max-w-xs"
                {...register("email", {
                  required: {
                    value: true,
                    message: "Email is required",
                  },
                  pattern: {
                    value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                    message: "Provide a valid email",
                  },
                })}
              />
              <label className="label">
                {errors.email?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.email.message}
                  </span>
                )}
                {errors.email?.type === "pattern" && (
                  <span className="label-text-alt text-red-500 text-sm">
                    {errors.email.message}
                  </span>
                )}
              </label>
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered w-full max-w-xs"
                {...register("password", {
                  required: {
                    value: true,
                    message: "Password is required",
                  },
                  minLength: {
                    value: 6,
                    message: "Password should be contains 6 characters",
                  },
                })}
              />
              <label className="label">
                {errors.password?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.password.message}
                  </span>
                )}
                {errors.password?.type === "minLength" && (
                  <span className="label-text-alt text-red-500 text-sm">
                    {errors.password.message}
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="btn text-sky-500 btn-link normal-case"
                >
                  <p>Forget Password?</p>
                </button>
              </label>
            </div>

            {signInError}
            <input
              type="submit"
              className="btn btn-primary w-full mt-4 text-white"
              value="Login"
            />
          </form>
          <p className="text-sm pt-2">
            New to Paint Pro?{" "}
            <Link className="text-sky-500" to="/signup">
              Create new account
            </Link>
          </p>

          <div className="divider">OR</div>
          <button
            className="btn btn-outline w-full"
            onClick={() => signInWithGoogle()}
          >
            Continue With Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
