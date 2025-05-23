import { useEffect, useState } from 'react';

import '@/styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Wallet, NearContext } from '@/wallets/near';
import { NetworkId } from '@/config';
import { AuthProvider } from '../contexts/AuthContext'; // adjust path if needed
import { AUTHORIZED_USERS } from '@/firebase';

const wallet = new Wallet({ networkId: NetworkId });

export default function MyApp({ Component, pageProps }) {
  const [signedAccountId, setSignedAccountId] = useState('');

  useEffect(() => { wallet.startUp(setSignedAccountId) }, []);

  return (
    <NearContext.Provider value={{ wallet, signedAccountId }}>
       <div className="App min-vh-100">
        <div className="gradient-bg-welcome h-100">
          <AuthProvider>
          <Component {...pageProps} />

          </AuthProvider>
        </div>
      </div>
    </NearContext.Provider>
  );
}