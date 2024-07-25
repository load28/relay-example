import * as React from "react";
import { usePaginationFragment } from "react-relay";
import { graphql } from "relay-runtime";
import type { StoryCommentsSectionFragment$key } from "./__generated__/StoryCommentsSectionFragment.graphql";
import Comment from "./Comment";
import LoadMoreCommentsButton from "./LoadMoreCommentsButton";
import StoryCommentsComposer from "./StoryCommentsComposer";

const { useState, useTransition } = React;

export type Props = {
  story: StoryCommentsSectionFragment$key;
};

const StoryCommentsSectionFragment = graphql`
    fragment StoryCommentsSectionFragment on Story
    @refetchable(queryName: "StoryCommentsSectionPaginationQuery")
    @argumentDefinitions(
        cursor: { type: "String" }
        count: { type: "Int", defaultValue: 3 }
    )
  {
    comments(after: $cursor, first: $count)
    @connection(key: "StoryCommentsSectionFragment_comments")
    {
      pageInfo {
        startCursor
      }
      edges {
        node {
          id
          ...CommentFragment
        }
      }
    }
    ...StoryCommentsComposerFragment
  }
`;

export default function StoryCommentsSection({ story }: Props) {
  const [isPending, startTransition] = useTransition();
  const {data, loadNext} = usePaginationFragment(StoryCommentsSectionFragment, story);
  const onLoadMore = () => startTransition(() => {
    loadNext(3 )
  });

  return (
    <div>
      <StoryCommentsComposer story={data}/>
      {data.comments.edges.map(commentEdge =>
        <Comment comment={commentEdge.node} />
      )}
      {data.comments.pageInfo.startCursor && (
        <LoadMoreCommentsButton onClick={onLoadMore} disabled={isPending}/>
      )}
    </div>
  );
}
