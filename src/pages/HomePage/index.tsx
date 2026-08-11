import { useCallback, useEffect, useState } from "react";
import { getCars, type Car } from "../../api/services/car-service";

type Props = { onOpenCar: (carId: string) => void };

function HomePage({ onOpenCar }: Props) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadCars = useCallback(async (searchTerm: string) => {
    setLoading(true);
    setError("");
    try {
      setCars(await getCars({
        page: 1,
        per_page: 24,
        search: searchTerm,
        sort_by: "created_at",
        order: "desc",
      }));
    } catch (err) {
      console.error(err);
      setError("We could not load your cars. Check that the backend is available.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCars("");
  }, [loadCars]);

  return (
    <section>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Fleet</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Your cars</h1>
          <p className="mt-2 text-slate-600">Select a car to view its live camera, details, and controls.</p>
        </div>
        <form onSubmit={(event) => { event.preventDefault(); void loadCars(search); }} className="flex gap-2">
          <label className="sr-only" htmlFor="car-search">Search cars</label>
          <input id="car-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search cars" className="w-44 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          <button type="submit" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <p className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">Loading cars...</p>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
      ) : cars.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="font-medium text-slate-800">No cars found</p>
          <p className="mt-2 text-sm text-slate-600">Cars returned by the backend will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cars.map((car) => (
            <button key={car.id} type="button" onClick={() => onOpenCar(car.id)} className="group rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Car</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">{car.name}</h2>
              <p className="mt-3 text-sm text-slate-500">ID: {car.id}</p>
              <span className="mt-5 inline-block text-sm font-semibold text-blue-600 group-hover:text-blue-700">Open dashboard →</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

export default HomePage;
