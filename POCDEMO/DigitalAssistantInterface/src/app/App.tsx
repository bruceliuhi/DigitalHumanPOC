import { RouterProvider } from 'react-router';
import { router } from '@/app/routes';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { DigitalHumanProvider } from '@/contexts/DigitalHumanContext';


export default function App() {
  return (
    <LanguageProvider>
      <DigitalHumanProvider>
        <RouterProvider router={router} />
      </DigitalHumanProvider>
    </LanguageProvider>
  );
}