'use server';

import { addToCart, removeFromCart, updateCart } from 'lib/bigcommerce';
import { cookies } from 'next/headers';

export const addItem = async (
  isBigCommerceAPI: boolean,
  productId: string,
  variantId: string | undefined
): Promise<Error | string> => {
  const cartId = cookies().get('cartId')?.value;

  if ((!isBigCommerceAPI && !cartId) || !variantId) {
    return new Error('Missing cartId or variantId');
  } else if (isBigCommerceAPI && !variantId) {
    return new Error('Missing variantId');
  }
  try {
    const { id } = await addToCart(cartId ?? '', [
      { merchandiseId: variantId, quantity: 1, productId }
    ]);
    cookies().set('cartId', id);
    return id;
  } catch (e) {
    return new Error('Error adding item', { cause: e });
  }
};

export const removeItem = async (lineId: string): Promise<Error | undefined> => {
  const cartId = cookies().get('cartId')?.value;

  if (!cartId) {
    return new Error('Missing cartId');
  }
  try {
    const response = await removeFromCart(cartId, [lineId]);

    if (!response && cartId) {
      cookies().delete('cartId');
    }
  } catch (e) {
    return new Error('Error removing item', { cause: e });
  }
};

export const updateItemQuantity = async ({
  lineId,
  productSlug,
  variantId,
  quantity
}: {
  lineId: string;
  productSlug: string;
  variantId: string;
  quantity: number;
}): Promise<Error | undefined> => {
  const cartId = cookies().get('cartId')?.value;

  if (!cartId) {
    return new Error('Missing cartId');
  }
  try {
    await updateCart(cartId, [
      {
        id: lineId,
        merchandiseId: variantId,
        quantity,
        productSlug
      }
    ]);
  } catch (e) {
    return new Error('Error updating item quantity', { cause: e });
  }
};
