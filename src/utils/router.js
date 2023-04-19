import Router from "next/router";
import qs from "query-string";

import { decodeQueryParams, encodeQueryParams } from "./url";

const useRouter = () => {
  const router = Router.router || {};

  if (router && router.state) {
    if (router?.state?.asPath?.includes("?")) {
      router.state.query = {
        ...router.state.query,
        ...qs.parse(router.state.asPath.split("?")[1]),
      };
    }

    router.state.query = router.state.query
      ? decodeQueryParams(router.state.query)
      : {};
  }

  router.pushQuery = ({ pathname, query, hash, options }) => {
    const queryWithoutLocation = { ...query, location: null };
    const queryString =
      queryWithoutLocation &&
      encodeQueryParams(queryWithoutLocation, {
        skipNull: true,
        skipEmptyString: true,
        arrayFormat: "comma",
      });

    router.push(
      `${pathname}${queryString ? `?${queryString}` : ""}${hash || ""}`,
      options
    );
  };

  return { ...Router, ...router, ...router.state };
};

export default useRouter;
