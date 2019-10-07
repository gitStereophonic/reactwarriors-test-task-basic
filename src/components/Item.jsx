import React, { memo } from "react";
// For render optimization:
// PureComponent for class
// memo for function

export const Item = memo(({ data }) => (
  <div
    style={{
      border: "1px solid black",
      marginBottom: "10px",
      padding: "10px"
    }}
  >
    {data.thumbnail !== "self" && <img src={data.thumbnail} alt="" />}
    <p>{data.title}</p>
    <p>Number of comments: {data.num_comments}</p>
    <a
      href={`https://www.reddit.com${data.permalink}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      Link
    </a>
  </div>
));
