import React, { useState } from 'react';
import { Header } from './components/Header';
import { UploadScreen } from './components/UploadScreen';
import { ReviewScreen } from './components/ReviewScreen';
import { FinalScreen } from './components/FinalScreen';
import { DEFAULT_FILE_NAME, ACTUAL_DEAL_1_EXTRACTION_DATA } from './data/actualDeal_1';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'upload' | 'review' | 'final'>('upload');
  const [workflowUuid, setWorkflowUuid] = useState<string>('actual-deal-1-uuid-001');
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string }>({
    name: DEFAULT_FILE_NAME,
    size: 'N/A'
  });
  const [createDealResponse, setCreateDealResponse] = useState<any>(null);

  const handleWorkflowComplete = (uuid: string, info: { name: string; size: string }) => {
    setWorkflowUuid(uuid);
    setFileInfo(info);
    setCurrentScreen('review');
  };

  const handleSignOffComplete = (dealResponse: any) => {
    setCreateDealResponse(dealResponse);
    setCurrentScreen('final');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 antialiased">
      {/* Navigation Header */}
      <Header
        currentScreen={currentScreen}
        fileName={fileInfo.name}
        borrowerName={ACTUAL_DEAL_1_EXTRACTION_DATA.borrowerName}
        pageCount={ACTUAL_DEAL_1_EXTRACTION_DATA.pageCount}
        onNavigateUpload={() => setCurrentScreen('upload')}
        onNavigateReview={() => setCurrentScreen('review')}
      />

      {/* Screen Views */}
      <main className="flex-1 overflow-hidden">
        {currentScreen === 'upload' && (
          <UploadScreen onWorkflowComplete={handleWorkflowComplete} />
        )}

        {currentScreen === 'review' && (
          <ReviewScreen
            uuid={workflowUuid}
            onSignOffComplete={handleSignOffComplete}
          />
        )}

        {currentScreen === 'final' && (
          <FinalScreen
            dealResponse={createDealResponse}
            onNavigateUpload={() => setCurrentScreen('upload')}
            onNavigateReview={() => setCurrentScreen('review')}
          />
        )}
      </main>
    </div>
  );
}
