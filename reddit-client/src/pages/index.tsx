import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/create-urql-client";
import { Layout } from "../components/Layout";
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import UpvoteSection from "../components/UpvoteSection";
import PostActions from "../components/PostActions";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as string | null,
  });
  const [{ data, fetching, error }] = usePostsQuery({
    variables,
  });

  if (!fetching && !data) {
    return (
      <Box>
        <div>Oops, something went wrong. No posts available to display</div>
        <div>Error: {error?.message}</div>
      </Box>
    );
  }

  return (
    <Layout>
      {!data && fetching ? (
        <div>Loading posts...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts?.posts.map((post) =>
            !post ? null : (
              <Flex key={post.id} p={5} shadow="md" borderWidth="1px">
                <UpvoteSection post={post} />
                <Box flex={1}>
                  <NextLink href="/post/[id]" as={`/post/${post.id}`}>
                    <Link>
                      <Heading fontSize="xl">{post.title}</Heading>
                    </Link>
                  </NextLink>
                  <Text>Posted by {post.creator.username}</Text>
                  <Flex align="center">
                    <Text flex={1} mt={4}>
                      {post.textSnippet}
                    </Text>
                    <PostActions id={post.id} creatorId={post.creator.id} />
                  </Flex>
                </Box>
              </Flex>
            )
          )}
        </Stack>
      )}
      {data && data.posts?.hasMore ? (
        <Flex>
          <Button
            isLoading={fetching}
            m="auto"
            my={8}
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor:
                  data.posts?.posts[data.posts?.posts.length - 1].createdAt,
              });
            }}
          >
            Load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
