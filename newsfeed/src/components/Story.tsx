import * as React from "react";
import { useFragment } from "react-relay";
import { graphql } from 'relay-runtime';
import { StoryFragment$key } from "./__generated__/StoryFragment.graphql";
import Card from "./Card";
import Heading from "./Heading";
import Image from "./Image";
import PosterByline from "./PosterByline";
import StorySummary from "./StorySummary";
import Timestamp from "./Timestamp";

const StoryFragment = graphql`
    fragment StoryFragment on Story {
        title
        summary
        createdAt
        thumbnail {
            ...ImageFragment @arguments(width: 400, height: 400)
        }
        poster {
            ...PosterBylineFragment
        }
    }
`;


type Props = {
  story: StoryFragment$key
};

export default function Story({ story }: Props): React.ReactElement {
  const data = useFragment(StoryFragment, story)
  
  return (
    <Card>
      <PosterByline poster={data.poster} />
      <Heading>{data.title}</Heading>
      <Timestamp time={data.createdAt}/>
      <Image image={data.thumbnail} width={400} height={400}/>
      <StorySummary summary={data.summary} />
    </Card>
  );
}
