// ** Third Party Components
import React from "react";
import { MoreHorizontal } from "react-feather";

const VerticalNavMenuSectionHeader:React.FC<any> = (item) => {
  return (
    <li className="navigation-header">
      <span>{item.header}</span>
      <MoreHorizontal className="feather-more-horizontal" />
    </li>
  );
};

export default VerticalNavMenuSectionHeader;
