import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Manrope, sans-serif",
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiUseMediaQuery: {
      defaultProps: {
        noSsr: true,
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "--TextField-brandBorderColor": "#283347",
          "--TextField-brandBorderHoverColor": "#283347",
          "--TextField-brandBorderFocusedColor": "#283347",
          height: "50px",
          "& label": {
            color: "#283347",
          },
          "& label.Mui-focused": {
            color: "#283347",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              // border: "2px solid #283347",
            },
            "&.Mui-focused fieldset": {
              // border: "2px solid #283347",
            },
          },
          "&.Mui-disabled": {
            "& label": {
              color: "#FAFAFA",
            },
          },

          // "& .Mui-focused": {
          //   color: "#6386AD",
          //   backgroundColor: "white",
          // },
          // backgroundColor: "#F6F6F6",
          // outline: "none",
          // border: "none",
        },
      },
    },

    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: "18px",
        },
      },
    },

    // MuiOutlinedInput: {
    //   styleOverrides: {
    //     root: {
    //       borderRadius: "50px",
    //       "&:before": {
    //         borderBottom: "2px solid var(--TextField-brandBorderColor)",
    //       },
    //       "&:hover:not(.Mui-disabled, .Mui-error):before": {
    //         borderBottom: "2px solid var(--TextField-brandBorderHoverColor)",
    //       },
    //       "&.Mui-focused:after": {
    //         borderBottom: "2px solid var(--TextField-brandBorderFocusedColor)",
    //       },
    //     },
    //   },
    // },
  },
});

export default theme;
