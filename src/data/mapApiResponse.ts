import { RawApiDeal, RawApiFacility, RawApiField, ExtractionData, DealAttribute, AttributeCategory, FacilityGroup } from '../types';

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function formatAmount(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return 'N/A';
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} USD`;
}

function toPercent(confidence: number): number {
  // API uses 0.0–1.0; UI expects 0–100
  return confidence <= 1 ? Math.round(confidence * 100) : Math.round(confidence);
}

function makeAttr(
  field: RawApiField<string | number>,
  id: string,
  label: string,
  category: AttributeCategory,
  displayValue?: string,
  facilityName?: string
): DealAttribute | null {
  if (field.value === null || field.value === undefined || field.value === '') return null;
  const val = displayValue ?? String(field.value);
  return {
    id,
    label,
    value: val,
    originalValue: val,
    confidence: toPercent(field.confidence),
    page: field.pageNumber ?? 1,
    excerpt: field.sourceText ? `"${field.sourceText}"` : '',
    category,
    status: 'PENDING',
    ...(facilityName ? { isFacilityItem: true, facilityName } : {}),
  };
}

function mapFacility(fac: RawApiFacility, idx: number): FacilityGroup {
  const facilityName = fac.facilityName?.value || `Facility ${idx + 1}`;
  const attrs: DealAttribute[] = [];

  const add = (field: RawApiField<string | number> | undefined, id: string, label: string, display?: string) => {
    if (!field) return;
    const a = makeAttr(field as RawApiField<string | number>, `fac_${idx}_${id}`, label, 'FACILITY', display, facilityName);
    if (a) attrs.push(a);
  };

  add(fac.facilityName, 'name', 'Facility Name');
  add(fac.facilityType, 'type', 'Facility Type');
  add(fac.proposedCommitmentAmount as unknown as RawApiField<string>, 'proposed_amount', 'Proposed Commitment Amount', formatAmount(fac.proposedCommitmentAmount?.value));
  add(fac.closingCommitment as unknown as RawApiField<string>, 'closing_commitment', 'Closing Commitment', formatAmount(fac.closingCommitment?.value));
  add(fac.agreementDate, 'agreement_date', 'Agreement Date', formatDate(fac.agreementDate?.value));
  if (fac.effectiveDate?.value) add(fac.effectiveDate, 'effective_date', 'Effective Date', formatDate(fac.effectiveDate.value));
  add(fac.expiryDate, 'expiry_date', 'Expiry Date', formatDate(fac.expiryDate?.value));
  add(fac.finalMaturityDate, 'maturity_date', 'Final Maturity Date', formatDate(fac.finalMaturityDate?.value));
  if (fac.loanPurpose?.loanPurposeCode?.value) add(fac.loanPurpose.loanPurposeCode, 'loan_purpose', 'Loan Purpose');
  if (fac.risk?.riskTypeCode?.value) add(fac.risk.riskTypeCode, 'risk_type', 'Risk Type Code');

  return {
    facilityName,
    facilityType: fac.facilityType?.value || 'N/A',
    amount: formatAmount(fac.proposedCommitmentAmount?.value),
    interestMargin: 'N/A',
    maturityDate: formatDate(fac.finalMaturityDate?.value),
    attributes: attrs,
  };
}

export function mapRawApiToExtractionData(
  raw: RawApiDeal,
  overrides?: { uuid?: string; fileName?: string; fileSize?: string; pageCount?: number }
): ExtractionData {
  const attrs: DealAttribute[] = [];

  const add = (field: RawApiField<string | number> | undefined, id: string, label: string, category: AttributeCategory, display?: string) => {
    if (!field) return;
    const a = makeAttr(field as RawApiField<string | number>, id, label, category, display);
    if (a) attrs.push(a);
  };

  add(raw.dealName, 'deal_name', 'Deal Name', 'GENERAL');
  add(raw.currency, 'currency', 'Currency', 'FINANCIAL');
  add(raw.agreementDate, 'agreement_date', 'Agreement Date', 'DATES & RATES', formatDate(raw.agreementDate?.value));
  add(
    raw.globalDealProposedCommitmentAmount as unknown as RawApiField<string>,
    'global_commitment_amount',
    'Global Proposed Commitment Amount',
    'FINANCIAL',
    formatAmount(raw.globalDealProposedCommitmentAmount?.value)
  );

  // Administrative Agent — parse name from sourceText
  const agentField = raw.administrativeAgent?.dealAdminServicingGroup?.profileType;
  if (agentField?.sourceText) {
    const agentName = agentField.sourceText.split('(')[0].replace(/"/g, '').trim();
    attrs.push({
      id: 'administrative_agent',
      label: 'Administrative Agent',
      value: agentName,
      originalValue: agentName,
      confidence: toPercent(agentField.confidence),
      page: agentField.pageNumber ?? 1,
      excerpt: `"${agentField.sourceText}"`,
      category: 'GENERAL',
      status: 'PENDING',
    });
  }

  if (raw.borrowerIndicator) {
    attrs.push({ id: 'borrower_indicator', label: 'Borrower Indicator', value: raw.borrowerIndicator, originalValue: raw.borrowerIndicator, confidence: 100, page: 1, excerpt: '', category: 'GENERAL', status: 'PENDING' });
  }
  if (raw.isDistressed) {
    attrs.push({ id: 'is_distressed', label: 'Is Distressed', value: raw.isDistressed, originalValue: raw.isDistressed, confidence: 100, page: 1, excerpt: '', category: 'GENERAL', status: 'PENDING' });
  }
  if (raw.circleFinalStatusCode) {
    attrs.push({ id: 'circle_final_status_code', label: 'Circle Final Status Code', value: raw.circleFinalStatusCode, originalValue: raw.circleFinalStatusCode, confidence: 100, page: 1, excerpt: '', category: 'GENERAL', status: 'PENDING' });
  }
  if (raw.price !== null && raw.price !== undefined) {
    attrs.push({ id: 'price', label: 'Price', value: String(raw.price), originalValue: String(raw.price), confidence: 100, page: 1, excerpt: '', category: 'FINANCIAL', status: 'PENDING' });
  }

  const facilities = (raw.facilities || []).map(mapFacility);

  return {
    uuid: overrides?.uuid ?? 'api-extracted-uuid',
    fileName: overrides?.fileName ?? `${raw.dealName?.value ?? 'Deal'}.pdf`,
    fileSize: overrides?.fileSize ?? 'N/A',
    pageCount: overrides?.pageCount ?? 1,
    documentType: 'Credit Agreement',
    borrowerName: raw.dealBorrower?.customerExternalId?.value ?? 'N/A',
    kycApproved: false,
    extractedAt: new Date().toISOString(),
    attributes: attrs,
    facilities,
  };
}
