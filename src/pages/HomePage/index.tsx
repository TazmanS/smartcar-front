import { useEffect, useState } from "react";

import { Button } from "../../components/Button";
import CarStream, { type StreamStatus } from "../../components/CarStream";

import { getStatusService } from "../../api/services/status-service";
import { sendCarAction } from "../../api/services/car-service";

import type { TCarAction } from "../../api/types/car-action-type";

type BackendStatus = "connecting" | "online" | "offline";

function HomePage() {
  const [backendStatus, setBackendStatus] = useState<BackendStatus>("connecting");

  const [statusMessage, setStatusMessage] = useState("Connecting...");

  const [cameraStatus, setCameraStatus] = useState<StreamStatus>("connecting");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await getStatusService();

        setBackendStatus("online");
        setStatusMessage(response.message);
      } catch (error) {
        console.error(error);

        setBackendStatus("offline");
        setStatusMessage("Backend unavailable");
      }
    };

    fetchStatus();
  }, []);

  const handleCommand = async (command: TCarAction) => {
    try {
      await sendCarAction(command);
    } catch (e) {
      console.error(e);
    }
  };

  const handleStopCommand = async () => {
    try {
      await sendCarAction("stop");
    } catch (e) {
      console.error(e);
    }
  };

  const headerColor =
    backendStatus === "online"
      ? "bg-green-100 text-green-700"
      : backendStatus === "connecting"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-red-100 text-red-700";

  const dotColor =
    backendStatus === "online"
      ? "bg-green-500"
      : backendStatus === "connecting"
        ? "bg-yellow-500 animate-pulse"
        : "bg-red-500";

  const backendText =
    backendStatus === "online"
      ? "Online"
      : backendStatus === "connecting"
        ? "Connecting..."
        : "Offline";

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl p-8">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-800">
            SmartCar Dashboard
          </h1>

          <div
            className={`flex items-center gap-2 rounded-full px-4 py-2 ${headerColor}`}
          >
            <div className={`h-3 w-3 rounded-full ${dotColor}`} />
            <span className="text-sm font-medium">
              {backendText}
            </span>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Camera */}
          <div className="rounded-2xl bg-white p-5 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">
              Camera Stream
            </h2>

            <CarStream onStatusChange={setCameraStatus} />
          </div>

          {/* Right panel */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-white p-5 shadow-lg">
              <h2 className="mb-4 text-lg font-semibold">
                System Status
              </h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span>Backend</span>

                  <span
                    className={`font-semibold ${backendStatus === "online"
                      ? "text-green-600"
                      : backendStatus === "connecting"
                        ? "text-yellow-600"
                        : "text-red-600"
                      }`}
                  >
                    {backendText}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span>System</span>

                  <span className="text-right text-slate-600">
                    {statusMessage}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>MQTT</span>

                  <span
                    className={
                      backendStatus === "online"
                        ? "text-green-600"
                        : "text-slate-500"
                    }
                  >
                    {backendStatus === "online"
                      ? "Connected"
                      : "--"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Camera</span>

                  <span
                    className={
                      cameraStatus === "connected"
                        ? "text-green-600"
                        : cameraStatus === "connecting"
                          ? "text-yellow-600"
                          : "text-red-600"
                    }
                  >
                    {cameraStatus === "connected"
                      ? "Streaming"
                      : cameraStatus === "connecting"
                        ? "Connecting..."
                        : "Offline"}
                  </span>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-lg">
              <h2 className="mb-4 text-lg font-semibold">
                Telemetry
              </h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span>Battery</span>
                  <span>--%</span>
                </div>

                <div className="flex justify-between">
                  <span>Speed</span>
                  <span>--</span>
                </div>

                <div className="flex justify-between">
                  <span>Wi-Fi</span>
                  <span>-- dBm</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <Button
            label="Forward"
            command="forward"
            onCommand={handleCommand}
            onStop={handleStopCommand}
          />

          <div className="flex gap-4">
            <Button
              label="Left"
              command="left"
              onCommand={handleCommand}
              onStop={handleStopCommand}
            />

            <Button
              label="Stop"
              command="stop"
              onCommand={handleCommand}
              onStop={handleStopCommand}
            />

            <Button
              label="Right"
              command="right"
              onCommand={handleCommand}
              onStop={handleStopCommand}
            />
          </div>

          <Button
            label="Backward"
            command="backward"
            onCommand={handleCommand}
            onStop={handleStopCommand}
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;