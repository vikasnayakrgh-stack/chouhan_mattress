import { createCustomerClient } from '@/repositories/supabase/customerClient';
import type { CustomerAddress } from './customerTypes';

export interface ICustomerAddressRepository {
  getByCustomerId(customerId: string): Promise<CustomerAddress[]>;
  getById(id: string): Promise<CustomerAddress | null>;
  create(address: Omit<CustomerAddress, 'id' | 'created_at' | 'updated_at'>): Promise<CustomerAddress>;
  update(id: string, address: Partial<CustomerAddress>): Promise<CustomerAddress>;
  delete(id: string): Promise<void>;
  setDefault(customerId: string, addressId: string, type: 'shipping' | 'billing'): Promise<void>;
}

export class SupabaseCustomerAddressRepository implements ICustomerAddressRepository {
  private supabase: ReturnType<typeof createCustomerClient>;

  constructor(accessToken: string) {
    this.supabase = createCustomerClient(accessToken);
  }

  async getByCustomerId(customerId: string): Promise<CustomerAddress[]> {
    const { data, error } = await this.supabase
      .from('customer_addresses')
      .select('*')
      .eq('customer_id', customerId)
      .order('is_default_shipping', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get customer addresses: ${error.message}`);
    }

    return data || [];
  }

  async getById(id: string): Promise<CustomerAddress | null> {
    const { data, error } = await this.supabase
      .from('customer_addresses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Failed to get address: ${error.message}`);
    }

    return data;
  }

  async create(address: Omit<CustomerAddress, 'id' | 'created_at' | 'updated_at'>): Promise<CustomerAddress> {
    // If setting as default, unset other defaults first
    if (address.is_default_shipping) {
      await this.unsetDefaultShipping(address.customer_id);
    }
    if (address.is_default_billing) {
      await this.unsetDefaultBilling(address.customer_id);
    }

    const { data, error } = await this.supabase
      .from('customer_addresses')
      .insert(address)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create address: ${error.message}`);
    }

    return data;
  }

  async update(id: string, address: Partial<CustomerAddress>): Promise<CustomerAddress> {
    // If setting as default, unset other defaults first
    if (address.is_default_shipping) {
      const { data: current } = await this.supabase
        .from('customer_addresses')
        .select('customer_id')
        .eq('id', id)
        .single();
      if (current) {
        await this.unsetDefaultShipping(current.customer_id);
      }
    }
    if (address.is_default_billing) {
      const { data: current } = await this.supabase
        .from('customer_addresses')
        .select('customer_id')
        .eq('id', id)
        .single();
      if (current) {
        await this.unsetDefaultBilling(current.customer_id);
      }
    }

    const { data, error } = await this.supabase
      .from('customer_addresses')
      .update({ ...address, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update address: ${error.message}`);
    }

    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('customer_addresses')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete address: ${error.message}`);
    }
  }

  async setDefault(customerId: string, addressId: string, type: 'shipping' | 'billing'): Promise<void> {
    // Unset all defaults for this customer
    if (type === 'shipping') {
      await this.unsetDefaultShipping(customerId);
    } else {
      await this.unsetDefaultBilling(customerId);
    }

    // Set the new default
    const { error } = await this.supabase
      .from('customer_addresses')
      .update({
        [`is_default_${type}`]: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', addressId)
      .eq('customer_id', customerId);

    if (error) {
      throw new Error(`Failed to set default ${type} address: ${error.message}`);
    }
  }

  private async unsetDefaultShipping(customerId: string): Promise<void> {
    await this.supabase
      .from('customer_addresses')
      .update({ is_default_shipping: false, updated_at: new Date().toISOString() })
      .eq('customer_id', customerId)
      .eq('is_default_shipping', true);
  }

  private async unsetDefaultBilling(customerId: string): Promise<void> {
    await this.supabase
      .from('customer_addresses')
      .update({ is_default_billing: false, updated_at: new Date().toISOString() })
      .eq('customer_id', customerId)
      .eq('is_default_billing', true);
  }
}