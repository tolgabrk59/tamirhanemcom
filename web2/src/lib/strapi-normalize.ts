// Strapi v5 normalizer — handles both nested attributes and flat formats

type StrapiRawItem = {
  id: number
  attributes?: Record<string, unknown>
  [key: string]: unknown
}

type StrapiListResponse = {
  data?: StrapiRawItem[]
  meta?: unknown
}

type StrapiSingleResponse = {
  data?: StrapiRawItem
}

function flattenStrapiEntity(item: StrapiRawItem): Record<string, unknown> {
  if (item.attributes && typeof item.attributes === 'object') {
    return { id: item.id, ...item.attributes }
  }
  const { id, ...rest } = item
  return { id, ...rest }
}

export function normalizeStrapiList<T>(
  raw: StrapiListResponse,
  mapper: (flat: Record<string, unknown>) => T
): T[] {
  const items = raw?.data ?? []
  return items.map(item => mapper(flattenStrapiEntity(item)))
}

export function normalizeStrapiItem<T>(
  raw: StrapiSingleResponse,
  mapper: (flat: Record<string, unknown>) => T
): T | null {
  if (!raw?.data) return null
  return mapper(flattenStrapiEntity(raw.data))
}
