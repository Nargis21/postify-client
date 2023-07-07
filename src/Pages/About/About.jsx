import React, { useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useForm } from "react-hook-form";
import auth from "./../../firebase.init";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import { useQuery } from "react-query";
import Loading from "./../Shared/Loading";

const About = () => {
  const [user] = useAuthState(auth);
  const [edit, setEdit] = useState(null);
  const handleEdit = () => {
    setEdit("set");
  };
  const reverseEdit = () => {
    setEdit(null);
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const {
    isLoading,
    data: users,
    refetch,
  } = useQuery(["users"], () =>
    fetch(`https://postify-server-beta.vercel.app/user/${user?.email}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }).then((res) => res.json())
  );
  // console.log(users);
  if (isLoading) {
    return <Loading></Loading>;
  }

  const onSubmit = (data) => {
    const imageStoragekey = "68cb5fb5d48334a60f021c30aff06ada";
    const image = data.image[0];
    const formData = new FormData();
    formData.append("image", image);
    fetch(`https://api.imgbb.com/1/upload?key=${imageStoragekey}`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          const img = result.data.url;
          const userInfo = {
            name: data.name,
            email: user.email,
            university: data.university,
            city: data.city,
            state: data.state,
            country: data.country,
            img: img,
          };

          fetch(
            `https://postify-server-beta.vercel.app/user/update/${user?.email}`,
            {
              method: "PUT",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify(userInfo),
            }
          )
            .then((res) => res.json())
            .then((data) => {
              reset();
              toast.success("Profile Updated!");
              setEdit(null);
              refetch();
            });
        }
      });
  };

  return (
    <div className="my-20">
      <div className="card card-side bg-base-300 shadow-2xl w-[50%] mx-auto">
        <div className="card-body">
          {!edit && (
            <div className="grid lg:grid-cols-2 grid-cols-1">
              <div className="py-10 flex flex-col justify-center items-center">
                <div className="avatar">
                  <div className="w-48 rounded-full">
                    <img
                      src={users?.img || "https://i.ibb.co/SRF75vM/avatar.png"}
                    />
                  </div>
                </div>
                <button
                  onClick={handleEdit}
                  className="btn btn-link normal-case"
                >
                  Edit Profile
                </button>
              </div>
              <div className="py-10 ">
                <h1 className="text-gray-600 pb-2 font-semibold">Full Name</h1>
                <h1 className="text-xl text-gray-800 pb-6">
                  {users?.name || user?.displayName}
                </h1>
                <h1 className="text-gray-600 pb-2 font-semibold">Email</h1>
                <h1 className="text-xl text-gray-800 pb-6">{user?.email}</h1>
                <h1 className="text-gray-600 pb-2 font-semibold">University</h1>
                {users?.university ? (
                  <h1 className="text-xl text-gray-800 pb-6">
                    {users?.university}
                  </h1>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="btn btn-link normal-case"
                  >
                    Add now +
                  </button>
                )}
                <h1 className="text-gray-600 pb-2 font-semibold">Address</h1>
                {users?.state || users.city || users?.country ? (
                  <h1 className="text-xl text-gray-800 pb-6">
                    {users?.state}, {users?.city}, {users?.country}
                  </h1>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="btn btn-link normal-case"
                  >
                    Add now +
                  </button>
                )}
              </div>
            </div>
          )}
          {edit && (
            <div>
              <button className="pt-6 text-xl font-xl" onClick={reverseEdit}>
                <AiOutlineArrowLeft></AiOutlineArrowLeft>
              </button>
              <div className="flex flex-col justify-center items-center text-center backCol">
                <h1 className="text-2xl meriFont pb-6 text-center ">
                  Profile Information
                </h1>
                <div className="pb-10 w-full">
                  <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-control w-full max-w-x">
                      <label className="label">
                        <span className="label-text text-gray-600 font-semibold">
                          Full Name
                        </span>
                      </label>
                      <input
                        className="input input-bordered input-warning w-full max-w-x mb-2"
                        placeholder="Name"
                        type="text"
                        defaultValue={users?.name}
                        {...register("name", {
                          required: {
                            value: true,
                            message: "Input Field is Required",
                          },
                        })}
                      />
                    </div>
                    <div className="form-control w-full max-w-x">
                      <label className="label">
                        <span className="label-text text-gray-600 font-semibold">
                          Phone Number
                        </span>
                      </label>
                      <input
                        className="input input-bordered input-warning w-full max-w-x mb-2"
                        placeholder="Phone"
                        type="text"
                        defaultValue={users?.university}
                        {...register("university", {
                          required: {
                            value: true,
                            message: "Input Field is Required",
                          },
                        })}
                      />
                    </div>
                    <div className="form-control w-full max-w-x">
                      <label className="label">
                        <span className="label-text text-gray-600 font-semibold">
                          City
                        </span>
                      </label>
                      <input
                        className="input input-bordered input-warning w-full max-w-x mb-4"
                        placeholder="City"
                        type="text"
                        defaultValue={users?.city}
                        {...register("city", {
                          required: {
                            value: true,
                            message: "Input Field is Required",
                          },
                        })}
                      />
                    </div>
                    <div className="form-control w-full max-w-x">
                      <label className="label">
                        <span className="label-text text-gray-600 font-semibold">
                          State
                        </span>
                      </label>
                      <input
                        className="input input-bordered input-warning w-full max-w-x mb-4"
                        placeholder="State"
                        type="text"
                        defaultValue={users?.state}
                        {...register("state", {
                          required: {
                            value: true,
                            message: "Input Field is Required",
                          },
                        })}
                      />
                    </div>
                    <div className="form-control w-full max-w-x">
                      <label className="label">
                        <span className="label-text text-gray-600 font-semibold">
                          Country
                        </span>
                      </label>
                      <input
                        className="input input-bordered input-warning w-full max-w-x mb-4"
                        placeholder="Country"
                        type="text"
                        defaultValue={users?.country}
                        {...register("country", {
                          required: {
                            value: true,
                            message: "Input Field is Required",
                          },
                        })}
                      />
                    </div>
                    <div className="form-control w-full max-w-x">
                      <label className="label">
                        <span className="label-text text-gray-600 font-semibold">
                          Photo
                        </span>
                      </label>
                      <input
                        type="file"
                        placeholder="Image"
                        className="input input-bordered input-warning w-full max-w-x mb-4"
                        {...register("image", {
                          required: {
                            value: true,
                            message: "Image is required",
                          },
                        })}
                      />
                      <label className="label">
                        {errors.email?.type === "required" && (
                          <span className="label-text-alt text-red-500">
                            {errors.email.message}
                          </span>
                        )}
                      </label>
                    </div>
                    <input
                      className="bg-primary p-2 rounded-lg text-white font-semibold w-full max-w-x cursor-pointer"
                      name="submit"
                      type="submit"
                      value="Save Changes"
                    />
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default About;
