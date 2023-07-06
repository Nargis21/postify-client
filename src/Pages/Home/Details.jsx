import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import Loading from "../Shared/Loading";
import { FaHeart, FaPaperPlane } from "react-icons/fa";

const Details = () => {
  const { id } = useParams();
  const {
    data: post,
    isLoading,
    refetch,
  } = useQuery("post", () =>
    fetch(`https://postify-server-beta.vercel.app/posts/${id}`, {
      method: "GET",
    }).then((res) => {
      return res.json();
    })
  );

  if (isLoading) {
    return <Loading></Loading>;
  }
  return (
    <div className="w-[70%] mx-auto mt-10">
      <div className="card lg:card-side bg-base-100 shadow-xl">
        <figure className="w-[50%]">
          <img src={post?.img} alt="Album" />
        </figure>
        <div className="card-body w-[50%]">
          <h2 className="card-title text-yellow-500">{post?.owner}</h2>
          <p>{post.text}</p>
          <p className="flex gap-2 items-center">
            <FaHeart className="text-red-500" />
            <span> Liked: {post.reaction}</span>
          </p>
          <p>All Comments:</p>
          {post?.comment.map((cm, index) => (
            <small key={index}>{cm}</small>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Details;
