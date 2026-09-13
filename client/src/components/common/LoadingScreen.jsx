import LoadingSpinner from './LoadingSpinner.jsx';

export default function LoadingScreen({ message = 'Loading...' }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50">
      <LoadingSpinner size="lg" />
      {message && (
        <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}