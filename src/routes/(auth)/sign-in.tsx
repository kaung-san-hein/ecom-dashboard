import { createFileRoute } from '@tanstack/react-router'
import SignIn from '@/features/auth/sign-in'
import { useAuth } from '@/stores/authStore';
import { router } from '@/main';

const AuthRoute = (Component: React.ComponentType) => {
  return (props: any) => {
    const authState = useAuth();

    if (authState.accessToken) {
      router.navigate({ to: '/' });
      return null;
    }

    return <Component {...props} />;
  };
};

export const Route = createFileRoute('/(auth)/sign-in')({
  component: AuthRoute(SignIn),
})
