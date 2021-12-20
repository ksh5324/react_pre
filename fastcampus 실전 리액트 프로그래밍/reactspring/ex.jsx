import React, { useState } from "react";
import { useSpring, config, animated } from "react-spring";

const Text = () => {
  const [flip, setFlip] = useState(false);
  const props = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    reset: true,
    reverse: flip,
    delay: 200,
    config: config.molasses,
    onRest: () => setFlip(!flip),
  });

  return <animated.h1 style={props}>Hello</animated.h1>;
};

export default Text;
