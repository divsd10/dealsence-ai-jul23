import { ExtractionData, CreatedDealRecord } from '../types';

export const DEFAULT_FILE_NAME = 'ABC_Manufacturing_Credit_Agreement_2025.pdf';
export const DEFAULT_BORROWER = 'ABC Manufacturing Ltd';
export const DEFAULT_DEAL_NAME = 'ABC Manufacturing Term Loan';
export const DEFAULT_LENDER = 'XYZ Commercial Bank';

export const SAMPLE_EXTRACTION_DATA: ExtractionData = {
  uuid: 'sample-uuid-2025-001',
  fileName: DEFAULT_FILE_NAME,
  fileSize: '3.32 MB',
  pageCount: 20,
  documentType: 'Syndicated Term Loan Agreement',
  borrowerName: DEFAULT_BORROWER,
  kycApproved: true,
  extractedAt: new Date().toISOString(),
  attributes: [
    {
      id: 'deal_name',
      label: 'Deal Name',
      value: 'ABC Manufacturing Term Loan',
      originalValue: 'ABC Manufacturing Term Loan',
      confidence: 98,
      page: 1,
      excerpt: '"ABC Manufacturing Term Loan"',
      category: 'GENERAL',
      status: 'PENDING',
      highlightCoordinates: { topPercent: 28, leftPercent: 15, widthPercent: 70, heightPercent: 6 }
    },
    {
      id: 'borrower_name',
      label: 'Borrower',
      value: 'ABC Manufacturing Ltd',
      originalValue: 'ABC Manufacturing Ltd',
      confidence: 97,
      page: 1,
      excerpt: '"ABC Manufacturing Ltd"',
      category: 'GENERAL',
      status: 'PENDING',
      highlightCoordinates: { topPercent: 18, leftPercent: 15, widthPercent: 70, heightPercent: 5 }
    },
    {
      id: 'lender_name',
      label: 'Lender / Admin Agent',
      value: 'XYZ Commercial Bank',
      originalValue: 'XYZ Commercial Bank',
      confidence: 99,
      page: 1,
      excerpt: '"XYZ Commercial Bank"',
      category: 'GENERAL',
      status: 'PENDING',
      highlightCoordinates: { topPercent: 22, leftPercent: 15, widthPercent: 70, heightPercent: 5 }
    },
    {
      id: 'facility_amount',
      label: 'Total Aggregate Amount',
      value: '$250,000,000 USD',
      originalValue: '$250,000,000 USD',
      confidence: 99,
      page: 2,
      excerpt: '"aggregate principal sum set forth herein equal to USD 250,000,000 (Two Hundred Fifty Million United States Dollars)"',
      category: 'FINANCIAL',
      status: 'PENDING',
      highlightCoordinates: { topPercent: 35, leftPercent: 15, widthPercent: 70, heightPercent: 6 }
    },
    {
      id: 'effective_date',
      label: 'Effective Date',
      value: 'December 31, 2025',
      originalValue: 'December 31, 2025',
      confidence: 96,
      page: 1,
      excerpt: '"THIS CREDIT AGREEMENT is dated as of December 31, 2025"',
      category: 'DATES & RATES',
      status: 'PENDING',
      highlightCoordinates: { topPercent: 15, leftPercent: 15, widthPercent: 70, heightPercent: 4 }
    },
    {
      id: 'maturity_date',
      label: 'Maturity Date',
      value: 'December 31, 2030',
      originalValue: 'December 31, 2030',
      confidence: 95,
      page: 3,
      excerpt: '"Maturity Date means the fifth anniversary of the Effective Date, being December 31, 2030"',
      category: 'DATES & RATES',
      status: 'PENDING',
      highlightCoordinates: { topPercent: 40, leftPercent: 15, widthPercent: 70, heightPercent: 5 }
    },
    {
      id: 'interest_benchmark',
      label: 'Interest Rate Benchmark',
      value: 'Term SOFR + 2.25%',
      originalValue: 'Term SOFR + 2.25%',
      confidence: 94,
      page: 4,
      excerpt: '"Loans hereunder shall bear interest on the outstanding principal balance thereof at an annual rate equal to Term SOFR plus 2.25%"',
      category: 'DATES & RATES',
      status: 'PENDING',
      highlightCoordinates: { topPercent: 25, leftPercent: 15, widthPercent: 70, heightPercent: 6 }
    },
    {
      id: 'governing_law',
      label: 'Governing Law',
      value: 'State of Delaware',
      originalValue: 'State of Delaware',
      confidence: 98,
      page: 1,
      excerpt: '"a corporation organized under the laws of Delaware"',
      category: 'LEGAL & GOVERNANCE',
      status: 'PENDING',
      highlightCoordinates: { topPercent: 19, leftPercent: 15, widthPercent: 70, heightPercent: 4 }
    },
    {
      id: 'leverage_ratio',
      label: 'Max Consolidated Leverage Ratio',
      value: '3.50x EBITDA',
      originalValue: '3.50x EBITDA',
      confidence: 92,
      page: 7,
      excerpt: '"The Borrower shall not permit the Consolidated Net Leverage Ratio as of the last day of any fiscal quarter to exceed 3.50 to 1.00"',
      category: 'FINANCIAL',
      status: 'PENDING',
      highlightCoordinates: { topPercent: 50, leftPercent: 15, widthPercent: 70, heightPercent: 6 }
    },
    {
      id: 'interest_coverage',
      label: 'Min Interest Coverage Ratio',
      value: '2.50x EBITDA',
      originalValue: '2.50x EBITDA',
      confidence: 91,
      page: 7,
      excerpt: '"The Borrower shall maintain a Consolidated Interest Coverage Ratio of not less than 2.50 to 1.00 at the end of each quarter"',
      category: 'FINANCIAL',
      status: 'PENDING',
      highlightCoordinates: { topPercent: 62, leftPercent: 15, widthPercent: 70, heightPercent: 6 }
    },
    {
      id: 'commitment_fee',
      label: 'Commitment Fee Rate',
      value: '0.35% per annum',
      originalValue: '0.35% per annum',
      confidence: 96,
      page: 5,
      excerpt: '"A commitment fee calculated at 0.35% per annum on the average daily undrawn balance of the Revolving Credit Facility"',
      category: 'FINANCIAL',
      status: 'PENDING',
      highlightCoordinates: { topPercent: 30, leftPercent: 15, widthPercent: 70, heightPercent: 5 }
    },
    {
      id: 'jurisdiction_court',
      label: 'Jurisdiction',
      value: 'New York State & Federal Courts',
      originalValue: 'New York State & Federal Courts',
      confidence: 95,
      page: 19,
      excerpt: '"The parties submit to the exclusive jurisdiction of the state and federal courts located in New York County, New York"',
      category: 'LEGAL & GOVERNANCE',
      status: 'PENDING',
      highlightCoordinates: { topPercent: 70, leftPercent: 15, widthPercent: 70, heightPercent: 5 }
    }
  ],
  facilities: [
    {
      facilityName: 'Facility A: Senior Term Loan',
      facilityType: 'Term Loan',
      amount: '$150,000,000 USD',
      interestMargin: 'SOFR + 2.25%',
      maturityDate: 'December 31, 2030',
      attributes: [
        {
          id: 'fac_a_amt',
          label: 'Tranche A Commitment',
          value: '$150,000,000 USD',
          originalValue: '$150,000,000 USD',
          confidence: 99,
          page: 2,
          excerpt: '"Term Loan Facility Commitment in an amount equal to USD 150,000,000"',
          category: 'FACILITY',
          status: 'PENDING',
          isFacilityItem: true,
          facilityName: 'Facility A: Senior Term Loan'
        },
        {
          id: 'fac_a_amort',
          label: 'Tranche A Amortization Schedule',
          value: '1.25% per quarter (5.00% p.a.)',
          originalValue: '1.25% per quarter (5.00% p.a.)',
          confidence: 93,
          page: 3,
          excerpt: '"Principal payable in quarterly installments equal to 1.25% of original balance with balloon payment at Maturity"',
          category: 'FACILITY',
          status: 'PENDING',
          isFacilityItem: true,
          facilityName: 'Facility A: Senior Term Loan'
        }
      ]
    },
    {
      facilityName: 'Facility B: Revolving Credit Facility',
      facilityType: 'Revolving Line',
      amount: '$100,000,000 USD',
      interestMargin: 'SOFR + 1.75%',
      maturityDate: 'December 31, 2028',
      attributes: [
        {
          id: 'fac_b_amt',
          label: 'Tranche B Commitment',
          value: '$100,000,000 USD',
          originalValue: '$100,000,000 USD',
          confidence: 98,
          page: 2,
          excerpt: '"Revolving Credit Facility Commitment in an amount equal to USD 100,000,000"',
          category: 'FACILITY',
          status: 'PENDING',
          isFacilityItem: true,
          facilityName: 'Facility B: Revolving Credit Facility'
        },
        {
          id: 'fac_b_lc',
          label: 'Letter of Credit Sublimit',
          value: '$15,000,000 USD',
          originalValue: '$15,000,000 USD',
          confidence: 94,
          page: 4,
          excerpt: '"Subject to an L/C Sublimit of USD 15,000,000 available to the Borrower"',
          category: 'FACILITY',
          status: 'PENDING',
          isFacilityItem: true,
          facilityName: 'Facility B: Revolving Credit Facility'
        }
      ]
    }
  ]
};

