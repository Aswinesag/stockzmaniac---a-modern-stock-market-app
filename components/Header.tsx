import NavItems from "@/components/NavItems";
import UserDropdown from "@/components/UserDropdown";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
    return (
        <header className="sticky top-0 header">
            <div className="container header-wrapper">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/assets/images/logo.png" alt="Stockzmaniac Logo" width={32} height={32} className="h-8 w-auto cursor-pointer" />
                    <span className="text-2xl font-bold text-white">Stockzmaniac</span>
                </Link>
                <nav className="hidden sm:block">
                    <NavItems />
                </nav>
                <UserDropdown />
            </div>
        </header>
    )
}

export default Header