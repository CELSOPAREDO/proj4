import Link from 'next/link'
import {
  Home,
  InfoCircle,
  Rocket,
  ShieldCheck,
  Calendar,
  Users,
  ArrowRight,
  Star,
  Github,
  Linkedin,
  X,
} from 'griddy-icons'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      <header className="sticky top-0 z-30 border-b border-white/50 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2 text-zinc-900">
            <div className="rounded-lg bg-zinc-900 p-1.5 text-white">
              <Home size={14} />
            </div>
            <span className="font-semibold tracking-tight">EventHub</span>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium text-zinc-600">
            <a href="#features" className="transition hover:text-zinc-900">Features</a>
            <a href="#pricing" className="transition hover:text-zinc-900">Pricing</a>
            <a href="#contact" className="transition hover:text-zinc-900">Contact</a>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <section className="relative overflow-hidden rounded-3xl border border-blue-100/60 bg-white/90 p-8 shadow-[0_20px_80px_rgba(30,64,175,0.10)] backdrop-blur sm:p-12">
          <div className="pointer-events-none absolute -top-28 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-400/25 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 -bottom-16 h-60 w-60 rounded-full bg-indigo-400/20 blur-3xl" />

          <div className="relative">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              <Star size={16} />
              Modern Event Platform
            </div>
            <h1 className="text-5xl font-black tracking-tight text-zinc-950 sm:text-6xl">
              Event Hub
            </h1>
            <p className="mt-4 max-w-2xl text-base text-zinc-600 sm:text-lg">
              Manage events, registrations, and attendance in one polished workflow.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(79,70,229,0.35)] transition duration-200 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0"
              >
                Student Login
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/admin-login"
                className="inline-flex items-center gap-2 rounded-xl border border-white/70 bg-white/40 px-5 py-3 text-sm font-semibold text-zinc-800 shadow-[0_8px_24px_rgba(15,23,42,0.12)] backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:bg-white/60 active:translate-y-0"
              >
                Admin Login
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-12 sm:mt-16">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
            Trusted by
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 text-zinc-500 sm:grid-cols-5">
            {['Northstar Labs', 'Nova Systems', 'Vertex Group', 'Cloudlane', 'OrbitWorks'].map((brand) => (
              <div key={brand} className="flex items-center justify-center rounded-xl border border-zinc-200/70 bg-white px-3 py-2 text-sm grayscale">
                {brand}
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="mt-14 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm sm:mt-20">
          <div className="mb-4 inline-flex items-center gap-2 text-zinc-800">
            <InfoCircle size={18} />
            <h2 className="text-xl font-semibold">About</h2>
          </div>
          <p className="text-zinc-600">
            This system is built for schools and organizations to streamline event
            registration and attendance tracking with role-based dashboards for
            students and admins.
          </p>
        </section>

        <section className="mt-14 grid gap-5 sm:grid-cols-3 sm:mt-20">
          <article className="rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(15,23,42,0.14)]">
            <Rocket size={18} className="text-blue-700" />
            <h3 className="mt-3 font-semibold text-zinc-900">Fast onboarding</h3>
            <p className="mt-1 text-sm text-zinc-600">
              New users can sign up and start registering in minutes.
            </p>
          </article>
          <article className="rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(15,23,42,0.14)]">
            <Calendar size={18} className="text-blue-700" />
            <h3 className="mt-3 font-semibold text-zinc-900">Simple scheduling</h3>
            <p className="mt-1 text-sm text-zinc-600">
              Create events quickly and keep important dates organized.
            </p>
          </article>
          <article className="rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(15,23,42,0.14)]">
            <ShieldCheck size={18} className="text-blue-700" />
            <h3 className="mt-3 font-semibold text-zinc-900">Secure roles</h3>
            <p className="mt-1 text-sm text-zinc-600">
              Student and admin routes are separated for safer access control.
            </p>
          </article>
        </section>

        <section id="pricing" className="mt-12 rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:mt-16">
          <div className="flex items-center gap-2 text-blue-800">
            <Users size={18} />
            <h3 className="font-semibold">Suggestion</h3>
          </div>
          <p className="mt-2 text-sm text-blue-900/90">
            Add an event search and filter bar next. It will make it much easier for
            students to find relevant events quickly.
          </p>
        </section>
      </div>

      <footer id="contact" className="border-t border-zinc-200 bg-white/80">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-zinc-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Event Hub. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-zinc-100 p-2 text-zinc-600"><Github size={14} /></span>
            <span className="rounded-lg bg-zinc-100 p-2 text-zinc-600"><Linkedin size={14} /></span>
            <span className="rounded-lg bg-zinc-100 p-2 text-zinc-600"><X size={14} /></span>
          </div>
        </div>
      </footer>
    </main>
  )
}