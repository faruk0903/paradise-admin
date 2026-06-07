// ** Vertical Menu Components
import VerticalNavMenuLink from "./VerticalNavMenuLink";
import VerticalNavMenuGroup from "./VerticalNavMenuGroup";
import VerticalNavMenuSectionHeader from "./VerticalNavMenuSectionHeader";
import {
  canViewMenuGroup,
  resolveVerticalNavMenuItemComponent,
} from "../../utils";
import React from "react";

// ** Utils
// import { resolveVerticalNavMenuItemComponent as resolveNavItemComponent } from "@layouts/utils";

const VerticalMenuNavItems: React.FC<any> = (props) => {
  // ** Components Object
  const Components = {
    VerticalNavMenuLink,
    VerticalNavMenuGroup,
    VerticalNavMenuSectionHeader,
  };

  // ** Render Nav Menu Items
  const RenderNavItems = props?.items?.map(
    (
      item: { children: any; id: React.Key | null | undefined; header: any },
      index: any
    ) => {
      // console.log(item, "item---check");
      const TagName = Components[resolveVerticalNavMenuItemComponent(item)];
      if (item.children) {
        return (
          canViewMenuGroup(item) && (
            <TagName item={item} index={index} key={item.id} {...props} />
          )
        );
      }
      return <TagName key={item.id || item.header} item={item} {...props} />;
    }
  );

  return RenderNavItems;
};

export default VerticalMenuNavItems;
