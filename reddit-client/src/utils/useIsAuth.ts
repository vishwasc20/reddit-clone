import { useCurrentUserQuery } from "../generated/graphql";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const useIsAuth = () => {
  const [{ data, fetching }] = useCurrentUserQuery();
  const router = useRouter();
  useEffect(() => {
    if (!fetching && !data?.currentUser) {
      router.replace("/login?next=" + router.pathname);
    }
  }, [fetching, data, router]);
};
