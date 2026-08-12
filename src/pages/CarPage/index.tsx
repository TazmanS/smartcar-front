import { useEffect, useState } from "react";
import { Button } from "../../components/Button";
import CarStream, { type StreamStatus } from "../../components/CarStream";
import { getCarInfo, sendCarAction, type Car } from "../../api/services/car-service";
import type { TCarAction } from "../../api/types/car-action-type";

type Props = { carId: string };

const formatDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

function CarPage({ carId }: Props) {
  const [car, setCar] = useState<Car>({ id: carId, name: `Car ${carId}` });
  const [loading, setLoading] = useState(true);
  const [infoError, setInfoError] = useState("");
  const [actionError, setActionError] = useState("");
  const [cameraStatus, setCameraStatus] = useState<StreamStatus>("connecting");

  useEffect(() => {
    const loadCar = async () => {
      setLoading(true);
      setInfoError("");
      try {
        setCar(await getCarInfo(carId));
      } catch (err) {
        console.error(err);
        setInfoError("Car details are currently unavailable.");
      } finally {
        setLoading(false);
      }
    };
    void loadCar();
  }, [carId]);

  const runAction = async (action: TCarAction) => {
    setActionError("");
    try {
      await sendCarAction(carId, action);
    } catch (err) {
      console.error(err);
      setActionError("Action could not be sent. Please try again.");
    }
  };

  return (
    <section>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Car dashboard</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{car.name}</h1>
        <p className="mt-2 text-slate-600">ID: {carId}</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Live camera</h2>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${cameraStatus === "connected" ? "bg-emerald-100 text-emerald-700" : cameraStatus === "connecting" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
              {cameraStatus === "connected" ? "Streaming" : cameraStatus === "connecting" ? "Connecting" : "Offline"}
            </span>
          </div>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_210px]">
            <CarStream carId={carId} onStatusChange={setCameraStatus} />

            <div className="border-t border-slate-100 pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
              <h2 className="mb-4 text-center text-lg font-semibold text-slate-900">Drive controls</h2>
              {actionError && <p className="mb-3 text-center text-sm text-red-600">{actionError}</p>}
              <div className="flex flex-col items-center gap-2">
                <Button label="Forward" command="forward" onCommand={(action) => void runAction(action)} onStop={() => void runAction("stop")} className="!min-w-16 !px-3 !py-2 text-sm" />
                <div className="flex gap-2">
                  <Button label="Left" command="left" onCommand={(action) => void runAction(action)} onStop={() => void runAction("stop")} className="!min-w-16 !px-2 !py-2 text-sm" />
                  <Button label="Stop" command="stop" onCommand={(action) => void runAction(action)} onStop={() => undefined} className="!min-w-16 !px-2 !py-2 text-sm" />
                  <Button label="Right" command="right" onCommand={(action) => void runAction(action)} onStop={() => void runAction("stop")} className="!min-w-16 !px-2 !py-2 text-sm" />
                </div>
                <Button label="Backward" command="backward" onCommand={(action) => void runAction(action)} onStop={() => void runAction("stop")} className="!min-w-16 !px-3 !py-2 text-sm" />
              </div>
            </div>
          </div>
        </div>

        <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Car information</h2>
          {loading ? <p className="mt-4 text-sm text-slate-600">Loading details...</p> : infoError ? <p className="mt-4 text-sm text-red-600">{infoError}</p> : <dl className="mt-4 divide-y divide-slate-100"><div className="flex justify-between gap-4 py-3 text-sm"><dt className="text-slate-500">Last seen</dt><dd className="text-right font-medium text-slate-800">{formatDate(car.last_seen)}</dd></div><div className="flex justify-between gap-4 py-3 text-sm"><dt className="text-slate-500">Created</dt><dd className="text-right font-medium text-slate-800">{formatDate(car.created_at)}</dd></div><div className="flex justify-between gap-4 py-3 text-sm"><dt className="text-slate-500">Updated</dt><dd className="text-right font-medium text-slate-800">{formatDate(car.updated_at)}</dd></div></dl>}
        </aside>
      </div>
    </section>
  );
}

export default CarPage;