export const MOCK_EXISTING_DEALS: CreatedDealRecord[] = [
  {
    dealId: 'DEAL-2026-8942',
    uuid: 'sample-uuid-2025-001',
    borrowerName: 'ABC Manufacturing Ltd',
    dealName: 'ABC Manufacturing Term Loan',
    fileName: 'ABC_Manufacturing_Credit_Agreement_2025.pdf',
    effectiveDate: 'December 31, 2025',
    totalAmount: '$250,000,000 USD',
    createdAt: '23/07/2026 at 17:33:44',
    totalFields: 12,
    approvedFields: 12,
    rejectedFields: 0,
    pendingFields: 0,
    status: 'SIGNED_OFF',
    attributes: {
      'Deal Name': 'ABC Manufacturing Term Loan',
      'Borrower': 'ABC Manufacturing Ltd',
      'Lender': 'XYZ Commercial Bank',
      'Total Aggregate Amount': '$250,000,000 USD',
      'Effective Date': 'December 31, 2025',
      'Maturity Date': 'December 31, 2030',
      'Interest Rate Benchmark': 'Term SOFR + 2.25%',
      'Governing Law': 'State of Delaware'
    }
  },
  {
    dealId: 'DEAL-2026-7811',
    uuid: 'sample-uuid-2025-002',
    borrowerName: 'Apex Logistics Global Corp',
    dealName: 'Apex Revolving & Expansion Facility',
    fileName: 'Apex_Logistics_Syndicated_Loan.pdf',
    effectiveDate: 'March 15, 2026',
    totalAmount: '$185,000,000 USD',
    createdAt: '19/07/2026 at 11:20:10',
    totalFields: 14,
    approvedFields: 14,
    rejectedFields: 0,
    pendingFields: 0,
    status: 'SIGNED_OFF',
    attributes: {
      'Deal Name': 'Apex Revolving & Expansion Facility',
      'Borrower': 'Apex Logistics Global Corp',
      'Lender': 'JPMorgan Chase & Co.',
      'Total Aggregate Amount': '$185,000,000 USD'
    }
  },
  {
    dealId: 'DEAL-2026-6409',
    uuid: 'sample-uuid-2025-003',
    borrowerName: 'BioHealth Tech Inc.',
    dealName: 'BioHealth Senior Secured Credit Facility',
    fileName: 'BioHealth_Credit_Agreement_Final.pdf',
    effectiveDate: 'January 10, 2026',
    totalAmount: '$95,000,000 USD',
    createdAt: '10/06/2026 at 14:45:00',
    totalFields: 10,
    approvedFields: 10,
    rejectedFields: 0,
    pendingFields: 0,
    status: 'SIGNED_OFF',
    attributes: {
      'Deal Name': 'BioHealth Senior Secured Credit Facility',
      'Borrower': 'BioHealth Tech Inc.'
    }
  }
];

