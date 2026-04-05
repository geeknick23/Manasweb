import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use | MANAS Foundation',
  description: 'Terms of use for the Manas Bandhan platform and MANAS Foundation website.',
};

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen">
      <section className="bg-primary pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h1 className="text-4xl font-display font-bold mb-4">Terms of Use</h1>
          <p className="text-white/85 leading-relaxed">
            These terms apply to use of our website and the Manas Bandhan matrimonial platform operated by MANAS
            Foundation.
          </p>
        </div>
      </section>
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 prose prose-slate prose-lg">
        <p className="lead text-slate-600">
          This is a summary placeholder. Replace with counsel-reviewed terms before production launch.
        </p>
        <h2 className="text-slate-900 font-display">1. Eligibility and conduct</h2>
        <p>
          You agree to provide accurate information, treat other members respectfully, and not misuse the platform for
          harassment, fraud, or illegal activity. We may suspend accounts that violate these rules.
        </p>
        <h2 className="text-slate-900 font-display">2. Service availability</h2>
        <p>
          We strive to keep services available but do not guarantee uninterrupted access. Features may change as we
          improve safety and user experience.
        </p>
        <h2 className="text-slate-900 font-display">3. Limitation of liability</h2>
        <p>
          MANAS Foundation provides the platform &quot;as is.&quot; To the extent permitted by law, we are not liable
          for indirect damages or outcomes of introductions between users.
        </p>
        <h2 className="text-slate-900 font-display">4. Privacy</h2>
        <p>
          Our{' '}
          <Link href="/privacy-policy" className="text-primary font-medium hover:underline">
            Privacy Policy
          </Link>{' '}
          describes how we collect and use data.
        </p>
        <h2 className="text-slate-900 font-display">5. Contact</h2>
        <p>
          Questions about these terms:{' '}
          <a href="mailto:manasfoundation2025@gmail.com" className="text-primary font-medium">
            manasfoundation2025@gmail.com
          </a>{' '}
          or{' '}
          <Link href="/contact" className="text-primary font-medium hover:underline">
            contact us
          </Link>
          .
        </p>
      </article>
    </div>
  );
}
