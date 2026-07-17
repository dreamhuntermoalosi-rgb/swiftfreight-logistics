'use client';

import { ArrowLeft } from 'lucide-react';
import { useNavStore } from '@/lib/store';
import { Button } from '@/components/ui/button';

export function PrivacyPolicyPage() {
  const { setView } = useNavStore();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Button variant="ghost" onClick={() => setView('marketing')} className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: June 2025</p>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">

          {/* Introduction */}
          <section>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SwiftFreight (Pty) Ltd (&quot;SwiftFreight,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy and personal information. This Privacy Policy describes how we collect, use, disclose, store, and protect your personal information when you access or use the SwiftFreight platform, website, and mobile application (collectively, the &quot;Platform&quot;). This policy applies to all users of the Platform, including customers, drivers, company owners, dispatchers, and all other registered users.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              In this policy, &quot;personal information&quot; has the meaning assigned to it under the data protection laws of the Kingdom of Lesotho and the Republic of South Africa, including the Protection of Personal Information Act 4 of 2013 (POPIA) of South Africa. We are committed to complying with all applicable data protection laws and regulations in both jurisdictions.
            </p>
          </section>

          {/* 1. Information We Collect */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">1. Information We Collect</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We collect personal information that you provide directly to us, information that is generated through your use of the Platform, and information that is collected automatically through technology. The types of information we collect include:
            </p>

            <h3 className="text-lg font-medium mt-5 mb-2">1.1 Personal Information</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li><strong>Identity Information:</strong> Full name, date of birth, gender, and nationality.</li>
              <li><strong>Contact Information:</strong> Email address, phone number(s), and physical residential or business address.</li>
              <li><strong>Identity Verification Data:</strong> National identity document number (Lesotho National ID or South African ID), passport number, photographs and selfie images submitted for KYC verification, proof of address documents.</li>
              <li><strong>Account Credentials:</strong> Passwords (stored in encrypted, hashed form only), security questions, and two-factor authentication details.</li>
              <li><strong>Business Information:</strong> Company name, registration number, business address, tax registration number, and company ownership details (for company owners and business account holders).</li>
              <li><strong>Payment Information:</strong> Mobile money account details, bank account details for payouts, and transaction history. We do not store full card numbers; payment card processing is handled by our third-party payment processors in compliance with PCI-DSS standards.</li>
            </ul>

            <h3 className="text-lg font-medium mt-5 mb-2">1.2 Location Information</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li><strong>GPS Location:</strong> Real-time GPS coordinates collected from driver mobile devices during active delivery assignments for the purpose of live tracking, route optimisation, and chain-of-custody documentation.</li>
              <li><strong>Address Data:</strong> Pickup and delivery addresses, including geocoded latitude and longitude coordinates, submitted when creating delivery requests.</li>
              <li><strong>Location History:</strong> Historical location data for drivers during completed deliveries, retained for a limited period for dispute resolution and operational analysis.</li>
            </ul>

            <h3 className="text-lg font-medium mt-5 mb-2">1.3 Shipment &amp; Logistics Data</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li><strong>Delivery Details:</strong> Package descriptions, declared values, weights, dimensions, photographs of parcels, and special handling instructions.</li>
              <li><strong>Tracking Information:</strong> Tracking numbers, delivery statuses, timestamps for each stage of the delivery process, and chain-of-custody records including handover signatures and photographs.</li>
              <li><strong>Customs Information:</strong> Customs declaration data, commercial invoice details, and documentation submitted for cross-border shipments between Lesotho and South Africa.</li>
              <li><strong>Transaction Records:</strong> Quotation details, payment records, invoices, and any refund or claims information.</li>
            </ul>

            <h3 className="text-lg font-medium mt-5 mb-2">1.4 Automatically Collected Information</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li><strong>Device Information:</strong> Device type, operating system and version, browser type and version, screen resolution, and unique device identifiers.</li>
              <li><strong>Usage Data:</strong> Pages viewed, features used, time spent on the Platform, click patterns, and navigation paths within the Platform.</li>
              <li><strong>Log Data:</strong> IP address, access times, referring URLs, and error logs.</li>
            </ul>

            <h3 className="text-lg font-medium mt-5 mb-2">1.5 Information from Third Parties</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We may also receive information from third-party sources, including payment processors, identity verification services, background check providers (for driver vetting), credit reference bureaus, and publicly available sources.
            </p>
          </section>

          {/* 2. How We Use Information */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">2. How We Use Information</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We use the personal information we collect for the following purposes, in accordance with the lawful bases established under applicable data protection legislation:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li><strong>Providing and Operating the Platform:</strong> To create and manage your account, authenticate your identity, process delivery requests, facilitate quotations, and enable all core Platform functionality.</li>
              <li><strong>Fulfilling Logistics Services:</strong> To match delivery requests with service providers, facilitate communication between parties, process payments, and manage the end-to-end delivery workflow.</li>
              <li><strong>Real-Time Tracking &amp; Visibility:</strong> To provide live tracking of shipments, generate proof of delivery records, and maintain chain-of-custody documentation.</li>
              <li><strong>Identity Verification &amp; KYC:</strong> To verify user identity, prevent fraud and money laundering, comply with anti-money laundering (AML) and counter-terrorism financing (CTF) regulations, and assign appropriate verification levels.</li>
              <li><strong>Customer Support:</strong> To respond to your enquiries, resolve disputes, process complaints, and provide technical support.</li>
              <li><strong>Communication:</strong> To send you transactional notifications (order confirmations, delivery updates, payment receipts), service-related messages, and, where you have consented, marketing and promotional communications.</li>
              <li><strong>Improvement &amp; Analytics:</strong> To analyse Platform usage, identify trends, improve user experience, optimise operations, and develop new features and services.</li>
              <li><strong>Safety &amp; Security:</strong> To detect, prevent, and address fraud, unauthorised access, security threats, and other harmful or illegal activities.</li>
              <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, legal processes, or enforceable governmental requests, including customs and border control requirements.</li>
              <li><strong>Driver Performance &amp; Operations:</strong> To monitor driver performance, calculate ratings, manage fleet operations, and optimise route planning.</li>
            </ul>
          </section>

          {/* 3. Information Sharing */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">3. Information Sharing</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We do not sell, rent, or trade your personal information to third parties for their marketing purposes. We share your information in the following circumstances:
            </p>

            <h3 className="text-lg font-medium mt-5 mb-2">3.1 With Logistics Partners &amp; Service Providers</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              When you submit a delivery request, your relevant information (name, phone number, pickup and delivery addresses, package details) is shared with the logistics service provider(s) and driver(s) assigned to fulfil your delivery. This sharing is necessary for the performance of the delivery service.
            </p>

            <h3 className="text-lg font-medium mt-5 mb-2">3.2 With Drivers</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Drivers assigned to your delivery will have access to your name, contact phone number, and delivery address information necessary to collect and deliver your shipment. For cross-border shipments, drivers may also have access to customs documentation relevant to the shipment.
            </p>

            <h3 className="text-lg font-medium mt-5 mb-2">3.3 With Customs Authorities</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              For cross-border shipments between Lesotho and South Africa, we may share relevant shipment and customs declaration data with the Lesotho Revenue Authority (LRA), the South African Revenue Service (SARS), and other relevant border control and customs authorities as required by law. This includes sender and recipient details, package descriptions, declared values, and supporting documentation.
            </p>

            <h3 className="text-lg font-medium mt-5 mb-2">3.4 With Other Users</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Customers may see driver names, vehicle details, and ratings. Drivers may see customer names, pickup locations, and delivery addresses. Service providers may see aggregated performance data and customer reviews. We limit the information shared to what is necessary for the specific interaction.
            </p>

            <h3 className="text-lg font-medium mt-5 mb-2">3.5 With Service Vendors</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We share information with third-party service vendors who perform services on our behalf, including payment processing, cloud hosting, SMS and communication delivery, identity verification, analytics, and customer support. These vendors are contractually obligated to process your personal information only as instructed by us and in compliance with applicable data protection laws.
            </p>

            <h3 className="text-lg font-medium mt-5 mb-2">3.6 Legal Requirements</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We may disclose your personal information if required to do so by law, regulation, court order, or governmental authority, or if we believe in good faith that such disclosure is necessary to protect our rights, the safety of our users or the public, investigate fraud, or respond to a government request.
            </p>

            <h3 className="text-lg font-medium mt-5 mb-2">3.7 Business Transfers</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              In the event of a merger, acquisition, reorganisation, bankruptcy, or sale of all or a portion of our assets, user personal information may be transferred to the acquiring entity. We will notify you via email or a prominent notice on the Platform before your personal information becomes subject to a different privacy policy.
            </p>
          </section>

          {/* 4. Data Security */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">4. Data Security</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. Our security measures include:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li><strong>Encryption:</strong> All data in transit is encrypted using TLS 1.2 or higher. Sensitive personal data (such as identity document numbers and passwords) is encrypted at rest using AES-256 encryption.</li>
              <li><strong>Access Controls:</strong> Role-based access control (RBAC) ensures that employees and contractors can access only the personal information necessary for their specific role and function.</li>
              <li><strong>Authentication:</strong> Multi-factor authentication (MFA) is available and recommended for all accounts. Passwords are stored using industry-standard cryptographic hashing algorithms (bcrypt/argon2).</li>
              <li><strong>Infrastructure Security:</strong> Our platform is hosted on secure, SOC 2 compliant cloud infrastructure. Regular security assessments, vulnerability scanning, and penetration testing are conducted.</li>
              <li><strong>Incident Response:</strong> We maintain a data breach response plan and will notify affected users and the relevant data protection authority in accordance with applicable legal requirements in the event of a data breach involving personal information.</li>
              <li><strong>Employee Training:</strong> All employees and contractors with access to personal information receive regular training on data protection and information security best practices.</li>
            </ul>
            <div className="border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30 rounded-lg p-4 my-4">
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                While we implement robust security measures, no method of transmission over the Internet or electronic storage is completely secure. We cannot guarantee absolute security of your personal information. You are responsible for maintaining the confidentiality of your account credentials and for any activities that occur under your account.
              </p>
            </div>
          </section>

          {/* 5. Data Retention */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">5. Data Retention</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We retain your personal information for as long as your account is active or as needed to provide you with the Platform&apos;s services. We also retain personal information as necessary to comply with legal obligations, resolve disputes, enforce our agreements, and protect our rights and the rights of others. Specifically:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li><strong>Account Information:</strong> Retained for the duration of your account and for a period of two (2) years after account deactivation or deletion, unless a longer retention period is required by law.</li>
              <li><strong>Delivery &amp; Transaction Records:</strong> Retained for a minimum of five (5) years from the date of the transaction, in compliance with tax and commercial record-keeping requirements in Lesotho and South Africa.</li>
              <li><strong>Customs Documentation:</strong> Retained for a minimum of seven (7) years from the date of the cross-border transaction, as required by the customs laws of Lesotho and South Africa.</li>
              <li><strong>KYC/Identity Verification Data:</strong> Retained for the duration of your account and for five (5) years after account closure, as required by anti-money laundering regulations.</li>
              <li><strong>GPS/Location Data:</strong> Real-time GPS data is retained for a maximum of ninety (90) days. Historical location data for completed deliveries is retained for one (1) year for dispute resolution purposes.</li>
              <li><strong>Server Logs:</strong> Automatically generated log data is retained for a maximum of ninety (90) days.</li>
              <li><strong>Marketing Communications:</strong> Records of your consent and preferences regarding marketing communications are retained for as long as you maintain an account with us.</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              When personal information is no longer required for the purposes for which it was collected, or when retention is no longer required by law, we will securely delete or anonymise it.
            </p>
          </section>

          {/* 6. User Rights */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">6. User Rights</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              In accordance with applicable data protection laws, including POPIA and the data protection framework of the Kingdom of Lesotho, you have the following rights with respect to your personal information:
            </p>

            <h3 className="text-lg font-medium mt-5 mb-2">6.1 Right of Access</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You have the right to request confirmation of whether we hold personal information about you and to obtain a copy of that information, including details of the purposes for which it is processed and the categories of third parties to whom it has been disclosed.
            </p>

            <h3 className="text-lg font-medium mt-5 mb-2">6.2 Right to Correction</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You have the right to request the correction of any inaccurate, incomplete, or outdated personal information we hold about you. You can update certain information directly through your account settings, or you may submit a correction request to our Data Protection Officer.
            </p>

            <h3 className="text-lg font-medium mt-5 mb-2">6.3 Right to Deletion</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You have the right to request the deletion of your personal information, subject to certain exceptions. We may retain personal information where retention is required by law (e.g., tax, customs, and AML record-keeping requirements), for the establishment, exercise, or defence of legal claims, or where the information is necessary for the legitimate interests of SwiftFreight or third parties. Where complete deletion is not possible, we will restrict processing to the legally required minimum.
            </p>

            <h3 className="text-lg font-medium mt-5 mb-2">6.4 Right to Restrict Processing</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You have the right to request the restriction of processing of your personal information in certain circumstances, such as where you contest the accuracy of the information, processing is unlawful but you prefer restriction over deletion, or we no longer need the information but you require it for legal claims.
            </p>

            <h3 className="text-lg font-medium mt-5 mb-2">6.5 Right to Data Portability</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You have the right to request your personal information in a structured, commonly used, and machine-readable format (e.g., JSON or CSV), and to transmit that information to another service provider where technically feasible.
            </p>

            <h3 className="text-lg font-medium mt-5 mb-2">6.6 Right to Object</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You have the right to object to the processing of your personal information based on our legitimate interests, direct marketing, or profiling. We will cease processing your information for such purposes unless we demonstrate compelling legitimate grounds that override your interests, rights, and freedoms, or for the establishment, exercise, or defence of legal claims.
            </p>

            <h3 className="text-lg font-medium mt-5 mb-2">6.7 Right to Withdraw Consent</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Where processing is based on your consent, you have the right to withdraw that consent at any time. Withdrawal of consent does not affect the lawfulness of processing carried out prior to the withdrawal.
            </p>

            <h3 className="text-lg font-medium mt-5 mb-2">6.8 How to Exercise Your Rights</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To exercise any of the above rights, please submit a written request to our Data Protection Officer at the contact details provided in Section 11 of this policy. We will respond to your request within thirty (30) days, as required by POPIA. In certain circumstances, we may require identity verification before processing your request.
            </p>
          </section>

          {/* 7. Cookies & Tracking */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">7. Cookies &amp; Tracking Technologies</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Platform uses cookies, web beacons, pixels, and similar tracking technologies to enhance your experience, analyse usage patterns, and deliver personalised content. The types of cookies we use include:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li><strong>Strictly Necessary Cookies:</strong> Required for the Platform to function properly, including session management, security features, and load balancing. These cookies cannot be disabled without affecting Platform functionality.</li>
              <li><strong>Performance &amp; Analytics Cookies:</strong> Collect information about how visitors use the Platform, including which pages are visited most often, how users navigate between pages, and whether error messages are encountered. We use this information to improve Platform performance. Data is anonymised and aggregated.</li>
              <li><strong>Functionality Cookies:</strong> Remember your preferences and settings (such as language, theme, and display preferences) to provide a more personalised experience.</li>
              <li><strong>Marketing &amp; Advertising Cookies:</strong> Used to deliver relevant advertisements and track the effectiveness of advertising campaigns. These cookies are set only with your consent.</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You can manage your cookie preferences through your browser settings. Please note that disabling certain cookies may affect the functionality of the Platform. For more detailed information about our use of cookies, including a list of cookies used and their purposes, please refer to our Cookie Policy (available upon request from our Data Protection Officer).
            </p>
          </section>

          {/* 8. Cross-Border Data Transfers */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">8. Cross-Border Data Transfers</h2>
            <div className="border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30 rounded-lg p-4 my-4">
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                Given that SwiftFreight operates between the Kingdom of Lesotho and the Republic of South Africa, personal information collected and processed by the Platform may be transferred, stored, and processed in both countries. Both Lesotho and South Africa are members of the Southern African Development Community (SADC) and share a common customs union (SACU), and data flows between these countries occur regularly in the ordinary course of cross-border business operations.
              </p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Specifically:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li><strong>Cloud Infrastructure:</strong> Our platform may utilise cloud servers located in South Africa and/or other jurisdictions. Where personal information is transferred outside of Lesotho and South Africa, we ensure that appropriate safeguards are in place, including standard contractual clauses, binding corporate rules, or other mechanisms approved by the relevant data protection authority.</li>
              <li><strong>Third-Party Service Providers:</strong> Some of our service vendors may be located outside of Lesotho. We ensure that these vendors are bound by contractual obligations to protect your personal information to standards equivalent to those required by POPIA and applicable Lesotho data protection laws.</li>
              <li><strong>Customs &amp; Regulatory Bodies:</strong> As described in Section 3.3, personal information related to cross-border shipments may be shared with customs authorities in both countries as required by law.</li>
              <li><strong>User Consent:</strong> By using the Platform and providing your personal information, you acknowledge and consent to the transfer of your personal information between Lesotho and South Africa for the purposes described in this Privacy Policy.</li>
            </ul>
          </section>

          {/* 9. Children's Privacy */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">9. Children&apos;s Privacy</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Platform is not directed at, and we do not knowingly collect personal information from, children under the age of eighteen (18) years. If you are under 18, you may not use the Platform or provide any personal information to us. By using the Platform, you represent and warrant that you are at least 18 years of age.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If we discover that we have inadvertently collected personal information from a person under 18 years of age, we will take immediate steps to delete that information from our systems. If you are a parent or guardian and believe that your child has provided personal information to us, please contact our Data Protection Officer immediately.
            </p>
          </section>

          {/* 10. Compliance with POPIA */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">10. Compliance with POPIA</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SwiftFreight is committed to complying with the Protection of Personal Information Act 4 of 2013 (POPIA) of the Republic of South Africa, which applies to the processing of personal information in South Africa and to the processing of personal information of South African data subjects. In accordance with POPIA, we:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li><strong>Lawful Processing (Section 11):</strong> We process personal information only on lawful grounds, including with your consent, where necessary for the performance of a contract, for compliance with a legal obligation, for the protection of legitimate interests (balanced against your rights), or for other purposes permitted under POPIA.</li>
              <li><strong>Minimum Necessary Information (Section 13):</strong> We collect and process only the personal information that is adequate, relevant, and not excessive in relation to the purpose for which it is processed.</li>
              <li><strong>Purpose Specification &amp; Limitation (Section 14):</strong> Personal information is collected for specific, explicitly defined, and lawful purposes and is not processed in a manner incompatible with those purposes.</li>
              <li><strong>Further Processing (Section 15):</strong> Further processing of personal information is carried out only for purposes that are compatible with the original purpose of collection.</li>
              <li><strong>Information Quality (Section 16):</strong> We take reasonable steps to ensure that the personal information we hold is complete, accurate, and up to date.</li>
              <li><strong>Openness (Section 17):</strong> We maintain transparency about our data processing practices through this Privacy Policy and other notices as required.</li>
              <li><strong>Security Safeguards (Section 19):</strong> We implement appropriate, reasonable technical and organisational measures to secure the integrity and confidentiality of personal information and to protect against identified risks.</li>
              <li><strong>Data Subject Participation (Section 23-25):</strong> We respect and facilitate the rights of data subjects as described in Section 6 of this policy, including the rights of access, correction, deletion, restriction, portability, objection, and the right to be notified of data breaches.</li>
              <li><strong>Appointment of an Information Officer:</strong> We have appointed a Data Protection Officer (DPO) / Information Officer responsible for ensuring compliance with POPIA and serving as the point of contact for data subject requests.</li>
            </ul>
          </section>

          {/* 11. Contact DPO */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">11. Contact Our Data Protection Officer</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you have any questions, concerns, or requests regarding this Privacy Policy, our data practices, or your personal information rights, or if you wish to lodge a complaint, please contact our Data Protection Officer / Information Officer:
            </p>
            <div className="bg-muted/50 rounded-lg p-4 my-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong>Data Protection Officer / Information Officer</strong><br />
                SwiftFreight (Pty) Ltd<br />
                Maseru, Kingdom of Lesotho<br /><br />
                <strong>Email:</strong> dpo@swiftfreight.ls<br />
                <strong>Phone:</strong> +266 2XXX XXXX<br />
                <strong>Physical Address:</strong> [Street Address], Maseru 100, Lesotho<br />
                <strong>Business Hours:</strong> Monday – Friday, 08:00 – 17:00 CAT
              </p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We will acknowledge receipt of your request within five (5) business days and will respond substantively within thirty (30) calendar days, as required by POPIA. If you are not satisfied with our response to your request or complaint, you have the right to lodge a complaint with the Information Regulator of South Africa or with the relevant data protection authority in Lesotho.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">12. Changes to This Privacy Policy</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes, we will notify you by posting a prominent notice on the Platform and, where required by law, by sending you an email notification at least fifteen (15) days before the changes take effect. We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
            </p>
          </section>

          <div className="border-t pt-6 mt-8">
            <p className="text-xs text-muted-foreground">
              This Privacy Policy is effective as of June 2025 and applies to all users of the SwiftFreight platform operating between the Kingdom of Lesotho and the Republic of South Africa. By using SwiftFreight, you consent to the collection, use, and sharing of your personal information as described herein.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}