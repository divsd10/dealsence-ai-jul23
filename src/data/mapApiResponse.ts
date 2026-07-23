import { RawApiDeal, RawApiFacility, RawApiField, ExtractionData, DealAttribute, AttributeCategory, FacilityGroup } from '../types';

type FieldMeta = {
  value: unknown;
  pageNumber: number;
  confidence: number;
  sourceText: string;
};

function pickPrimitiveFromObject(obj: Record<string, unknown>): string | number | null {
  const preferredKeys = ['text', 'name', 'label', 'code', 'id', 'currency'];
  for (const key of preferredKeys) {
    const v = obj[key];
    if (typeof v === 'string' || typeof v === 'number') return v;
  }
  for (const v of Object.values(obj)) {
    if (typeof v === 'string' || typeof v === 'number') return v;
  }
  return null;
}

function unwrapField(input: unknown, fallbackSourceText = ''): FieldMeta {
  let current = input;
  let pageNumber = 1;
  let confidence = 1;
  let sourceText = fallbackSourceText;

  // Some API variants nest field payloads inside repeated `value` wrappers.
  for (let depth = 0; depth < 6; depth += 1) {
    if (!current || typeof current !== 'object') break;
    const obj = current as Record<string, unknown>;

    if (typeof obj.pageNumber === 'number') pageNumber = obj.pageNumber;
    if (typeof obj.confidence === 'number') confidence = obj.confidence;
    if (typeof obj.sourceText === 'string' && obj.sourceText.trim()) sourceText = obj.sourceText;

    if (!('value' in obj)) break;
    current = obj.value;
  }

  return { value: current, pageNumber, confidence, sourceText };
}

function asAmountField(value: unknown, fallbackSourceText = ''): RawApiField<string | number> {
  const field = unwrapField(value, fallbackSourceText);
  const normalizedValue =
    field.value && typeof field.value === 'object'
      ? pickPrimitiveFromObject(field.value as Record<string, unknown>)
      : field.value;
  return {
    value: normalizedValue === undefined ? null : (normalizedValue as string | number | null),
    pageNumber: field.pageNumber,
    confidence: field.confidence,
    sourceText: field.sourceText,
  };
}

