/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import classnames from "classnames";
// import { ArrowUp } from "react-feather";
import { Navbar } from "reactstrap";
import themeConfig from "../configs/themeConfig";
// import "@styles/base/core/menu/menu-types/vertical-menu.scss";
// import "@styles/base/core/menu/menu-types/vertical-overlay-menu.scss";
import Customizer from "./customizer";
// import ScrollToTop from "./scrolltop";
// import FooterComponent from "./footer";
import NavbarComponent from "./navbar";
import SidebarComponent from "./menu/vertical-menu";
import "../assets/scss/base/core/menu/menu-types/vertical-menu.scss";
import "../assets/scss/base/core/menu/menu-types/vertical-overlay-menu.scss";

const VerticalLayout = (props: any) => {
  const { menu, navbar, footer, children, menuData } = props;
  const [isMounted, setIsMounted] = useState(false);
  const [menuVisibility, setMenuVisibility] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [navbarType, setNavbarType] = useState("floating");
  const [footerType, setFooterType] = useState("static");
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [skin, setSkin] = useState("light");
  const location = useLocation();
  const [navbarColor, setNavbarColor] = useState("");

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    const handleWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleWindowWidth);
    return () => {
      window.removeEventListener("resize", handleWindowWidth);
    };
  }, []);

  useEffect(() => {
    if (menuVisibility && windowWidth < 1200) {
      setMenuVisibility(false);
    }
  }, [location]);

  const footerClasses:any = {
    static: "footer-static",
    sticky: "footer-fixed",
    hidden: "footer-hidden",
  };

  const navbarWrapperClasses:any = {
    floating: "navbar-floating",
    sticky: "navbar-sticky",
    static: "navbar-static",
    hidden: "navbar-hidden",
  };

  const navbarClasses:any = {
    floating: "floating-nav",
    sticky: "fixed-top",
    static: "navbar-static-top",
    hidden: "d-none",
  };

  if (!isMounted) {
    return null;
  }
  const bgColorCondition =
    navbarColor !== "" && navbarColor !== "light" && navbarColor !== "white";

  return (
    <div
      className={classnames(
        `wrapper vertical-layout ${
          navbarWrapperClasses[navbarType] || "navbar-floating"
        } ${footerClasses[footerType] || "footer-static"}`,
        {
          "vertical-menu-modern": windowWidth >= 1200,
          "menu-collapsed": menuCollapsed && windowWidth >= 1200,
          "menu-expanded": !menuCollapsed && windowWidth > 1200,
          "vertical-overlay-menu": windowWidth < 1200,
          "menu-hide": !menuVisibility && windowWidth < 1200,
          "menu-open": menuVisibility && windowWidth < 1200,
        }
      )}
    >
      {/* Sidebar Component */}
      <SidebarComponent
        skin={skin}
        menu={menu}
        menuData={menuData}
        menuCollapsed={menuCollapsed}
        menuVisibility={menuVisibility}
        setMenuCollapsed={setMenuCollapsed}
        setMenuVisibility={setMenuVisibility}
      />

      {/* Navbar Component */}
      <Navbar
        expand="lg"
        container={false}
        light={skin !== "dark"}
        dark={skin === "dark" || bgColorCondition}
        color={bgColorCondition ? navbarColor : undefined}
        className={classnames(
          `header-navbar navbar align-items-center ${
            navbarClasses[navbarType] || "floating-nav"
          } navbar-shadow `
        )}
      >
        <div className="navbar-container d-flex content">
          {navbar ? (
            navbar({ skin, setSkin, setMenuVisibility })
          ) : (
            <NavbarComponent
              setMenuVisibility={setMenuVisibility}
              skin={skin}
              setSkin={setSkin}
            />
          )}
        </div>
      </Navbar>

      {/* Children */}
      <div className="app-content content overflow-hidden">
        <div className="content-overlay"></div>
        {children}
      </div>

      {/* Vertical Nav Menu Overlay */}
      <div
        className={classnames("sidenav-overlay", {
          show: menuVisibility,
        })}
        onClick={() => setMenuVisibility(false)}
      ></div>

      {/* Customizer */}
      {themeConfig.layout.customizer === true ? (
        <Customizer
          skin={skin}
          // isRtl={isRtl}
          // layout={layout}
          setSkin={setSkin}
          // setIsRtl={setIsRtl}
          // isHidden={isHidden}
          // setLayout={setLayout}
          footerType={footerType}
          navbarType={navbarType}
          // setIsHidden={setIsHidden}
          themeConfig={themeConfig}
          navbarColor={navbarColor}
          // contentWidth={contentWidth}
          setFooterType={setFooterType}
          setNavbarType={setNavbarType}
          // setLastLayout={setLastLayout}
          menuCollapsed={menuCollapsed}
          setNavbarColor={setNavbarColor}
          // setContentWidth={setContentWidth}
          setMenuCollapsed={setMenuCollapsed}
        />
      ) : null}

      {/* Footer */}
      <footer
        className={classnames(
          `footer footer-light ${footerClasses[footerType] || "footer-static"}`,
          {
            "d-none": footerType === "hidden",
          }
        )}
      >
        {footer ? (
          footer
        ) : (""
          // <FooterComponent
          //   footerType={footerType}
          //   footerClasses={footerClasses}
          // />
        )}
      </footer>

      {/* Scroll to Top */}
      {themeConfig.layout.scrollTop === true ? (
        <div className="scroll-to-top">
          {/* <ScrollToTop showOffset={300} className="scroll-top d-block">
            <Button className="btn-icon" color="primary">
              <ArrowUp size={14} />
            </Button>
          </ScrollToTop> */}
        </div>
      ) : null}
    </div>
  );
};

export default VerticalLayout;
