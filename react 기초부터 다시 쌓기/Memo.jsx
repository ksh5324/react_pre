import React, { memo } from "react";

const Memo = memo(() => {
  return (
    <div>
      {/* memo는 classComponent에서 PureComponent와 같은 것 */}
      {/* state값이 바꼈을 때만 렌더링되게 만들어주어 성능 향상 */}
    </div>
  );
});

export default Memo;