function asStringField(value: unknown, fallbackSourceText = ''): RawApiField {
  const field = unwrapField(value, fallbackSourceText);
  const primitiveValue =
    field.value && typeof field.value === 'object'
      ? pickPrimitiveFromObject(field.value as Record<string, unknown>)
      : field.value;
  return {
    value:
      primitiveValue === null || primitiveValue === undefined
        ? null
        : typeof primitiveValue === 'string' || typeof primitiveValue === 'number'
        ? String(primitiveValue)
        : null,
    pageNumber: field.pageNumber,
    confidence: field.confidence,
    sourceText: field.sourceText,
  };
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'N/A';
  const trimmed = dateStr.trim();
  if (!trimmed) return 'N/A';

  const normalizedInput = /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? `${trimmed}T00:00:00` : trimmed;
  const d = new Date(normalizedInput);
  if (Number.isNaN(d.getTime())) return trimmed;

  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function formatAmount(amount: string | number | null | undefined): string {
  if (amount === null || amount === undefined) return 'N/A';
  if (typeof amount === 'string') {
    const trimmed = amount.trim();
    if (!trimmed) return 'N/A';
    // Keep API-provided currency strings as-is (e.g. "USD 5,000,000.00").
    if (/^[A-Za-z]{3}\s/.test(trimmed) || trimmed.includes('$')) return trimmed;
    const parsed = Number(trimmed.replace(/[^\d.-]/g, ''));
    if (Number.isNaN(parsed)) return trimmed;
    return `$${parsed.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} USD`;
  }
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

function normalizeRawApiDeal(rawInput: unknown): RawApiDeal {
  const payload = (rawInput ?? {}) as Record<string, unknown>;
  const maybeMetadataDeal = payload.deal && typeof payload.deal === 'object' ? (payload.deal as Record<string, unknown>) : payload;

  const facilitiesSource = Array.isArray(maybeMetadataDeal.facilities)
    ? maybeMetadataDeal.facilities
    : Array.isArray(maybeMetadataDeal.facilityList)
    ? maybeMetadataDeal.facilityList
    : [];

  const normalizedFacilities: RawApiFacility[] = facilitiesSource.map((f, idx) => {
    const fac = (f ?? {}) as Record<string, unknown>;
    return {
      facilityRid: null,
      facilityInternalId: null,
      facilityName: asStringField(fac.facilityName ?? `Facility ${idx + 1}`),
      facilityType: asStringField(fac.facilityType ?? fac.facilityName ?? 'N/A'),
      proposedCommitmentAmount: asAmountField(fac.proposedCommitmentAmount),
      closingCommitment: asAmountField(fac.closingCommitment),
      agreementDate: asStringField(fac.agreementDate),
      effectiveDate: asStringField(fac.effectiveDate),
      expiryDate: asStringField(fac.expiryDate),
      finalMaturityDate: asStringField(fac.finalMaturityDate),
      globalNewAmount: null,
      risk: { riskTypeCode: asStringField((fac.risk as Record<string, unknown> | undefined)?.riskTypeCode) },
      loanPurpose: { loanPurposeCode: asStringField((fac.loanPurpose as Record<string, unknown> | undefined)?.loanPurposeCode) },
      facilityInterestPricingList: Array.isArray(fac.facilityInterestPricingList) ? fac.facilityInterestPricingList : [],
      facilitySubLimit: Array.isArray(fac.facilitySubLimit) ? fac.facilitySubLimit : [],
    };
  });

  const adminSource = (maybeMetadataDeal.administrativeAgent as Record<string, unknown> | undefined)
    ?? (maybeMetadataDeal.dealAdminAgent as Record<string, unknown> | undefined)
    ?? {};

  return {
    dealName: asStringField(maybeMetadataDeal.dealName),
    currency: asStringField(maybeMetadataDeal.currency),
    department: asStringField(maybeMetadataDeal.department),
    branch: asStringField(maybeMetadataDeal.branch),
    processingAreaCode: asStringField(maybeMetadataDeal.processingAreaCode),
    classification: asStringField(maybeMetadataDeal.classification),
    agreementDate: asStringField(maybeMetadataDeal.agreementDate),
    globalDealProposedCommitmentAmount: asAmountField(maybeMetadataDeal.globalDealProposedCommitmentAmount),
    expenseCode: asStringField(maybeMetadataDeal.expenseCode),
    dealInternalId: null,
    dealTrackingNumber: String(maybeMetadataDeal.dealTrackingNumber ?? ''),
    administrativeAgent: {
      customerExternalId: asStringField((adminSource.customerExternalId as unknown) ?? null),
      dealAdminServicingGroup: {
        profileType: asStringField(((adminSource.dealAdminServicingGroup as Record<string, unknown> | undefined)?.profileType as unknown) ?? null),
      },
    },
    dealBorrower: {
      customerExternalId: asStringField(((maybeMetadataDeal.dealBorrower as Record<string, unknown> | undefined)?.customerExternalId as unknown) ?? null),
    },
    borrowerIndicator: String(maybeMetadataDeal.borrowerIndicator ?? ''),
    isDistressed: String(maybeMetadataDeal.isDistressed ?? ''),
    interestPricing: Array.isArray(maybeMetadataDeal.interestPricing) ? maybeMetadataDeal.interestPricing : [],
    circleFinalStatusCode: String(maybeMetadataDeal.circleFinalStatusCode ?? ''),
    price: typeof maybeMetadataDeal.price === 'number' ? maybeMetadataDeal.price : 0,
    facilities: normalizedFacilities,
    tradeList: Array.isArray(maybeMetadataDeal.tradeList) ? maybeMetadataDeal.tradeList : [],
    version: String(maybeMetadataDeal.version ?? 'v1'),
  };
}

function guessCategory(key: string): AttributeCategory {
  const normalized = key.toLowerCase();
  if (normalized.includes('date') || normalized.includes('rate') || normalized.includes('margin')) return 'DATES & RATES';
  if (normalized.includes('amount') || normalized.includes('price') || normalized.includes('commitment') || normalized.includes('currency')) return 'FINANCIAL';
  if (normalized.includes('legal') || normalized.includes('governance') || normalized.includes('compliance') || normalized.includes('covenant')) return 'LEGAL & GOVERNANCE';
  return 'GENERAL';
}

export function mapRawApiToExtractionData(
  rawInput: RawApiDeal | Record<string, unknown>,
  overrides?: { uuid?: string; fileName?: string; fileSize?: string; pageCount?: number }
): ExtractionData {
  // ─── Extract from raw API payload BEFORE normalization to catch all fields ────
  const rawPayload = (rawInput ?? {}) as Record<string, unknown>;
  const dealPayload = rawPayload.deal && typeof rawPayload.deal === 'object'
    ? (rawPayload.deal as Record<string, unknown>)
    : rawPayload;

  const raw = normalizeRawApiDeal(rawInput);
  const attrs: DealAttribute[] = [];

  const add = (field: RawApiField<string | number> | undefined, id: string, label: string, category: AttributeCategory, display?: string) => {
    if (!field) return;
    const a = makeAttr(field as RawApiField<string | number>, id, label, category, display);
    if (a) attrs.push(a);
  };

  // ─── Dynamically extract ALL raw deal-level fields (no hardcoding) ────
  // Keys to skip: nested objects, arrays, internal metadata
  const skipKeys = new Set([
    'dealInternalId',
    'facilities',
    'facilityList',
    'tradeList',
    'administrativeAgent',
    'dealAdminAgent',
    'dealBorrower',
    'interestPricing',
    'interestPricingOptions',
    'version',
  ]);

  // Iterate over ALL raw API deal payload keys and extract any field with .value
  Object.entries(dealPayload).forEach(([key, field]) => {
    if (skipKeys.has(key)) return;
    if (!field || typeof field !== 'object' || !('value' in field)) return;

    const unwrapped = asStringField(field);
    const category = guessCategory(key);
    const label = key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (c) => c.toUpperCase())
      .trim();
    const id = `deal_${key}`;

    // NO formatting — show raw value as-is
    add(unwrapped, id, label, category);
  });

  // ─── Extract nested fields from dealBorrower (e.g., customerExternalId) ────
  const dealBorrowerObj = dealPayload.dealBorrower && typeof dealPayload.dealBorrower === 'object'
    ? (dealPayload.dealBorrower as Record<string, unknown>)
    : null;
  if (dealBorrowerObj) {
    Object.entries(dealBorrowerObj).forEach(([key, field]) => {
      if (!field || typeof field !== 'object' || !('value' in field)) return;
      const unwrapped = asStringField(field);
      const label = `Borrower ${key.replace(/([A-Z])/g, ' $1').trim()}`;
      const id = `borrower_${key}`;
      add(unwrapped, id, label, 'GENERAL');
    });
  }

  // ─── Extract nested fields from dealAdminAgent (e.g., dealAdminServicingGroup) ────
  const dealAdminAgentObj = dealPayload.dealAdminAgent && typeof dealPayload.dealAdminAgent === 'object'
    ? (dealPayload.dealAdminAgent as Record<string, unknown>)
    : null;
  if (dealAdminAgentObj) {
    Object.entries(dealAdminAgentObj).forEach(([key, nested]) => {
      if (!nested || typeof nested !== 'object') return;
      const nestedObj = nested as Record<string, unknown>;
      Object.entries(nestedObj).forEach(([subkey, field]) => {
        if (!field || typeof field !== 'object' || !('value' in field)) return;
        const unwrapped = asStringField(field);
        const label = `Admin Agent ${key} ${subkey}`.replace(/([A-Z])/g, ' $1').trim();
        const id = `admin_agent_${key}_${subkey}`;
        add(unwrapped, id, label, 'GENERAL');
      });
    });
  }

  // ─── Extract interestPricingOptions array if present ────
  const pricingOpts = Array.isArray(dealPayload.interestPricingOptions) ? dealPayload.interestPricingOptions : [];
  pricingOpts.forEach((opt, idx) => {
    if (opt && typeof opt === 'object') {
      const optStr = JSON.stringify(opt);
      attrs.push({
        id: `interest_pricing_${idx}`,
        label: `Interest Pricing Option ${idx + 1}`,
        value: optStr,
        originalValue: optStr,
        confidence: 100,
        page: 1,
        excerpt: optStr,
        category: 'FINANCIAL',
        status: 'PENDING',
      });
    }
  });

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
