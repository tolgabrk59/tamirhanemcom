import type {
  Category,
  CategoryAttributes,
  Vehicle,
  VehicleAttributes,
  ObdCode,
  ObdCodeAttributes,
  Service,
  StrapiResponse,
  StrapiData,
} from '@/types';

const STRAPI_URL = process.env.STRAPI_URL || 'https://api.tamirhanem.net';

// Generic fetch function with error handling
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T | null> {
  try {
    const url = `${STRAPI_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      console.error(`API Error: ${response.status} - ${response.statusText}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}

// ==================== CATEGORIES ====================

export async function getCategories(): Promise<Category[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<CategoryAttributes>[]>>(
    '/api/categories?populate=icon'
  );

  if (!response?.data) {
    return [];
  }

  return response.data.map((item) => ({
    id: item.id,
    title: item.attributes.title,
    slug: item.attributes.slug,
    description: item.attributes.description,
    icon: item.attributes.icon?.data
      ? { url: `${STRAPI_URL}${item.attributes.icon.data.attributes.url}` }
      : undefined,
  }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const response = await fetchAPI<StrapiResponse<StrapiData<CategoryAttributes>[]>>(
    `/api/categories?filters[slug][$eq]=${slug}&populate=icon`
  );

  if (!response?.data?.[0]) {
    return null;
  }

  const item = response.data[0];
  return {
    id: item.id,
    title: item.attributes.title,
    slug: item.attributes.slug,
    description: item.attributes.description,
    icon: item.attributes.icon?.data
      ? { url: `${STRAPI_URL}${item.attributes.icon.data.attributes.url}` }
      : undefined,
  };
}

// ==================== VEHICLES ====================

export async function getVehicleBrands(): Promise<string[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<VehicleAttributes>[]>>(
    '/api/vehicles?fields[0]=brand&pagination[pageSize]=100'
  );

  if (!response?.data) {
    return [];
  }

  const brands = [...new Set(response.data.map((item) => item.attributes.brand))];
  return brands.sort();
}

export async function getVehicleModels(brand: string): Promise<string[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<VehicleAttributes>[]>>(
    `/api/vehicles?filters[brand][$eq]=${encodeURIComponent(brand)}&fields[0]=model&pagination[pageSize]=100`
  );

  if (!response?.data) {
    return [];
  }

  const models = [...new Set(response.data.map((item) => item.attributes.model))];
  return models.sort();
}

export async function getVehicleYears(brand: string, model: string): Promise<number[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<VehicleAttributes>[]>>(
    `/api/vehicles?filters[brand][$eq]=${encodeURIComponent(brand)}&filters[model][$eq]=${encodeURIComponent(model)}&fields[0]=year&sort=year:desc`
  );

  if (!response?.data) {
    return [];
  }

  const years = [...new Set(response.data.map((item) => item.attributes.year))];
  return years.sort((a, b) => b - a);
}

export async function getVehiclesByBrand(brand: string): Promise<Vehicle[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<VehicleAttributes>[]>>(
    `/api/vehicles?filters[brand][$eq]=${encodeURIComponent(brand)}&sort=year:desc&pagination[pageSize]=100`
  );

  if (!response?.data) {
    return [];
  }

  return response.data.map((item) => ({
    id: item.id,
    brand: item.attributes.brand,
    model: item.attributes.model,
    year: item.attributes.year,
    engineType: item.attributes.engineType,
  }));
}

// ==================== OBD CODES ====================

export async function getObdCodes(): Promise<ObdCode[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<ObdCodeAttributes>[]>>(
    '/api/obd-codes?pagination[pageSize]=100&sort=code:asc'
  );

  if (!response?.data) {
    return [];
  }

  return response.data.map((item) => ({
    id: item.id,
    code: item.attributes.code,
    title: item.attributes.title,
    description: item.attributes.description || '',
    symptoms: item.attributes.symptoms || [],
    causes: item.attributes.causes || [],
    fixes: item.attributes.fixes || [],
    estimatedCostMin: item.attributes.estimatedCostMin,
    estimatedCostMax: item.attributes.estimatedCostMax,
    severity: item.attributes.severity || 'medium',
    category: item.attributes.category || 'Genel',
  }));
}

export async function getObdCodeByCode(code: string): Promise<ObdCode | null> {
  const response = await fetchAPI<StrapiResponse<StrapiData<ObdCodeAttributes>[]>>(
    `/api/obd-codes?filters[code][$eq]=${encodeURIComponent(code.toUpperCase())}`
  );

  if (!response?.data?.[0]) {
    return null;
  }

  const item = response.data[0];
  return {
    id: item.id,
    code: item.attributes.code,
    title: item.attributes.title,
    description: item.attributes.description || '',
    symptoms: item.attributes.symptoms || [],
    causes: item.attributes.causes || [],
    fixes: item.attributes.fixes || [],
    estimatedCostMin: item.attributes.estimatedCostMin,
    estimatedCostMax: item.attributes.estimatedCostMax,
    severity: item.attributes.severity || 'medium',
    category: item.attributes.category || 'Genel',
  };
}

export async function searchObdCodes(query: string): Promise<ObdCode[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<ObdCodeAttributes>[]>>(
    `/api/obd-codes?filters[$or][0][code][$containsi]=${encodeURIComponent(query)}&filters[$or][1][title][$containsi]=${encodeURIComponent(query)}&pagination[pageSize]=20`
  );

  if (!response?.data) {
    return [];
  }

  return response.data.map((item) => ({
    id: item.id,
    code: item.attributes.code,
    title: item.attributes.title,
    description: item.attributes.description || '',
    symptoms: item.attributes.symptoms || [],
    causes: item.attributes.causes || [],
    fixes: item.attributes.fixes || [],
    estimatedCostMin: item.attributes.estimatedCostMin,
    estimatedCostMax: item.attributes.estimatedCostMax,
    severity: item.attributes.severity || 'medium',
    category: item.attributes.category || 'Genel',
  }));
}

// ==================== SERVICES ====================

export async function getServices(): Promise<Service[]> {
  const response = await fetchAPI<StrapiResponse<StrapiData<any>[]>>(
    '/api/services?pagination[pageSize]=100'
  );

  if (!response?.data) {
    return [];
  }

  return response.data.map((item) => ({
    id: item.id,
    name: item.attributes.name,
    slug: item.attributes.slug,
    description: item.attributes.description,
    priceMin: item.attributes.priceMin,
    priceMax: item.attributes.priceMax,
    duration: item.attributes.duration,
    category: item.attributes.category,
  }));
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const response = await fetchAPI<StrapiResponse<StrapiData<any>[]>>(
    `/api/services?filters[slug][$eq]=${encodeURIComponent(slug)}`
  );

  if (!response?.data?.[0]) {
    return null;
  }

  const item = response.data[0];
  return {
    id: item.id,
    name: item.attributes.name,
    slug: item.attributes.slug,
    description: item.attributes.description,
    priceMin: item.attributes.priceMin,
    priceMax: item.attributes.priceMax,
    duration: item.attributes.duration,
    category: item.attributes.category,
  };
}
