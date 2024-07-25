import * as React from "react";
import { useLazyLoadQuery, usePaginationFragment } from "react-relay";
import { graphql } from "relay-runtime";
import InfiniteScrollTrigger from "./InfiniteScrollTrigger";
import Story from "./Story";

const NewsfeedQuery = graphql`
    query NewsfeedQuery {
        ...NewsfeedContentsFragment
    }
`;

const NewsfeedContentsFragment = graphql`
    fragment NewsfeedContentsFragment on Query
    @argumentDefinitions (
        cursor: { type: "String" }
        count: { type: "Int", defaultValue: 3 }
    )
    @refetchable(queryName: "NewsfeedContentsRefetchQuery")
    {
        viewer {
            newsfeedStories(after: $cursor, first: $count)
            @connection(key: "NewsfeedContentsFragment_newsfeedStories")
            {
                edges {
                    node {
                        id
                        ...StoryFragment
                    }
                }
            }
        }
    }
`;


export default function Newsfeed() {
    const queryData = useLazyLoadQuery(NewsfeedQuery, {});
    const {    data, loadNext, hasNext, isLoadingNext,} = usePaginationFragment(NewsfeedContentsFragment, queryData);
    function onEndReached() {
        loadNext(3);
    }
    const storyEdges = data.viewer.newsfeedStories.edges;

    return (
      <>
          {storyEdges.map(storyEdge =>
            <Story key={storyEdge.node.id} story={storyEdge.node} />
          )}
          <InfiniteScrollTrigger
            onEndReached={onEndReached}
            hasNext={hasNext}
            isLoadingNext={isLoadingNext}
          />
      </>
    );
}
