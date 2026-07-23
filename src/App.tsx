import React, { useState } from 'react';
import { Header } from './components/Header';
import { UploadScreen } from './components/UploadScreen';
import { ReviewScreen } from './components/ReviewScreen';
import { FinalScreen } from './components/FinalScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'upload' | 'review' | 'final'>('upload');
  const [workflowUuid, setWorkflowUuid] = useState<string>('sample-uuid-2025-001');
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string }>({
    name: 'Credit_Agreement_Wells_Fargo_2011.pdf',
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
        borrowerName="Unknown Borrower"
        pageCount={1}
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
