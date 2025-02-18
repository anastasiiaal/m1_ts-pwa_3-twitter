import { Outlet, Link } from 'react-router-dom';
import { useNetworkStatus } from '../utils/useNetworkStatus';

export default function Layout() {
    const isOnline = useNetworkStatus();
    
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <header className="bg-slate-800 text-white py-8">
                <h1 className="font-bold text-xl text-center">
                    <Link to="/" className="text-white hover:opacity-85 ">
                        Twitter 🕊️
                    </Link>
                </h1>
            </header>
            <main className="flex-1 m-4">
                {!isOnline && (
                    <div className="flex justify-center w-full">

                        <div className="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm animate-pulse text-center w-60">
                            ⚠️ You're currently offline
                        </div>
                    </div>
                )}
                <Outlet />
            </main>
        </div>
    );
}