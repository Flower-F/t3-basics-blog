import { createContext, useContext, type ReactNode } from 'react';
import { type RouterOutputs } from '../utils/trpc';

type UserContext = RouterOutputs['user']['me'];
const UserContext = createContext<UserContext>(null);

function UserContextProvider({ children, value }: { children: ReactNode; value: UserContext | undefined }) {
  return <UserContext.Provider value={value || null}>{children}</UserContext.Provider>;
}

const useUserContext = () => useContext(UserContext);

export { useUserContext, UserContextProvider };
