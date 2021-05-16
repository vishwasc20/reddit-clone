import { dedupExchange, fetchExchange } from "urql";
import {
  LoginMutation,
  CurrentUserQuery,
  CurrentUserDocument,
  RegisterMutation,
  LogoutMutation,
} from "../generated/graphql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { updateQueryHelper } from "./update-query-helper";

export const createUrqlClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include" as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
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
        },
      },
    }),
    ssrExchange,
    fetchExchange,
  ],
});
