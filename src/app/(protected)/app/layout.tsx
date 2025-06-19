import { Page } from '@/components/PageLayout';
import { Navigation } from '@/components/Navigation';
import { Header } from '@/components/Header';

export default function ProtectedAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Page className='h-screen'>
        <Header/>
        {children}
        
 
   



    </Page>
  );
}