export const MOCK_PDF_PAGES: Record<number, { title: string; subtitle: string; content: string; fieldCount: number }> = {
  1: {
    title: 'CONFIDENTIAL CREDIT AGREEMENT',
    subtitle: 'PREAMBLE AND PARTIES',
    fieldCount: 3,
    content: `THIS CREDIT AGREEMENT is dated as of December 31, 2025 (the "Agreement"), among ABC MANUFACTURING LTD, a corporation organized under the laws of Delaware (the "Borrower"), XYZ COMMERCIAL BANK, as Administrative Agent and Issuing Bank, and each lender from time to time party hereto (collectively, the "Lenders").

RECITALS
WHEREAS, the Borrower has requested that Lenders establish a senior secured facility designated as the ABC Manufacturing Term Loan in the aggregate principal sum set forth herein to refinance existing debt and fund working capital needs.

ARTICLE I: DEFINITIONS
Section 1.01. Defined Terms. As used in this Agreement, the following terms have the meanings specified below:
"Borrower" means ABC Manufacturing Ltd, together with its permitted successors and assigns under Section 9.04.
"Governing Law" shall be construed in accordance with and governed by the law of the State of Delaware.`
  },
  2: {
    title: 'ARTICLE II: THE CREDITS & FACILITIES',
    subtitle: 'Section 2.01. Facility Structure and Amounts',
    fieldCount: 2,
    content: `Section 2.01. Commitment Amounts. The Lenders agree to make available a senior secured Term Loan facility (the "Term Loan Facility") to the Borrower subject to the satisfaction of conditions precedent set forth in Article IV.

The aggregate principal sum of the credit facilities under this Agreement shall equal $250,000,000 USD (Two Hundred Fifty Million United States Dollars).

(a) Tranche A Senior Term Loan Commitment: $150,000,000 USD.
(b) Tranche B Revolving Credit Commitment: $100,000,000 USD.`
  },
  3: {
    title: 'ARTICLE III: REPAYMENT AND MATURITY',
    subtitle: 'Section 3.01. Maturity Date and Amortization',
    fieldCount: 1,
    content: `Section 3.01. Maturity.
The principal balance of the Term Loan Facility, together with all accrued and unpaid interest thereon, shall be fully due and payable on the Maturity Date, being December 31, 2030 (the fifth anniversary of the Effective Date).

Section 3.02. Mandatory Amortization.
Principal shall be payable in quarterly installments equal to 1.25% of the original principal balance ($1,875,000 per quarter) on the last business day of each March, June, September, and December.`
  },
  4: {
    title: 'ARTICLE IV: INTEREST RATES AND BENCHMARKS',
    subtitle: 'Section 4.01. Interest Rate Determination',
    fieldCount: 1,
    content: `Section 4.01. Benchmark Rate.
Loans hereunder shall bear interest on the outstanding principal balance thereof at an annual rate equal to Term SOFR plus 2.25% per annum.

Section 4.02. L/C Sublimit.
The Revolving Credit Facility shall include a sublimit for Letters of Credit up to an aggregate face amount of $15,000,000 USD.`
  },
  5: {
    title: 'ARTICLE V: FEES AND COMMISSIONS',
    subtitle: 'Section 5.01. Commitment Fees and Upfront Fees',
    fieldCount: 1,
    content: `Section 5.01. Undrawn Commitment Fee.
The Borrower agrees to pay to the Administrative Agent for the account of each Revolving Lender a commitment fee calculated at 0.35% per annum on the average daily undrawn balance of the Revolving Credit Facility.`
  },
  7: {
    title: 'ARTICLE VII: FINANCIAL COVENANTS',
    subtitle: 'Section 7.01. Leverage & Coverage Ratios',
    fieldCount: 2,
    content: `Section 7.01. Financial Covenants.
So long as any Lender shall have any Commitment hereunder:
(a) Consolidated Net Leverage Ratio: The Borrower shall not permit the Consolidated Net Leverage Ratio as of the last day of any fiscal quarter to exceed 3.50 to 1.00.
(b) Consolidated Interest Coverage Ratio: The Borrower shall maintain a Consolidated Interest Coverage Ratio of not less than 2.50 to 1.00 at the end of each quarter.`
  },
  19: {
    title: 'ARTICLE XIX: MISCELLANEOUS & JURISDICTION',
    subtitle: 'Section 19.01. Submission to Jurisdiction',
    fieldCount: 1,
    content: `Section 19.01. Governing Law & Jurisdiction.
This Agreement shall be governed by Delaware law. The parties submit to the exclusive jurisdiction of the state and federal courts located in New York County, New York for any legal proceedings originating hereunder.`
  }
};
