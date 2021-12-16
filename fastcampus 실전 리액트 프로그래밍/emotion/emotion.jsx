import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

const Button = styled.button`
  padding: 32px;
  background-color: hotpink;
  font-size: 24px;
  color: black;
  font-weight: bold;
  &:hover {
    color: white;
  }
  a {
    border-bottom: 1px solid black;
  }
`;

const color = "white";

const emotion = () => {
  return (
    <>
      <div
        css={css`
          padding: 32px;
          background: hotpink;
          font-size: 24px;
          border-radius: 4px;
          &:hover {
            color: ${color};
          }
        `}
      >
        Hover to change color
      </div>
      <Button>Hello</Button>
    </>
  );
};

export default emotion;
