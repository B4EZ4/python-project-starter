import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '@/components/qr/Header';
import { QRForm } from '@/components/qr/QRForm';
import { QRPreview } from '@/components/qr/QRPreview';
import { QRResult } from '@/components/qr/QRResult';
import { StatsSection } from '@/components/qr/StatsSection';
import { InfoSection } from '@/components/qr/InfoSection';
import { LimitationsSection } from '@/components/qr/LimitationsSection';
import { FAQSection } from '@/components/qr/FAQSection';
import { Footer } from '@/components/qr/Footer';
import { DonationModal } from '@/components/qr/DonationModal';
import { useQRGenerator } from '@/hooks/useQRGenerator';

export default function Index() {
  const [selectedStyle, setSelectedStyle] = useState(6);
  const [showDonation, setShowDonation] = useState(false);
  const { isLoading, error, qrResult, generateQR, generatedCount } = useQRGenerator();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Toaster position="top-right" />
      
      <Header />

      <main className="flex-1 px-4 py-8">
        {/* Form Container */}
        <div className="flex justify-center gap-8 mb-8 flex-wrap items-start">
          <div className="w-full max-w-md">
            <QRForm
              onSubmit={generateQR}
              onStyleChange={setSelectedStyle}
              isLoading={isLoading}
            />
            <QRResult result={qrResult} isLoading={isLoading} error={error} />
          </div>
          
          <QRPreview selectedStyle={selectedStyle} />
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
