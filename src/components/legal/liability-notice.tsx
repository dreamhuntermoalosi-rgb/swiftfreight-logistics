'use client';

import { ArrowLeft } from 'lucide-react';
import { useNavStore } from '@/lib/store';
import { Button } from '@/components/ui/button';

export function LiabilityNoticePage() {
  const { setView } = useNavStore();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Button variant="ghost" onClick={() => setView('marketing')} className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <h1 className="text-3xl font-bold mb-2">Liability Notice</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: June 2025</p>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">

          {/* Introduction */}
          <section>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This Liability Notice (&quot;Notice&quot;) sets out the full extent and limitations of SwiftFreight (Pty) Ltd&apos;s legal liability in connection with your use of the SwiftFreight platform (the &quot;Platform&quot;). This Notice is an integral part of and should be read in conjunction with the Terms of Service, Privacy Policy, and Platform Disclaimer. By using the Platform, you acknowledge that you have read, understood, and agree to the limitations of liability set out below.
            </p>
            <div className="border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30 rounded-lg p-4 my-4">
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                This Notice contains important limitations on the legal rights and remedies available to you. If you do not understand or do not agree with any part of this Notice, you must discontinue use of the Platform immediately and contact our legal team at legal@swiftfreight.ls before proceeding.
              </p>
            </div>
          </section>

          {/* 1. Platform Is an Intermediary Only */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">1. SwiftFreight Is an Intermediary Technology Provider Only</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SwiftFreight operates solely as an intermediary technology provider. The Platform provides digital tools and software infrastructure that facilitate the connection between customers and independent third-party logistics service providers. SwiftFreight does not:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li>Collect, handle, transport, store, or deliver any goods or parcels.</li>
              <li>Own, operate, or control any vehicles, warehouses, or logistics infrastructure.</li>
              <li>Employ, engage, or supervise any drivers, couriers, or logistics personnel.</li>
              <li>Provide customs brokerage, freight forwarding, or clearing services.</li>
              <li>Enter into contracts for the provision of logistics services as a principal party.</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Accordingly, SwiftFreight&apos;s liability is limited to the provision of the technology platform itself and does not extend to the performance or non-performance of any logistics services arranged through the Platform. All such services are provided by independent third-party service providers, and any liability arising from those services rests solely with the respective service provider.
            </p>
          </section>

          {/* 2. Not Liable for Loss, Damage, Delay, Misdelivery */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">2. Not Liable for Loss, Damage, Delay, or Misdelivery</h2>
            <div className="border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30 rounded-lg p-4 my-4">
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                To the maximum extent permitted by the laws of the Kingdom of Lesotho, SwiftFreight shall NOT be liable for any loss, damage, delay, misdelivery, non-delivery, deterioration, contamination, theft, pilferage, or any other form of harm or deficiency affecting any goods, parcels, or shipments transported through the Platform, regardless of the cause or circumstances.
              </p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Without limiting the generality of the above, SwiftFreight shall not be liable for:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li><strong>Total or Partial Loss of Goods:</strong> Whether caused by theft, accident, fire, natural disaster, or any other cause during collection, transit, warehousing, or delivery.</li>
              <li><strong>Physical Damage to Goods:</strong> Including but not limited to breakage, crushing, water damage, heat damage, freezing, contamination, or any other form of physical deterioration.</li>
              <li><strong>Delivery Delays:</strong> Whether caused by traffic congestion, road conditions, weather, vehicle breakdowns, border delays, customs inspections, documentation issues, or any other cause. SwiftFreight does not guarantee any delivery timeframes, and any estimated delivery dates or times displayed on the Platform are indicative only.</li>
              <li><strong>Misdelivery:</strong> Delivery to an incorrect address, wrong recipient, or incorrect location, regardless of whether the error originated from incorrect address information, driver error, or any other cause.</li>
              <li><strong>Non-Delivery:</strong> Failure to deliver a shipment for any reason, including but not limited to the inability to locate the recipient, recipient refusal to accept delivery, customs seizure, or the Service Provider&apos;s failure to perform.</li>
              <li><strong>Consequential Loss:</strong> Any indirect, incidental, special, consequential, or punitive damages arising from loss, damage, delay, or non-delivery, including but not limited to loss of business, loss of profits, loss of market opportunity, or any financial loss beyond the declared value of the shipment.</li>
              <li><strong>Emotional Distress or Inconvenience:</strong> Any non-economic damages, including emotional distress, inconvenience, frustration, or disappointment arising from shipment issues.</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Any claims for loss, damage, delay, or misdelivery must be directed to the Service Provider who was responsible for the relevant shipment. The applicable terms of service, liability limits, and claims procedures of that Service Provider will govern the resolution of such claims.
            </p>
          </section>

          {/* 3. Not Liable for Actions of Drivers, Carriers, Customs */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">3. Not Liable for Actions of Drivers, Carriers, or Customs Authorities</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SwiftFreight is not liable for any acts, omissions, errors, negligence, misconduct, fraud, or criminal behaviour of any of the following parties:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li><strong>Drivers:</strong> Including but not limited to reckless or negligent driving, vehicle accidents, unprofessional conduct, theft, unauthorised access to goods, diversion of shipments, failure to follow delivery instructions, or any other misconduct by any driver, whether employed, contracted, or engaged by a Service Provider.</li>
              <li><strong>Carriers &amp; Transport Companies:</strong> Including but not limited to failure to collect or deliver goods, improper handling, overloading, use of unroadworthy vehicles, failure to maintain required insurance, regulatory non-compliance, or any other failure in the performance of logistics services.</li>
              <li><strong>Customs Authorities:</strong> Including the Lesotho Revenue Authority (LRA) and the South African Revenue Service (SARS). SwiftFreight is not liable for any delays, seizures, detentions, inspections, assessments, duties, penalties, confiscations, or other actions taken by customs or border control authorities, regardless of whether such actions are justified or erroneous.</li>
              <li><strong>Warehouse Operators:</strong> Including but not limited to damage, loss, or theft of goods while in storage, improper storage conditions, or failure to release goods in a timely manner.</li>
              <li><strong>Sourcing Agents:</strong> Including but not limited to purchasing incorrect items, failure to secure items, misrepresentation of product quality, or any other issues arising from product sourcing services.</li>
              <li><strong>Other Third Parties:</strong> Including payment processors, communication service providers, and any other third parties involved in the delivery ecosystem.</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SwiftFreight does not control, supervise, or direct the conduct of any of the above parties. While we may suspend or remove Service Providers or drivers who violate our platform guidelines, this is a platform governance measure and does not create or imply any duty of care or liability on the part of SwiftFreight.
            </p>
          </section>

          {/* 4. Not Liable for Inaccurate User Information */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">4. Not Liable for Inaccurate Information Provided by Users</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SwiftFreight is not liable for any consequences, damages, or losses arising from inaccurate, incomplete, false, or misleading information provided by any user of the Platform, including but not limited to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li><strong>Incorrect Delivery Addresses:</strong> Inaccurate or incomplete pickup or delivery addresses that result in failed delivery attempts, additional charges, misdelivery, or return of goods.</li>
              <li><strong>Incorrect Recipient Information:</strong> Wrong recipient names, phone numbers, or contact details that prevent successful delivery.</li>
              <li><strong>Inaccurate Package Descriptions:</strong> Misleading or false descriptions of package contents, weight, dimensions, or declared value that result in incorrect quotations, customs issues, or improper handling.</li>
              <li><strong>Undeclared or Misdeclared Goods:</strong> Failure to accurately declare the nature, value, or contents of a shipment, which may result in customs penalties, seizure of goods, legal proceedings, or additional charges.</li>
              <li><strong>Fraudulent Registration Information:</strong> False identity information, business details, or KYC documentation that undermines the integrity of the platform or causes harm to other users.</li>
              <li><strong>Prohibited Items:</strong> Submission of prohibited items for delivery, as described in Section 9 of the Terms of Service, which may result in legal consequences, confiscation, or harm to persons or property.</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Users are solely responsible for the accuracy and completeness of all information they provide on the Platform. SwiftFreight does not independently verify all user-provided information and is not liable for any reliance placed on such information by other users or Service Providers.
            </p>
          </section>

          {/* 5. Maximum Liability Cap */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">5. Maximum Liability Cap</h2>
            <div className="border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30 rounded-lg p-4 my-4">
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                SwiftFreight&apos;s total aggregate liability to any user (whether as a customer, Service Provider, or any other category of user) for all claims arising out of or in connection with the use of the Platform, the Terms of Service, or any related agreement, shall not exceed the GREATER of:
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium mt-2">
                (a) the total platform fees and transaction fees actually paid by that user to SwiftFreight during the twelve (12) month period immediately preceding the event or series of events giving rise to the claim; or
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium mt-2">
                (b) M5,000.00 (five thousand Maloti).
              </p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This maximum liability cap applies regardless of the legal theory on which the claim is based, whether in contract, tort (including negligence), strict liability, statutory liability, or any other legal or equitable theory. This cap is the absolute maximum and represents SwiftFreight&apos;s entire financial exposure to any single user for any and all claims.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The following categories of damages are expressly excluded from the liability cap and are not recoverable from SwiftFreight under any circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li>Indirect, incidental, special, consequential, or punitive damages.</li>
              <li>Loss of profits, revenue, data, goodwill, or business opportunities.</li>
              <li>Loss of use of any goods, equipment, or property.</li>
              <li>The cost of substitute goods or services.</li>
              <li>Any damages arising from loss, damage, delay, or non-delivery of goods (these are the responsibility of the Service Provider).</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Some jurisdictions do not allow the exclusion or limitation of certain liabilities. In such cases, SwiftFreight&apos;s liability shall be limited to the fullest extent permitted by applicable law. Nothing in this Notice is intended to exclude or limit liability for death or personal injury caused by negligence, or for fraud or fraudulent misrepresentation, where such exclusion or limitation is prohibited by law.
            </p>
          </section>

          {/* 6. Indemnification by Users */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">6. Indemnification by Users</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              By using the Platform, you agree to indemnify, defend, and hold harmless SwiftFreight (Pty) Ltd, its directors, officers, employees, agents, affiliates, successors, and assigns (collectively, the &quot;Indemnified Parties&quot;) from and against any and all claims, demands, actions, proceedings, lawsuits, losses, damages, costs, expenses (including reasonable legal fees and attorney&apos;s costs), judgments, fines, penalties, and liabilities (collectively, &quot;Claims&quot;) arising out of or related to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li>Your use of, or inability to use, the Platform.</li>
              <li>Your breach of any provision of the Terms of Service, this Liability Notice, the Privacy Policy, or the Platform Disclaimer.</li>
              <li>Your violation of any applicable law, regulation, or third-party right, including intellectual property rights.</li>
              <li>The submission, shipment, or transportation of prohibited items, as described in the Terms of Service.</li>
              <li>Any inaccurate, false, incomplete, or misleading information you provide on the Platform.</li>
              <li>Your interactions with Service Providers, drivers, or other users of the Platform, whether online or in person.</li>
              <li>Any customs violations, duties, penalties, or legal proceedings arising from your shipments, including incorrect customs declarations, under-declaration of value, or the shipment of restricted or prohibited goods.</li>
              <li>Any claim by a Service Provider, driver, or other user arising from your actions or omissions in connection with the Platform.</li>
              <li>Any claim arising from goods that cause damage, injury, or harm to persons or property during transit.</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SwiftFreight will promptly notify you of any claim for which indemnification is sought and will provide you with reasonable cooperation in the defence of such claim. SwiftFreight reserves the right to participate in the defence of any claim at its own expense. You shall not settle any claim without the prior written consent of SwiftFreight if such settlement would impose any obligation or liability on any of the Indemnified Parties.
            </p>
          </section>

          {/* 7. Insurance Responsibility */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">7. Insurance Responsibility Rests with Service Providers</h2>
            <div className="border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30 rounded-lg p-4 my-4">
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                SwiftFreight does NOT provide, arrange, underwrite, or guarantee any insurance coverage for goods transported through the Platform. The responsibility for maintaining adequate insurance coverage rests entirely with the Service Providers and, where applicable, the customers.
              </p>
            </div>
            <h3 className="text-lg font-medium mt-5 mb-2">7.1 Service Provider Insurance Obligations</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Service Providers registered on the Platform are required to maintain, at their own cost, the following minimum insurance coverage as a condition of their continued use of the Platform:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li><strong>Vehicle Insurance:</strong> Comprehensive motor vehicle insurance for all vehicles used in connection with Platform-facilitated deliveries, valid in both Lesotho and South Africa for cross-border operations.</li>
              <li><strong>Cargo/Transit Insurance:</strong> Goods-in-transit insurance covering the value of goods being transported, with coverage adequate for the types of goods typically handled by the Service Provider.</li>
              <li><strong>Public Liability Insurance:</strong> Public liability insurance covering third-party claims for bodily injury and property damage arising from the Service Provider&apos;s operations.</li>
              <li><strong>Employer&apos;s Liability Insurance:</strong> Where applicable, employer&apos;s liability insurance covering claims by employees, including drivers.</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              While SwiftFreight may require Service Providers to provide proof of insurance as part of the registration and onboarding process, SwiftFreight does not verify the ongoing validity, adequacy, or scope of such insurance. Customers are strongly encouraged to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li>Ask Service Providers about their insurance coverage before accepting a quotation.</li>
              <li>Purchase separate cargo insurance for valuable or high-risk shipments.</li>
              <li>Confirm whether the Service Provider&apos;s insurance covers cross-border transit.</li>
              <li>Understand the terms, conditions, deductibles, and exclusions of any applicable insurance policy.</li>
              <li>Retain all documentation (receipts, photographs, packing lists, commercial invoices) necessary to support an insurance claim in the event of loss or damage.</li>
            </ul>

            <h3 className="text-lg font-medium mt-5 mb-2">7.2 Customer Insurance</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Customers who are shipping valuable, fragile, or high-risk items are strongly advised to obtain their own insurance coverage. This may be arranged through the Service Provider (if offered) or independently through a licensed insurance broker. The cost of insurance is the responsibility of the customer and is separate from the delivery charges quoted on the Platform.
            </p>

            <h3 className="text-lg font-medium mt-5 mb-2">7.3 Claims Process</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              In the event of loss or damage to goods, customers must:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li>Report the issue to the Service Provider and through the Platform within twenty-four (24) hours of the discovery of the loss or damage.</li>
              <li>Document the loss or damage with photographs and a written description.</li>
              <li>Preserve all packaging materials and the goods themselves (unless they pose a safety hazard) until the claim is resolved.</li>
              <li>File the insurance claim directly with the relevant insurance provider, using the documentation provided by the Service Provider.</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SwiftFreight is not a party to any insurance claim and does not act as an intermediary in the claims process between customers, Service Providers, and insurance companies.
            </p>
          </section>

          {/* 8. Force Majeure */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">8. Force Majeure</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SwiftFreight shall not be liable for any failure, delay, or interruption in the provision or availability of the Platform, or for any consequences arising from such failure, delay, or interruption, where such failure, delay, or interruption is caused by circumstances beyond SwiftFreight&apos;s reasonable control. These circumstances (collectively, &quot;Force Majeure Events&quot;) include, but are not limited to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li><strong>Natural Disasters:</strong> Earthquakes, floods, severe storms, cyclones, landslides, wildfires, droughts, or other natural catastrophes.</li>
              <li><strong>Public Health Emergencies:</strong> Pandemics, epidemics, outbreaks of infectious disease, or government-mandated quarantine or lockdown measures (as experienced during the COVID-19 pandemic).</li>
              <li><strong>Government Actions:</strong> War, armed conflict, terrorism, civil unrest, insurrection, rebellion, or military action; changes in laws, regulations, or government policies; trade embargoes, economic sanctions, or import/export restrictions; border closures, travel bans, or immigration restrictions.</li>
              <li><strong>Infrastructure Failures:</strong> Widespread power outages, internet or telecommunications failures, or other utility service disruptions that affect the Platform&apos;s availability.</li>
              <li><strong>Customs &amp; Border Issues:</strong> Border closures, port congestion, strikes by customs officials, changes in customs procedures or requirements, or other disruptions at border crossings between Lesotho and South Africa.</li>
              <li><strong>Labor Disputes:</strong> Strikes, lockouts, work stoppages, or other labour disputes affecting Service Providers, customs authorities, telecommunications providers, or other critical service providers.</li>
              <li><strong>Cybersecurity Incidents:</strong> Denial-of-service attacks, hacking, malware, ransomware, or other cybersecurity incidents affecting the Platform or its underlying infrastructure (notwithstanding our obligation to implement reasonable security measures).</li>
              <li><strong>Transportation Disruptions:</strong> Road closures, fuel shortages, vehicle bans, or other disruptions to the transportation infrastructure of Lesotho or South Africa.</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              In the event of a Force Majeure Event, SwiftFreight will use reasonable efforts to mitigate the impact and restore Platform functionality as soon as practicable. However, SwiftFreight shall not be liable for any losses, damages, or additional costs incurred by users as a result of the Force Majeure Event.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              It is important to note that Force Majeure Events may also affect the performance of logistics services by Service Providers. In such cases, Service Providers may invoke their own force majeure provisions, and the impact on delivery times, costs, and the ability to complete deliveries will be governed by the agreement between the customer and the Service Provider.
            </p>
          </section>

          {/* Severability */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">9. Severability</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If any provision of this Liability Notice is held to be invalid, illegal, or unenforceable by a court of competent jurisdiction, such provision shall be modified to the minimum extent necessary to make it valid, legal, and enforceable, or if modification is not possible, shall be severed from this Notice. The invalidity, illegality, or unenforceability of any provision shall not affect the validity or enforceability of the remaining provisions, which shall continue in full force and effect.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">10. Contact Information</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you have any questions, concerns, or legal inquiries regarding this Liability Notice, please contact us:
            </p>
            <div className="bg-muted/50 rounded-lg p-4 my-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong>SwiftFreight (Pty) Ltd — Legal Department</strong><br />
                Maseru, Kingdom of Lesotho<br /><br />
                <strong>Email:</strong> legal@swiftfreight.ls<br />
                <strong>Phone:</strong> +266 2XXX XXXX<br />
                <strong>Physical Address:</strong> [Street Address], Maseru 100, Lesotho<br />
                <strong>Business Hours:</strong> Monday – Friday, 08:00 – 17:00 CAT
              </p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              For insurance-related claims regarding lost or damaged shipments, please contact the Service Provider who handled your delivery directly, or contact their insurance provider. SwiftFreight cannot process or mediate insurance claims.
            </p>
          </section>

          <div className="border-t pt-6 mt-8">
            <p className="text-xs text-muted-foreground">
              This Liability Notice is effective as of June 2025 and forms an integral part of the SwiftFreight Terms of Service. The limitations of liability set forth herein apply to the maximum extent permitted by the laws of the Kingdom of Lesotho. By using the SwiftFreight platform, you accept these limitations in their entirety.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}