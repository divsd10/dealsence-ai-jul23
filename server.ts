import express from 'express';
import path from 'path';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import { SAMPLE_EXTRACTION_DATA, MOCK_EXISTING_DEALS } from './src/data/sampleDeal.js';
import { CreatedDealRecord } from './src/types.js';

const app = express();
const PORT = 3000;

// Configure Multer for handling PDF file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS headers for local / external clients
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// In-memory state storage
interface JobState {
  uuid: string;
  fileName: string;
  fileSize: string;
  userName: string;
  step: number;
  totalSteps: number;
  status: 'UPLOADING' | 'PROCESSING' | 'HUMAN APPROVED';
  createdAt: number;
  stepMessages: string[];
}

const jobsStore: Record<string, JobState> = {};
const createdDealsStore: CreatedDealRecord[] = [...MOCK_EXISTING_DEALS];

const STEP_MESSAGES = [
  'Uploading credit agreement and validating signature...',
  'Performing high-precision OCR and document parsing...',
  'Extracting key financial terms, interest rates, and covenants...',
  'Parsing facility tranches and fee schedules...',
  'Mapping page references and cross-validating covenants...',
  'Processing complete. Ready for human validation.'
];

// 1. POST /workflow/upload (and /api/workflow/upload)
const handleUpload = (req: express.Request, res: express.Response) => {
  try {
    const file = req.file;
    const uuid = (req.body.uuid || `uuid-${Date.now()}`).toString();
    const userName = (req.body.userName || req.body.username || 'john.doe@dealsense.ai').toString();

    const fileName = file ? file.originalname : 'ABC_Manufacturing_Credit_Agreement_2025.pdf';
    const fileSize = file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : '3.32 MB';

    const newJob: JobState = {
      uuid,
      fileName,
      fileSize,
      userName,
      step: 1,
      totalSteps: 6,
      status: 'PROCESSING',
      createdAt: Date.now(),
      stepMessages: STEP_MESSAGES
    };

    jobsStore[uuid] = newJob;

    console.log(`[Workflow Upload] Created job for UUID: ${uuid}, File: ${fileName}, User: ${userName}`);

    res.status(200).json({
      uuid,
      status: 'PROCESSING',
      message: 'Workflow upload successful and processing initiated',
      fileName,
      fileSize,
      userName,
      totalSteps: 6,
      currentStep: 1
    });
  } catch (error: any) {
    console.error('[Workflow Upload Error]', error);
    res.status(500).json({ error: error.message || 'Failed to process workflow upload' });
  }
};

app.post('/workflow/upload', upload.single('pdf'), handleUpload);
app.post('/api/workflow/upload', upload.single('pdf'), handleUpload);

// 2. GET /workflow/:uuid/status (and /api/workflow/:uuid/status)
const handleStatus = (req: express.Request, res: express.Response) => {
  const uuid = req.params.uuid;
  let job = jobsStore[uuid];

  if (!job) {
    // If unknown UUID, auto-create a standard job for demo stability
    job = {
      uuid,
      fileName: 'ABC_Manufacturing_Credit_Agreement_2025.pdf',
      fileSize: '3.32 MB',
      userName: 'john.doe@dealsense.ai',
      step: 1,
      totalSteps: 6,
      status: 'PROCESSING',
      createdAt: Date.now(),
      stepMessages: STEP_MESSAGES
    };
    jobsStore[uuid] = job;
  }

  // Calculate step progression based on time elapsed or increments
  const elapsedSecs = Math.floor((Date.now() - job.createdAt) / 1000);
  
  // Every ~3 seconds progress to next step (or instantly if step >= 6)
  let currentStep = Math.min(6, Math.floor(elapsedSecs / 3) + 1);
  if (job.step > currentStep) {
    currentStep = job.step;
  } else {
    job.step = currentStep;
  }

  let currentStatus: 'UPLOADING' | 'PROCESSING' | 'HUMAN APPROVED' = 'PROCESSING';
  let message = STEP_MESSAGES[currentStep - 1] || STEP_MESSAGES[5];

  if (currentStep >= 6) {
    currentStatus = 'HUMAN APPROVED';
    job.status = 'HUMAN APPROVED';
    message = 'HUMAN APPROVED';
  }

  const percentage = Math.min(100, Math.round((currentStep / 6) * 100));

  res.status(200).json({
    uuid,
    status: currentStatus, // Will equal 'HUMAN APPROVED' when completed!
    step: currentStep,
    totalSteps: 6,
    message: currentStatus === 'HUMAN APPROVED' ? 'HUMAN APPROVED' : message,
    percentage,
    userName: job.userName,
    fileName: job.fileName,
    updatedAt: new Date().toISOString()
  });
};

