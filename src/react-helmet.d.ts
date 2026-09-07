declare module 'react-helmet' {
  import React from 'react';
  export interface HelmetProps {
    children?: React.ReactNode;
  }
  export const Helmet: React.FC<HelmetProps>;
  export default Helmet;
}
