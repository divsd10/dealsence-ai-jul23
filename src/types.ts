export type AttributeCategory = 'GENERAL' | 'FINANCIAL' | 'DATES & RATES' | 'LEGAL & GOVERNANCE' | 'FACILITY';
export type AttributeStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface DealAttribute {
  id: string;
  label: string;
  value: string;
  originalValue: string;
  confidence: number;
  page: number;
  excerpt: string;
  category: AttributeCategory;
  status: AttributeStatus;
  isFacilityItem?: boolean;
  facilityName?: string;
  highlightCoordinates?: {
    topPercent: number;
    leftPercent: number;
    widthPercent: number;
    heightPercent: number;
  };
}

export interface FacilityGroup {
  facilityName: string;
  facilityType: string;
  amount: string;
  interestMargin: string;
  maturityDate: string;
  attributes: DealAttribute[];
}

export interface ExtractionData {
  uuid: string;
  fileName: string;
  fileSize: string;
  pageCount: number;
  documentType: string;
  borrowerName: string;
  kycApproved: boolean;
  extractedAt: string;
  attributes: DealAttribute[];
  facilities?: FacilityGroup[];
}

export interface WorkflowStatusResponse {
  uuid: string;
  status: 'UPLOADING' | 'PROCESSING' | 'HUMAN APPROVED';
  step: number;
  totalSteps: number;
  message: string;
  percentage: number;
  userName?: string;
  updatedAt?: string;
}

export interface CreateDealResponse {
  dealId: string;
  status: string;
  message: string;
  timestamp: string;
  deal: CreatedDealRecord;
}

export interface CreatedDealRecord {
  dealId: string;
  uuid: string;
  borrowerName: string;
  dealName: string;
  fileName: string;
  effectiveDate: string;
  totalAmount: string;
  createdAt: string;
  totalFields: number;
  approvedFields: number;
  rejectedFields: number;
  pendingFields: number;
  status: 'SIGNED_OFF' | 'ACTIVE' | 'UNDER_REVIEW';
  attributes: Record<string, string>;
}

export interface UploadResponse {
  uuid: string;
  status: string;
  message: string;
  fileName: string;
  fileSize: string;
  userName: string;
}
