import { createCustomerClient } from '@/repositories/supabase/customerClient';
import type { Cart, CartItem } from './customerTypes';

export interface ICartRepository {
  getByCustomerId(customerId: string): Promise<Cart | null>;
  upsert(cart: Cart): Promise<Cart>;
  clear(customerId: string): Promise<void>;
  addItem(customerId: string, item: Omit<CartItem, 'id'>): Promise<Cart>;
  updateItem(customerId: string, itemId: string, quantity: number): Promise<Cart>;
  removeItem(customerId: string, itemId: string): Promise<Cart>;
  applyCoupon(customerId: string, couponCode: string | null): Promise<Cart>;
}

export class SupabaseCartRepository implements ICartRepository {
  private supabase: ReturnType<typeof createCustomerClient>;

  constructor(accessToken: string) {
    this.supabase = createCustomerClient(accessToken);
  }

  async getByCustomerId(customerId: string): Promise<Cart | null> {
    const { data, error } = await this.supabase
      .from('carts')
      .select('*')
      .eq('customer_id', customerId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Failed to get cart: ${error.message}`);
    }

    return data;
  }

  async upsert(cart: Cart): Promise<Cart> {
    const { data, error } = await this.supabase
      .from('carts')
      .upsert(cart, { onConflict: 'customer_id' })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to upsert cart: ${error.message}`);
    }

    return data;
  }

  async clear(customerId: string): Promise<void> {
    const { error } = await this.supabase
      .from('carts')
      .delete()
      .eq('customer_id', customerId);

    if (error) {
      throw new Error(`Failed to clear cart: ${error.message}`);
    }
  }

  async addItem(customerId: string, item: Omit<CartItem, 'id'>): Promise<Cart> {
    // Get current cart
    let cart = await this.getByCustomerId(customerId);
    
    if (!cart) {
      cart = {
        id: crypto.randomUUID(),
        customer_id: customerId,
        items: [],
        applied_coupon_code: null,
        updated_at: new Date().toISOString(),
      };
    }

    // Check if item already exists (same product, variant, size, thickness)
    const existingIndex = cart.items.findIndex(
      (i) =>
        i.product_id === item.product_id &&
        i.variant_id === item.variant_id &&
        i.size === item.size &&
        i.thickness === item.thickness
    );

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += item.quantity;
    } else {
      const newItem: CartItem = {
        ...item,
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      };
      cart.items.push(newItem);
    }

    cart.updated_at = new Date().toISOString();
    return this.upsert(cart);
  }

  async updateItem(customerId: string, itemId: string, quantity: number): Promise<Cart> {
    let cart = await this.getByCustomerId(customerId);
    if (!cart) throw new Error('Cart not found');

    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.id !== itemId);
    } else {
      const itemIndex = cart.items.findIndex((i) => i.id === itemId);
      if (itemIndex >= 0) {
        cart.items[itemIndex].quantity = quantity;
      } else {
        throw new Error('Item not found in cart');
      }
    }

    cart.updated_at = new Date().toISOString();
    return this.upsert(cart);
  }

  async removeItem(customerId: string, itemId: string): Promise<Cart> {
    let cart = await this.getByCustomerId(customerId);
    if (!cart) throw new Error('Cart not found');

    cart.items = cart.items.filter((i) => i.id !== itemId);
    cart.updated_at = new Date().toISOString();
    return this.upsert(cart);
  }

  async applyCoupon(customerId: string, couponCode: string | null): Promise<Cart> {
    let cart = await this.getByCustomerId(customerId);
    if (!cart) throw new Error('Cart not found');

    cart.applied_coupon_code = couponCode;
    cart.updated_at = new Date().toISOString();
    return this.upsert(cart);
  }
}