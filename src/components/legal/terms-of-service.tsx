'use client';

import { ArrowLeft } from 'lucide-react';
import { useNavStore } from '@/lib/store';
import { Button } from '@/components/ui/button';

export function TermsOfServicePage() {
  const { setView } = useNavStore();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Button variant="ghost" onClick={() => setView('marketing')} className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: June 2025</p>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">

          {/* 1. Acceptance of Terms */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">1. Acceptance of Terms</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Welcome to SwiftFreight. These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;User,&quot; &quot;you,&quot; or &quot;your&quot;) and SwiftFreight (Pty) Ltd, a company registered in the Kingdom of Lesotho (&quot;SwiftFreight,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). By accessing, registering for, or using the SwiftFreight platform, website, mobile application, or any related services (collectively, the &quot;Platform&quot;), you acknowledge that you have read, understood, and agree to be bound by these Terms, as well as our Privacy Policy, Platform Disclaimer, and Liability Notice, all of which are incorporated herein by reference.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you do not agree with any part of these Terms, you must discontinue use of the Platform immediately. Your continued use of the Platform following the posting of any amendments to these Terms constitutes acceptance of those amendments.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              By creating an account or using the Platform, you represent and warrant that you are at least eighteen (18) years of age, possess the legal capacity to enter into binding agreements, and are not prohibited from using the Platform under any applicable law.
            </p>
          </section>

          {/* 2. Description of Service */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">2. Description of Service</h2>
            <div className="border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30 rounded-lg p-4 my-4">
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                SwiftFreight is a TECHNOLOGY PLATFORM that facilitates the connection between customers seeking logistics and delivery services and independent third-party logistics service providers. SwiftFreight is NOT a courier, freight carrier, transportation company, or logistics provider. We do not directly collect, transport, store, or deliver any goods or parcels.
              </p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Platform provides a digital marketplace and management tool that enables:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li>Customers to submit delivery requests, obtain quotations, track shipments, and communicate with logistics companies operating between Lesotho and South Africa.</li>
              <li>Logistics companies, dispatchers, and drivers to manage delivery operations, fleet assignments, route planning, and customer communications.</li>
              <li>Real-time tracking and chain-of-custody documentation for cross-border shipments.</li>
              <li>Invoicing, payment processing, and transaction management between parties.</li>
              <li>Warehouse management, sourcing assistance, and reporting tools for logistics businesses.</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              All logistics services, including but not limited to the collection, transportation, customs clearance, warehousing, and delivery of goods, are performed exclusively by independent third-party service providers who are registered on the Platform. SwiftFreight&apos;s role is limited to providing the technology infrastructure that enables these interactions.
            </p>
          </section>

          {/* 3. User Accounts & Registration */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">3. User Accounts &amp; Registration</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To access certain features of the Platform, you must register for an account. When registering, you agree to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li>Provide accurate, current, and complete information during the registration process and maintain such information up to date at all times.</li>
              <li>Maintain the security and confidentiality of your account credentials, including your password, and accept all risks of unauthorized access to your account.</li>
              <li>Promptly notify SwiftFreight of any unauthorized use of your account or any other breach of security.</li>
              <li>Not create multiple accounts, impersonate any person or entity, or use false or misleading information during registration.</li>
              <li>Complete the Know Your Customer (KYC) verification process as required by your role and the nature of your intended use of the Platform.</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SwiftFreight reserves the right to suspend or terminate accounts that are found to have provided false, inaccurate, or incomplete information, or that are associated with fraudulent, abusive, or unlawful activity. You are solely responsible for all activities that occur under your account.
            </p>
            <h3 className="text-lg font-medium mt-5 mb-2">3.1 KYC Verification</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Depending on your role and usage level, you may be required to complete identity verification, including but not limited to providing a valid national identity document (Lesotho National ID or South African ID), a selfie verification, proof of residential address, and business registration documents (for company owners). KYC verification levels are designated as Bronze (basic), Silver (standard), and Gold (full), each unlocking different features and transaction limits on the Platform.
            </p>
          </section>

          {/* 4. Role-Based Access */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">4. Role-Based Access</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Platform supports multiple user roles, each with distinct permissions and responsibilities:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li><strong>Customer:</strong> Individuals or businesses that submit delivery requests, receive quotations, make payments, and track their shipments. Customers may also submit product sourcing requests for goods available in South Africa.</li>
              <li><strong>Driver:</strong> Individuals employed by or contracted to a logistics company who are responsible for the physical collection, transportation, and delivery of goods. Drivers must hold a valid driver&apos;s license and comply with all transport regulations in both Lesotho and South Africa.</li>
              <li><strong>Company Owner:</strong> Individuals who own or manage a logistics company registered on the Platform. Company owners have full administrative access to their company&apos;s operations, including user management, fleet management, and financial reporting.</li>
              <li><strong>Dispatcher:</strong> Personnel within a logistics company responsible for coordinating deliveries, assigning drivers to shipments, and managing day-to-day operational logistics.</li>
              <li><strong>Operations Manager:</strong> Senior personnel responsible for overseeing broader operational aspects, including route optimisation, performance monitoring, and strategic decision-making within their company.</li>
              <li><strong>Fleet Manager:</strong> Personnel responsible for managing the company&apos;s vehicle fleet, including maintenance scheduling, vehicle registration, and insurance tracking.</li>
              <li><strong>Sourcing Agent:</strong> Individuals who assist customers with purchasing and sourcing goods from South African retailers, wholesalers, or suppliers on their behalf.</li>
              <li><strong>Trailer Owner:</strong> Individuals or entities that own trailers and make them available for logistics operations through the Platform.</li>
              <li><strong>Warehouse Partner:</strong> Third-party warehouse operators who provide storage, consolidation, and distribution services for shipments passing through the Platform.</li>
              <li><strong>Super Admin:</strong> SwiftFreight personnel with full administrative access to the Platform for maintenance, support, and governance purposes.</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Each role is governed by specific permissions that determine the features and data accessible to that user. Users may not attempt to access features or data outside their assigned role. SwiftFreight reserves the right to modify role permissions at any time.
            </p>
          </section>

          {/* 5. Delivery Requests & Quotations */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">5. Delivery Requests &amp; Quotations</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Customers may submit delivery requests through the Platform by providing details including, but not limited to, the pickup and delivery addresses, package description, weight, dimensions, declared value, and any special handling instructions. The Platform will route delivery requests to registered logistics service providers who may, at their discretion, provide quotations.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              All quotations provided through the Platform are made by the respective logistics service providers, not by SwiftFreight. Quotations are indicative estimates based on the information provided and are subject to change based on actual package weight, dimensions, route conditions, border processing times, and other factors. A quotation becomes a binding agreement only when accepted by the customer and confirmed by the service provider through the Platform.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Quotations are valid for the period specified in the quotation (typically forty-eight [48] hours). Expired quotations require a new request. SwiftFreight does not guarantee that any delivery request will receive a quotation or that a quotation will be accepted by a service provider.
            </p>
          </section>

          {/* 6. Pricing & Payments */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">6. Pricing &amp; Payments</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              All amounts displayed and transacted on the Platform are denominated in Maloti (M), the official currency of the Kingdom of Lesotho, unless otherwise specified. For cross-border shipments between Lesotho and South Africa, the applicable exchange rate shall be determined at the time of quotation or payment processing, and any currency conversion fees shall be disclosed before the transaction is confirmed.
            </p>
            <h3 className="text-lg font-medium mt-5 mb-2">6.1 Pricing</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Delivery pricing is determined solely by the logistics service providers and may vary based on factors including, but not limited to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li>Distance between pickup and delivery points</li>
              <li>Package weight, dimensions, and volume</li>
              <li>Urgency and priority of delivery (standard, express, urgent)</li>
              <li>Cross-border documentation and customs processing requirements</li>
              <li>Fuel costs and toll fees</li>
              <li>Seasonal demand and route availability</li>
              <li>Declared value and insurance requirements</li>
            </ul>
            <h3 className="text-lg font-medium mt-5 mb-2">6.2 Payments</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Payments for delivery services are processed through the Platform using available payment methods, which may include mobile money (e.g., M-Pesa, EcoCash), bank transfers, and other payment gateways as made available from time to time. Payment is due upon acceptance of a quotation unless alternative payment terms have been agreed upon between the customer and the service provider.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SwiftFreight may charge platform fees, transaction fees, or subscription fees for access to certain features. Such fees shall be clearly disclosed before they are charged. Refund and cancellation policies are governed by the terms agreed upon between the customer and the service provider, subject to any applicable consumer protection laws.
            </p>
            <h3 className="text-lg font-medium mt-5 mb-2">6.3 Taxes</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              All prices quoted through the Platform exclude applicable taxes, duties, customs levies, and other government-imposed charges, unless explicitly stated otherwise. Customers are responsible for any import duties, VAT, customs clearance fees, and other charges levied by the customs authorities of Lesotho or South Africa, as applicable.
            </p>
          </section>

          {/* 7. Shipment & Packaging Rules */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">7. Shipment &amp; Packaging Rules</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Customers are responsible for ensuring that all items submitted for delivery are properly packaged, labelled, and prepared for transportation in accordance with the following requirements:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li>All packages must be securely sealed and labelled with the correct sender and recipient information, including full names, physical addresses, and contact phone numbers.</li>
              <li>Fragile items must be clearly marked as &quot;FRAGILE&quot; and packed with appropriate cushioning and protective materials.</li>
              <li>Perishable goods must be packed with appropriate insulation and temperature-control measures, and the customer must inform the service provider of the nature of the goods.</li>
              <li>Liquid items must be sealed in leak-proof containers and placed in waterproof packaging.</li>
              <li>Electronic items must be protected against static damage and physical impact, with batteries removed where applicable in compliance with transport regulations.</li>
              <li>All shipments must be accompanied by an accurate package declaration, including a truthful description of contents, estimated value, weight, and dimensions.</li>
              <li>Customers must not under-declare or misrepresent the value or nature of goods being shipped, as this may result in customs violations, penalties, or shipment confiscation.</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Service providers reserve the right to refuse collection of any package that does not meet the above packaging standards or that appears to contain prohibited items. In such cases, the customer will be notified and any pre-paid fees will be refunded in accordance with the applicable cancellation policy.
            </p>
          </section>

          {/* 8. Cross-Border Shipments */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">8. Cross-Border Shipments</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SwiftFreight facilitates logistics services between the Kingdom of Lesotho and the Republic of South Africa. Cross-border shipments are subject to the laws, regulations, and procedures of both countries, including but not limited to customs laws, immigration requirements, and trade agreements.
            </p>
            <h3 className="text-lg font-medium mt-5 mb-2">8.1 Customs &amp; Border Procedures</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              All cross-border shipments must comply with the customs requirements of both the Lesotho Revenue Authority (LRA) and the South African Revenue Service (SARS). This includes, but is not limited to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li>Completion and submission of accurate customs declarations, including the SACU (Southern African Customs Union) Customs Declaration form where required.</li>
              <li>Payment of applicable import duties, VAT, excise duties, and other levies as determined by the relevant customs authority.</li>
              <li>Provision of all required documentation, including commercial invoices, packing lists, certificates of origin, and import/export permits where applicable.</li>
              <li>Compliance with any import restrictions, quotas, or licensing requirements applicable to the specific goods being shipped.</li>
            </ul>
            <h3 className="text-lg font-medium mt-5 mb-2">8.2 Duties &amp; Taxes</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              As Lesotho and South Africa are both members of the Southern African Customs Union (SACU), goods moving between the two countries may be subject to reduced or zero customs duties for qualifying SACU-origin goods. However, VAT and other domestic taxes may still apply. The customer is ultimately responsible for determining and paying all applicable duties and taxes. SwiftFreight and the service providers do not provide tax advice and shall not be held liable for any duties, taxes, or penalties imposed by customs authorities.
            </p>
            <h3 className="text-lg font-medium mt-5 mb-2">8.3 Delays at Border Posts</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Cross-border shipments may experience delays due to customs inspections, documentation issues, border congestion, regulatory changes, or other factors beyond the control of SwiftFreight and the service providers. Estimated delivery times provided through the Platform do not account for potential border delays and are not guaranteed.
            </p>
          </section>

          {/* 9. Prohibited Items */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">9. Prohibited Items</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The following categories of items are strictly prohibited from being shipped through the Platform:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li>Illegal substances, narcotics, and controlled drugs as defined under the laws of Lesotho and South Africa.</li>
              <li>Weapons, ammunition, explosives, and related components (including fireworks and flares).</li>
              <li>Hazardous materials, including flammable liquids, corrosive substances, radioactive materials, toxic substances, and compressed gases, unless properly declared and shipped in compliance with the applicable dangerous goods regulations.</li>
              <li>Counterfeit goods, pirated materials, and any items that infringe upon intellectual property rights.</li>
              <li>Pornographic, obscene, or offensive material.</li>
              <li>Live animals (unless shipped through authorised and specialised live animal transport providers with appropriate documentation and permits).</li>
              <li>Perishable food items that require refrigeration during transit, unless the service provider has confirmed capacity and the customer has made appropriate arrangements.</li>
              <li>Stolen goods or goods obtained through fraudulent means.</li>
              <li>Government-issued identification documents (passports, national IDs) unless being shipped in connection with an authorised application process.</li>
              <li>Cash, coins, negotiable instruments, and precious metals in quantities exceeding the limits prescribed by the relevant customs authorities.</li>
              <li>Any items the export, import, or transit of which is prohibited, restricted, or regulated under the laws of Lesotho, South Africa, or international sanctions regimes.</li>
            </ul>
            <div className="border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30 rounded-lg p-4 my-4">
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                Violation of this prohibition may result in immediate account termination, reporting to law enforcement authorities, and the user being held fully liable for any legal consequences, fines, penalties, or damages arising from the shipment of prohibited items.
              </p>
            </div>
          </section>

          {/* 10. Liability Limitations */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">10. Liability Limitations</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To the maximum extent permitted by applicable law in the Kingdom of Lesotho:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li>SwiftFreight shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from or related to the use of the Platform, including but not limited to loss of profits, data, goodwill, or business opportunities.</li>
              <li>SwiftFreight shall not be liable for any loss, damage, delay, misdelivery, or non-delivery of goods shipped through the Platform, as all logistics services are provided by independent third-party service providers.</li>
              <li>SwiftFreight shall not be liable for any actions, omissions, errors, or negligence of drivers, carriers, customs authorities, warehouse operators, or any other third parties involved in the shipment process.</li>
              <li>SwiftFreight does not guarantee the accuracy, completeness, or reliability of any information, quotations, or delivery estimates provided through the Platform.</li>
              <li>SwiftFreight&apos;s total aggregate liability arising out of or in connection with these Terms shall not exceed the total fees paid by the user to SwiftFreight during the twelve (12) months preceding the event giving rise to the claim, or M5,000.00 (five thousand Maloti), whichever is greater.</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              For a more comprehensive statement of liability limitations and indemnification obligations, please refer to our dedicated Liability Notice document.
            </p>
          </section>

          {/* 11. Intellectual Property */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">11. Intellectual Property</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              All content, features, functionality, software, and design of the Platform, including but not limited to text, graphics, logos, icons, images, audio, video, data compilations, page layout, underlying code, and software (collectively, &quot;Content&quot;) are the exclusive property of SwiftFreight (Pty) Ltd or its licensors and are protected by copyright, trademark, patent, trade secret, and other intellectual property laws of the Kingdom of Lesotho, South Africa, and international treaties.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The SwiftFreight name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of SwiftFreight (Pty) Ltd. You may not use, reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any Content from the Platform without our prior written consent, except as expressly permitted by these Terms or as required for the normal use of the Platform.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Users retain ownership of any content they submit to the Platform (such as delivery requests, reviews, and messages). By submitting content to the Platform, you grant SwiftFreight a non-exclusive, worldwide, royalty-free, perpetual, irrevocable licence to use, reproduce, modify, adapt, publish, translate, distribute, and display such content in connection with the operation and improvement of the Platform.
            </p>
          </section>

          {/* 12. Termination */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">12. Termination</h2>
            <h3 className="text-lg font-medium mt-5 mb-2">12.1 Termination by User</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You may terminate your account at any time by contacting our support team or through the account settings within the Platform. Upon termination, your right to use the Platform will cease immediately. Any pending deliveries or active transactions will be completed in accordance with the terms agreed upon with the respective service provider.
            </p>
            <h3 className="text-lg font-medium mt-5 mb-2">12.2 Termination by SwiftFreight</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SwiftFreight reserves the right to suspend or terminate your account, restrict your access to the Platform, or take any other action it deems necessary if:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li>You breach any provision of these Terms.</li>
              <li>You engage in fraudulent, illegal, or abusive activity.</li>
              <li>Your account is associated with repeated complaints from other users or service providers.</li>
              <li>You provide false or misleading information during registration or KYC verification.</li>
              <li>Required by law, regulation, or a court or governmental order.</li>
              <li>We reasonably believe that your account has been compromised or is being used in an unauthorised manner.</li>
            </ul>
            <h3 className="text-lg font-medium mt-5 mb-2">12.3 Effect of Termination</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Upon termination, the provisions of these Terms that by their nature should survive termination shall remain in effect, including but not limited to liability limitations, indemnification, intellectual property rights, and dispute resolution provisions. Data retained in accordance with our Privacy Policy and applicable data retention laws may be preserved even after account termination.
            </p>
          </section>

          {/* 13. Dispute Resolution */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">13. Dispute Resolution</h2>
            <h3 className="text-lg font-medium mt-5 mb-2">13.1 Governing Law</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the Kingdom of Lesotho, without regard to its conflict of law principles.
            </p>
            <h3 className="text-lg font-medium mt-5 mb-2">13.2 Informal Resolution</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              In the event of any dispute, claim, or controversy arising out of or relating to these Terms or the use of the Platform, you agree to first attempt to resolve the dispute informally by contacting SwiftFreight&apos;s support team. We will attempt to resolve the dispute within thirty (30) days of receiving notice of the dispute.
            </p>
            <h3 className="text-lg font-medium mt-5 mb-2">13.3 Jurisdiction</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If the dispute cannot be resolved informally, you irrevocably submit to the exclusive jurisdiction of the courts of the Kingdom of Lesotho, specifically the High Court of Lesotho and the subordinate courts of Maseru District. You waive any objection to the laying of venue in any such court and agree not to plead or claim in any such court that any such action brought in any such court has been brought in an inconvenient forum.
            </p>
            <h3 className="text-lg font-medium mt-5 mb-2">13.4 Disputes with Service Providers</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Disputes arising between customers and third-party service providers regarding the actual logistics services (including but not limited to loss, damage, delay, or quality of service) are matters between those parties. SwiftFreight may, at its sole discretion, assist in facilitating communication or resolution but is not a party to any such dispute and shall not be compelled to participate in any proceedings related thereto.
            </p>
          </section>

          {/* 14. Amendments to Terms */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">14. Amendments to Terms</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SwiftFreight reserves the right to amend, modify, or update these Terms at any time at its sole discretion. When we make material changes to these Terms, we will:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li>Update the &quot;Last updated&quot; date at the top of these Terms.</li>
              <li>Provide notice of the changes through the Platform (via in-app notification, email, or banner notice) at least fifteen (15) days before the amended terms take effect.</li>
              <li>Require your express consent for changes that significantly alter your rights or obligations, where required by applicable law.</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your continued use of the Platform after the effective date of any amendments constitutes your acceptance of the revised Terms. If you do not agree with the amended Terms, you must discontinue use of the Platform and may request account deletion by contacting our support team.
            </p>
          </section>

          {/* 15. Contact Information */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">15. Contact Information</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you have any questions, concerns, or feedback regarding these Terms of Service, please contact us using the following details:
            </p>
            <div className="bg-muted/50 rounded-lg p-4 my-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong>SwiftFreight (Pty) Ltd</strong><br />
                Maseru, Kingdom of Lesotho<br /><br />
                <strong>Email:</strong> legal@swiftfreight.ls<br />
                <strong>Phone:</strong> +266 2XXX XXXX<br />
                <strong>Physical Address:</strong> [Street Address], Maseru 100, Lesotho<br />
                <strong>Business Hours:</strong> Monday – Friday, 08:00 – 17:00 CAT (Central Africa Time)
              </p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              For urgent delivery-related issues, please use the in-app messaging feature or contact the relevant service provider directly through the Platform.
            </p>
          </section>

          <div className="border-t pt-6 mt-8">
            <p className="text-xs text-muted-foreground">
              These Terms of Service are effective as of June 2025 and apply to all users of the SwiftFreight platform. By using SwiftFreight, you acknowledge that you have read, understood, and agree to be bound by these Terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}