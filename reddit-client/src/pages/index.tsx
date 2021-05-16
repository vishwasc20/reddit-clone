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

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as string | null,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  if (!fetching && !data) {
    return <div>Oops, something went wrong. No posts available to display</div>;
  }

  return (
    <Layout>
      <Flex align="center">
        <Heading>Reddit Clone</Heading>
        <NextLink href="/create-post">
          <Link ml="auto">Create a new post</Link>
        </NextLink>
      </Flex>

      <br />
      {!data && fetching ? (
        <div>Loading posts...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts?.posts.map((post) => (
            <Box key={post.id} p={5} shadow="md" borderWidth="1px">
              <Heading fontSize="xl">{post.title}</Heading>
              <Text mt={4}>{post.textSnippet}</Text>
            </Box>
          ))}
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
