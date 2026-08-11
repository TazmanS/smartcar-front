import { useEffect, useState } from "react";
import { CarPage, HomePage } from "./pages";

const carPath = /^\/cars\/([^/]+)$/;

function getRoute() {
  const match = window.location.pathname.match(carPath);
  return match ? { kind: "car" as const, carId: decodeURIComponent(match[1]) } : { kind: "home" as const };
}

function App() {
  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const onPopState = () => setRoute(getRoute());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    setRoute(getRoute());
  };

  const isHome = route.kind === "home";
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="flex min-h-screen">
        <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-5">
          <button type="button" onClick={() => navigate("/")} className="text-left text-xl font-bold text-slate-900">SmartCar</button>
          <p className="mt-1 text-sm text-slate-500">Fleet control</p>
          <nav className="mt-10">
            <button type="button" onClick={() => navigate("/")} className={`w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold ${isHome ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}>
              Home · Cars
            </button>
          </nav>
        </aside>
        <main className="min-w-0 flex-1 p-6 sm:p-10">
          <div className="mx-auto max-w-6xl">{route.kind === "car" ? <CarPage carId={route.carId} /> : <HomePage onOpenCar={(id) => navigate(`/cars/${encodeURIComponent(id)}`)} />}</div>
        </main>
      </div>
    </div>
  );
}

export default App;
