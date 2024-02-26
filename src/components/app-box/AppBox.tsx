import { Box, styled } from '@mui/material';

const AppBox = styled(Box)(
  ({ theme }) => `
    height: 100vh;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    z-index: 1;
   
    & .appbar {
      background-color: ${theme.palette.primary.dark};
      box-shadow: 0px 0px 12px #00000088;
      color: #fff;
      display: grid;
      grid-template-columns: 1fr 1fr; 
      grid-template-rows: 1fr;
      position: sticky;
      top: 0;
      z-index: 1100;
      & .navigation { 
        grid-area: 1 / 1 / 2 / 2; 
        display: flex;
        flex-direction: row;
        justify-content: start;
      }
      & .actions { 
        grid-area: 1 / 2 / 2 / 3; 
        display: flex;
        flex-direction: row;
        justify-content: end;
        & button { 
          color: #fff;
        }
      }
      & h1 { 
        grid-area: 1 / 1 / 2 / 3; 
        text-align: center;
        font-size: 1.3rem;
        line-height: 40px;
      }
    }
    
    & .content {
      flex-grow: 1;
      overflow-Y: auto;
    }
    
    & .toolbar {
      width: auto;
    }
    
    & .background {
      background-color: #f8f8f8;
      position: absolute;
      z-index: -1;
      width: 100vw;
      height: 100vh;
      & svg {
        width: 100%;
        opacity: 0.1;
        filter: blur(50px);
      }
    }
  `,
);

export default AppBox;
