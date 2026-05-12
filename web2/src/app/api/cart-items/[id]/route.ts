import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_CART_ITEMS_ID');

export const dynamic = 'force-dynamic';

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!jwt) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme token\'ı gerekli' },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    logger.info({ cartItemId: id }, 'Sepet öğesi siliniyor');

    const response = await fetch(`${STRAPI}/cart-items/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      logger.error({ cartItemId: id, status: response.status, error: result }, 'Strapi sepet öğesi silme hatası');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Sepet öğesi silinemedi' },
        { status: response.status }
      );
    }

    logger.info({ cartItemId: id }, 'Sepet öğesi silindi');

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Cart item DELETE request failed');
    return NextResponse.json(
      { success: false, error: 'Sepet öğesi silinirken hata oluştu' },
      { status: 500 }
    );
  }
}
