import { Page } from '@/components/PageLayout';
import { Navigation } from '@/components/Navigation';

export default function ProtectedAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Page className='h-screen'>
      
        {children}
        
 
   


    </Page>
  );
}
