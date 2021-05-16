import { withUrqlClient } from "next-urql";
import React from "react";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/create-urql-client";
import { Layout } from "../components/Layout";
import { Link } from "@chakra-ui/react";
import NextLink from "next/link";

const Index = () => {
  const [{ data, fetching }] = usePostsQuery();

  return (
    <Layout>
      <NextLink href="/create-post">
        <Link>Create a new post</Link>
      </NextLink>
      <br />
      {!data || fetching ? (
        <div>Loading posts</div>
      ) : (
        data.posts.map((post) => <div key={post.id}>{post.title}</div>)
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
