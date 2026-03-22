
import LoginForm from '@/components/LoginForm';
import { Suspense } from 'react';
 
export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[var(--login-bg)]">
      <Suspense>
        <LoginForm/>
      </Suspense>
    </main>
  );
}
