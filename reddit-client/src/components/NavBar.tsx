import { Box, Button, Flex, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useCurrentUserQuery, useLogoutMutation } from "../generated/graphql";
import { isServer } from "../utils/is-server";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching: fetchingLogin }] = useCurrentUserQuery({
    pause: isServer(),
  });
  const [{ fetching: fetchingLogout }, logout] = useLogoutMutation();
  let navLinks = null;

  if (fetchingLogin) {
    navLinks = <Box>Loading</Box>;
  } else if (!data?.currentUser) {
    navLinks = (
      <>
        <NextLink href="/login">
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </>
    );
  } else {
    navLinks = (
      <Flex>
        <Box mr={2}>{data.currentUser.username}</Box>
        <Button
          variant="link"
          onClick={() => logout()}
          isLoading={fetchingLogout}
        >
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex bg="tan" p={4} ml="auto">
      <Box ml="auto">{navLinks}</Box>
    </Flex>
  );
};

export default NavBar;
