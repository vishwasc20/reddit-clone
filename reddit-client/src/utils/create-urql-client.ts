import { dedupExchange, fetchExchange, gql } from "urql";
import {
  LoginMutation,
  CurrentUserQuery,
  CurrentUserDocument,
  RegisterMutation,
  LogoutMutation,
  DeletePostMutationVariables,
} from "../generated/graphql";
import { Cache, cacheExchange } from "@urql/exchange-graphcache";
import { updateQueryHelper } from "./update-query-helper";
import { cursorPagination } from "./cursor-pagination-helper";
import { isServer } from "./is-server";

function invalidateAllPosts(cache: Cache) {
  const allFields = cache.inspectFields("Query");
  const fieldInfos = allFields.filter((info) => info.fieldName === "posts");
  fieldInfos.forEach((fieldInfo) => {
    cache.invalidate("Query", "posts", fieldInfo.arguments || {});
  });
}

export const createUrqlClient = (ssrExchange: any, ctx: any) => ({
  url: process.env.NEXT_PUBLIC_API_URL as string,
  fetchOptions: {
    credentials: "include" as const,
    ...(isServer() ? { headers: { cookie: ctx?.req?.headers?.cookie } } : null),
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      keys: {
        PaginatedPosts: () => null,
      },
      resolvers: {
        Query: {
          posts: cursorPagination(),
        },
      },
      updates: {
        Mutation: {
          deletePost: (_result, args, cache, info) => {
            cache.invalidate({
              __typename: "Post",
              id: (args as DeletePostMutationVariables).id,
            });
          },
          vote: (_result, args, cache, info) => {
            const { postId, value } = args;
            const data = cache.readFragment(
              gql`
                fragment _ on Post {
                  id
                  points
                  voteStatus
                }
              `,
              { id: postId }
            );

            if (data) {
              if (data.voteStatus === value) {
                return;
              }
              const newPoints =
                data.points + (!data.voteStatus ? 1 : 2) * (value as number);

              cache.writeFragment(
                gql`
                  fragment __ on Post {
                    id
                    points
                    voteStatus
                  }
                `,
                { id: postId, points: newPoints, voteStatus: value }
              );
            }
          },
          login: (_result, args, cache, info) => {
            updateQueryHelper<LoginMutation, CurrentUserQuery>(
              cache,
              {
                query: CurrentUserDocument,
              },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                }
                return {
                  currentUser: result.login.user,
                };
              }
            );
            invalidateAllPosts(cache);
          },
          register: (_result, args, cache, info) => {
            updateQueryHelper<RegisterMutation, CurrentUserQuery>(
              cache,
              {
                query: CurrentUserDocument,
              },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                }
                return {
                  currentUser: result.register.user,
                };
              }
            );
          },
          logout: (_result, args, cache, info) => {
            updateQueryHelper<LogoutMutation, CurrentUserQuery>(
              cache,
              {
                query: CurrentUserDocument,
              },
              _result,
              () => ({
                currentUser: null,
              })
            );
          },
          createPost: (_result, args, cache, info) => {
            invalidateAllPosts(cache);
          },
        },
      },
    }),
    ssrExchange,
    fetchExchange,
  ],
});
