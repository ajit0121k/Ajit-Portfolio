import Providers from './providers.jsx';
import { RouterProvider } from 'react-router-dom';
import router from './router.jsx';

export default function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}