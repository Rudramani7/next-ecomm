import './globals.css';
import Header from './components/Header';
import CartProvider from './providers/CartProvider';
import { cookies } from 'next/headers';
import FetchRedirector from './components/FetchReDirector';

export const metadata = { title: 'arizon', description: 'Simple store' };

export default async function RootLayout({ children }) {
  let initialItems = [];
  try {
    const raw = cookies().get('cart')?.value;
    if (raw) initialItems = JSON.parse(decodeURIComponent(raw));
  } catch {}
  return (
    <html lang="en">
      <body>
        <FetchRedirector>
        <CartProvider initialItems={initialItems}>
          <Header />
          <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
        </CartProvider>
        </FetchRedirector>
      </body>
    </html>
  );
}
