'use server';

import { TAGS } from 'lib/constants';
import { addToCart, createCart, getCart, removeFromCart, updateCart } from 'lib/bigcommerce';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

export async function addItem(prevState: any, productId: string, variantId: string | undefined) {
  let cartId = cookies().get('cartId')?.value;

  if (!selectedVariantId) {
    return 'Missing product variant ID';
  }

  try {
    const { id } = await addToCart(cartId ?? '', [
      { merchandiseId: variantId, quantity: 1, productId }
    ]);
    revalidateTag(TAGS.cart);
    cookies().set('cartId', id);
    return id;
  } catch (e) {
    return 'Error adding item to cart';
  }
}

export async function removeItem(prevState: any, lineId: string) {
  const cartId = cookies().get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  try {
    const response = await removeFromCart(cartId, [lineId]);
    revalidateTag(TAGS.cart);

    if (!response && cartId) {
      cookies().delete('cartId');
    }
  } catch (e) {
    return 'Error removing item from cart';
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    lineId: string;
    productSlug: string;
    variantId: string;
    quantity: number;
  }
) {
  const cartId = cookies().get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  const { lineId, variantId, quantity } = payload;

  try {
    if (quantity === 0) {
      await removeFromCart(cartId, [lineId]);
      revalidateTag(TAGS.cart);
      return;
    }

    await updateCart(cartId, [
      {
        id: lineId,
        merchandiseId: variantId,
        quantity,
        productSlug
      }
    ]);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error updating item quantity';
  }
}
