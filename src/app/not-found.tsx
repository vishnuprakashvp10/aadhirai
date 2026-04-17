import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="font-display text-[10rem] text-stone-100 leading-none select-none font-bold">404</div>
        <div className="-mt-12 mb-6">
          <h1 className="font-display text-3xl text-forest-900 font-semibold mb-3">Page Not Found</h1>
          <p className="font-body text-stone-400 text-base">
            The statue you seek has wandered from its pedestal. Let us guide you back.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary">Return Home</Link>
          <Link href="/products" className="btn-outline">Browse Collection</Link>
        </div>
      </div>
    </div>
  );
}
