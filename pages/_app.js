import '@/styles/globals.css';
import StoreProvider from '@/store/coffeeStore-context';
export default function App({ Component, pageProps }) {
  return (
    <StoreProvider>
      <Component {...pageProps} />
    </StoreProvider>
  );
}
