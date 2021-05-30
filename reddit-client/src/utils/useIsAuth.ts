import { useCurrentUserQuery } from "../generated/graphql";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const useIsAuth = () => {
  const { data, loading } = useCurrentUserQuery();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !data?.currentUser) {
      router.replace("/login?next=" + router.pathname);
    }
  }, [loading, data, router]);
};