app.get('/workflow/:uuid/status', handleStatus);
app.get('/api/workflow/:uuid/status', handleStatus);

// Fast-forward status route for instant testing if needed
app.post('/workflow/:uuid/complete', (req, res) => {
  const uuid = req.params.uuid;
  if (jobsStore[uuid]) {
    jobsStore[uuid].step = 6;
    jobsStore[uuid].status = 'HUMAN APPROVED';
  }
  res.json({ uuid, status: 'HUMAN APPROVED', message: 'HUMAN APPROVED' });
});

// 3. GET /workflow/:uuid/extracted (and /workflow/data/:uuid)
const handleExtracted = (req: express.Request, res: express.Response) => {
  const uuid = req.params.uuid;
  const job = jobsStore[uuid];

  const extractedData = {
    ...SAMPLE_EXTRACTION_DATA,
    uuid,
    fileName: job ? job.fileName : SAMPLE_EXTRACTION_DATA.fileName,
    fileSize: job ? job.fileSize : SAMPLE_EXTRACTION_DATA.fileSize,
    extractedAt: new Date().toISOString()
  };

  res.status(200).json(extractedData);
};

app.get('/workflow/:uuid/extracted', handleExtracted);
app.get('/workflow/data/:uuid', handleExtracted);
app.get('/api/workflow/:uuid/extracted', handleExtracted);

// 4. POST /workflow/create/deal (and /api/workflow/create/deal)
const handleCreateDeal = (req: express.Request, res: express.Response) => {
  try {
    const payload = req.body || {};
    const dealId = `DEAL-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const borrowerName = payload['Borrower'] || payload['borrower_name'] || payload.borrowerName || 'ABC Manufacturing Ltd';
    const dealName = payload['Deal Name'] || payload['deal_name'] || payload.dealName || 'ABC Manufacturing Term Loan';
    const totalAmount = payload['Total Aggregate Amount'] || payload['facility_amount'] || '$250,000,000 USD';
    const effectiveDate = payload['Effective Date'] || payload['effective_date'] || 'December 31, 2025';
    const fileName = payload.fileName || 'ABC_Manufacturing_Credit_Agreement_2025.pdf';

    const now = new Date();
    const timestampStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} at ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    const newDealRecord: CreatedDealRecord = {
      dealId,
      uuid: payload.uuid || `uuid-${Date.now()}`,
      borrowerName,
      dealName,
      fileName,
      effectiveDate,
      totalAmount,
      createdAt: timestampStr,
      totalFields: Object.keys(payload.attributes || payload).length || 12,
      approvedFields: Object.keys(payload.attributes || payload).length || 12,
      rejectedFields: 0,
      pendingFields: 0,
      status: 'SIGNED_OFF',
      attributes: typeof payload.attributes === 'object' ? payload.attributes : payload
    };

    createdDealsStore.unshift(newDealRecord);

    console.log(`[Create Deal] Success! Created Deal ID: ${dealId} for ${borrowerName}`);

    res.status(200).json({
      success: true,
      dealId,
      status: 'DEAL_CREATED',
      message: 'Deal creation done successfully!',
      timestamp: timestampStr,
      deal: newDealRecord
    });
  } catch (error: any) {
    console.error('[Create Deal Error]', error);
    res.status(500).json({ error: error.message || 'Failed to create deal' });
  }
};

app.post('/workflow/create/deal', handleCreateDeal);
app.post('/api/workflow/create/deal', handleCreateDeal);

// 5. GET /workflow/deals (and /api/workflow/deals)
const handleGetDeals = (req: express.Request, res: express.Response) => {
  res.status(200).json({
    totalDeals: createdDealsStore.length,
    deals: createdDealsStore
  });
};

app.get('/workflow/deals', handleGetDeals);
app.get('/api/workflow/deals', handleGetDeals);

// Vite middleware / Static server setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DealSense AI backend running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
