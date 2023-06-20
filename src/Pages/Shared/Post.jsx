/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { FcLike } from "react-icons/fc";
import { FaHeart } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FaPaperPlane } from "react-icons/fa";
import { Link } from "react-router-dom";

const Post = ({ post, refetch }) => {
  const { _id, owner, text, reaction, img } = post;
  const [liked, setLiked] = useState(true);

  const handleLikeClick = async () => {
    setLiked(!liked);
    const updatedReaction = {
      liked: liked,
    };
    console.log(updatedReaction);
    await fetch(`http://localhost:5000/posts/like/${_id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(updatedReaction),
    })
      .then((res) => res.json())
      .then((data) => {
        refetch();
      });
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  const onSubmit = (data) => {
    const comment = {
      comment: data.comment,
    };

    console.log(comment);
    fetch(`http://localhost:5000/posts/comment/${_id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(comment),
    })
      .then((res) => res.json())
      .then((inserted) => {
        if (inserted.acknowledged) {
          reset();
          toast.success("Comment Added!");
        } else {
          toast.error("Failed to add comment!");
        }
      });
  };

  return (
    <div className="">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-title m-4">
          <p className="font-sans">
            Posted by: <span className="text-yellow-500 ">{owner}</span>
          </p>
        </div>
        <div className="card-body">
          <p className="text-center">{text}</p>
        </div>
        <figure className="">
          <img src={img} alt="Shoes" />
        </figure>
        <div className="flex justify-between">
          <div className="m-5 flex gap-2 items-center">
            <p className="text-white">{reaction}</p>
            <FaHeart
              onClick={handleLikeClick}
              style={{ color: liked ? "white" : "red", cursor: "pointer" }}
            />
            {!liked && <small>You Loved it!</small>}
          </div>
          <div className="m-5">
            <Link to={`/details/${_id}`}>
              <button className="btn btn-secondary text-white">Details</button>
            </Link>
          </div>
        </div>

        <div>
          <form
            className="w-full flex items-center justify-center gap-3 "
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="form-control">
              <input
                className="input input-bordered input-warning w-full max-w-xs"
                placeholder="Put your comment here"
                type="text"
                {...register("comment", { required: true })}
              />
              <label className="label">
                {errors.comment && (
                  <p className="text-red-500 text-sm">Please put you comment</p>
                )}
              </label>
            </div>
            <div>
              <button type="submit" className="pb-4">
                <FaPaperPlane className="text-yellow-500" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Post;
