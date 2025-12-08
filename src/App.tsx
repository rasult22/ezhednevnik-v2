import { Outlet } from 'react-router-dom';

/**
 * Root Application Component
 *
 * Currently just renders router outlets.
 * Will later include:
 * - Navigation sidebar
 * - OnboardingGuard
 * - Global error boundary
 * - Storage quota warnings
 */
function App() {
  return (
    <div className="h-full flex">
      {/* Temporary navigation - will be replaced with proper Navigation component */}
      <nav className="w-64 bg-white border-r border-gray-200 p-4">
        <h1 className="text-xl font-semibold mb-8">Ежедневник Триллионера</h1>
        <div className="space-y-2 text-sm text-gray-600">
          <p>📅 Сегодня</p>
          <p>🎯 Цели</p>
          <p>📊 План 90 дней</p>
          <p>📝 Еженедельные обзоры</p>
          <p>⚙️ Настройки</p>
        </div>
      </nav>

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-4xl mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default App;
