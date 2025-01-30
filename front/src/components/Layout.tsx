import { Outlet, Link } from 'react-router-dom';

export default function Layout() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <header className="bg-slate-800 text-white py-8">
                <div className="container">
                    <h1 className="font-bold text-xl text-center">
                        <Link to="/" className="text-white hover:opacity-85 ">
                            Twitter 🕊️
                        </Link>
                    </h1>
                </div>
            </header>
            <main className="flex-1 m-4">
                <Outlet />
            </main>
        </div>
    );
}