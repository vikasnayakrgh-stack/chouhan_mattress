import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';
import { getRepositories } from '@/repositories';
import { AccountLayoutProvider } from './AccountLayoutClient';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?redirectTo=/account');
  }

  if (!user.email_confirmed_at) {
    redirect('/auth/verify-email?redirectTo=/account');
  }

  const accessToken = cookieStore.get('sb-access-token')?.value;
  const repos = getRepositories(accessToken);

  // Fetch customer profile, addresses, and orders
  const [profile, addresses, orders] = await Promise.all([
    repos.customerProfiles.getById(user.id),
    repos.customerAddresses.getByCustomerId(user.id),
    repos.orders.getByCustomer(user.id),
  ]);

  return (
    <AccountLayoutProvider
      user={user}
      profile={profile}
      addresses={addresses || []}
      orders={orders || []}
      repos={repos}
    >
      {children}
    </AccountLayoutProvider>
  );
}