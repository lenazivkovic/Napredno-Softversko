
import styled from 'styled-components';
   
export const Box = styled.div`
  padding: 40px 40px;
  background: #F5F5F5;
  position: fixed-bottom;
  bottom: 0;
  width: 100%;
  max-width: 1296px;
  border-radius: 30px 30px 0 0;
  margin-left: auto;
  margin-right: auto;
  color: #3D3269;
   
  @media (max-width: 1000px) {
    padding: 30px 30px;
  }
`;
   
export const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 1000px;
    margin: 0 auto;
    /* background: red; */
`
   
export const Column = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-left: 60px;
`;
   
export const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  
  justify-content: space-between;
  align-items: flex-start;
  align-content: center;
  }
`;
   
export const FooterLink = styled.a`
font-family: 'Inter', sans-serif;
  color:  #4E4E4E;
  margin-bottom: 10px;
  font-size: 16px;
  text-decoration: none;
   
  &:hover {
      color: orange;
      transition: 200ms ease-in;
  }
`;
   
export const Heading = styled.p`
font-family: 'Inter', sans-serif;
  font-size: 24px;
  color: #3D3269;
  margin-bottom: 20px;
  font-weight: bold;
`;