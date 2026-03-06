// OpenChargeMap API Response Types

export interface OCMConnection {
  ID: number;
  ConnectionTypeID: number;
  ConnectionType: {
    ID: number;
    Title: string;
    FormalName?: string;
    IsDiscontinued?: boolean;
    IsObsolete?: boolean;
  };
  StatusTypeID?: number;
  StatusType?: {
    ID: number;
    Title: string;
    IsOperational?: boolean;
  };
  LevelID?: number;
  Level?: {
    ID: number;
    Title: string;
    Comments?: string;
    IsFastChargeCapable?: boolean;
  };
  Amps?: number;
  Voltage?: number;
  PowerKW?: number;
  CurrentTypeID?: number;
  CurrentType?: {
    ID: number;
    Title: string;
    Description?: string;
  };
  Quantity?: number;
  Comments?: string;
}

export interface OCMOperator {
  ID: number;
  Title: string;
  WebsiteURL?: string;
  Comments?: string;
  PhonePrimaryContact?: string;
  PhoneSecondaryContact?: string;
  IsPrivateIndividual?: boolean;
  ContactEmail?: string;
  FaultReportEmail?: string;
}

export interface OCMAddressInfo {
  ID: number;
  Title: string;
  AddressLine1?: string;
  AddressLine2?: string;
  Town?: string;
  StateOrProvince?: string;
  Postcode?: string;
  CountryID: number;
  Country: {
    ID: number;
    ISOCode: string;
    ContinentCode?: string;
    Title: string;
  };
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

export interface OCMStation {
  ID: number;
  UUID: string;
  ParentChargePointID?: number;
  DataProviderID: number;
  DataProvider: {
    ID: number;
    Title: string;
    WebsiteURL?: string;
    Comments?: string;
    DataProviderStatusType?: {
      ID: number;
      Title: string;
      IsProviderEnabled?: boolean;
    };
    IsRestrictedEdit?: boolean;
    IsOpenDataLicensed?: boolean;
    IsApprovedImport?: boolean;
    License?: string;
    DateLastImported?: string;
  };
  OperatorID?: number;
  OperatorInfo?: OCMOperator;
  UsageTypeID?: number;
  UsageType?: {
    ID: number;
    Title: string;
    IsPayAtLocation?: boolean;
    IsMembershipRequired?: boolean;
    IsAccessKeyRequired?: boolean;
  };
  UsageCost?: string;
  AddressInfo: OCMAddressInfo;
  Connections: OCMConnection[];
  NumberOfPoints?: number;
  GeneralComments?: string;
  DatePlanned?: string;
  DateLastConfirmed?: string;
  DateLastStatusUpdate?: string;
  DateCreated?: string;
  StatusTypeID?: number;
  StatusType?: {
    ID: number;
    Title: string;
    IsOperational?: boolean;
    IsUserSelectable?: boolean;
  };
  SubmissionStatusTypeID?: number;
  SubmissionStatus?: {
    ID: number;
    Title: string;
    IsLive?: boolean;
  };
  UserComments?: Array<{
    ID: number;
    Comment: string;
    Rating?: number;
    UserName?: string;
    DateCreated: string;
  }>;
  MediaItems?: Array<{
    ID: number;
    ItemURL: string;
    ItemThumbnailURL?: string;
    Comment?: string;
    IsEnabled?: boolean;
    DateCreated?: string;
  }>;
  IsRecentlyVerified?: boolean;
  DateLastVerified?: string;
}

export interface OCMFetchOptions {
  countryCode?: string;
  maxResults?: number;
  latitude?: number;
  longitude?: number;
  distanceKm?: number;
  compact?: boolean;
  verbose?: boolean;
}
