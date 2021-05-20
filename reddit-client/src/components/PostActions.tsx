import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Box, Link, IconButton } from "@chakra-ui/react";
import React from "react";
import {
  useCurrentUserQuery,
  useDeletePostMutation,
} from "../generated/graphql";
import NextLink from "next/link";

interface PostActionsProps {
  id: number;
  creatorId: number;
}

const PostActions: React.FC<PostActionsProps> = ({ id, creatorId }) => {
  const [{ data: currentUserData }] = useCurrentUserQuery();
  const [, deletePost] = useDeletePostMutation();
  if (currentUserData?.currentUser?.id !== creatorId) {
    return null;
  }

  return (
    <Box ml="auto">
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <Link mr={2}>
          <IconButton
            ml="auto"
            aria-label="update post"
            icon={<EditIcon />}
            size="sm"
          />
        </Link>
      </NextLink>
      <IconButton
        ml="auto"
        aria-label="delete post"
        icon={<DeleteIcon />}
        onClick={() => {
          deletePost({ id });
        }}
        size="sm"
      />
    </Box>
  );
};

export default PostActions;
