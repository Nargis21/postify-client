import React from "react";
import { useQuery } from "react-query";
import Loading from "../Shared/Loading";
import Post from "../Shared/Post";

const Media = () => {
  const {
    data: posts,
    isLoading,
    refetch,
  } = useQuery("posts", () =>
    fetch("https://postify-server-beta.vercel.app/posts", {
      method: "GET",
    }).then((res) => {
      return res.json();
    })
  );

  if (isLoading) {
    return <Loading></Loading>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-8">
      {posts.map((post) => (
        <Post key={post._id} post={post} refetch={refetch}></Post>
      ))}
    </div>
  );
};

export default Media;
