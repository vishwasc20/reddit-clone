import { useRouter } from "next/router";
import { useEffect } from "react";
import { useCurrentUserQuery } from "../generated/graphql";

export const useIsAuth = () => {
  const [{ data, fetching }] = useCurrentUserQuery();
  const router = useRouter();
  useEffect(() => {
    if (!data?.currentUser && !fetching) {
      router.replace(`/login?next=${router.pathname}`);
    }
  }, [data, router, fetching]);
};
