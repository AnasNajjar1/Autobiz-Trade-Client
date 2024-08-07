import React, { useState } from "react";
import { Tooltip as RsTooltip } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
const Tooltip = (props) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggleToolTip = () => setTooltipOpen(!tooltipOpen);

  const { className = "text-left pt-2 ml-2" } = props;

  return (
    <span className={className}>
      <FontAwesomeIcon
        icon={faInfoCircle}
        className="gray"
        size="1x"
        id={"tooltip-" + props.id}
      />
      <RsTooltip
        placement="bottom"
        isOpen={tooltipOpen}
        target={"tooltip-" + props.id}
        toggle={toggleToolTip}
      >
        {props.children}
      </RsTooltip>
    </span>
  );
};

export default Tooltip;
