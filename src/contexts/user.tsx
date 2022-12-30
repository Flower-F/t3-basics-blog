import type { inferProcedureOutput } from '@trpc/server';
import { createContext, useContext, type ReactNode } from 'react';
import { AppRouter } from '../server/trpc/router/_app';

type UserContext = AppRouter['user']['me']['_def']['_ctx_out']['user'];
const UserContext = createContext<UserContext>(null);

function UserContextProvider({ children, value }: { children: ReactNode; value: UserContext | undefined }) {
  return <UserContext.Provider value={value || null}>{children}</UserContext.Provider>;
}

const useUserContext = () => useContext(UserContext);

export { useUserContext, UserContextProvider };
