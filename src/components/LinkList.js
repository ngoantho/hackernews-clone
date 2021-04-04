import React from "react";
import Link from "./Link";
import { useQuery } from "urql";
import gql from "graphql-tag";

const FEED_QUERY = gql`
  query FeedQuery($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
      count
      links {
        id
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

const LinkList = (props) => {
  const isNewPage = props.location.pathname.includes("new");
  const page = parseInt(props.match.params.page, 10);

  const nextPage = React.useCallback(() => {
    if (page <= data.feed.count / 10) {
      props.history.push(`/new/${page + 1}`);
    }
  }, [props.history, data.feed.count, page]);

  const previousPage = React.useCallback(() => {
    if (page > 1) {
      props.history.push(`/new/${page - 1}`);
    }
  }, [props.history, page]);

  const pageIndex = isNewPage ? (page - 1) * 10 : 0;

  const variables = React.useMemo(
    () => ({
      skip: isNewPage ? (page - 1) * 10 : 0,
      first: isNewPage ? 10 : 100,
      orderBy: isNewPage ? "createdAt_DESC" : null,
    }),
    [isNewPage, page]
  );

  const [result] = useQuery({ query: FEED_QUERY, variables });
  const { data, fetching, error } = result;

  const linksToRender = React.useMemo(() => {
    if (!data) {
      return [];
    } else if (isNewPage) {
      return data.feed.links;
    } else {
      const rankedLinks = data.feed.links
        .slice()
        .sort((l1, l2) => l2.votes.length - l1.votes.length);
      return rankedLinks;
    }
  }, [data, isNewPage]);

  if (fetching) return <div>Fetching</div>;
  if (error) return <div>Error</div>;

  return (
    <React.Fragment>
      <div>
        {linksToRender.map((link, index) => (
          <Link key={link.id} link={link} index={pageIndex + index} />
        ))}
      </div>
      {isNewPage && (
        <div className="flex ml4 mv3 gray">
          <div className="pointer mr2" onClick={previousPage}>
            Previous
          </div>
          <div className="pointer" onClick={nextPage}>
            Next
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default LinkList;
