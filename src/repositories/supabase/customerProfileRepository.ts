import { createCustomerClient } from '@/repositories/supabase/customerClient';
import type { CustomerProfile } from './customerTypes';

export interface ICustomerProfileRepository {
  getById(id: string): Promise<CustomerProfile | null>;
  upsert(profile: CustomerProfile): Promise<CustomerProfile>;
}

export class SupabaseCustomerProfileRepository implements ICustomerProfileRepository {
  private supabase: ReturnType<typeof createCustomerClient>;

  constructor(accessToken: string) {
    this.supabase = createCustomerClient(accessToken);
  }

  async getById(id: string): Promise<CustomerProfile | null> {
    const { data, error } = await this.supabase
      .from('customer_profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Failed to get customer profile: ${error.message}`);
    }

    return data;
  }

  async upsert(profile: CustomerProfile): Promise<CustomerProfile> {
    const { data, error } = await this.supabase
      .from('customer_profiles')
      .upsert(profile, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to upsert customer profile: ${error.message}`);
    }

    return data;
  }
}