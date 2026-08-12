import { useEffect, useState } from "react";
import { CarPage, HomePage } from "./pages";

const carPath = /^\/cars\/([^/]+)$/;

function getRoute() {
  const match = window.location.pathname.match(carPath);
  return match ? { kind: "car" as const, carId: decodeURIComponent(match[1]) } : { kind: "home" as const };
}

function App() {
  const [route, setRoute] = useState(getRoute);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const onPopState = () => setRoute(getRoute());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    setRoute(getRoute());
    setSidebarOpen(false);
  };

  const isHome = route.kind === "home";
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="flex min-h-screen">
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/40 md:hidden"
          />
        )}
        <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-5 shadow-xl transition-transform duration-200 md:static md:translate-x-0 md:shadow-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <button type="button" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} className="absolute right-3 top-3 rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden">
            ✕
          </button>
          <button type="button" onClick={() => navigate("/")} className="rounded-lg px-2 py-1 text-left text-xl font-bold text-slate-900 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
            SmartCar
          </button>
          <p className="mt-1 text-sm text-slate-500">Fleet control</p>
          <nav className="mt-10">
            <button type="button" onClick={() => navigate("/")} className={`w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${isHome ? "bg-blue-50 text-blue-700 hover:bg-blue-100" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}>
              Home · Cars
            </button>
          </nav>
        </aside>
        <main className="min-w-0 flex-1 p-5 sm:p-10">
          <button type="button" aria-label="Open navigation" aria-expanded={sidebarOpen} onClick={() => setSidebarOpen(true)} className="mb-6 rounded-lg border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden">
            <span className="block h-0.5 w-5 bg-current" />
            <span className="mt-1 block h-0.5 w-5 bg-current" />
            <span className="mt-1 block h-0.5 w-5 bg-current" />
          </button>
          <div className="mx-auto max-w-6xl">{route.kind === "car" ? <CarPage carId={route.carId} /> : <HomePage onOpenCar={(id) => navigate(`/cars/${encodeURIComponent(id)}`)} />}</div>
        </main>
      </div>
    </div>
  );
}

export default App;
