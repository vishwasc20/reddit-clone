import { withUrqlClient } from "next-urql";
import React from "react";
import NavBar from "../components/NavBar";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/create-urql-client";

const Index = () => {
  const [{ data, fetching }] = usePostsQuery();

  return (
    <>
      <NavBar />
      <div>Hello World</div>
      <br />
      {!data || fetching ? (
        <div>Loading posts</div>
      ) : (
        data.posts.map((post) => <div key={post.id}>{post.title}</div>)
      )}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
