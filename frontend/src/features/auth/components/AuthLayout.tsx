import React from 'react';

// this layout wraps around all auth pages to keep the design consistent
const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    // make sure the page always takes up at least the full screen height
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* render the actual page content inside here */}
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
};

export default AuthLayout;
