import { useEffect, useState } from "react";
import { Button } from "../../components/Button";
import { getStatusService } from "../../api/services/status-service";

function HomePage() {
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await getStatusService();

        setStatus(response.message);
      } catch (error) {
        console.error(error);
        setStatus("Backend unavailable");
      }
    };

    fetchStatus();
  }, []);

  const handleCommand = (command: string) => {
    console.log(command);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-8">
        SmartCar Home Page v1
      </h1>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2">Status</h2>
        <p>{status}</p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <Button
          label="Forward"
          command="forward"
          onCommand={handleCommand}
        />

        <div className="flex gap-4">
          <Button
            label="Left"
            command="Left"
            onCommand={handleCommand}
          />

          <Button
            label="Stop"
            command="Stop"
            onCommand={handleCommand}
          />

          <Button
            label="Right"
            command="Right"
            onCommand={handleCommand}
          />
        </div>

        <Button
          label="Backward"
          command="Backward"
          onCommand={handleCommand}
        />
      </div>
    </div>
  );
}

export default HomePage;