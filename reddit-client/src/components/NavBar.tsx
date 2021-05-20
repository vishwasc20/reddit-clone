import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
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
    navLinks = <Box>Loading...</Box>;
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
      <Flex align="center">
        <NextLink href="/create-post">
          <Button colorScheme="messenger" as={Link} mr={4}>
            Create a new post
          </Button>
        </NextLink>
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
    <Flex bg="tan" p={4} zIndex={1} position="sticky" top="0">
      <Flex flex={1} m="auto" align="center" maxW={800}>
        <NextLink href="/">
          <Link>
            <Heading>Reddit Clone</Heading>
          </Link>
        </NextLink>
        <Box ml="auto">{navLinks}</Box>
      </Flex>
    </Flex>
  );
};

export default NavBar;
