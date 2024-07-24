import * as React from "react";
import { useRef } from "react";
import { useFragment, useQueryLoader } from "react-relay";
import { graphql } from "relay-runtime";
import { PosterBylineFragment$key } from "./__generated__/PosterBylineFragment.graphql";
import type {
  PosterDetailsHovercardContentsQuery as HovercardQueryType
} from './__generated__/PosterDetailsHovercardContentsQuery.graphql';
import Hovercard from "./Hovercard";
import Image from "./Image";
import PosterDetailsHovercardContents, { PosterDetailsHovercardContentsQuery } from "./PosterDetailsHovercardContents";

const PosterBylineFragment = graphql`
  fragment PosterBylineFragment on Actor {
      id
      name
      profilePicture {
          ...ImageFragment @arguments(width: 60, height: 60)
      }
  }
`

export type Props = {
  poster: PosterBylineFragment$key
};

export default function PosterByline({ poster }: Props): React.ReactElement {
  const [  hovercardQueryRef, loadHovercardQuery,] = useQueryLoader<HovercardQueryType>(PosterDetailsHovercardContentsQuery)
  const data = useFragment(PosterBylineFragment, poster)
  const hoverRef = useRef();

  function onBeginHover() {
    loadHovercardQuery({ posterID: data.id });
  }

  if (poster == null) {
    return null;
  }

  return (
    <div ref={hoverRef} className="byline">
      <Image
        image={data.profilePicture}
        width={60}
        height={60}
        className="byline__image"
      />
      <div className="byline__name">{data.name}</div>
      <Hovercard onBeginHover={onBeginHover} targetRef={hoverRef}>
        <PosterDetailsHovercardContents queryRef={hovercardQueryRef}/>
      </Hovercard>
    </div>
  );
}
