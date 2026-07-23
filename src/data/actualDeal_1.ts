import { RawApiDeal, ExtractionData } from '../types';
import { mapRawApiToExtractionData } from './mapApiResponse';

export const RAW_DEAL_1: RawApiDeal = {
  dealName: { value: 'CREDIT AGREEMENT', pageNumber: 1, confidence: 0.95, sourceText: 'CREDIT AGREEMENT' },
  currency: { value: 'USD', pageNumber: 1, confidence: 0.95, sourceText: 'Five Million Dollars ($5,000,000.00)' },
  department: { value: null, pageNumber: null, confidence: 0.0, sourceText: '' },
  branch: { value: null, pageNumber: null, confidence: 0.0, sourceText: '' },
  processingAreaCode: { value: null, pageNumber: null, confidence: 0.0, sourceText: '' },
  classification: { value: null, pageNumber: null, confidence: 0.0, sourceText: '' },
  agreementDate: { value: '2011-04-01', pageNumber: 1, confidence: 0.95, sourceText: 'as of April 1, 2011' },
  globalDealProposedCommitmentAmount: { value: 5000000, pageNumber: 1, confidence: 0.95, sourceText: 'Five Million Dollars ($5,000,000.00)' },
  expenseCode: { value: null, pageNumber: null, confidence: 0.0, sourceText: '' },
  dealInternalId: null,
  dealTrackingNumber: '',
  administrativeAgent: {
    customerExternalId: { value: null, pageNumber: null, confidence: 0.0, sourceText: '' },
    dealAdminServicingGroup: {
      profileType: { value: 'Lender', pageNumber: 1, confidence: 0.9, sourceText: 'WELLS FARGO BANK, NATIONAL ASSOCIATION ("Bank")' },
    },
  },
  dealBorrower: {
    customerExternalId: { value: null, pageNumber: null, confidence: 0.0, sourceText: '' },
  },
  borrowerIndicator: 'Y',
  isDistressed: 'N',
  interestPricing: [],
  circleFinalStatusCode: 'OPSA',
  price: 1,
  facilities: [
    {
      facilityRid: null,
      facilityInternalId: null,
      facilityName: { value: 'Line of Credit', pageNumber: 1, confidence: 0.95, sourceText: 'SECTION 1.1. LINE OF CREDIT. (a) Line of Credit.' },
      facilityType: { value: 'Revolving Credit', pageNumber: 1, confidence: 0.9, sourceText: 'Borrower may from time to time during the term of the Line of Credit borrow, partially or wholly repay its outstanding...' },
      proposedCommitmentAmount: { value: 5000000, pageNumber: 1, confidence: 0.95, sourceText: 'aggregate principal amount of Five Million Dollars ($5,000,000.00) ("Line of Credit")' },
      closingCommitment: { value: 5000000, pageNumber: 1, confidence: 0.95, sourceText: 'aggregate principal amount of Five Million Dollars ($5,000,000.00)' },
      agreementDate: { value: '2011-04-01', pageNumber: 1, confidence: 0.9, sourceText: 'THIS CREDIT AGREEMENT (this "Agreement") is entered into as of April 1, 2011' },
      effectiveDate: { value: null, pageNumber: null, confidence: 0.0, sourceText: '' },
      expiryDate: { value: '2012-04-01', pageNumber: 1, confidence: 0.95, sourceText: 'up to and including April 1, 2012' },
      finalMaturityDate: { value: '2012-04-01', pageNumber: 1, confidence: 0.95, sourceText: 'up to and including April 1, 2012' },
      globalNewAmount: null,
      risk: { riskTypeCode: { value: null, pageNumber: null, confidence: 0.0, sourceText: '' } },
      loanPurpose: { loanPurposeCode: { value: 'Working Capital', pageNumber: 1, confidence: 0.95, sourceText: "finance Borrower's working capital requirements" } },
      facilityInterestPricingList: [],
      facilitySubLimit: [],
    },
  ],
  tradeList: [],
  version: '1.0',
};

export const DEFAULT_FILE_NAME = 'Credit_Agreement_Wells_Fargo_2011.pdf';
export const DEFAULT_DEAL_NAME = RAW_DEAL_1.dealName.value ?? 'CREDIT AGREEMENT';
export const DEFAULT_LENDER = 'WELLS FARGO BANK, NATIONAL ASSOCIATION';
export const DEFAULT_AGREEMENT_DATE = 'April 1, 2011';
export const DEFAULT_TOTAL_AMOUNT = '$5,000,000 USD';

export const ACTUAL_DEAL_1_EXTRACTION_DATA: ExtractionData = mapRawApiToExtractionData(RAW_DEAL_1, {
  uuid: 'actual-deal-1-uuid-001',
  fileName: DEFAULT_FILE_NAME,
  fileSize: 'N/A',
  pageCount: 1,
});
