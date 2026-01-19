import {
  Hero,
  Features,
  Compatibility,
  Gallery,
  HowItWorks,
  FAQ,
} from '@/components/home';
import { SEO, structuredDataGenerators } from '@/components/common';

export function Home() {
  // Combine multiple structured data for rich results
  const structuredData = [
    structuredDataGenerators.softwareApplication(),
    structuredDataGenerators.faqPage([
      {
        question: 'Is Trexo PDF Signer really free?',
        answer: 'Yes, Trexo PDF Signer is completely free and open-source under the AGPL-3.0 license. You can use it for personal and commercial purposes without any cost.',
      },
      {
        question: 'How is Trexo PDF Signer different from jSignPDF?',
        answer: 'Trexo PDF Signer is a modern alternative to jSignPDF with an enhanced user interface, better USB token detection, improved signature appearance options, and native Windows Certificate Store integration. Both are free Java applications, but Trexo PDF Signer offers intuitive drag-and-drop signature placement and real-time preview.',
      },
      {
        question: 'Will my signature show a green tick in Adobe Reader?',
        answer: 'Yes, when you sign PDFs with Trexo PDF Signer using a trusted certificate, Adobe Reader will display a green tick checkmark indicating the signature is valid and trusted. This confirms the document has not been modified after signing.',
      },
      {
        question: 'Can I sign PDFs with my DSC USB token?',
        answer: 'Yes, Trexo PDF Signer fully supports Digital Signature Certificates (DSC) from Indian Certifying Authorities. It works with Class 2 and Class 3 DSC tokens from eMudhra, Sify, CDAC, and others for government tenders, MCA filings, GST documents, and legal contracts.',
      },
      {
        question: 'What types of certificates does Trexo PDF Signer support?',
        answer: 'Trexo PDF Signer supports PKCS#12/PFX certificate files, PKCS#11 hardware tokens (eToken, SafeNet, Gemalto, ProxKey, mToken), smart cards, and Windows Certificate Store integration.',
      },
      {
        question: 'Does Trexo PDF Signer require Java?',
        answer: 'Yes, Trexo PDF Signer requires exactly Java 8 to run. Higher versions (Java 11, 17, 21) are NOT supported. Install Java 8 from Eclipse Temurin or Oracle before running Trexo PDF Signer.',
      },
      {
        question: 'Is Trexo PDF Signer compatible with Adobe Reader?',
        answer: 'Yes, PDFs signed with Trexo PDF Signer are fully compatible with Adobe Reader DC, Adobe Acrobat, and other major PDF applications. Signatures display with green tick checkmark when valid.',
      },
      {
        question: 'Can I sign PDFs on Linux with Trexo PDF Signer?',
        answer: 'Yes, Trexo PDF Signer supports Linux. Download the .deb package for Ubuntu/Debian or the universal .jar file for other distributions. Ensure Java 8 (openjdk-8-jre) is installed.',
      },
      {
        question: 'Is Trexo PDF Signer legally valid for signing documents?',
        answer: 'Yes, digital signatures created with Trexo PDF Signer using valid certificates are legally valid under the IT Act 2000 (India), eIDAS (EU), and similar laws. Signatures are tamper-proof with cryptographic proof of authenticity.',
      },
    ]),
    structuredDataGenerators.breadcrumb([
      { name: 'Home', url: 'https://trexolab-solution.github.io/trexo-pdf-signer/' },
      { name: 'Download', url: 'https://trexolab-solution.github.io/trexo-pdf-signer/#download' },
      { name: 'Features', url: 'https://trexolab-solution.github.io/trexo-pdf-signer/#features' },
    ]),
  ];

  return (
    <>
      <SEO
        title="Free PDF Digital Signature Software | Sign PDF with DSC Token | jSignPDF Alternative"
        description="Trexo PDF Signer PDF Signer is a free, open-source PDF signing software and modern jSignPDF alternative. Sign PDF documents with USB DSC tokens, PKCS#11, PKCS#12/PFX certificates. Get green tick valid signatures in Adobe Reader. Download for Windows, macOS & Linux."
        keywords="Trexo PDF Signer PDF Signer, free PDF signer, PDF signing software, jSignPDF alternative, sign PDF with DSC token, USB token PDF signing, PKCS#11 PDF signer, PKCS#12 PFX certificate, digital signature certificate India, DSC token signing, how to digitally sign PDF, green tick signature, green checkmark PDF, valid signature Adobe Reader, sign PDF free, open source PDF signer, DocuSign alternative, Adobe Acrobat alternative, iText PDF signature, legally sign PDF, RFC 3161 timestamp, PAdES signature, sign PDF with smart card, Class 3 DSC signing, government tender PDF signing"
        url="https://trexolab-solution.github.io/trexo-pdf-signer/"
        structuredData={structuredData}
      />
      <main>
        <Hero />
        <Features />
        <Compatibility />
        <Gallery />
        <HowItWorks />
        <FAQ />
      </main>
    </>
  );
}

export default Home;
