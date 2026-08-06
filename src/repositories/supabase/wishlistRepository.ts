import { createCustomerClient } from '@/repositories/supabase/customerClient';
import type { Wishlist } from './customerTypes';

export interface IWishlistRepository {
  getByCustomerId(customerId: string): Promise<Wishlist | null>;
  upsert(wishlist: Wishlist): Promise<Wishlist>;
  addProduct(customerId: string, productId: string): Promise<Wishlist>;
  removeProduct(customerId: string, productId: string): Promise<Wishlist>;
  clear(customerId: string): Promise<void>;
  isInWishlist(customerId: string, productId: string): Promise<boolean>;
}

export class SupabaseWishlistRepository implements IWishlistRepository {
  private supabase: ReturnType<typeof createCustomerClient>;

  constructor(accessToken: string) {
    this.supabase = createCustomerClient(accessToken);
  }

  async getByCustomerId(customerId: string): Promise<Wishlist | null> {
    const { data, error } = await this.supabase
      .from('wishlists')
      .select('*')
      .eq('customer_id', customerId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Failed to get wishlist: ${error.message}`);
    }

    return data;
  }

  async upsert(wishlist: Wishlist): Promise<Wishlist> {
    const { data, error } = await this.supabase
      .from('wishlists')
      .upsert(wishlist, { onConflict: 'customer_id' })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to upsert wishlist: ${error.message}`);
    }

    return data;
  }

  async addProduct(customerId: string, productId: string): Promise<Wishlist> {
    let wishlist = await this.getByCustomerId(customerId);
    
    if (!wishlist) {
      wishlist = {
        id: crypto.randomUUID(),
        customer_id: customerId,
        product_ids: [],
        updated_at: new Date().toISOString(),
      };
    }

    if (!wishlist.product_ids.includes(productId)) {
      wishlist.product_ids = [...wishlist.product_ids, productId];
    }

    wishlist.updated_at = new Date().toISOString();
    return this.upsert(wishlist);
  }

  async removeProduct(customerId: string, productId: string): Promise<Wishlist> {
    let wishlist = await this.getByCustomerId(customerId);
    if (!wishlist) throw new Error('Wishlist not found');

    wishlist.product_ids = wishlist.product_ids.filter((id) => id !== productId);
    wishlist.updated_at = new Date().toISOString();
    return this.upsert(wishlist);
  }

  async clear(customerId: string): Promise<void> {
    const { error } = await this.supabase
      .from('wishlists')
      .delete()
      .eq('customer_id', customerId);

    if (error) {
      throw new Error(`Failed to clear wishlist: ${error.message}`);
    }
  }

  async isInWishlist(customerId: string, productId: string): Promise<boolean> {
    const wishlist = await this.getByCustomerId(customerId);
    return wishlist?.product_ids.includes(productId) ?? false;
  }
}