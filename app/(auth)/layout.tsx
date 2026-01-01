import { auth } from "@/lib/better-auth/auth"
import { headers } from "next/headers"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

const layout = async({children} : {children : React.ReactNode}) => {
    const session = await auth.api.getSession({headers: await headers() })
    if(session?.user) redirect('/')
    return (
        <main className="auth-layout">
            <section className="auth-left-section scrollbar-hide-default">
                <Link href="/" className="auth-logo flex items-center gap-2">
                    <Image src="/assets/icons/logo.svg" alt="stockzmaniac-logo" width={140} height={32} className="h-8 w-auto" />
                    <span className="text-2xl font-bold text-white">Signalist</span>
                </Link>

                <div className="pb-6 lg:pb-8 flex-1">{children}</div>
            </section>
            <section className="auth-right-section relative hidden lg:flex w-1/2 overflow-hidden bg-black text-cyan-300 font-mono">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.06)_1px,transparent_1px)] bg-[size:48px_48px]" />
                <div className="absolute -top-1/3 left-1/2 w-[900px] h-[900px] bg-cyan-500/10 rounded-full blur-3xl -translate-x-1/2" />
                <div className="relative z-10 flex flex-col justify-between p-14 w-full">
                    {/* Header */}
                <div>
                    <p className="text-xs tracking-[0.35em] text-cyan-500 uppercase">Market Intelligence</p>
                    <h2 className="mt-3 text-2xl tracking-widest font-semibold text-cyan-300">STOCKZMANIAC SYSTEM</h2>
                </div>
                <div className="border border-cyan-500/20 rounded-xl p-6 backdrop-blur-sm">
                    <div className="flex justify-between text-xs text-cyan-300 mb-3">
                        <span>SIGNALS</span>
                        <span className="text-cyan-500 animate-[pulseSoft_2.5s_ease-in-out_infinite]">LIVE</span>
                    </div>

                    <div className="h-24 border border-cyan-500/20 rounded-md flex items-center justify-center text-cyan-600 text-xs tracking-widest">
                        DATA STREAM ACTIVE
                    </div>
                </div>
                <p className="text-[10px] tracking-widest text-cyan-600">STATUS: ONLINE • ENCRYPTED • v1.0</p>
            </div>
            </section>
        </main>
    )
}

export default layout