/**
 * External API Type Definitions
 *
 * This file contains comprehensive TypeScript interfaces for all external API integrations
 * used in the tamirhanem-next project.
 */

// ============================================================================
// STRAPI API TYPES
// ============================================================================

/**
 * Base Strapi response wrapper
 */
export interface StrapiResponse<T> {
  data: T;
  meta?: StrapiMeta;
}

export interface StrapiMeta {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

/**
 * Strapi entity base structure
 */
export interface StrapiEntity<T> {
  id: number;
  attributes: T;
}

/**
 * Strapi collection response (array of entities)
 */
export type StrapiCollectionResponse<T> = StrapiResponse<StrapiEntity<T>[]>;

/**
 * Strapi single response (single entity)
 */
export type StrapiSingleResponse<T> = StrapiResponse<StrapiEntity<T>>;

/**
 * Vehicle Analysis data stored in Strapi
 */
export interface VehicleAnalysisAttributes {
  brand: string;
  model: string;
  year: number;
  data: VehicleAnalysisData;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleAnalysisData {
  specs: {
    engine: string;
    horsepower: string;
    torque: string;
    transmission: string;
    drivetrain: string;
    fuel_economy: string;
  };
  tires: {
    standard: string;
    alternative: string[];
    pressure: string;
  };
  chronic_problems: ChronicProblem[];
  maintenance: {
    oil_type: string;
    oil_capacity: string;
    intervals: MaintenanceInterval[];
  };
  pros: string[];
  cons: string[];
  summary: string;
  estimated_prices: {
    market_min: string;
    market_max: string;
    average: string;
  };
  image_url?: string | null;
}

export interface ChronicProblem {
  problem: string;
  description: string;
  severity: 'Düşük' | 'Orta' | 'Yüksek';
  significance_score: number;
}

export interface MaintenanceInterval {
  km: string;
  action: string;
}

/**
 * Vehicle Validation data stored in Strapi
 */
export interface VehicleValidationAttributes {
  brand: string;
  model: string;
  year: number;
  valid: boolean;
  production_start: number | null;
  production_end: number | null;
  message: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * EV Charging Station data stored in Strapi
 */
export interface ChargingStationAttributes {
  externalId: string | null;
  name: string;
  operatorName: string | null;
  address: string | null;
  city: string;
  district: string | null;
  latitude: number | null;
  longitude: number | null;
  maxPowerKw: number | null;
  connectors: string; // JSON stringified ConnectorInfo[]
  is24Hours: boolean;
  isPublic: boolean;
  rating: number | null;
  reviewCount: number;
  phone: string | null;
  website: string | null;
  openingHours: string | null;
  thumbnail: string | null;
  source: 'SERPER' | 'OCM' | 'MANUAL';
  createdAt: string;
  updatedAt: string;
}

export interface ConnectorInfo {
  type: string;
  typeName: string;
  powerKw: number;
  quantity: number;
}

// ============================================================================
// GOOGLE GEMINI API TYPES
// ============================================================================

/**
 * Gemini API response types
 */
export interface GeminiGenerateContentResponse {
  response: GeminiResponse;
}

export interface GeminiResponse {
  text(): string;
  candidates?: GeminiCandidate[];
  promptFeedback?: GeminiPromptFeedback;
}

export interface GeminiCandidate {
  content: GeminiContent;
  finishReason?: string;
  safetyRatings?: GeminiSafetyRating[];
  citationMetadata?: GeminiCitationMetadata;
}

export interface GeminiContent {
  parts: GeminiPart[];
  role: string;
}

export interface GeminiPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

export interface GeminiPromptFeedback {
  safetyRatings?: GeminiSafetyRating[];
  blockReason?: string;
}

export interface GeminiSafetyRating {
  category: string;
  probability: string;
}

export interface GeminiCitationMetadata {
  citationSources?: GeminiCitationSource[];
}

export interface GeminiCitationSource {
  startIndex?: number;
  endIndex?: number;
  uri?: string;
  license?: string;
}

/**
 * Gemini model configuration
 */
export interface GeminiModelConfig {
  model: string;
  tools?: GeminiTool[];
  generationConfig?: {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
    stopSequences?: string[];
  };
  safetySettings?: GeminiSafetySetting[];
}

export interface GeminiTool {
  googleSearch?: Record<string, never>;
  codeExecution?: Record<string, never>;
}

export interface GeminiSafetySetting {
  category: string;
  threshold: string;
}

/**
 * Gemini error response
 */
export interface GeminiError {
  message: string;
  code?: number;
  status?: string;
}

// ============================================================================
// OPENAI API TYPES
// ============================================================================

/**
 * OpenAI Chat Completion types
 */
export interface OpenAIChatCompletionResponse {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: OpenAIChatChoice[];
  usage: OpenAIUsage;
  system_fingerprint?: string;
}

export interface OpenAIChatChoice {
  index: number;
  message: OpenAIChatMessage;
  finish_reason: 'stop' | 'length' | 'content_filter' | 'tool_calls' | null;
  logprobs?: null;
}

export interface OpenAIChatMessage {
  role: 'system' | 'user' | 'assistant' | 'function';
  content: string | null;
  name?: string;
  function_call?: {
    name: string;
    arguments: string;
  };
}

export interface OpenAIUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

/**
 * OpenAI Chat Completion request
 */
export interface OpenAIChatCompletionRequest {
  model: string;
  messages: OpenAIChatMessage[];
  temperature?: number;
  top_p?: number;
  n?: number;
  stream?: boolean;
  stop?: string | string[];
  max_tokens?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  logit_bias?: Record<string, number>;
  user?: string;
}

/**
 * OpenAI error response
 */
export interface OpenAIError {
  error: {
    message: string;
    type: string;
    param?: string | null;
    code?: string | null;
  };
}

// ============================================================================
// GROK API TYPES (using OpenAI-compatible interface via Codefast)
// ============================================================================

/**
 * Grok uses OpenAI-compatible API, so we reuse OpenAI types
 * but define specific model names
 */
export type GrokChatCompletionResponse = OpenAIChatCompletionResponse;
export type GrokChatCompletionRequest = OpenAIChatCompletionRequest;
export type GrokError = OpenAIError;

export const GROK_MODELS = {
  FAST: 'grok-4-fast',
  STANDARD: 'grok-2',
} as const;

export type GrokModel = typeof GROK_MODELS[keyof typeof GROK_MODELS];

// ============================================================================
// OPENCHARGEMAP (OCM) API TYPES
// ============================================================================

/**
 * OCM POI (Point of Interest) response
 */
export interface OCMStation {
  ID: number;
  UUID?: string;
  DataProvider?: OCMDataProvider;
  OperatorInfo?: OCMOperatorInfo;
  UsageType?: OCMUsageType;
  StatusType?: OCMStatusType;
  AddressInfo: OCMAddressInfo;
  Connections: OCMConnection[];
  NumberOfPoints?: number;
  GeneralComments?: string;
  DatePlanned?: string | null;
  DateLastConfirmed?: string | null;
  UserComments?: OCMUserComment[];
  MediaItems?: OCMMediaItem[];
  IsRecentlyVerified?: boolean;
  DateLastVerified?: string | null;
}

export interface OCMDataProvider {
  ID: number;
  Title: string;
  WebsiteURL?: string;
  Comments?: string;
}

export interface OCMOperatorInfo {
  ID: number;
  Title: string;
  WebsiteURL?: string;
  Comments?: string;
  PhonePrimaryContact?: string;
  PhoneSecondaryContact?: string;
  IsPrivateIndividual?: boolean;
}

export interface OCMUsageType {
  ID: number;
  Title: string;
  IsPayAtLocation?: boolean;
  IsMembershipRequired?: boolean;
  IsAccessKeyRequired?: boolean;
}

export interface OCMStatusType {
  ID: number;
  Title: string;
  IsOperational?: boolean;
  IsUserSelectable?: boolean;
}

export interface OCMAddressInfo {
  ID: number;
  Title: string;
  AddressLine1?: string;
  AddressLine2?: string;
  Town?: string;
  StateOrProvince?: string;
  Postcode?: string;
  Country?: OCMCountry;
  Latitude: number;
  Longitude: number;
  ContactTelephone1?: string;
  ContactTelephone2?: string;
  ContactEmail?: string;
  AccessComments?: string;
  RelatedURL?: string;
  Distance?: number;
  DistanceUnit?: number;
}

export interface OCMCountry {
  ID: number;
  ISOCode: string;
  ContinentCode?: string;
  Title: string;
}

export interface OCMConnection {
  ID: number;
  ConnectionTypeID: number;
  ConnectionType?: OCMConnectionType;
  Reference?: string;
  StatusTypeID?: number;
  StatusType?: OCMStatusType;
  LevelID?: number;
  Level?: OCMChargerLevel;
  Amps?: number;
  Voltage?: number;
  PowerKW?: number;
  CurrentTypeID?: number;
  CurrentType?: OCMCurrentType;
  Quantity?: number;
  Comments?: string;
}

export interface OCMConnectionType {
  ID: number;
  Title: string;
  FormalName?: string;
  IsDiscontinued?: boolean;
  IsObsolete?: boolean;
}

export interface OCMChargerLevel {
  ID: number;
  Title: string;
  Comments?: string;
  IsFastChargeCapable?: boolean;
}

export interface OCMCurrentType {
  ID: number;
  Title: string;
  Description?: string;
}

export interface OCMUserComment {
  ID: number;
  ChargePointID: number;
  CommentTypeID?: number;
  CommentType?: OCMCommentType;
  UserName: string;
  Comment: string;
  Rating?: number;
  RelatedURL?: string;
  DateCreated: string;
  User?: OCMUser;
}

export interface OCMCommentType {
  ID: number;
  Title: string;
}

export interface OCMUser {
  ID: number;
  Username?: string;
  ReputationPoints?: number;
}

export interface OCMMediaItem {
  ID: number;
  ChargePointID: number;
  ItemURL: string;
  ItemThumbnailURL?: string;
  Comment?: string;
  IsEnabled?: boolean;
  IsVideo?: boolean;
  IsFeaturedItem?: boolean;
  IsExternalResource?: boolean;
  User?: OCMUser;
  DateCreated: string;
}

/**
 * OCM API query parameters
 */
export interface OCMQueryParams {
  output?: 'json' | 'xml' | 'kml';
  countrycode?: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
  distanceunit?: 'KM' | 'Miles';
  maxresults?: number;
  compact?: boolean;
  verbose?: boolean;
  key?: string;
  operatorid?: number;
  connectiontypeid?: number;
  levelid?: number;
  minpowerkw?: number;
}

// ============================================================================
// SUPERMEMORY API TYPES
// ============================================================================

/**
 * Supermemory add memory request
 */
export interface SupermemoryAddRequest {
  content: string;
  containerTags?: string[];
  metadata?: Record<string, string>;
}

/**
 * Supermemory add memory response
 */
export interface SupermemoryAddResponse {
  id: string;
  content: string;
  containerTags?: string[];
  metadata?: Record<string, string>;
  createdAt: string;
}

/**
 * Supermemory search request
 */
export interface SupermemorySearchRequest {
  q: string;
  containerTags?: string[];
  limit?: number;
  offset?: number;
}

/**
 * Supermemory search result
 */
export interface SupermemorySearchResult {
  id: string;
  content?: string;
  text?: string;
  metadata?: Record<string, string>;
  score?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Supermemory search response
 */
export interface SupermemorySearchResponse {
  results: SupermemorySearchResult[];
  total?: number;
  limit?: number;
  offset?: number;
}

/**
 * Supermemory error response
 */
export interface SupermemoryError {
  error: string;
  message?: string;
  statusCode?: number;
}

// ============================================================================
// SERPER API TYPES (Google Search)
// ============================================================================

/**
 * Serper Places API request
 */
export interface SerperPlacesRequest {
  q: string;
  location?: string;
  gl?: string; // country code
  hl?: string; // language
  num?: number;
  lat?: string;
  lng?: string;
}

/**
 * Serper Places API response
 */
export interface SerperPlacesResponse {
  searchParameters: {
    q: string;
    gl?: string;
    hl?: string;
    location?: string;
    num?: number;
  };
  places?: SerperPlace[];
  credits?: number;
}

export interface SerperPlace {
  position: number;
  title: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  ratingCount?: number;
  category?: string;
  phoneNumber?: string;
  website?: string;
  cid?: string;
  placeId?: string;
  openingHours?: string;
  thumbnailUrl?: string;
  description?: string;
}

/**
 * Serper error response
 */
export interface SerperError {
  error: string;
  message?: string;
}

// ============================================================================
// PEXELS API TYPES
// ============================================================================

/**
 * Pexels search response
 */
export interface PexelsSearchResponse {
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
  total_results: number;
  next_page?: string;
  prev_page?: string;
}

export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: PexelsPhotoSrc;
  liked: boolean;
  alt: string;
}

export interface PexelsPhotoSrc {
  original: string;
  large2x: string;
  large: string;
  medium: string;
  small: string;
  portrait: string;
  landscape: string;
  tiny: string;
}

/**
 * Pexels error response
 */
export interface PexelsError {
  error: string;
}

// ============================================================================
// ARABAM.COM SCRAPING TYPES
// ============================================================================

/**
 * Arabam.com price scraping result
 */
export interface ArabamPriceResult {
  success: boolean;
  data?: ArabamPriceData;
  error?: string;
}

export interface ArabamPriceData {
  count: number;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  medianPrice: number;
  priceRange: {
    low: number;
    high: number;
  };
  source: 'arabam.com';
  fetchedAt: string;
  searchUrl: string;
}

// ============================================================================
// TIRE RESEARCH TYPES
// ============================================================================

/**
 * Tire research response from AI
 */
export interface TireResearchData {
  standard_size: string;
  alternative_sizes: string[];
  recommended_pressure: {
    front: string;
    rear: string;
  };
  recommended_brands: TireBrandRecommendation[];
  seasonal_recommendations: {
    summer: string;
    winter: string;
    all_season: string;
  };
  maintenance_tips: string[];
}

export interface TireBrandRecommendation {
  name: string;
  model: string;
  price_range: string;
  rating: number;
  features: string[];
}

// ============================================================================
// VEHICLE VALIDATION TYPES
// ============================================================================

/**
 * Vehicle validation result
 */
export interface ValidationResult {
  valid: boolean;
  production_years: ProductionYears | null;
  message: string | null;
}

export interface ProductionYears {
  start: number;
  end: number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Generic API error response
 */
export interface ApiErrorResponse {
  error: string;
  message?: string;
  statusCode?: number;
  details?: unknown;
}

/**
 * Generic API success response
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

/**
 * API response wrapper (union type)
 */
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Coordinates type
 */
export interface Coordinates {
  lat: number;
  lng: number;
  latitude?: number;
  longitude?: number;
}

/**
 * Date range type
 */
export interface DateRange {
  start: string | Date;
  end: string | Date;
}

/**
 * Pagination params
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  limit?: number;
  offset?: number;
}

/**
 * Sort params
 */
export interface SortParams {
  field: string;
  order: 'asc' | 'desc';
}
