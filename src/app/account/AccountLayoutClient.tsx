'use client';

import React, { createContext, useContext } from 'react';

interface AccountLayoutContextType {
  user: any;
  profile: any;
  addresses: any[];
  orders: any[];
  repos: any;
}

const AccountLayoutContext = createContext<AccountLayoutContextType | null>(null);

export function AccountLayoutProvider({
  user,
  profile,
  addresses,
  orders,
  repos,
  children,
}: {
  user: any;
  profile: any;
  addresses: any[];
  orders: any[];
  repos: any;
  children: React.ReactNode;
}) {
  return (
    <AccountLayoutContext.Provider value={{ user, profile, addresses, orders, repos }}>
      {children}
    </AccountLayoutContext.Provider>
  );
}

export function useAccountLayout() {
  const context = React.useContext(AccountLayoutContext);
  if (!context) {
    throw new Error('useAccountLayout must be used within AccountLayoutProvider');
  }
  return context;
}