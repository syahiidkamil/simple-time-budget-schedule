import dynamic from 'next/dynamic';
import Head from 'next/head';

// Import App dynamically to avoid SSR issues with React Router
const ClientApp = dynamic(() => import('../App'), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <Head>
        <title>Next.js CSR Template</title>
        <meta name="description" content="Client-side rendered Next.js application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ClientApp />
    </>
  );
}