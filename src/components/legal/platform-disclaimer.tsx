'use client';

import { ArrowLeft } from 'lucide-react';
import { useNavStore } from '@/lib/store';
import { Button } from '@/components/ui/button';

export function PlatformDisclaimerPage() {
  const { setView } = useNavStore();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Button variant="ghost" onClick={() => setView('marketing')} className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <h1 className="text-3xl font-bold mb-2">Platform Disclaimer</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: June 2025</p>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">

          {/* Introduction */}
          <section>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This Platform Disclaimer (&quot;Disclaimer&quot;) is an integral part of the Terms of Service and is provided to ensure that all users of the SwiftFreight platform have a clear and unambiguous understanding of the nature of the services provided, the roles of the parties involved, and the limitations of SwiftFreight&apos;s responsibilities. By accessing or using the SwiftFreight platform (the &quot;Platform&quot;), you acknowledge that you have read, understood, and accept the terms of this Disclaimer.
            </p>
          </section>

          {/* 1. Technology Platform Nature */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">1. SwiftFreight Is a Technology Platform</h2>
            <div className="border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30 rounded-lg p-4 my-4">
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                SwiftFreight is, and at all times remains, a technology platform that provides software-based tools and digital infrastructure to facilitate the connection between customers who require logistics and delivery services and independent, third-party logistics service providers who offer such services. SwiftFreight does NOT provide logistics, courier, freight, transportation, warehousing, or delivery services of any kind.
              </p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Platform functions as a digital marketplace and management system. It provides the following technological features:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li>A digital interface for customers to submit delivery requests with detailed specifications (pickup and delivery locations, package details, timing preferences).</li>
              <li>A quotation management system that allows registered logistics service providers to view delivery requests and submit competitive quotes.</li>
              <li>Real-time shipment tracking based on GPS data transmitted by driver devices, displayed to both customers and service providers.</li>
              <li>Communication tools enabling messaging between customers, dispatchers, drivers, and other parties involved in a delivery.</li>
              <li>Payment processing and invoicing tools that facilitate financial transactions between customers and service providers.</li>
              <li>Fleet management, route optimisation, and operational reporting tools for logistics companies.</li>
              <li>Chain-of-custody documentation, proof-of-delivery capture, and package declaration management.</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              These features are provided as software tools only. SwiftFreight does not perform, oversee, or guarantee any physical logistics operations, including but not limited to the collection, handling, transportation, customs clearance, warehousing, or delivery of goods.
            </p>
          </section>

          {/* 2. NOT a Courier, Carrier, or Logistics Provider */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">2. SwiftFreight Is NOT a Courier, Freight Carrier, or Logistics Provider</h2>
            <div className="border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30 rounded-lg p-4 my-4">
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                SwiftFreight does NOT operate as a courier company, a freight carrier, a transportation provider, a customs broker, a warehousing operator, or any other type of logistics service provider. SwiftFreight does NOT own, lease, or operate any vehicles, warehouses, or logistics infrastructure. SwiftFreight does NOT employ, contract, or dispatch drivers. SwiftFreight does NOT handle, collect, transport, store, or deliver any goods, parcels, or shipments.
              </p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Any logistics services facilitated through the Platform — including but not limited to the collection of parcels from senders, transportation by road, border crossing and customs processing, warehousing and consolidation, and final delivery to recipients — are performed exclusively by independent, third-party logistics companies and their employees or contractors who are registered on the Platform.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              When you submit a delivery request on the Platform, you are requesting a service from an independent third-party logistics company, not from SwiftFreight. SwiftFreight&apos;s involvement is limited to providing the technology that enables you to submit your request and connect with available service providers.
            </p>
          </section>

          {/* 3. Independent Third-Party Service Providers */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">3. All Logistics Services Provided by Independent Third Parties</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              All logistics services arranged through the Platform are provided by independent third-party companies (&quot;Service Providers&quot;) who have registered on the Platform. These Service Providers include:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li>Logistics and transport companies operating between Lesotho and South Africa</li>
              <li>Courier and parcel delivery companies</li>
              <li>Freight forwarding and clearing agents</li>
              <li>Customs brokerage firms</li>
              <li>Warehouse operators and consolidation centres</li>
              <li>Individual drivers operating under or on behalf of the above entities</li>
              <li>Sourcing agents who purchase goods on behalf of customers</li>
              <li>Trailer owners who make vehicles available for logistics operations</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              These Service Providers are independent contractors. They are not employees, agents, partners, or joint venturers of SwiftFreight. SwiftFreight does not control, direct, or supervise the day-to-day operations, business practices, or conduct of any Service Provider. Each Service Provider is solely responsible for:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li>The quality, safety, and timeliness of their logistics services</li>
              <li>Maintaining appropriate vehicle insurance, cargo insurance, and public liability insurance</li>
              <li>Compliance with all transport, traffic, and road safety regulations in both Lesotho and South Africa</li>
              <li>Employment, training, and supervision of their drivers and staff</li>
              <li>Proper handling, packaging, and care of goods in transit</li>
              <li>Accurate customs declarations and compliance with import/export regulations</li>
              <li>Setting their own pricing, terms, and conditions of service (subject to Platform guidelines)</li>
            </ul>
          </section>

          {/* 4. Not a Party to Shipment Contracts */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">4. SwiftFreight Is Not a Party to Any Shipment Contract</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              When a customer accepts a quotation from a Service Provider through the Platform, the resulting agreement for logistics services is a contract solely between the customer and the Service Provider. SwiftFreight is not a party to this contract and does not assume any obligations, liabilities, or responsibilities under it.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Specifically:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li>SwiftFreight is not a shipper, consignee, carrier, or bailee of any goods transported through the Platform.</li>
              <li>SwiftFreight does not take possession, custody, or control of any goods at any point during the delivery process.</li>
              <li>The terms and conditions of service, including liability for loss or damage, delivery guarantees, and insurance coverage, are governed by the agreement between the customer and the Service Provider, not by SwiftFreight.</li>
              <li>SwiftFreight does not underwrite, guarantee, or insure any shipment. Any insurance coverage is arranged by and between the customer and/or the Service Provider.</li>
              <li>In the event of a dispute regarding the logistics service (e.g., loss, damage, delay, non-delivery, or quality issues), the dispute is between the customer and the Service Provider. SwiftFreight may, at its sole discretion, assist in facilitating communication but is not obligated to resolve or mediate any such dispute.</li>
            </ul>
            <div className="border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30 rounded-lg p-4 my-4">
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                By using the Platform, you acknowledge and agree that SwiftFreight is an intermediary technology provider only and bears no responsibility for the performance, non-performance, or inadequate performance of any logistics services arranged through the Platform.
              </p>
            </div>
          </section>

          {/* 5. No Guarantee of Delivery Times, Safety, or Condition */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">5. No Guarantee of Delivery Times, Safety, or Condition</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SwiftFreight does not guarantee any of the following:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li><strong>Delivery Times:</strong> Any estimated delivery dates, times, or durations displayed on the Platform are indicative estimates only and are not guaranteed. Actual delivery times may vary significantly due to factors including, but not limited to, road conditions, weather, traffic congestion, border delays, customs inspections, vehicle breakdowns, or other circumstances beyond the control of both SwiftFreight and the Service Provider.</li>
              <li><strong>Safety of Goods:</strong> SwiftFreight does not guarantee the physical safety, security, or integrity of any goods during transit. While Service Providers are expected to exercise reasonable care, SwiftFreight has no control over how goods are handled, loaded, transported, or stored.</li>
              <li><strong>Condition Upon Delivery:</strong> SwiftFreight does not guarantee that goods will arrive in the same condition as when they were collected. Any claims regarding damage, tampering, or deterioration of goods during transit must be directed to the Service Provider who handled the shipment.</li>
              <li><strong>Delivery Completion:</strong> SwiftFreight does not guarantee that any shipment will be successfully delivered. Shipments may be returned, lost, confiscated by customs authorities, or otherwise undeliverable for reasons beyond SwiftFreight&apos;s control.</li>
              <li><strong>Availability of Service Providers:</strong> SwiftFreight does not guarantee that any delivery request will receive a quotation, that a quotation will be accepted, or that a Service Provider will be available for a specific route or timeframe.</li>
              <li><strong>Accuracy of Tracking Data:</strong> While we strive to provide accurate real-time tracking, GPS data may be affected by signal availability, device issues, or other technical limitations. Tracking information should not be relied upon as the sole source of delivery status information.</li>
            </ul>
          </section>

          {/* 6. Users Interact at Their Own Risk */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">6. Users Interact with Service Providers at Their Own Risk</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Users of the Platform interact with Service Providers and other users at their own risk. SwiftFreight does not:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li>Vet, endorse, or guarantee the quality, reliability, or competence of any Service Provider. While we conduct basic KYC verification, this is an identity verification process and does not constitute an endorsement or quality assurance of any Service Provider&apos;s services.</li>
              <li>Verify the accuracy of all information provided by Service Providers, including vehicle insurance status, driver licence validity, or regulatory compliance. Users are encouraged to conduct their own due diligence.</li>
              <li>Guarantee the safety of in-person interactions between customers, drivers, and Service Providers. Users should exercise appropriate caution when meeting in person or sharing personal information.</li>
              <li>Accept responsibility for any financial loss, personal injury, property damage, or other harm arising from interactions between users and Service Providers arranged through the Platform.</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Customers are encouraged to review the profile, ratings, and reviews of Service Providers before accepting a quotation. While ratings and reviews may provide useful information, they represent the subjective opinions of individual users and should not be the sole basis for your decision.
            </p>
            <div className="border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30 rounded-lg p-4 my-4">
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                SwiftFreight strongly recommends that customers obtain adequate insurance coverage for valuable or sensitive shipments. The cost of insurance, if available, may be quoted separately by the Service Provider. SwiftFreight does not provide, arrange, or underwrite insurance of any kind.
              </p>
            </div>
          </section>

          {/* 7. Pricing Indicative and Subject to Change */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">7. Pricing Is Indicative and Subject to Change</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              All pricing information displayed on the Platform is subject to the following important qualifications:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li><strong>Quotations Are Estimates:</strong> Quotations provided by Service Providers through the Platform are indicative estimates based on the information available at the time of quotation. They are not fixed, binding, or guaranteed prices until formally accepted and confirmed by both the customer and the Service Provider.</li>
              <li><strong>Price Variations:</strong> The final price charged for a delivery may differ from the initial quotation due to factors including, but not limited to: actual package weight or dimensions differing from the declared values, changes in fuel prices, additional handling requirements, border processing fees, customs duties, or other surcharges not known or foreseeable at the time of quotation.</li>
              <li><strong>Service Provider Discretion:</strong> Service Providers retain the right to adjust their pricing at any time. The price displayed on the Platform for a given route or service type is the price quoted by the specific Service Provider at that time and may change without notice.</li>
              <li><strong>Additional Costs:</strong> Unless explicitly stated otherwise, quotations do not include customs duties, import VAT, excise taxes, or other government-imposed charges. These additional costs are the responsibility of the customer and may significantly affect the total cost of a cross-border shipment.</li>
              <li><strong>Currency Fluctuations:</strong> For cross-border transactions involving currency conversion between the Maloti (M) and the South African Rand (ZAR), the applicable exchange rate may affect the final amount charged. Exchange rates are determined at the time of payment processing.</li>
              <li><strong>Platform Fees:</strong> SwiftFreight may charge separate platform fees, transaction fees, or subscription fees. These are distinct from the service fees charged by Service Providers and will be clearly disclosed before they are applied.</li>
              <li><strong>No Price Matching:</strong> SwiftFreight does not guarantee the lowest price for any service. Users are encouraged to compare quotations from multiple Service Providers available on the Platform.</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              All amounts displayed on the Platform are in Maloti (M) unless otherwise specified. Users should carefully review the full terms of any quotation before accepting it, including any applicable terms regarding price adjustments, cancellation fees, and refund policies.
            </p>
          </section>

          {/* General Disclaimer */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">8. General Disclaimer</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Platform and all content, features, and functionality are provided on an &quot;as is&quot; and &quot;as available&quot; basis without any representations or warranties of any kind, whether express, implied, or statutory. To the fullest extent permitted by applicable law, SwiftFreight disclaims all warranties, including but not limited to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li>Implied warranties of merchantability, fitness for a particular purpose, and non-infringement.</li>
              <li>Warranties that the Platform will be uninterrupted, timely, secure, or error-free.</li>
              <li>Warranties that the results obtained from the use of the Platform will be accurate or reliable.</li>
              <li>Warranties that any defects or errors in the Platform will be corrected.</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Users acknowledge that they use the Platform and rely on any information or services obtained through the Platform at their own risk and discretion.
            </p>
          </section>

          {/* Acknowledgement */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">9. Your Acknowledgement</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              By using the SwiftFreight Platform, you explicitly acknowledge, understand, and agree that:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li>SwiftFreight is a technology platform and not a logistics service provider.</li>
              <li>All logistics services are provided by independent third-party Service Providers.</li>
              <li>SwiftFreight is not a party to any contract for logistics services between you and a Service Provider.</li>
              <li>SwiftFreight does not guarantee delivery times, safety, condition, or completion of any shipment.</li>
              <li>You interact with Service Providers at your own risk and should exercise due diligence.</li>
              <li>Pricing displayed on the Platform is indicative and subject to change by Service Providers.</li>
              <li>SwiftFreight&apos;s liability is limited as set forth in the Terms of Service and the dedicated Liability Notice.</li>
            </ul>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">10. Contact Information</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you have any questions about this Platform Disclaimer, please contact us:
            </p>
            <div className="bg-muted/50 rounded-lg p-4 my-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong>SwiftFreight (Pty) Ltd</strong><br />
                Maseru, Kingdom of Lesotho<br /><br />
                <strong>Email:</strong> legal@swiftfreight.ls<br />
                <strong>Phone:</strong> +266 2XXX XXXX<br />
                <strong>Physical Address:</strong> [Street Address], Maseru 100, Lesotho
              </p>
            </div>
          </section>

          <div className="border-t pt-6 mt-8">
            <p className="text-xs text-muted-foreground">
              This Platform Disclaimer is effective as of June 2025 and forms an integral part of the SwiftFreight Terms of Service. By using the Platform, you accept this Disclaimer in its entirety.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}