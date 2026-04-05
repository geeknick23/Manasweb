import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Eye, Database, Lock, Bell, UserCheck, Trash2, Mail, MapPin, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Manas Bandhan – MANAS Foundation',
  description:
    'Privacy Policy for the Manas Bandhan app by MANAS Foundation. Learn how we collect, use, and protect your personal data.',
  robots: { index: true, follow: true },
};

const lastUpdated = 'April 2, 2025';
const effectiveDate = 'April 2, 2025';

const sections = [
  {
    id: 'information-we-collect',
    icon: Database,
    title: '1. Information We Collect',
    content: [
      {
        subtitle: 'Personal Information',
        text: 'When you register on Manas Bandhan, we collect information you voluntarily provide, including your name, age, gender, marital status (widow/divorcee), contact number, email address, city/district, state, religion, caste (optional), occupation, educational background, and a profile photograph.',
      },
      {
        subtitle: 'Profile & Matrimonial Data',
        text: 'To help you find a compatible partner, we collect details such as height, complexion, hobbies, family background, children (if any), and personal preferences related to a prospective match.',
      },
      {
        subtitle: 'Usage & Device Data',
        text: 'We automatically collect information about how you use the app, including device type, operating system version, app version, IP address, session duration, pages viewed, and crash reports to improve performance.',
      },
      {
        subtitle: 'Communications',
        text: 'We store messages exchanged through our in-app chat feature to ensure safety and resolve disputes. We do not read private messages unless required for safety or legal compliance.',
      },
    ],
  },
  {
    id: 'how-we-use',
    icon: Eye,
    title: '2. How We Use Your Information',
    bullets: [
      'To create, manage, and display your matrimonial profile to other verified users.',
      'To suggest compatible matches based on your preferences and profile data.',
      'To verify your identity and ensure all users meet our eligibility criteria.',
      'To send you notifications about new matches, messages, and platform updates.',
      'To provide customer support and respond to your queries.',
      'To improve app features, user experience, and safety through analytics.',
      'To comply with applicable Indian laws and regulatory requirements.',
      'To detect, prevent, and respond to fraud, abuse, or illegal activity.',
    ],
  },
  {
    id: 'data-sharing',
    icon: UserCheck,
    title: '3. How We Share Your Information',
    content: [
      {
        subtitle: 'With Other Users',
        text: 'Your profile information (name, photo, age, location, occupation, etc.) is visible to other registered users of the app. You can control certain visibility settings from your profile settings.',
      },
      {
        subtitle: 'With MANAS Foundation Staff',
        text: 'Authorised staff and administrators of MANAS Foundation may access your data to verify profiles, provide support, and ensure community safety.',
      },
      {
        subtitle: 'With Service Providers',
        text: 'We share data with trusted third-party service providers (e.g., Firebase by Google for real-time chat and notifications) who process data on our behalf under strict confidentiality agreements.',
      },
      {
        subtitle: 'Legal Requirements',
        text: 'We may disclose your information to law enforcement or government authorities if required by law, court order, or to protect the rights, safety, and property of our users or the public.',
      },
      {
        subtitle: 'We Never Sell Your Data',
        text: 'MANAS Foundation does NOT sell, rent, or trade your personal information to any third party for commercial purposes, ever.',
      },
    ],
  },
  {
    id: 'data-security',
    icon: Lock,
    title: '4. Data Security',
    text: 'We take the security of your personal information seriously. We implement industry-standard security measures including encrypted data transmission (HTTPS/TLS), secure cloud storage, and access controls limited to authorised personnel only. While we strive to protect your data, no method of transmission over the internet is 100% secure. We encourage you to use a strong password and not share your account credentials with anyone.',
  },
  {
    id: 'notifications',
    icon: Bell,
    title: '5. Push Notifications',
    text: 'The Manas Bandhan app may send push notifications to inform you about new match suggestions, messages, and important updates. You can control notification preferences from your device settings or within the app at any time. Disabling notifications will not affect your ability to use the core features of the app.',
  },
  {
    id: 'data-retention',
    icon: Trash2,
    title: '6. Data Retention & Deletion',
    content: [
      {
        subtitle: 'Active Accounts',
        text: 'We retain your data for as long as your account is active or as needed to provide you services.',
      },
      {
        subtitle: 'Account Deletion',
        text: 'You may request deletion of your account and all associated data at any time by contacting us at the email address provided below. Upon receiving your request, we will delete your data within 30 days, except where retention is required by law.',
      },
      {
        subtitle: 'Inactive Accounts',
        text: 'Accounts inactive for more than 24 months may be automatically archived or deleted after advance notice.',
      },
    ],
  },
  {
    id: 'your-rights',
    icon: Shield,
    title: '7. Your Rights',
    bullets: [
      'Access: Request a copy of the personal data we hold about you.',
      'Correction: Request correction of inaccurate or incomplete data.',
      'Deletion: Request deletion of your personal data (Right to be Forgotten).',
      'Portability: Request your data in a portable, machine-readable format.',
      'Withdrawal of Consent: Withdraw your consent for data processing at any time.',
      'Opt-out: Opt out of marketing communications while retaining your account.',
    ],
    footer:
      'To exercise any of these rights, please contact us at the email address below. We will respond to your request within 15 business days.',
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner */}
      <section className="relative bg-primary pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Manas Bandhan App
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            We are committed to protecting your personal information and your privacy. This policy explains how MANAS Foundation collects, uses, and safeguards your data.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8 text-sm text-white/70">
            <span>
              <strong className="text-white">Last Updated:</strong> {lastUpdated}
            </span>
            <span className="hidden sm:block text-white/30">•</span>
            <span>
              <strong className="text-white">Effective Date:</strong> {effectiveDate}
            </span>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="bg-muted/40 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Contents</p>
          <nav className="flex flex-wrap gap-3">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-sm text-primary border border-primary/20 bg-primary/5 hover:bg-primary hover:text-white px-3 py-1.5 rounded-full transition-all duration-200 font-medium"
              >
                {s.title}
              </a>
            ))}
            <a
              href="#contact"
              className="text-sm text-primary border border-primary/20 bg-primary/5 hover:bg-primary hover:text-white px-3 py-1.5 rounded-full transition-all duration-200 font-medium"
            >
              8. Contact Us
            </a>
          </nav>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Intro notice */}
        <div className="bg-primary/5 border-l-4 border-primary rounded-r-xl p-6 mb-14">
          <p className="text-text leading-relaxed">
            This Privacy Policy applies to the <strong>Manas Bandhan</strong> mobile application (&quot;App&quot;) operated by <strong>MANAS Foundation</strong> (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;). By registering and using the App, you agree to the collection and use of your information as described in this policy. Please read it carefully before proceeding.
          </p>
        </div>

        <div className="space-y-16">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.id} id={section.id} className="scroll-mt-24">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground leading-tight">
                    {section.title}
                  </h2>
                </div>

                {/* Plain text section */}
                {'text' in section && section.text && (
                  <p className="text-muted-foreground leading-relaxed text-[17px] ml-0 sm:ml-15">
                    {section.text}
                  </p>
                )}

                {/* Sub-sections */}
                {'content' in section && section.content && (
                  <div className="space-y-5 ml-0 sm:ml-15">
                    {section.content.map((item, i) => (
                      <div key={i} className="bg-muted/30 rounded-xl p-5 border border-border">
                        <h3 className="font-bold text-text mb-2 text-[15px]">{item.subtitle}</h3>
                        <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Bullet list */}
                {'bullets' in section && section.bullets && (
                  <ul className="space-y-3 ml-0 sm:ml-15">
                    {section.bullets.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                        <span className="text-muted-foreground leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {'footer' in section && section.footer && (
                  <p className="mt-4 text-muted-foreground italic text-sm ml-0 sm:ml-15">{section.footer}</p>
                )}
              </div>
            );
          })}

          {/* Children's Privacy */}
          <div id="childrens-privacy" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                Children&apos;s Privacy
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed text-[17px]">
              The Manas Bandhan App is intended exclusively for adults aged <strong>18 years and above</strong>. We do not knowingly collect personal information from anyone under the age of 18. If we discover that a user is under 18, we will immediately delete their account and associated data. If you believe a minor has registered, please contact us immediately.
            </p>
          </div>

          {/* Changes to Policy */}
          <div id="policy-changes" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                Changes to This Policy
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed text-[17px]">
              We may update this Privacy Policy from time to time. When we make significant changes, we will notify you through a push notification or a prominent notice within the app. We encourage you to review this policy periodically. Your continued use of the App after any changes constitutes acceptance of the updated policy.
            </p>
          </div>

          {/* Contact Section */}
          <div id="contact" className="scroll-mt-24">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-white flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                  8. Contact Us
                </h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-8 text-[17px]">
                If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-text text-sm mb-1">Address</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      MANAS Foundation,<br />
                      Buldhana, Maharashtra,<br />
                      India
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-text text-sm mb-1">Email</p>
                    <a
                      href="mailto:manasfoundation2025@gmail.com"
                      className="text-primary text-sm hover:underline"
                    >
                      manasfoundation2025@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-text text-sm mb-1">App Support</p>
                    <Link
                      href="/contact"
                      className="text-primary text-sm hover:underline"
                    >
                      Visit our Contact Page →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer note */}
      <section className="bg-muted/40 border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} MANAS Foundation. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/" className="text-primary hover:underline">
              Home
            </Link>
            <Link href="/about" className="text-primary hover:underline">
              About
            </Link>
            <Link href="/contact" className="text-primary hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
