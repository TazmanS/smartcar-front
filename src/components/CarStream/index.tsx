import { useEffect, useRef, useState } from "react";

const STREAM_URL = `${import.meta.env.VITE_API_URL}/car-stream`;
const RECONNECT_DELAY = 3000;

export type StreamStatus =
  | "connecting"
  | "connected"
  | "disconnected";

type Props = {
  onStatusChange?: (status: StreamStatus) => void;
};

export default function CarStream({ onStatusChange }: Props) {
  const [streamUrl, setStreamUrl] = useState("");
  const [status, setStatus] =
    useState<StreamStatus>("connecting");

  const timerRef = useRef<number>(null);

  const changeStatus = (value: StreamStatus) => {
    setStatus(value);
    onStatusChange?.(value);
  };

  const connect = () => {
    window.clearTimeout(timerRef.current);

    changeStatus("connecting");

    setStreamUrl(`${STREAM_URL}?t=${Date.now()}`);
  };

  useEffect(() => {
    connect();

    return () => {
      window.clearTimeout(timerRef.current);
      setStreamUrl("");
    };
  }, []);

  const reconnect = () => {
    timerRef.current = window.setTimeout(() => {
      connect();
    }, RECONNECT_DELAY);
  };

  return (
    <div className="relative w-full max-w-[900px] aspect-video overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-xl">

      {status === "connecting" && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/80">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-600 border-t-blue-500" />

            <div className="text-center">
              <p className="text-white font-semibold">
                Connecting...
              </p>

              <p className="text-sm text-slate-400">
                Waiting for ESP32 camera
              </p>
            </div>
          </div>
        </div>
      )}

      {status === "disconnected" && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900">
          <div className="flex flex-col items-center gap-4">

            <div className="text-6xl">
              ??
            </div>

            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-400">
                Camera Offline
              </h2>

              <p className="mt-2 text-slate-400">
                Reconnecting in 3 seconds...
              </p>
            </div>

            <button
              onClick={connect}
              className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
            >
              Retry now
            </button>

          </div>
        </div>
      )}

      <img
        src={streamUrl}
        alt="Car Stream"
        className={`h-full w-full object-contain ${status === "disconnected" ? "hidden" : ""
          }`}
        onLoad={() => changeStatus("connected")}
        onError={() => {
          changeStatus("disconnected");
          reconnect();
        }}
      />
    </div>
  );
}