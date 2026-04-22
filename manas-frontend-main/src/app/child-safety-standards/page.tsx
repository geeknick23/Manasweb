import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Shield,
  AlertTriangle,
  Ban,
  Eye,
  Phone,
  Mail,
  MapPin,
  UserX,
  FileText,
  Lock,
  ClipboardList,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Child Safety Standards | Manas Bandhan – MANAS Foundation',
  description:
    'Child Safety Standards and CSAE (Child Sexual Abuse and Exploitation) Policy for the Manas Bandhan app by MANAS Foundation. Our commitment to protecting minors.',
  robots: { index: true, follow: true },
};

const lastUpdated = 'April 22, 2025';
const effectiveDate = 'April 22, 2025';

export default function ChildSafetyStandardsPage() {
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
            Manas Bandhan App — MANAS Foundation
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
            Child Safety Standards
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Our commitment to preventing Child Sexual Abuse and Exploitation (CSAE) and maintaining
            a safe platform for all adults on Manas Bandhan.
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
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Contents
          </p>
          <nav className="flex flex-wrap gap-3">
            {[
              { href: '#our-commitment', label: '1. Our Commitment' },
              { href: '#prohibited-content', label: '2. Prohibited Content' },
              { href: '#age-verification', label: '3. Age Verification' },
              { href: '#detection-reporting', label: '4. Detection & Reporting' },
              { href: '#user-reporting', label: '5. User Reporting Tools' },
              { href: '#enforcement', label: '6. Enforcement' },
              { href: '#cooperation', label: '7. Law Enforcement Cooperation' },
              { href: '#contact', label: '8. Contact Us' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-primary border border-primary/20 bg-primary/5 hover:bg-primary hover:text-white px-3 py-1.5 rounded-full transition-all duration-200 font-medium"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Intro notice */}
        <div className="bg-primary/5 border-l-4 border-primary rounded-r-xl p-6 mb-14">
          <p className="text-text leading-relaxed">
            MANAS Foundation operates <strong>Manas Bandhan</strong> — a matrimonial platform
            exclusively for widows and divorcees above the age of 18. We have a zero-tolerance
            policy against child sexual abuse and exploitation (CSAE). This document outlines our
            published safety standards in compliance with Google Play&apos;s Child Safety Standards
            Policy and applicable Indian laws including the POCSO Act, 2012 and the IT Act, 2000.
          </p>
        </div>

        <div className="space-y-16">

          {/* 1. Our Commitment */}
          <div id="our-commitment" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground leading-tight">
                1. Our Commitment to Child Safety
              </h2>
            </div>
            <div className="space-y-5 ml-0 sm:ml-15">
              <div className="bg-muted/30 rounded-xl p-5 border border-border">
                <h3 className="font-bold text-text mb-2 text-[15px]">Adults-Only Platform</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Manas Bandhan is strictly an adults-only platform designed for individuals aged
                  18 years and above. Registration requires age confirmation, and we actively
                  enforce this policy. The app is not intended for, and must not be used by,
                  anyone under 18 years of age.
                </p>
              </div>
              <div className="bg-muted/30 rounded-xl p-5 border border-border">
                <h3 className="font-bold text-text mb-2 text-[15px]">Zero-Tolerance Policy</h3>
                <p className="text-muted-foreground leading-relaxed">
                  MANAS Foundation has an absolute zero-tolerance stance against any form of child
                  sexual abuse and exploitation (CSAE). Any content, behavior, or activity that
                  involves the sexual exploitation or abuse of minors is strictly prohibited and
                  will result in immediate account termination and reporting to law enforcement
                  authorities.
                </p>
              </div>
              <div className="bg-muted/30 rounded-xl p-5 border border-border">
                <h3 className="font-bold text-text mb-2 text-[15px]">Mission Alignment</h3>
                <p className="text-muted-foreground leading-relaxed">
                  MANAS Foundation is a non-profit organization dedicated to the welfare and
                  empowerment of widows and divorcees. Protecting children and vulnerable
                  individuals is central to our mission and our platform standards.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Prohibited Content */}
          <div id="prohibited-content" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Ban className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground leading-tight">
                2. Prohibited Content & Behaviour
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed text-[17px] mb-6 ml-0 sm:ml-15">
              The following content and behaviours are strictly prohibited on Manas Bandhan and
              will result in immediate action including permanent account suspension and reporting
              to law enforcement:
            </p>
            <ul className="space-y-3 ml-0 sm:ml-15">
              {[
                'Any content that sexually depicts, exploits, or abuses minors (Child Sexual Abuse Material — CSAM).',
                'Grooming of minors through any feature of the platform including chat, profile, or media sharing.',
                'Soliciting, distributing, or accessing child sexual abuse material in any form.',
                'Attempting to register as a minor or on behalf of a minor.',
                'Impersonating a child or minor-aged individual.',
                'Sharing any content that normalises, glorifies, or trivialises child sexual abuse or exploitation.',
                'Using the platform to arrange meetings with minors for illicit purposes.',
                'Facilitating trafficking of minors or any trafficking-related activity.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                  <span className="text-muted-foreground leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Age Verification */}
          <div id="age-verification" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <UserX className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground leading-tight">
                3. Age Verification & Registration Controls
              </h2>
            </div>
            <div className="space-y-5 ml-0 sm:ml-15">
              <div className="bg-muted/30 rounded-xl p-5 border border-border">
                <h3 className="font-bold text-text mb-2 text-[15px]">Minimum Age Requirement</h3>
                <p className="text-muted-foreground leading-relaxed">
                  All users must confirm they are 18 years of age or older during registration.
                  Users found to be under 18 will have their accounts immediately deleted along
                  with all associated data.
                </p>
              </div>
              <div className="bg-muted/30 rounded-xl p-5 border border-border">
                <h3 className="font-bold text-text mb-2 text-[15px]">OTP-Based Verification</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Registration requires mobile phone OTP verification (via MSG91), linking each
                  account to a verified Indian mobile number. This acts as a baseline barrier
                  against anonymous or fraudulent registrations.
                </p>
              </div>
              <div className="bg-muted/30 rounded-xl p-5 border border-border">
                <h3 className="font-bold text-text mb-2 text-[15px]">Profile Review</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Profiles are reviewed by MANAS Foundation administrators to ensure compliance
                  with our eligibility criteria. Profiles suspected of belonging to minors are
                  suspended pending investigation.
                </p>
              </div>
              <div className="bg-muted/30 rounded-xl p-5 border border-border">
                <h3 className="font-bold text-text mb-2 text-[15px]">Play Store Age Rating</h3>
                <p className="text-muted-foreground leading-relaxed">
                  The Manas Bandhan app is rated for users aged 18+ on the Google Play Store.
                  Google Play&apos;s parental controls and Family Link further restrict access for
                  underage users.
                </p>
              </div>
            </div>
          </div>

          {/* 4. Detection & Reporting */}
          <div id="detection-reporting" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Eye className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground leading-tight">
                4. Detection & Internal Reporting
              </h2>
            </div>
            <div className="space-y-5 ml-0 sm:ml-15">
              <div className="bg-muted/30 rounded-xl p-5 border border-border">
                <h3 className="font-bold text-text mb-2 text-[15px]">Content Moderation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  MANAS Foundation staff actively monitor the platform for signs of CSAE activity.
                  Uploaded profile photographs and chat content are subject to periodic review for
                  policy compliance.
                </p>
              </div>
              <div className="bg-muted/30 rounded-xl p-5 border border-border">
                <h3 className="font-bold text-text mb-2 text-[15px]">
                  Mandatory NCMEC Reporting
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  In accordance with applicable laws and platform best practices, any identified
                  CSAM will be reported to the National Center for Missing & Exploited Children
                  (NCMEC) via their CyberTipline (
                  <a
                    href="https://www.missingkids.org/gethelpnow/cybertipline"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    cybertipline
                  </a>
                  ) and to relevant Indian law enforcement authorities including the Cyber Crime
                  Cell and POCSO authorities.
                </p>
              </div>
              <div className="bg-muted/30 rounded-xl p-5 border border-border">
                <h3 className="font-bold text-text mb-2 text-[15px]">Evidence Preservation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  When CSAE content or behaviour is identified, all relevant evidence is preserved
                  and securely stored to support law enforcement investigations.
                </p>
              </div>
            </div>
          </div>

          {/* 5. User Reporting Tools */}
          <div id="user-reporting" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground leading-tight">
                5. User Reporting Tools
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed text-[17px] mb-6 ml-0 sm:ml-15">
              Every user of Manas Bandhan has access to easy-to-use reporting mechanisms:
            </p>
            <ul className="space-y-3 ml-0 sm:ml-15 mb-6">
              {[
                'In-app Report button on every user profile and chat conversation.',
                'Direct email reporting to our dedicated safety team at manasfoundation2025@gmail.com.',
                'All reports are reviewed by a designated team member within 24–48 hours.',
                'Reporters can remain anonymous — we do not share the identity of reporters with reported users.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-muted-foreground leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 ml-0 sm:ml-15">
              <p className="text-amber-800 text-sm leading-relaxed font-medium">
                🚨 <strong>If you believe a child is in immediate danger</strong>, please contact
                your local police or emergency services immediately (India: Dial 112 or Childline
                1098). Do not wait for a response from us.
              </p>
            </div>
          </div>

          {/* 6. Enforcement */}
          <div id="enforcement" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <ClipboardList className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground leading-tight">
                6. Enforcement Actions
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed text-[17px] mb-6 ml-0 sm:ml-15">
              Upon identifying a violation of our child safety standards, MANAS Foundation will:
            </p>
            <ul className="space-y-3 ml-0 sm:ml-15">
              {[
                'Immediately suspend and permanently ban the offending account.',
                'Preserve all evidence related to the violation.',
                'Report the incident to the National Cyber Crime Reporting Portal (cybercrime.gov.in) and relevant law enforcement agencies.',
                'Report identified CSAM to NCMEC via the CyberTipline as required.',
                'Cooperate fully with any subsequent investigation by law enforcement.',
                'Notify affected users where appropriate and legally permissible.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-muted-foreground leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 7. Law Enforcement Cooperation */}
          <div id="cooperation" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground leading-tight">
                7. Law Enforcement Cooperation
              </h2>
            </div>
            <div className="space-y-5 ml-0 sm:ml-15">
              <div className="bg-muted/30 rounded-xl p-5 border border-border">
                <h3 className="font-bold text-text mb-2 text-[15px]">Legal Compliance</h3>
                <p className="text-muted-foreground leading-relaxed">
                  MANAS Foundation is committed to full compliance with Indian laws, including the
                  Protection of Children from Sexual Offences (POCSO) Act, 2012, the Information
                  Technology Act, 2000, and the Information Technology (Intermediary Guidelines
                  and Digital Media Ethics Code) Rules, 2021.
                </p>
              </div>
              <div className="bg-muted/30 rounded-xl p-5 border border-border">
                <h3 className="font-bold text-text mb-2 text-[15px]">Data Disclosure</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We will disclose user data and account information to law enforcement agencies
                  and regulatory authorities when required by law, court order, or when we
                  reasonably believe disclosure is necessary to protect the safety of any child or
                  person.
                </p>
              </div>
              <div className="bg-muted/30 rounded-xl p-5 border border-border">
                <h3 className="font-bold text-text mb-2 text-[15px]">Designated Nodal Officer</h3>
                <p className="text-muted-foreground leading-relaxed">
                  MANAS Foundation designates a responsible point-of-contact for all child safety
                  and law enforcement inquiries. All official requests can be directed to{' '}
                  <a
                    href="mailto:manasfoundation2025@gmail.com"
                    className="text-primary hover:underline"
                  >
                    manasfoundation2025@gmail.com
                  </a>{' '}
                  with the subject line <em>&quot;Child Safety — Law Enforcement Request&quot;</em>.
                </p>
              </div>
            </div>
          </div>

          {/* Legal References */}
          <div id="legal-references" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground leading-tight">
                Applicable Laws & External Resources
              </h2>
            </div>
            <ul className="space-y-3 ml-0 sm:ml-15">
              {[
                {
                  label: 'POCSO Act, 2012 (India)',
                  href: 'https://wcd.nic.in/sites/default/files/POCSO%20ACT,%202012.pdf',
                },
                {
                  label: 'IT Act, 2000 & IT Rules, 2021 (India)',
                  href: 'https://www.meity.gov.in/content/information-technology-act',
                },
                {
                  label: 'NCMEC CyberTipline — Report CSAM',
                  href: 'https://www.missingkids.org/gethelpnow/cybertipline',
                },
                {
                  label: 'National Cyber Crime Reporting Portal (India)',
                  href: 'https://cybercrime.gov.in',
                },
                {
                  label: 'Childline India — 1098 (24/7 helpline for children in distress)',
                  href: 'https://www.childlineindia.org',
                },
                {
                  label: "Google Play's Families Policy Center",
                  href: 'https://support.google.com/googleplay/android-developer/answer/9893335',
                },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline leading-relaxed"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div id="contact" className="scroll-mt-24">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-white flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                  8. Child Safety Contact
                </h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-8 text-[17px]">
                To report child safety concerns, CSAE violations, or for law enforcement inquiries,
                please contact us through any of the following channels. We treat all child safety
                reports as our highest priority.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-text text-sm mb-1">Organisation</p>
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
                    <p className="font-semibold text-text text-sm mb-1">Safety Email</p>
                    <a
                      href="mailto:manasfoundation2025@gmail.com"
                      className="text-primary text-sm hover:underline"
                    >
                      manasfoundation2025@gmail.com
                    </a>
                    <p className="text-muted-foreground text-xs mt-1">
                      Subject: &quot;Child Safety Report&quot;
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-text text-sm mb-1">Emergency</p>
                    <p className="text-muted-foreground text-sm">
                      Childline India: <strong>1098</strong><br />
                      National Emergency: <strong>112</strong>
                    </p>
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
            <Link href="/privacy-policy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-primary hover:underline">
              Terms
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
