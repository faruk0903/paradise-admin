// ** React Imports
import { useState, useEffect, MouseEvent } from "react";

// ** Third Party Components
import classnames from "classnames";

// ** Reactstrap Imports
import { Button, ButtonProps } from "reactstrap";

// ** Styles
import "./ripple-button.scss";

// ** Custom Props Interface
interface RippleButtonProps extends ButtonProps {
  className?: string;
  children: React.ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

const RippleButton = ({
  className = "",
  children,
  onClick,
  ...rest
}: RippleButtonProps) => {
  const [isRippling, setIsRippling] = useState(false);
  const [coords, setCoords] = useState({ x: -1, y: -1 });

  // ** Trigger ripple on valid click
  useEffect(() => {
    if (coords.x !== -1 && coords.y !== -1) {
      setIsRippling(true);
      const timeout = setTimeout(() => setIsRippling(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [coords]);

  // ** Reset Coords on ripple end
  useEffect(() => {
    if (!isRippling) {
      setCoords({ x: -1, y: -1 });
    }
  }, [isRippling]);

  return (
    <Button
      className={classnames("waves-effect", className)}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });

        if (onClick) onClick(e);
      }}
      {...rest}
    >
      {children}
      {isRippling && (
        <span
          className="waves-ripple"
          style={{
            left: coords.x,
            top: coords.y,
          }}
        />
      )}
    </Button>
  );
};

export default RippleButton;
