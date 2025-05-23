import { useEffect, useState, useContext } from 'react';
import { NearContext } from '@/wallets/near';
import { Menu, X } from 'lucide-react'; 

export const Navbar = ({ onRouteChange }) => {
    const { signedAccountId, wallet } = useContext(NearContext);
    const [action, setAction] = useState(() => { });
    const [label, setLabel] = useState('Loading...');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!wallet) return;

        if (signedAccountId) {
            setAction(() => wallet.signOut);
            setLabel(`${signedAccountId}`);
        } else {
            setAction(() => wallet.signIn);
            setLabel('Connect Wallet');
        }
    }, [signedAccountId, wallet]);

    const navItems = ["Explore", "Create"];

    return (
        <nav className="bg-gradient-to-b from-[#0f172a]/80 to-[#0f172a]/30 backdrop-blur-md fixed top-0 left-0 w-full z-50 border-b border-[#1f2937] shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center text-white">

                {/* Logo */}
                <div
                    className="text-2xl font-extrabold tracking-wide cursor-pointer"
                    onClick={() => onRouteChange('home')}
                >
                    NEAR<span className="text-purple-400">Fund</span>
                </div>

                {/* Desktop Nav */}
                <ul className="hidden md:flex space-x-10 text-sm font-medium">
                    {navItems.map((item, index) => (
                        <li
                            key={index}
                            className="hover:text-purple-400 transition duration-150 ease-in-out cursor-pointer"
                            onClick={() => onRouteChange(item.toLowerCase())}
                        >
                            {item}
                        </li>
                    ))}
                </ul>

                {/* Wallet Button */}
                <button
                    onClick={action}
                    className="bg-purple-600 hover:bg-purple-700 transition duration-200 px-5 py-2 rounded-xl text-sm font-semibold shadow"
                >
                    {label}
                </button>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden flex items-center ml-4">
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav Menu */}
            {mobileMenuOpen && (
                <ul className="md:hidden flex flex-col items-center space-y-4 bg-[#111827] px-6 py-4 text-sm font-medium border-t border-gray-700">
                    {navItems.map((item, index) => (
                        <li
                            key={index}
                            onClick={() => {
                                onRouteChange(item.toLowerCase());
                                setMobileMenuOpen(false);
                            }}
                            className="text-gray-300 hover:text-white transition duration-150 ease-in-out cursor-pointer"
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </nav>
    );
};
