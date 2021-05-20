import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import { PostTypeFragment, useVoteMutation } from "../generated/graphql";

interface UpvoteSectionProps {
  post: PostTypeFragment;
}

const UpvoteSection: React.FC<UpvoteSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] =
    useState<"upvote-loading" | "downvote-loading" | "not-loading">(
      "not-loading"
    );
  const [, vote] = useVoteMutation();

  return (
    <Flex direction="column" alignItems="center" justifyContent="center" mr={4}>
      <IconButton
        aria-label="upvote post"
        icon={<ChevronUpIcon />}
        onClick={async () => {
          setLoadingState("upvote-loading");
          await vote({ postId: post.id, value: 1 });
          setLoadingState("not-loading");
        }}
        colorScheme={post.voteStatus === 1 ? "green" : undefined}
        isLoading={loadingState === "upvote-loading"}
        size="sm"
      />
      {post.points}
      <IconButton
        aria-label="down vote post"
        icon={<ChevronDownIcon />}
        onClick={async () => {
          setLoadingState("downvote-loading");
          await vote({ postId: post.id, value: -1 });
          setLoadingState("not-loading");
        }}
        colorScheme={post.voteStatus === -1 ? "red" : undefined}
        isLoading={loadingState === "downvote-loading"}
        size="sm"
      />
    </Flex>
  );
};

export default UpvoteSection;
