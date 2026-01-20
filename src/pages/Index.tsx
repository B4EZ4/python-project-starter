import { useState, useCallback } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '@/components/qr/Header';
import { QRForm } from '@/components/qr/QRForm';
import { QRLivePreview } from '@/components/qr/QRLivePreview';
import { QRResult } from '@/components/qr/QRResult';
import { StatsSection } from '@/components/qr/StatsSection';
import { InfoSection } from '@/components/qr/InfoSection';
import { LimitationsSection } from '@/components/qr/LimitationsSection';
import { FAQSection } from '@/components/qr/FAQSection';
import { Footer } from '@/components/qr/Footer';
import { DonationModal } from '@/components/qr/DonationModal';
import { useQRGenerator } from '@/hooks/useQRGenerator';
import { DEFAULT_QR_CONFIG, type QRConfig } from '@/types/qr';

export default function Index() {
  const [showDonation, setShowDonation] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<QRConfig>(DEFAULT_QR_CONFIG);
  const { isLoading, error, qrResult, generateQR, generatedCount } = useQRGenerator();

  const handleConfigChange = useCallback((config: QRConfig) => {
    setCurrentConfig(config);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Toaster position="top-right" />
      
      <Header />

      <main className="flex-1 px-4 py-8">
        {/* Form Container */}
        <div className="flex justify-center gap-6 mb-8 flex-wrap items-start max-w-5xl mx-auto">
          <div className="w-full max-w-xl flex-1 min-w-[320px]">
            <QRForm
              onSubmit={generateQR}
              onConfigChange={handleConfigChange}
              isLoading={isLoading}
            />
            <QRResult result={qrResult} isLoading={isLoading} error={error} />
          </div>
          
          <div className="w-full max-w-md flex-shrink-0">
            <QRLivePreview config={currentConfig} />
          </div>
        </div>

        {/* Stats */}
        <StatsSection generatedCount={generatedCount} />

        {/* Info */}
        <InfoSection />

        {/* Limitations */}
        <section id="limitations">
          <LimitationsSection />
        </section>

        {/* FAQ */}
        <FAQSection />
      </main>

      <Footer onShowDonation={() => setShowDonation(true)} />

      <DonationModal isOpen={showDonation} onClose={() => setShowDonation(false)} />
    </div>
  );
}
