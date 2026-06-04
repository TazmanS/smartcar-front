function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-8">
        SmartCar Home Page
      </h1>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2">Status</h2>
        <p>Car is ready</p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <button className="px-8 py-3 rounded-lg bg-blue-500 text-white font-medium hover:opacity-90">
          Forward
        </button>

        <div className="flex gap-4">
          <button className="px-8 py-3 rounded-lg bg-blue-500 text-white font-medium hover:opacity-90">
            Left
          </button>

          <button className="px-8 py-3 rounded-lg bg-red-500 text-white font-medium hover:opacity-90">
            Stop
          </button>

          <button className="px-8 py-3 rounded-lg bg-blue-500 text-white font-medium hover:opacity-90">
            Right
          </button>
        </div>

        <button className="px-8 py-3 rounded-lg bg-blue-500 text-white font-medium hover:opacity-90">
          Backward
        </button>
      </div>
    </div>
  );
}

export default HomePage;