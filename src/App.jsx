import "./App.css";
import UsersPage from "./pages/UsersPage";

function App() {
  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-semibold mb-4">
            User Management Dashboard
          </h1>
          <UsersPage />
        </div>
      </div>
    </>
  );
}

export default App;
