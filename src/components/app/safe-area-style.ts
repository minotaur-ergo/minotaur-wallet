const createStyle = (marginTop: number, marginBottom: number) => {
  return `
.appbar{
  padding-top: ${marginTop}px; 
}
.toolbar > .MuiBox-root{
  padding-bottom: ${marginBottom}px;
}
`;
};

export default createStyle;
