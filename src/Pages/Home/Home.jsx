import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import auth from "../../firebase.init";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import Post from "../Shared/Post";
import Loading from "../Shared/Loading";

const Home = () => {
  const [selectedImage, setSelectedImage] = useState(null);
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
          fetch("https://postify-server-beta.vercel.app/posts/", {
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
    fetch("https://postify-server-beta.vercel.app/posts/popular", {
      method: "GET",
    }).then((res) => {
      return res.json();
    })
  );

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <div className="w-full px-8">
      <h1 className="text-3xl font-bold text-secondary my-8 text-center">
        Express Your Thoughts
      </h1>
      <div className="flex w-full items-start my-12">
        <div className="w-[70%] flex flex-col justify-center items-center text-center backCol">
          <div className="pb-6 lg:w-8/12 md:w-6/12 w-full">
            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-control w-full max-w-x">
                <input
                  type="file"
                  placeholder="Image"
                  className="input input-bordered input-warning w-full max-w-x "
                  {...register("image", { required: true })}
                  onChange={(e) => {
                    setSelectedImage(URL.createObjectURL(e.target.files[0]));
                  }}
                />
                <label className="label">
                  {errors.image && (
                    <p className="text-red-500 text-sm">
                      Please select an image
                    </p>
                  )}
                </label>
              </div>
              <div className="form-control w-full max-w-x">
                <textarea
                  rows="10"
                  cols="10"
                  className="textarea textarea-warning w-full max-w-x"
                  placeholder="Add your text here"
                  type="text"
                  {...register("text", { required: true })}
                ></textarea>
                <label className="label">
                  {errors.text && (
                    <p className="text-red-500 text-sm">
                      Please enter some text
                    </p>
                  )}
                </label>
              </div>
              <input
                className="bg-primary p-2 rounded-lg text-white font-semibold w-full  cursor-pointer"
                name="submit"
                type="submit"
                value="Upload Post"
              />
            </form>
          </div>
        </div>
        <div className="w-[30%]">
          <p className="text-2xl font-bold text-black mb-4">Image Preview:</p>
          {!selectedImage && (
            <div className="avatar">
              <div className="w-80 rounded">
                <img
                  src="https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                  alt="Selected"
                  className="max-w-xs"
                />
              </div>
            </div>
          )}
          {selectedImage && (
            <div className="avatar">
              <div className="w-80 rounded">
                <img src={selectedImage} alt="Selected" className="max-w-xs" />
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="text-3xl font-bold text-black mt-20 mb-10 text-center">
        Popular Trends
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4  mb-20">
        {posts.map((post) => (
          <Post key={post._id} post={post} refetch={refetch}></Post>
        ))}
      </div>
    </div>
  );
};

export default Home;
