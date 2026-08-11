import { useCallback, useEffect, useRef, useState } from "react";
import { getApiUrl } from "../../config";

const RECONNECT_DELAY = 3000;

export type StreamStatus = "connecting" | "connected" | "disconnected";

type Props = {
  carId: string;
  onStatusChange?: (status: StreamStatus) => void;
};

export default function CarStream({ carId, onStatusChange }: Props) {
  const [streamUrl, setStreamUrl] = useState("");
  const [status, setStatus] = useState<StreamStatus>("connecting");
  const timerRef = useRef<number>(undefined);

  const changeStatus = useCallback((value: StreamStatus) => {
    setStatus(value);
    onStatusChange?.(value);
  }, [onStatusChange]);

  const connect = useCallback(() => {
    window.clearTimeout(timerRef.current);
    changeStatus("connecting");
    const streamPath = `/cars/${encodeURIComponent(carId)}/stream`;
    setStreamUrl(`${getApiUrl()}${streamPath}?t=${Date.now()}`);
  }, [carId, changeStatus]);

  useEffect(() => {
    connect();
    return () => {
      window.clearTimeout(timerRef.current);
      setStreamUrl("");
    };
  }, [connect]);

  const reconnect = useCallback(() => {
    timerRef.current = window.setTimeout(connect, RECONNECT_DELAY);
  }, [connect]);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
      {status !== "connected" && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/85">
          <div className="text-center">
            <p className="font-semibold text-white">
              {status === "connecting" ? "Connecting to camera..." : "Camera unavailable"}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              {status === "connecting" ? "Waiting for the video stream" : "Retrying in a few seconds"}
            </p>
            {status === "disconnected" && (
              <button onClick={connect} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500">
                Retry now
              </button>
            )}
          </div>
        </div>
      )}
      <img
        src={streamUrl}
        alt={`Live stream for car ${carId}`}
        className="h-full w-full object-contain"
        onLoad={() => changeStatus("connected")}
        onError={() => {
          changeStatus("disconnected");
          reconnect();
        }}
      />
    </div>
  );
}
