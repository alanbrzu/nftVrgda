import { createTheme } from "@mui/material/styles";

const boxStyle = {
  display: "flex",
  height: "fit-content",
  padding: "4em 4em",
};

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1em",
  padding: "4em 0",
};

const formStyle: any = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "200px",
  gap: ".25em",
  margin: 0,
};

const inputStyle = {
  height: "36px",
  border: "1px solid #d3d3d3",
  borderRadius: "6px",
  width: "100%",
  paddingLeft: "6px",
  marginTop: "6px",
};

const headStyle = {
  marginBottom: "10px",
};

const buttonStyle = {
  width: "80px",
  textTransform: "none",
  marginTop: "10px",
};

export {
  boxStyle,
  containerStyle,
  inputStyle,
  formStyle,
  buttonStyle,
  headStyle,
};
