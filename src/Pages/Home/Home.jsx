import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import auth from "../../firebase.init";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import Post from "../Shared/Post";
import Loading from "../Shared/Loading";

const Home = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const onSubmit = (data) => {
    if (!user) {
      navigate("/login");
      return;
    }

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
          const postInfo = {
            text: data.text,
            reaction: 0,
            comment: [],
            img: img,
            owner: user.displayName,
          };

          console.log(postInfo);
          fetch("https://postify-server-production.up.railway.app/posts/", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify(postInfo),
          })
            .then((res) => res.json())
            .then((inserted) => {
              if (inserted.acknowledged) {
                reset();
                toast.success("Post Uploaded");
              } else {
                toast.error("Failed to add the Post");
              }
            });
        }
      });
  };

  const {
    data: posts,
    isLoading,
    refetch,
  } = useQuery("posts", () =>
    fetch("https://postify-server-production.up.railway.app/posts/popular", {
      method: "GET",
    }).then((res) => {
      return res.json();
    })
  );

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <div className="">
      <div className="flex flex-col justify-center items-center text-center backCol">
        <h1 className="text-2xl meriFont pb-6 text-center ">
          Profile Information
        </h1>
        <div className="pb-10 lg:w-6/12 md:w-8/12 w-full">
          <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control w-full max-w-x">
              <label className="label">
                <span className="label-text text-gray-600 font-semibold">
                  Text
                </span>
              </label>
              <textarea
                rows="10"
                cols="10"
                className="textarea textarea-warning w-full max-w-x mb-4"
                placeholder="Put your text here"
                type="text"
                {...register("text", { required: true })}
              ></textarea>
              <label className="label">
                {errors.text && (
                  <p className="text-red-500 text-sm">Please enter some text</p>
                )}
              </label>
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
                {...register("image", { required: true })}
              />
              <label className="label">
                {errors.image && (
                  <p className="text-red-500 text-sm">Please select an image</p>
                )}
              </label>
            </div>
            {/* <input type="hidden" {...register("reaction")} value={0} />
            <input
              type="hidden"
              {...register("comment")}
              value={JSON.stringify([])}
            /> */}
            <input
              className="bg-red-900 p-2 rounded-lg text-white font-semibold w-full max-w-sm cursor-pointer"
              name="submit"
              type="submit"
              value="Upload Post"
            />
          </form>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-8">
        {posts.map((post) => (
          <Post key={post._id} post={post} refetch={refetch}></Post>
        ))}
      </div>
    </div>
  );
};

export default Home;
