import { memo } from "react";
import "./index.css";
import Grid from "../grid";

function Component({ username, date, text }) {
  return (
    <Grid>
      <div className="post-content">
        <span className="post-content	username">@{username}</span>
        <span className="post-content	date">{date}</span>{" "}
      </div>
      <p className="post-content	text">{text}</p>{" "}
    </Grid>
  );
}

export default memo(Component);
