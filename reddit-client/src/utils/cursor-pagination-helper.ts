import { stringifyVariables } from "@urql/core";
import { Resolver } from "@urql/exchange-graphcache";

export const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;

    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const inCache = cache.resolve(
      cache.resolve(
        entityKey,
        `${fieldName}(${stringifyVariables(fieldArgs)})`
      ) as string,
      "posts"
    );

    info.partial = !inCache;

    const results: string[] = [];
    let hasMore = true;
    fieldInfos.forEach((fieldInfo) => {
      const key = cache.resolve(entityKey, fieldInfo.fieldKey) as string;
      const data = cache.resolve(key, "posts") as string[];
      const hasMoreData = cache.resolve(key, "hasMore");
      if (!hasMoreData) {
        hasMore = hasMoreData as boolean;
      }
      results.push(...data);
    });

    return { hasMore, posts: results, __typename: "PaginatedPosts" };
    //   const visited = new Set();
    //   let result: NullArray<string> = [];
    //   let prevOffset: number | null = null;

    //   for (let i = 0; i < size; i++) {
    //     const { fieldKey, arguments: args } = fieldInfos[i];
    //     if (args === null || !compareArgs(fieldArgs, args)) {
    //       continue;
    //     }

    //     const links = cache.resolve(entityKey, fieldKey) as string[];
    //     const currentOffset = args[cursorArgument];

    //     if (
    //       links === null ||
    //       links.length === 0 ||
    //       typeof currentOffset !== "number"
    //     ) {
    //       continue;
    //     }

    //     const tempResult: NullArray<string> = [];

    //     for (let j = 0; j < links.length; j++) {
    //       const link = links[j];
    //       if (visited.has(link)) continue;
    //       tempResult.push(link);
    //       visited.add(link);
    //     }

    //     if (
    //       (!prevOffset || currentOffset > prevOffset) ===
    //       (mergeMode === "after")
    //     ) {
    //       result = [...result, ...tempResult];
    //     } else {
    //       result = [...tempResult, ...result];
    //     }

    //     prevOffset = currentOffset;
    //   }

    //   const hasCurrentPage = cache.resolve(entityKey, fieldName, fieldArgs);
    //   if (hasCurrentPage) {
    //     return result;
    //   } else if (!(info as any).store.schema) {
    //     return undefined;
    //   } else {
    //     info.partial = true;
    //     return result;
    //   }
  };
};
