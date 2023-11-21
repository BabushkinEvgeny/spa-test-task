import React, { ReactNode } from "react";
import { Box } from "@mui/material";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="root">
      <div className="form">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          maxWidth={800}
          marginTop={"50px"}
          padding={5}
          borderRadius={5}
          boxShadow={"5px 5px 10px #ccc"}
        >
          {children}
        </Box>
      </div>
    </div>
  );
};

export default Layout;
