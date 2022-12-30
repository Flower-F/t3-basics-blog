import { type AppType } from 'next/app';
import { trpc } from '../utils/trpc';
import { UserContextProvider } from '../contexts/user';
import '../styles/globals.css';

const MyApp: AppType = ({ Component, pageProps }) => {
  const { data, isLoading } = trpc.user.me.useQuery();

  if (isLoading) {
    return <>Loading user...</>;
  }

  return (
    <UserContextProvider value={data}>
      <main>
        <Component {...pageProps} />
      </main>
    </UserContextProvider>
  );
};

export default trpc.withTRPC(MyApp);
