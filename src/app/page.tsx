import { Page } from '@/components/PageLayout';
import { AuthButton } from '../components/AuthButton';

export default function Home() {
  return (
    <Page>
      <Page.Main className="flex flex-col items-center justify-center">
        <h1>Hello World</h1>
      </Page.Main>
    </Page>
  );
}
