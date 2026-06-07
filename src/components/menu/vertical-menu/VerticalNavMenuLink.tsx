import React from "react";
import { NavLink } from "react-router-dom";
import classnames from "classnames";
import { useTranslation } from "react-i18next";
import { Badge } from "reactstrap";

interface NavItemType {
  title: string;
  icon?: string; // if you’re using a component, use React.ReactNode
  navLink?: string;
  disabled?: boolean;
  badge?: string;
  badgeText?: string;
  newTab?: boolean;
  externalLink?: boolean;
  children?: any;
}

interface VerticalNavMenuLinkProps {
  item: NavItemType;
  activeItem: string;
}

const VerticalNavMenuLink: React.FC<VerticalNavMenuLinkProps> = ({
  item,
  activeItem,
}) => {
  const { t } = useTranslation();

  const isExternal = item.externalLink === true;

  const commonProps = {
    target: item.newTab ? "_blank" : undefined,
    onClick: (
      e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement, MouseEvent>
    ) => {
      if (!item.navLink || item.navLink === "#" || item.disabled) {
        e.preventDefault();
      }
    },
  };

  return (
    <li
      className={classnames("nav-item gap-2", {
        disabled: item.disabled,
        active: item.navLink === activeItem,
      })}
    >
      {isExternal ? (
        <a
          {...commonProps}
          href={item.navLink || "/"}
          className="d-flex align-items-center navitemcss"
        >
          {item.icon && <img src={item.icon} alt="icon" />}
          <span className="menu-item text-truncate">{t(item.title)}</span>
          {item.badge && item.badgeText && (
            <Badge className="ms-auto me-1" color={item.badge} pill>
              {item.badgeText}
            </Badge>
          )}
        </a>
      ) : (
        <NavLink
          {...commonProps}
          to={item.navLink || "/"}
          className={({ isActive }) =>
            classnames("d-flex align-items-center gap-1", {
              active: isActive && !item.disabled,
              navitemcss: true,
            })
          }
        >
          {item.icon && <img src={item.icon} alt="icon" />}
          <span className="menu-item text-truncate">{t(item.title)}</span>
          {item.badge && item.badgeText && (
            <Badge className="ms-auto me-1" color={item.badge} pill>
              {item.badgeText}
            </Badge>
          )}
        </NavLink>
      )}
    </li>
  );
};

export default VerticalNavMenuLink;
