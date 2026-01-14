import "../styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "../components/Navbar";

export default function App({ Component, pageProps }) {
  return (
    <ClerkProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Component {...pageProps} />
        </main>
      </div>
    </ClerkProvider>
  );
}