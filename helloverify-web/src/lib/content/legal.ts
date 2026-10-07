/**
 * Legal documents -- operative text ported VERBATIM from the live site.
 *
 * SOURCE. `D:\Projects\Application Frontend HV`, English only:
 * `public/cms/en/policies.base.json` (6 documents) and
 * `public/cms/en/privacyPolicy.cards.json` (the 28 privacy cards). Those two
 * files are what production renders -- `components/policy/PolicyPageFromCms`
 * fetches them for `en` and falls back to `src/pages/policy/*.tsx` only when
 * the fetch fails -- so the JSON is the live text and the 2,949 lines of TSX
 * are its fallback. Every string below was extracted by script from the JSON
 * and never retyped, because retyping legal text is how a clause loses a
 * "not". The ~55%-translated hi/ar policies were ignored: this site serves
 * `en`.
 *
 * THE TWO OLD SOURCES DISAGREE, in about 30 small editorial ways, and the
 * JSON wins here because the JSON is what the live site renders. Measured:
 * of 321 ported strings, 263 appear byte-for-byte in the TSX fallback too, 3
 * appear once the TSX's typographic quotes are folded to ASCII, and 55 differ
 * or are absent -- 21 of those because `RefundPolicyPage.tsx` is a 38-line
 * stub reading "See English refund policy for full details.". The rest are
 * the TSX being the staler copy: lowercase list openers, "Hello Verify" with
 * a space, "dismissal..", "adjustments." with no closing bracket, and a
 * lawful-basis TABLE the JSON has rewritten as prose. Reported, NOT fixed --
 * this port has no mandate to edit legal text, in either direction.
 *
 * VERBATIM means verbatim. No rewriting, no summarising, no typography
 * repair. Curly apostrophes, em dashes, the U+2192 arrows in the browser
 * instructions and the U+26A0 U+FE0F warning sign are the old copy's own and
 * are reproduced as-is. Two things could not survive the type: `body` is
 * `string[]`, so the old copy's bulleted lists and inline subheadings both
 * arrive as ordinary paragraphs, and its `mailto:`/`href` links arrive as
 * plain text. The rejected alternative was adding list/subheading/link
 * variants to `LegalSection` -- a renderer change, out of scope for a port,
 * and the fidelity loss is presentational rather than operative.
 *
 * WHAT IS HERE (BUILD-SPEC §4: legal pages port verbatim from the existing
 * site). 8 documents here, 6 there:
 *   privacy-policy               privacy (28 sections)  25/27 sections   67648 chars
 *   terms-of-service             terms (5)               6/15 sections    6008 chars
 *   cookie-policy                cookie (7)             10/11 sections    4325 chars
 *   acceptable-use-policy        -- none                 0/7  sections       0 chars
 *   data-processing-addendum     -- none                 0/11 sections       0 chars
 *   refund-policy                refund (2)              2/7  sections    2052 chars
 *   equal-opportunities          equalOpportunities (12) 12/12 sections   12537 chars
 *   criminal-convictions-policy  criminalConvictions (11) 11/11 sections   12923 chars
 *
 * STILL OWED BY COUNSEL. A port is not a review. Every section below is the
 * text production already serves, which restores parity -- it does not mean
 * anyone has approved it for this site, and `effective` therefore still
 * reads "Awaiting legal sign-off" on all 8 documents. COUNSEL SIGN-OFF
 * BEFORE CUTOVER IS STILL OWED, for the ported text as much as the pending.
 *
 * PENDING, and why -- these are the sections that actually need drafting,
 * not porting. `body: null` renders the visible pending state, and the
 * template's own `drafted < sections.length` test keeps the "awaiting legal
 * copy" banner on every document that has one:
 *
 *   privacy-policy -- 2 of 27 pending:
 *     sub-processors: no sub-processor register exists on the old site; the
 *       only old text is the generic 'For external processing' paragraph,
 *       already ported to `sharing`
 *     candidates: the old policy has no candidate-facing section; its
 *       'HelloVerify applicants and employees' block is about HelloVerify's
 *       own staff and is ported to `what-we-collect`
 *
 *   terms-of-service -- 9 of 15 pending:
 *     definitions: old Terms of Use has no definitions clause
 *     services: old Terms of Use governs the website only; it never describes
 *       the verification services
 *     your-obligations: no client obligations clause, and nothing on consent
 *       to verify
 *     fees: no fees, payment or tax clause
 *     turnaround: no service levels or turnaround commitment
 *     accuracy: the old 'as is' disclaimers are about the accuracy of website
 *       materials, not of verification reports; porting them here would
 *       misstate what they disclaim, so they went to `liability` instead
 *     confidentiality: no confidentiality clause; the one mention runs the
 *       other way ('deemed to be non-confidential', ported to `ip`)
 *     indemnity: no indemnity clause
 *     law: no governing law or dispute-resolution clause
 *
 *   cookie-policy -- 1 of 11 pending:
 *     categories: the old policy declares four categories under one 'Types of
 *       Cookies We Use' heading and has no category-overview text; each of
 *       the four has its own section, so there is nothing left for this one
 *
 *   acceptable-use-policy -- 7 of 7 pending:
 *     purpose: no acceptable-use policy exists on the old site
 *     consent-required: no acceptable-use policy exists on the old site
 *     prohibited: no acceptable-use policy exists on the old site; the old
 *       Terms' submission restrictions are about website comments, not use of
 *       the verification service
 *     discrimination: no acceptable-use policy exists on the old site
 *     data-handling: no acceptable-use policy exists on the old site
 *     reporting: no acceptable-use policy exists on the old site
 *     enforcement: no acceptable-use policy exists on the old site
 *
 *   data-processing-addendum -- 11 of 11 pending:
 *     roles: no DPA exists on the old site
 *     scope: no DPA exists on the old site
 *     instructions: no DPA exists on the old site
 *     confidentiality: no DPA exists on the old site
 *     security-measures: no DPA exists on the old site
 *     sub-processing: no DPA exists on the old site
 *     assistance: no DPA exists on the old site
 *     breach: no DPA exists on the old site; the privacy policy's XIII. Data
 *       Breach Notification is a notice, not a contractual undertaking, and
 *       lifting it into a contract is a drafting decision for counsel
 *     transfers: no DPA exists on the old site
 *     audit: no DPA exists on the old site
 *     deletion: no DPA exists on the old site
 *
 *   refund-policy -- 5 of 7 pending:
 *     unverifiable: the old copy on this is item '05. Unable to Verify Case
 *       Status' inside the numbered 01-08 not-eligible list; lifting it out
 *       would leave a hole in that numbering, so it stays in `non-refundable`
 *     consent-refused: the old refund policy says nothing about a subject
 *       refusing consent
 *     re-runs: the old refund policy offers no corrections or free
 *       re-verification
 *     how-to-request: the old policy gives only a cancellation address
 *       (scfhs@helloverifyksa.com, inside item 01) and no refund-request
 *       route
 *     timeframes: the old refund policy states no timeframe or refund method
 *
 * OLD COPY WITH NO DESTINATION HERE. Computed, not guessed: every card of
 * the two source files is flattened and looked up in this file. Old sections
 * the skeleton had no heading for got a section of their own under the old
 * title, in the old order. Only two runs are left out:
 *   privacy / content            III. Policy Content                                 all 14    runs    570 chars  <- a table of contents; the template renders its own
 *   terms / copyright            Copyright                                           all 1     runs     47 chars  <- the site footer carries the copyright line
 *
 *   plus 6 old subheading runs not reproduced as body text, because this
 *   file re-expresses them as the section's own `h`:
 *     privacy / share: 'Data retention'
 *     cookie / types: '1. Strictly Necessary Cookies (Essential)'
 *     cookie / types: '2. Performance & Analytics Cookies'
 *     cookie / types: '3. Functional Cookies'
 *     cookie / types: '4. Targeting & Advertising Cookies'
 *     cookie / manage: '3. Third-Party Opt-Out'
 *
 * To fill a pending section: replace `body: null` with the approved
 * paragraphs. Do not paste anything here that counsel has not seen.
 */

export type LegalSection = { id: string; h: string; body: string[] | null };

export type LegalDoc = {
  slug: string;
  title: string;
  summary: string;
  effective: string;
  sections: LegalSection[];
};

const s = (id: string, h: string, body: string[] | null = null): LegalSection => ({ id, h, body });

export const LEGAL: LegalDoc[] = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    summary:
      "What personal data HelloVerify collects, why, who it is shared with, how long it is kept, and the rights you have over it.",
    effective: "Awaiting legal sign-off",
    sections: [
      s("who-we-are", "Who we are", [
        "HelloVerify and its registered entities (collectively, \"HelloVerify\", \"we\", \"us\", or \"our\") are background screening organizations that provide services including, but not limited to, employment screening, background verification, occupational health screening, primary source verification, and reporting (collectively, the \"Services\") to clients who have a legitimate and lawful purpose for conducting such screening. This Privacy Policy applies to the website www.helloverify.com (the \"Website\") and to all services owned and operated by HelloVerify and its registered entities:",
        "HelloVerify Inc.",
        "HelloVerify India Pvt. Ltd.",
        "HelloVerify Document Verification Follow- Up Services Co. L.L.C.",
        "HelloVerify Ai Pte. Ltd.",
        "HelloVerify Ai Company",
        "HelloVerify is dedicated to protecting your personal information and will make every reasonable effort to handle collected information appropriately. This Privacy Policy (\"Policy\") describes how HelloVerify treats information collected or provided in connection with an end user's (\"you\", \"user\", or \"client\") use of HelloVerify products and background screening services (the \"Services\"). This privacy statement covers the data collected by HelloVerify. We are committed to protecting privacy and information provided by end users to enable HelloVerify to complete its Services.",
        "Your use of and interaction with HelloVerify's online portals indicates your acknowledgement of this privacy policy. Where required by applicable law, we will obtain your explicit consent before collecting or processing your personal or sensitive personal data. By voluntarily providing your personal information, you consent to its collection, use, and disclosure for the purposes described in this Privacy Policy. If you do not agree with this Privacy Policy, you may choose not to use our online portals or provide personal information. Please note that certain services may not be available without the required information.",
        "This Policy applies to individuals whose personal data (including sensitive personal data, where applicable) is processed by HelloVerify, including applicants, clients, employees, and business partners. HelloVerify generally acts as a data processor when processing personal data on behalf of its clients, in accordance with client instructions and applicable law. HelloVerify acts as a data controller (or equivalent under applicable law) with respect to personal data it processes for its own internal business operations, including human resources administration and employee management.",
      ]),
      s("what-we-collect", "Personal data we collect", [
        "Personally Identifiable Information",
        "Personally Identifying Information (\"PII\") means such information that can potentially identify you, such as your name, date of birth and address. It does not include anonymized, aggregate or statistical information.",
        "PII that we collect and hold about an individual will vary depending upon the background checks required by the client and the information the individual supplies to us. We process personal data based on applicable legal grounds, including consent, contractual necessity, legal obligations, and legitimate interests where permitted by law. Processing of sensitive personal data is conducted in accordance with applicable laws and subject to additional safeguards and consent requirements where applicable. Publicly available information is collected only from lawful and reliable sources and in accordance with applicable laws.",
        "PII we may collect and hold",
        "Contact information — name (including previous names or aliases), email address, telephone number, residential address, and location",
        "Identity information — government-issued identification numbers (as permitted by law), passport number, driver's licence number, date of birth, place of birth, and other identifiers necessary for identity verification",
        "Address history",
        "Criminal records — arrests, charges, convictions, and related records, as permitted under applicable law",
        "Credit information — credit history, payment records, judgments, or other financial characteristics, where legally permitted",
        "Education history and qualifications — university accreditation, certification history",
        "Employment history and professional experience",
        "Professional licences and certifications",
        "Right-to-work information — residency, sanctions, immigration status",
        "Occupational health and drug screening results",
        "References and opinions provided by third parties",
        "Directorships, corporate affiliations, and governance information — claims, judgments, insolvency, current and previous directorships, character, personal reputation",
        "Publicly available information — including information from social, print, or online media sources",
        "Primary source verification — verification of educational, employment, or professional credentials as required by applicable legal or regulatory authorities",
        "Any additional information — as requested by the client and permitted under applicable law",
        "From clients and individuals, we may collect information related to conducting a background check and billing and payment details. From clients we may collect company address and the name, email and phone number of system users. From sources of our background checks we may collect the name and job title of the person who supplied us with the information.",
        "HelloVerify applicants and employees",
        "For individuals applying for employment with HelloVerify, we may collect the same categories of information described for candidates to assess suitability for employment and, where applicable, to conduct background verification. You may choose to provide further information during recruitment, including interview-related disclosures or supporting documentation.",
        "For individuals employed by HelloVerify, we may collect and process personal information necessary for employment administration, including personal interests and voluntarily provided information; professional background and employment history; identity information (date of birth, identification documents, nationality, citizenship, immigration status, and work authorization); diversity information (such as gender, ethnicity, disability, veteran status, or similar data for statistical and compliance purposes, processed in accordance with applicable laws and, where required, maintained separately from identifying information); employment records; and compensation and benefits information (including payroll, tax, banking, insurance, benefits enrolment, and, where necessary, limited medical information required for administering employee benefits).",
        "For employees located in Singapore, KSA, and UAE, HelloVerify complies with applicable employment data protection obligations in each jurisdiction, including rules on monitoring, records retention, and cross-border HR data transfers.",
        "Website and cookies",
        "When you visit our Website, we may collect technical and usage-related information, including IP address, device identifiers, domain name, approximate location, referring webpage, pages visited, time spent on each page, browsing behaviour (including interactions with third-party links), and other analytical or diagnostic data. This information is collected through cookies and similar tracking technologies.",
        "We may also collect personal information you voluntarily provide for business or sales inquiries, including name, job title, organization, email address, telephone number, and mailing address.",
        "You can use the Cookie Manager to learn more about the online tracking technologies we use and to review or set your preferences. The Cookie Manager is presented when you first visit a webpage or opened by selecting Cookie Preferences in the website footer. Blocking, disabling, or rejecting cookies may cause services to not function properly. Disabling cookies does not disable other online tracking technologies, but prevents those technologies from accessing details stored in cookies.",
        "We recognize the importance of privacy issues and respect the confidentiality of PII individuals or clients provide to us. We collect and deal with PII in accordance with local laws and this Privacy Policy (as amended from time to time).",
        "How do we collect information?",
        "Information you provide directly, such as application forms, onboarding documents, and other materials submitted during the verification process",
        "Information collected through your interactions with us, our systems, or authorized third parties during the course of providing our services",
        "Information provided by our clients through client portals or by applicants through our applicant portal, where applicant details are uploaded and accessed by authorized HelloVerify users",
        "In connection with a client's request for background verification services, HelloVerify and/or its clients may collect personal data directly from the individual or from authorized sources, in accordance with applicable law. We collect and process this information solely for legitimate business purposes, including the delivery and improvement of our services.",
      ]),
      /** V. Information Used by HelloVerify, then VII. General Exceptions --
       *  two old sections, one new heading, because VII is the old policy's
       *  second list of processing purposes (and carries the communications
       *  monitoring disclosure). Nothing else in the new skeleton covers it. */
      s("why", "Why we process it, and our lawful basis", [
        "HelloVerify collects and uses personal information to perform services requested by our clients or applicants. This information may be collected through online portals, electronic communications (including email), or other authorized means, and may include:",
        "Verification of applicant identity",
        "Conducting background checks based on information provided by clients or applicants",
        "Performing quality assurance and audit checks",
        "Investigating discrepancies or disputes",
        "Issuing necessary communications, including adverse action notices",
        "Communicating with clients regarding their use of the Services",
        "Providing updates, alerts, or changes related to our Services",
        "We may also collect limited system or usage-related information (such as log information) to support service delivery, system security, and performance monitoring. Any such use will be proportionate and, where required, based on appropriate consent.",
        "HelloVerify processes personal data only for specified and lawful purposes and ensures that appropriate consent is obtained where required under applicable data protection laws. Personal information may be stored, processed, and retained only for as long as necessary to fulfill these purposes or to comply with legal and regulatory requirements.",
        "HelloVerify may collect, use, monitor, store, or disclose personal information where necessary under the following circumstances:",
        "To comply with applicable laws, regulations, legal processes, or enforceable governmental requests",
        "To operate, maintain, and improve our business and services",
        "To protect the security, integrity, and functionality of our systems and platforms",
        "To enforce our Terms of Use or other contractual rights, and to investigate potential violations",
        "Any such activities will be carried out in accordance with applicable law and with appropriate safeguards in place. To ensure compliance with our Terms of Use and to maintain the security of our services, HelloVerify may monitor information processed through its systems. Such monitoring is limited to what is necessary and proportionate and may include automated filtering of electronic communications to identify and prevent spam, malicious code, unauthorized access, or unlawful content.",
        "HelloVerify may engage third-party service providers to deliver certain aspects of its services. Where necessary, personal information may be shared with such service providers solely for the purpose of delivering the services, and subject to appropriate contractual, confidentiality, and data protection obligations. Where required under applicable law, we will obtain appropriate consent prior to processing or sharing personal information. All disclosures will be made in accordance with this Privacy Policy and applicable legal requirements.",
      ]),
      s("consent", "Consent, and how to withdraw it", [
        "Clients and candidates may at any time withdraw their consent for personal data stored with HelloVerify by providing written notice to privacy@helloverify.com.",
        "Withdrawal of consent will be processed as soon as reasonably practicable and within applicable legal timelines from the date of receipt, subject to verification and applicable legal or contractual obligations. Withdrawal may impact our ability to continue providing certain services, including background verification activities, where processing of personal data is necessary for service delivery.",
        "HelloVerify will process such requests in accordance with applicable data protection laws and will take appropriate steps to cease processing and, where applicable, delete or anonymize personal data, unless retention is required for legal, regulatory, or contractual purposes.",
        "Requests relating to withdrawal of consent and other data subject rights (DSRs) will be addressed within the timelines prescribed under applicable data protection laws, or where no specific timeline is prescribed, within fifteen (15) business days of receiving a valid request.",
      ]),
      /** VI. Information We Share, cut at its own "Data retention" subheading;
       *  the three paragraphs after that subheading are in `retention` below. */
      s("sharing", "Who we share data with", [
        "We do not share personally identifiable information with companies, organizations and individuals outside HelloVerify unless one of the following circumstances applies:",
        "With client and applicant consent",
        "We may share an applicant's personal information with clients, employers, or other authorized parties for employment verification and related services. Where required by applicable law, such sharing will be based on the explicit consent of the individual.",
        "For external processing",
        "HelloVerify may engage trusted third-party service providers and partners, including background verification agencies, data processors, identity verification providers, IT service providers, auditors, legal advisors, and accounting professionals. Such third parties are granted access only to information necessary to perform their designated functions and are contractually obligated to maintain confidentiality, implement appropriate security measures, and process personal data only in accordance with our instructions and applicable law.",
        "For legal reasons",
        "We may disclose personal information, including personal and sensitive personal data, if we believe in good faith that such disclosure is necessary to:",
        "Comply with any applicable law, regulation, legal process or enforceable governmental request",
        "Enforce applicable Terms of Service, including investigation of potential violations",
        "Detect, prevent, or otherwise address fraud, security or technical issues",
        "Protect against harm to the rights, property or safety of HelloVerify, our clients, applicants, users or the public as required or permitted by law",
        "For business transfers",
        "In the event of a merger, acquisition, restructuring, or sale of assets, personal information may be transferred as part of the transaction. HelloVerify India will ensure that the confidentiality of such information is maintained and that affected individuals are provided with appropriate notice, where required.",
      ]),
      s("sub-processors", "Sub-processors"),
      /** XVI. Information Processing & Storage + XVII. International -- Onward
       *  Transfer, in old document order. XVI is here rather than in `security`
       *  because its subject is WHERE data is processed, which is the transfer
       *  question; the new skeleton has no storage-location section. */
      s("transfers", "International transfers", [
        "HelloVerify processes and stores personal data using secure systems and infrastructure. Depending on client requirements and the nature of services, such data may be stored and processed in appropriate jurisdictions in accordance with applicable laws and contractual obligations.",
        "Our systems operate in secure environments designed to protect personal data against unauthorized access, accidental loss, natural disasters, and other potential risks. Where necessary, HelloVerify may engage authorized service providers or partners to process or store personal data for purposes such as service delivery, backup, or retention, subject to appropriate contractual, confidentiality, and security safeguards.",
        "In the course of providing services, personal data may be transmitted to authorized sources or recipients across different jurisdictions for verification purposes, subject to applicable cross-border transfer requirements. Such transfers will be conducted in accordance with applicable data protection laws and contractual commitments.",
        "HelloVerify may transfer or disclose personal data (including sensitive personal data) to recipients located in different jurisdictions where necessary to provide its services. Such transfers may occur in connection with background verification activities—for example, where an individual has lived, studied, or worked in another country, it may be necessary to share personal data with relevant overseas entities, including employers, educational institutions, references, or verification agencies, in order to validate the information provided.",
        "The jurisdictions to which personal data may be transferred will depend on the nature and scope of the services and may include countries with differing levels of data protection. HelloVerify ensures that such cross-border transfers are conducted in accordance with applicable data protection laws and contractual obligations, and that appropriate safeguards are implemented. Cross-border transfers may use Standard Contractual Clauses, adequacy decisions, binding corporate rules, or other mechanisms approved by the applicable data protection authority.",
        "HelloVerify may also disclose personal data to affiliates, service providers, regulatory authorities, or law enforcement agencies, including those located in different jurisdictions, where such disclosure is necessary to provide services, comply with applicable law, or respond to valid legal requests.",
      ]),
      s("retention", "How long we keep data", [
        "HelloVerify retains personal data only for as long as necessary to fulfill the purposes for which it was collected, including providing services, responding to inquiries, complying with contractual obligations, or meeting legal and regulatory requirements.",
        "Unless otherwise required by jurisdiction-specific law or agreed with the client, personal data is retained for an active use period of up to one (1) year. Exceptions may be applied based on documented client requirements or applicable legal obligations. Personal data may be stored in electronic or physical formats, including secure servers, backup systems, and paper records. Access is restricted to authorized personnel on a need-to-know basis.",
        "After the active retention period, data may be securely archived for a limited duration and subsequently deleted, anonymized, or destroyed in accordance with internal data retention and disposal policies. Data used in testing or development environments is retained only for as long as necessary and is subject to appropriate safeguards. Each internal function within HelloVerify is responsible for ensuring that data it creates, processes, stores, or manages is handled and disposed of in accordance with this policy.",
      ]),
      /** X. Online Tracking, Analytics & Email Communications, whole. */
      s("online-tracking", "Online tracking, analytics and email communications", [
        "HelloVerify may send periodic informational, service-related, or promotional communications to its clients. Clients may opt out of such communications by connecting with their concerned account manager or sending an email to HelloVerify (see Section XIX for contact details).",
        "It may take up to 15 business days to process opt-out requests. We send service-related communications as necessary to fulfill contractual obligations, while promotional communications are sent based on consent or legitimate business interests, where permitted by law. We use cookies and similar technologies, and where required, obtain consent prior to their use. Users may manage preferences through cookie settings.",
      ]),
      /** XI. Security & Confidentiality + XV. Protection of Information. The old
       *  policy states its safeguards twice under two headings; the new skeleton
       *  has one, so both are here and neither is dropped. */
      s("security", "How we protect it", [
        "HelloVerify implements appropriate administrative, technical, and physical safeguards to protect personal data that we collect, process, and store. These safeguards are designed to protect against unauthorized access, use, alteration, disclosure, or destruction of personal data, and to ensure the confidentiality, integrity, and availability of such information. Security measures include, but are not limited to:",
        "Secure transmission of data using industry-standard encryption protocols (such as SSL/TLS)",
        "Network security controls, including firewalls and intrusion protection mechanisms",
        "Access controls, including role-based access and password protection",
        "Physical security measures at facilities where data is stored or processed",
        "Periodic monitoring and assessment of security controls",
        "We take reasonable steps to ensure that personal information, including sensitive identifiers (such as government-issued identity numbers), is protected from foreseeable risks. While we strive to use commercially acceptable means to protect personal information, no method of transmission over the internet or electronic storage is completely secure. Accordingly, we cannot guarantee absolute security. If you have any questions regarding our security practices, please contact us using the details provided in this Privacy Policy.",
        "HelloVerify provides adequate safeguards to protect and secure information we maintain about clients. We maintain a comprehensive information security program aligned with ISO/IEC 27001 standards and applicable client-specific security requirements. These safeguards include encryption, secure network architecture, system hardening, access controls, physical security measures and continuous monitoring to ensure the protection of personal data.",
        "We periodically review and update our security controls to address evolving threats, risks, and regulatory requirements.",
      ]),
      /** XII. Use of Artificial Intelligence Technologies, whole. */
      s("ai", "Use of artificial intelligence technologies", [
        "HelloVerify is committed to the ethical, secure, and transparent use of artificial intelligence (\"AI\") technologies in the delivery of its background verification services. HelloVerify utilises AI technologies to assist in the processing, analysis, and quality assurance of personal information submitted as part of background verification.",
        "The AI capabilities currently deployed include Optical Character Recognition (\"OCR\") for automated extraction of text from identity documents, qualification certificates, and other verification documents; Document Forensics for AI-assisted analysis to detect indicators of document tampering, forgery, digital manipulation, and metadata or pixel-level anomalies; and Document Blurriness Detection for automated quality assessment of uploaded document images to ensure legibility prior to processing.",
        "All AI processing is conducted on enterprise-tier infrastructure where candidate data remains encrypted within HelloVerify's isolated processing environment. HelloVerify does not permit any AI vendor to use candidate or client data for model training, fine-tuning, or any purpose beyond the delivery of HelloVerify's services.",
        "HelloVerify does not use AI tools to make any automated decisions that produce legal effects or similarly significant impacts on candidates. All AI outputs are advisory in nature and are subject to mandatory review by a trained human operator before any finding is acted upon or any verification report is finalised. No verification report is published without human sign-off.",
        "Data controllers retain the right to request that their candidates' documents be processed without the use of AI tools. Where such a request is made as part of the written agreement, HelloVerify will accommodate manual processing as an alternative, which may affect processing timelines. Any use of AI processing is conducted in accordance with applicable data protection laws across HelloVerify's operating jurisdictions. HelloVerify's clients retain ultimate responsibility for employment, engagement, or other decisions made on the basis of verification reports; HelloVerify provides verification outputs and findings, and the client makes all final decisions relating to the individual candidate.",
      ]),
      /** XIII. Data Breach Notification, whole. */
      s("breach", "Data breach notification", [
        "HelloVerify maintains a data breach response procedure. In the event of a personal data breach, HelloVerify will promptly assess the nature and scope of the breach and take appropriate remedial measures. Where required by applicable law, HelloVerify will notify the relevant data protection authority and/or affected individuals within the timeframe prescribed by law, and in no event later than 72 hours from becoming aware of the breach where such notification is legally mandated.",
        "Breach notifications will include the nature of the breach, categories and approximate number of individuals affected, likely consequences, and measures taken or proposed to address the breach.",
      ]),
      /** XIV. Compliance & Regulatory Cooperation, whole. */
      s("regulatory", "Compliance and regulatory cooperation", [
        "HelloVerify regularly reviews and updates its practices to ensure compliance with this Privacy Policy and applicable data protection laws. We comply with applicable legal and regulatory requirements, including information technology, privacy, and data protection laws. We may disclose personal data to regulatory authorities, law enforcement agencies, or government bodies where such disclosure is necessary to comply with applicable law or valid legal processes.",
      ]),
      s("your-rights", "Your rights, including erasure and access", [
        "Clients are responsible for ensuring that their contact and related information is accurate and up to date. In the event of any change or inaccuracy, clients should promptly update such information with their employer or client, or may request HelloVerify to assist in updating the same.",
        "Applicants may review, access, and change certain account information (such as email address, phone number and mailing address) via the applicant portal. Requests to change certain other information, such as identity numbers, may require verification before the change is accepted. Applicants can request deletion of certain information in HelloVerify's control by contacting us through the details provided at the end of this Privacy Policy, subject to applicable legal and contractual requirements. Individuals may also have the right to restrict or object to processing and to request data portability, where applicable.",
        "Applicants can dispute background check reports through the applicant portal or by directly contacting their employer/client (requestor). Once a client, such as an employer, has received a background check report, HelloVerify does not control the client's use, storage, or retention of such information. Clients are independently responsible for complying with applicable data protection laws in their handling of such data.",
        "HelloVerify retains personal data only for as long as necessary to fulfill the purposes for which it was collected, including providing services, complying with legal obligations, preventing fraud, resolving disputes, enforcing agreements, and supporting investigations. Retention may continue even after closure of accounts or completion of services, where required for legal, regulatory, or legitimate business purposes. Where deletion is requested, HelloVerify will take reasonable steps to delete or anonymize personal data, unless retention is required under applicable law or contractual obligation.",
        "HelloVerify will be unable to proceed with the provision of services to clients in the absence of necessary permissions or consent from the individual subject to the background verification.",
      ]),
      s("candidates", "If you are a candidate being verified"),
      s("children", "Children's data", [
        "HelloVerify's services are not directed to minors (children as defined under applicable law), and we do not knowingly collect personal data from individuals who are considered minors in the relevant jurisdiction.",
        "In the event that personal data relating to a minor is required to be processed as part of our services, HelloVerify will ensure that appropriate consent or authorization is obtained from a parent or legal guardian, in accordance with applicable legal requirements. If we become aware that personal data has been collected from a minor without the required parental or legal guardian consent, we will take reasonable steps to delete such information as soon as practicable, unless retention is required to comply with applicable legal or regulatory obligations. We may implement additional safeguards where required under applicable laws when processing personal data relating to children.",
      ]),
      s("changes", "Changes to this policy", [
        "We reserve the right to modify HelloVerify's privacy policy at any time, which will be published on our website. If we make material changes to this privacy policy, we will notify users by means of a notice on our home page. By continuing to use our websites and services after a revision takes effect, it is considered that users have read and understand the changes. You have the right to withdraw your consent at any time, subject to applicable legal or contractual obligations.",
      ]),
      s("contact", "How to contact us or complain", [
        "HelloVerify has established a grievance redressal mechanism to address concerns, complaints, or requests related to the processing of personal data. HelloVerify has designated appropriate personnel responsible for handling such requests in accordance with applicable laws.",
        "In jurisdictions where applicable laws require the appointment of a Grievance Officer, Data Protection Officer, or similar designated authority, such responsibilities are fulfilled through the contact details provided below:",
        "Group Data Protection Officer (DPO)",
        "Email: privacy@helloverify.com",
        "This contact point is designated exclusively for privacy-related queries, data protection concerns, and grievances regarding the processing of personal data. Requests will be addressed within the timelines prescribed under applicable data protection laws.",
        "Please note that this contact should not be used for technical support or login-related issues concerning HelloVerify platforms.",
      ]),
      /** XX-XXVIII, the jurisdiction supplements, whole and in the old order.
       *  Each one's own subheadings stay as body paragraphs. */
      s("us-supplement", "United States — privacy supplement", [
        "This United States Privacy Supplement (\"Supplement\") applies to the extent that HelloVerify processes personal data in connection with individuals located in the United States, including where data is received from clients, data sources, or other authorized parties. Where such processing occurs, HelloVerify is committed to handling personal data in a manner consistent with applicable U.S. legal and regulatory frameworks and recognized data protection standards. This Supplement should be read in conjunction with the Global Privacy Policy. In the event of any inconsistency, this Supplement will govern with respect to U.S.-related data processing.",
        "Applicability of U.S. laws",
        "To the extent applicable, HelloVerify aligns its practices with relevant U.S. federal and state laws governing personal data, including:",
        "Fair Credit Reporting Act (FCRA)",
        "Driver's Privacy Protection Act (DPPA)",
        "Gramm-Leach-Bliley Act (GLBA)",
        "Applicable U.S. state privacy laws (e.g., California Consumer Privacy Act (CCPA), as amended by CPRA, and other state-level privacy laws)",
        "Where HelloVerify operates as a Consumer Reporting Agency (CRA) or provides services that fall within the scope of FCRA, it aligns with FCRA obligations, including permissible purpose requirements, consumer disclosure rights, dispute resolution and reinvestigation obligations, accuracy and data minimization standards, and user certification and monitoring. HelloVerify applies these principles where relevant to the nature of the service being delivered and the role it performs (e.g., service provider, processor, or contractor), even where it is not directly subject to jurisdiction.",
        "Role in background screening",
        "HelloVerify generally acts as a service provider to its clients and does not independently determine the purpose of processing U.S. personal data in most cases. Where services provided by HelloVerify fall within the scope of consumer reporting activities under U.S. law, HelloVerify supports its clients in meeting applicable obligations, including processing data only for legitimate and authorized purposes, supporting accuracy and data quality measures, enabling dispute resolution workflows where applicable, and implementing appropriate safeguards for sensitive personal data. Clients remain responsible for ensuring compliance with their specific regulatory obligations, including providing notices, obtaining authorizations, and managing consumer rights where required.",
        "Distribution of personally identifiable information",
        "HelloVerify seeks to limit the distribution of personally identifiable information consistent with the nature and sensitivity of the information. HelloVerify strives to make available personally identifiable information from sources other than public records or publicly available information only to its authorized users or clients. Similarly, where applicable, HelloVerify strives to restrict access to information in accordance with privacy laws such as the FCRA, the GLBA, and the DPPA and comparable state statutes. In the case of public record information available to the general public (such as bankruptcy, liens, judgments, criminal records and Uniform Commercial Code filings) and publicly available information, we may limit disclosure to authorized parties.",
        "If, upon investigation, HelloVerify finds that personally identifiable information has been used or accessed inappropriately or unlawfully, HelloVerify strives to take reasonable steps to stop the misuse or access, educate the user concerning the appropriate use of the information, and prevent similar future misuses. Such steps may include discontinuation of the user's access to HelloVerify information products and services, pursuit of other legal remedies, and referral of misuse to the appropriate authorities.",
        "Data accuracy and rights",
        "HelloVerify strives to accurately report information in its products and information received from its data sources. HelloVerify takes reasonable steps to maintain data accuracy and encourages individuals to report inaccuracies through the appropriate client or designated contact channels. HelloVerify recognizes that reporting errors may occur and, where applicable, provides consumers with the opportunity to dispute and correct information we report, as described further in Access & correction below.",
        "Sensitive information safeguards",
        "HelloVerify strives to provide additional safeguards for sensitive personally identifiable information, such as Social Security numbers and driver's licence numbers. HelloVerify strives to limit the availability and access to full Social Security Numbers (\"SSNs\"), Driver's License Numbers and State Identification Numbers, and to protect the confidentiality of SSNs by limiting access to certain legitimate and authorized users. A limited number of public records may contain SSNs already available to the public; if such public records are accessed through HelloVerify services, our services may provide access to such SSNs. HelloVerify prohibits the unlawful disclosure of SSNs and takes steps to limit the availability of DLNs and state identification card numbers.",
        "Education",
        "HelloVerify is committed to promoting responsible data handling practices and raising awareness among its employees, clients, and users regarding the appropriate use of its products and services. HelloVerify provides guidance on privacy and security considerations associated with HelloVerify information products and services, and on the responsible use of personally identifiable information. HelloVerify also seeks to make information available to the public, where appropriate, regarding responsible use of personally identifiable information, measures HelloVerify has undertaken to enhance consumer privacy, and choices available to consumers regarding information access and the ability to opt out of certain products and services which utilize personally identifiable information.",
        "Reputable sources",
        "HelloVerify strives to acquire personally identifiable information from established, reputable sources in the government and private sectors. HelloVerify takes reasonable steps to assess the reputation and reliability of its private sector data sources before incorporating personally identifiable information from the source into its products and services. HelloVerify also strives to obtain assurances from its data suppliers that they have the legal right to license or sell the data to HelloVerify.",
        "Cross-border processing",
        "Where U.S.-origin personal data is transferred outside the United States, such transfers are conducted in accordance with contractual obligations with clients, applicable data protection requirements, and appropriate safeguards to ensure data protection standards are maintained.",
        "Access & correction",
        "HelloVerify provides a central point of contact for individuals seeking information about its privacy practices and the processing of personal information. HelloVerify strives to inform individuals about the nature of the public records, non-public information, and publicly available information that HelloVerify makes available in its information products and services. HelloVerify also strives, whenever practicable, to provide consumers, upon request, with meaningful opportunities to review personally identifiable information we maintain about them, and to provide opportunities for consumers to dispute and correct information by assisting them in identifying potential information sources at which corrections should be made.",
        "Accountability",
        "HelloVerify maintains internal policies, procedures, and controls designed to support compliance with applicable data protection requirements. It promotes responsible data handling practices across its operations and engages with relevant stakeholders to maintain appropriate privacy and security standards.",
        "Online privacy",
        "HelloVerify strives to protect the privacy of personally identifiable information obtained over the Internet and strives to apply our data privacy principles and evolving standards to the online environment.",
        "Identity theft",
        "HelloVerify strives to prevent the acquisition of information from its products and services for improper purposes, such as identity theft. Where a state law requires notice, HelloVerify complies with the law. In those states where notification laws do not exist, HelloVerify follows its Information Security Breach Response and Notification Policy, which provides that affected individuals will be notified when sensitive personally identifiable information owned or licensed by HelloVerify is acquired by an unauthorized individual and whenever HelloVerify has a reasonable basis to believe the breach has resulted in, or there is a significant risk that it will result in, identity theft to the consumer to whom the information relates.",
        "Compliance",
        "HelloVerify maintains a comprehensive information security and privacy program, which may be subject to periodic internal and external assessments. Such measures are designed to evaluate the effectiveness of administrative, technical, and physical safeguards and to support ongoing compliance with applicable standards and contractual obligations.",
        "Consumer reporting activities (where applicable)",
        "In limited circumstances, the services provided by HelloVerify may align with activities regulated under the U.S. Fair Credit Reporting Act (\"FCRA\"). HelloVerify primarily operates as a service provider to its clients and typically processes personal information on their behalf. To the extent applicable, HelloVerify supports its clients in complying with relevant legal requirements, including use of personal information for legitimate and authorized purposes, data accuracy and quality, and processes for dispute resolution and correction of information. Clients are responsible for ensuring compliance with applicable legal obligations, including establishing permissible purpose, providing required notices, and managing consumer rights.",
        "Regulatory framework",
        "Where relevant, HelloVerify aligns its practices with applicable U.S. laws, including the FCRA, the California Investigative Consumer Reporting Agencies Act (ICRAA), where applicable, and other relevant federal and state privacy laws. Regulatory oversight of such frameworks may involve authorities such as the Federal Trade Commission (FTC) and the Consumer Financial Protection Bureau (CFPB).",
        "Investigative consumer reports (California)",
        "Under California law, an investigative consumer report may include information regarding an individual's character, general reputation, personal characteristics, or mode of living. To the extent HelloVerify supports the preparation or processing of such reports on behalf of clients, such activities are conducted in accordance with client instructions, applicable law, and appropriate safeguards.",
        "Contact us",
        "To obtain additional information about the privacy practices and policies of HelloVerify in connection with its preparation and processing of investigative consumer reports, please contact: Email: privacy@helloverify.com",
      ]),
      s("eea-supplement", "EEA and UK — privacy supplement", [
        "This European Economic Area (EEA) and United Kingdom (UK) Privacy Supplement applies to the processing of personal data relating to individuals located in the EEA and the UK by HelloVerify, in accordance with applicable data protection laws, including the General Data Protection Regulation (EU) 2016/679 (\"GDPR\") and the UK GDPR. This Supplement should be read in conjunction with the Global Privacy Policy. In the event of any inconsistency, this Supplement shall prevail with respect to personal data originating from the EEA and the UK.",
        "Scope of processing",
        "HelloVerify may process personal data originating from the EEA or UK in connection with the provision of its global background verification and related services, on behalf of clients and in accordance with their instructions, contractual obligations, and applicable data protection laws. Personal data may be processed for purposes including identity verification, employment and credential verification, fraud prevention, and compliance with legal or regulatory requirements. HelloVerify may obtain personal data from individuals, clients, or authorized third-party sources. The personal data processed is limited to what is necessary and proportionate for the specified purposes. HelloVerify primarily acts as a service provider or processor on behalf of its clients.",
        "Legal basis for processing",
        "Consent of the individual, where required",
        "Performance of a contract",
        "Compliance with legal or regulatory obligations",
        "Legitimate interests pursued by HelloVerify or its clients, where such interests are not overridden by the rights and freedoms of the individual",
        "Purpose of processing",
        "Identity verification and background screening",
        "Verification of education, employment, and professional credentials",
        "Compliance with legal, regulatory, and client requirements",
        "Fraud prevention, risk management, and security monitoring",
        "Service delivery, quality assurance, and audit activities",
        "Data sharing and onward transfers",
        "HelloVerify may share personal data with clients, affiliates, and authorized service providers for the purposes described in this Policy. Where personal data is transferred outside the EEA or UK, HelloVerify ensures that appropriate safeguards are implemented, including Standard Contractual Clauses (SCCs) or other legally recognized transfer mechanisms, and contractual, organizational, and technical safeguards designed to protect personal data. Such transfers are carried out in accordance with applicable data protection laws.",
        "Data subject rights",
        "Right to access personal data",
        "Right to rectify inaccurate or incomplete data",
        "Right to request erasure of personal data (subject to legal and contractual limitations)",
        "Right to restrict processing",
        "Right to object to processing, where applicable",
        "Right to data portability, where applicable",
        "Requests may be submitted using the contact details below. Where HelloVerify processes personal data on behalf of a client, such requests may be directed to or coordinated with the relevant client.",
        "Security and data integrity",
        "HelloVerify implements appropriate technical and organizational measures to protect personal data against unauthorized access, loss, misuse, or alteration. Personal data is processed in a manner that ensures its accuracy, integrity, and confidentiality, and is limited to what is necessary for the purposes for which it is processed.",
        "Data retention",
        "Personal data is retained only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, or as required to comply with applicable legal, regulatory, or contractual obligations.",
        "Complaints",
        "Individuals have the right to lodge a complaint with the relevant data protection authority in their country of residence, place of work, or place of the alleged infringement. HelloVerify encourages individuals to contact us first so that we may address any concerns directly.",
        "Contact us",
        "For any questions, requests, or concerns relating to this Supplement, please contact: Email: privacy@helloverify.com",
      ]),
      s("ch-supplement", "Switzerland — privacy supplement", [
        "This Switzerland Privacy Supplement applies to the processing of personal data relating to individuals located in Switzerland in accordance with the Swiss Federal Act on Data Protection, as revised in 2023 (\"revFADP\"). This Supplement should be read in conjunction with the Global Privacy Policy and, where applicable, the EEA and UK Privacy Supplement. In the event of any inconsistency, this Supplement shall prevail with respect to personal data originating from Switzerland.",
        "Scope of processing",
        "HelloVerify may process personal data originating from Switzerland in connection with the provision of background verification and related services. HelloVerify primarily acts as a service provider and processes personal data on behalf of its clients in accordance with their instructions, contractual obligations, and applicable laws.",
        "Purpose of processing",
        "Identity verification and background screening",
        "Verification of employment, education, and professional credentials",
        "Compliance with legal or regulatory requirements",
        "Fraud prevention and risk management",
        "Service delivery, audit, and quality assurance",
        "Personal data processed is limited to what is necessary and proportionate for these purposes.",
        "Data sharing and onward transfers",
        "Standard Contractual Clauses or equivalent contractual safeguards",
        "Transfers to jurisdictions recognized as providing adequate protection",
        "Other legally recognized transfer mechanisms",
        "Data subject rights",
        "Access their personal data",
        "Request correction of inaccurate or incomplete data",
        "Object to certain processing, where applicable",
        "Request deletion, subject to legal and contractual limitations",
        "Requests may be submitted using the contact details below. Where HelloVerify processes personal data on behalf of a client, such requests may be directed to or coordinated with the relevant client.",
        "Security and retention",
        "HelloVerify implements appropriate technical and organizational measures to protect personal data and to ensure its confidentiality, integrity, and availability. Personal data is retained only for as long as necessary to fulfill the purposes outlined in this Privacy Policy or as required by applicable law.",
        "Contact us",
        "For any questions, requests, or concerns relating to this Supplement, please contact: Email: privacy@helloverify.com",
      ]),
      s("in-supplement", "India — privacy supplement", [
        "This India Privacy Supplement applies to the processing of personal data by HelloVerify in India and should be read in conjunction with the Global Privacy Policy. HelloVerify processes personal data in India in connection with the provision of its Services, including background verification, identity verification, and related activities, as well as for its internal business operations and services offered to clients and individuals within India. This Supplement is to be read in light of the Digital Personal Data Protection Act, 2023 (\"DPDP Act\") and any rules notified thereunder.",
        "Scope and role of processing",
        "On behalf of clients, where HelloVerify acts as a service provider and processes data in accordance with client instructions",
        "For its own legitimate business purposes, where HelloVerify determines the purpose and means of processing in accordance with applicable law",
        "In all cases, personal data is processed only for lawful purposes and in compliance with applicable data protection requirements.",
        "Purpose of processing",
        "Conducting background verification and identity checks",
        "Verifying employment, education, and professional credentials",
        "Complying with legal, regulatory, and client requirements",
        "Preventing fraud, misconduct, and unauthorized activities",
        "Delivering and improving services, including quality assurance and audits",
        "Managing client relationships and internal operations",
        "Lawful processing",
        "HelloVerify processes personal data based on consent and other lawful grounds as permitted under applicable law. Where consent is required, HelloVerify will ensure that such consent is obtained in a clear and informed manner. Individuals may withdraw their consent at any time, subject to applicable legal or contractual requirements. Withdrawal of consent may affect the ability of HelloVerify to provide certain services where such processing is necessary.",
        "Notice and transparency",
        "HelloVerify provides individuals with appropriate notice regarding the collection and use of personal data, including the purpose of processing, categories of data processed, and available rights, in accordance with applicable legal requirements. Where HelloVerify processes personal data on behalf of clients, such notice may be provided by the relevant client.",
        "Data sharing",
        "Clients and authorized parties for the purpose of service delivery",
        "Affiliates and group entities",
        "Third-party service providers engaged to support the Services",
        "Cross-border transfers",
        "Personal data may be processed or transferred outside India where necessary for the provision of Services. HelloVerify ensures that such transfers are carried out in accordance with applicable legal requirements and subject to appropriate safeguards.",
        "Individual rights",
        "Access information about the personal data being processed",
        "Request correction or updating of personal data",
        "Request deletion of personal data, subject to applicable limitations",
        "Withdraw consent",
        "Raise concerns or grievances regarding processing",
        "Data security and retention",
        "HelloVerify implements appropriate technical and organizational measures to protect personal data and ensure its confidentiality, integrity, and availability. Personal data is retained only for as long as necessary to fulfill the purposes for which it was collected or as required by applicable law or contractual obligations.",
        "Grievance redressal",
        "HelloVerify has established a grievance redressal mechanism to address concerns relating to the processing of personal data. Requests or complaints may be submitted using the contact details below and will be addressed within the timelines prescribed under applicable law.",
        "Contact us",
        "For any questions, requests, or concerns relating to this Supplement, please contact: Email: privacy@helloverify.com",
      ]),
      s("ksa-supplement", "Kingdom of Saudi Arabia — privacy supplement", [
        "This Kingdom of Saudi Arabia Privacy Supplement applies to the processing of personal data by HelloVerify in connection with individuals located in the Kingdom of Saudi Arabia (\"KSA\"), in accordance with the Saudi Personal Data Protection Law (\"PDPL\") and its implementing regulations. This Supplement should be read in conjunction with the Global Privacy Policy. In the event of any inconsistency, this Supplement shall prevail with respect to personal data processed in KSA.",
        "Scope and role of processing",
        "HelloVerify may process personal data in KSA in connection with the provision of its Services, including background verification and related activities. Depending on the nature of the engagement, HelloVerify may process personal data on behalf of clients or for its own legitimate business purposes, where permitted by applicable law. All processing is carried out in accordance with applicable legal and regulatory requirements.",
        "Where processing involves sensitive personal data as defined under the PDPL, HelloVerify will ensure prior explicit consent and compliance with the PDPL Implementing Regulations. Cross-border transfers shall be subject to a Data Transfer Impact Assessment where required by SDAIA.",
        "Purpose of processing",
        "Identity verification and background screening",
        "Verification of employment, education, and professional credentials",
        "Compliance with legal, regulatory, and client requirements",
        "Fraud prevention and risk management",
        "Service delivery, audit, and quality assurance activities",
        "Business operations and client relationship management",
        "Lawful processing and consent",
        "HelloVerify processes personal data in accordance with lawful bases recognized under the PDPL. Where required, personal data is processed based on the consent of the individual in a clear and informed manner. Consent may be withdrawn at any time, subject to applicable legal or contractual obligations. Processing may also be carried out without consent where permitted under applicable law.",
        "Notice and transparency",
        "HelloVerify provides appropriate notice to individuals regarding the collection and use of personal data. Where HelloVerify processes personal data on behalf of clients, such notice may be provided by the relevant client.",
        "Data sharing",
        "Clients and authorized parties for the purpose of providing Services",
        "Affiliates and group entities",
        "Third-party service providers engaged to support service delivery",
        "Cross-border transfers",
        "Implementation of appropriate safeguards",
        "Compliance with regulatory approvals or conditions",
        "Ensuring that the level of protection for personal data is maintained",
        "Data subject rights",
        "Be informed about the collection and processing of their personal data",
        "Access their personal data",
        "Request correction or updating of personal data",
        "Request deletion of personal data, where applicable",
        "Data security and retention",
        "HelloVerify implements appropriate technical, administrative, and organizational measures to protect personal data. Personal data is retained only for as long as necessary to fulfill the purposes for which it was collected, or as required under applicable legal or contractual obligations.",
        "Regulatory compliance",
        "HelloVerify complies with applicable regulatory requirements and may disclose personal data to competent authorities where required by law or pursuant to valid legal processes.",
        "Contact us",
        "For any questions, requests, or concerns relating to this Supplement, please contact: Email: privacy@helloverify.com",
      ]),
      s("uae-supplement", "United Arab Emirates — privacy supplement", [
        "This United Arab Emirates (\"UAE\") Privacy Supplement applies to the processing of personal data by HelloVerify in connection with individuals located in the UAE, in accordance with UAE Federal Decree Law No. 45 of 2021 on the Protection of Personal Data (\"UAE PDPL\"). Where HelloVerify's operations extend to the DIFC or ADGM free zones, the applicable free zone data protection laws shall govern in addition to or in lieu of the UAE Federal PDPL to the extent applicable. This Supplement should be read in conjunction with the Global Privacy Policy. In the event of any inconsistency, this Supplement shall prevail with respect to personal data processed in the UAE.",
        "Scope and role of processing",
        "HelloVerify may process personal data in the UAE in connection with the provision of its Services. Depending on the nature of the engagement, HelloVerify may process personal data on behalf of clients or for its own legitimate business purposes, where permitted by applicable law.",
        "Purpose of processing",
        "Identity verification and background screening",
        "Verification of employment, education, and professional credentials",
        "Compliance with legal, regulatory, and client requirements",
        "Fraud prevention, risk management, and due diligence",
        "Service delivery, audit, and quality assurance",
        "Business operations and client relationship management",
        "Lawful processing",
        "HelloVerify processes personal data in accordance with lawful grounds recognized under applicable law. Where required, personal data is processed based on consent obtained in a clear and informed manner. Consent may be withdrawn at any time, subject to applicable legal or contractual obligations. Processing may also occur without consent where permitted under applicable law.",
        "Notice and transparency",
        "HelloVerify provides appropriate notice regarding the collection and use of personal data. Where HelloVerify processes personal data on behalf of clients, such notice may be provided by the relevant client.",
        "Data sharing",
        "Clients and authorized parties for the purpose of providing Services",
        "Affiliates and group entities",
        "Third-party service providers engaged to support the Services",
        "Cross-border transfers",
        "Personal data may be transferred outside the UAE where necessary for the provision of Services. HelloVerify ensures that such transfers are carried out in accordance with applicable legal requirements, including implementing appropriate safeguards.",
        "Data subject rights",
        "Access personal data",
        "Request correction or updating of personal data",
        "Request deletion of personal data, where applicable",
        "Restrict or object to certain processing activities, where permitted",
        "Data security and retention",
        "HelloVerify implements appropriate administrative, technical, and organizational measures to protect personal data. Personal data is retained only for as long as necessary to fulfill the purposes for which it was collected or as required under applicable legal or contractual obligations.",
        "Regulatory compliance",
        "HelloVerify complies with applicable regulatory requirements and may disclose personal data to competent authorities where required by law or pursuant to valid legal processes.",
        "Contact us",
        "For any questions, requests, or concerns relating to this Supplement, please contact: Email: privacy@helloverify.com",
      ]),
      s("sg-supplement", "Singapore — privacy supplement", [
        "This Singapore Privacy Supplement applies to the processing of personal data by HelloVerify in connection with individuals located in Singapore, in accordance with the Singapore Personal Data Protection Act 2012 (\"PDPA\"). This Supplement should be read in conjunction with the Global Privacy Policy. In the event of any inconsistency, this Supplement shall prevail with respect to personal data processed in Singapore.",
        "Scope and role of processing",
        "HelloVerify may process personal data in Singapore in connection with the provision of its Services. Depending on the nature of the engagement, HelloVerify may process personal data on behalf of clients or for its own legitimate business purposes, where permitted by applicable law.",
        "Purpose of processing",
        "Identity verification and background screening",
        "Verification of employment, education, and professional credentials",
        "Compliance with legal, regulatory, and client requirements",
        "Fraud prevention, risk management, and due diligence",
        "Service delivery, quality assurance, and audit activities",
        "Business operations and client relationship management",
        "Lawful processing",
        "HelloVerify collects, uses, and discloses personal data with consent where required under the PDPA or where otherwise permitted by law. Individuals are provided with appropriate notice regarding the purposes for which their personal data is collected, used, or disclosed. Consent may be withdrawn at any time, subject to applicable legal or contractual obligations. Where HelloVerify processes personal data on behalf of clients, such notice and consent may be obtained by the relevant client.",
        "Data sharing",
        "Clients and authorized parties for the purpose of providing Services",
        "Affiliates and group entities",
        "Third-party service providers engaged to support the Services",
        "Cross-border transfers",
        "Personal data may be transferred outside Singapore where necessary for the provision of Services. HelloVerify takes appropriate measures to ensure that any such transfers are conducted in accordance with applicable legal requirements and that the personal data continues to receive a standard of protection comparable to that required under the PDPA.",
        "Access and correction",
        "Individuals may have the right to request access to personal data and request correction of inaccuracies, subject to applicable legal requirements. Where HelloVerify processes personal data on behalf of a client, such requests may be directed to or coordinated with the relevant client.",
        "Data security and retention",
        "HelloVerify implements appropriate administrative, technical, and organizational measures to protect personal data. Personal data is retained only for as long as necessary to fulfill the purposes for which it was collected or as required under applicable legal or contractual obligations.",
        "Accountability & compliance",
        "HelloVerify maintains policies and procedures to support compliance with the PDPA. In the event of a data breach affecting individuals in Singapore, HelloVerify will notify the Personal Data Protection Commission and affected individuals in accordance with Section 26C of the PDPA.",
        "Contact us",
        "For any questions, requests, or concerns relating to this Supplement, please contact: Email: privacy@helloverify.com",
      ]),
      s("anz-supplement", "Australia and New Zealand — privacy supplement", [
        "This Australia and New Zealand Privacy Supplement applies to the processing of personal information by HelloVerify in connection with individuals located in Australia and New Zealand. This Supplement should be read in conjunction with the Global Privacy Policy. For the purposes of this Supplement, \"Privacy Legislation\" refers to the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs), and the Privacy Act 2020 (New Zealand) and the Information Privacy Principles (IPPs). \"Personal Information\" has the meaning given under the applicable Privacy Legislation.",
        "Scope of services",
        "HelloVerify provides background screening and verification services to its clients to assist them in assessing individuals for employment, changes in responsibility, or other circumstances where background verification is required, including regulatory, compliance, and risk management purposes.",
        "Information we collect",
        "Identification and contact details (e.g., name, date of birth, address)",
        "Employment history, references, and professional qualifications",
        "Educational background and certifications",
        "Residency, immigration, and right-to-work information",
        "Publicly available records (e.g., court records, insolvency data)",
        "Other information necessary to verify the information provided by the individual",
        "HelloVerify may also collect limited information from clients and from sources used during verification. In certain circumstances, HelloVerify may process sensitive information (e.g., criminal records), which is handled in accordance with applicable legal requirements and subject to additional safeguards.",
        "Purpose of processing",
        "Verifying information provided by individuals",
        "Conducting background screening and due diligence checks",
        "Preparing verification or investigative reports for clients",
        "Supporting compliance with legal and regulatory requirements",
        "Assisting clients in making employment or business decisions",
        "How we collect information",
        "Directly from individuals",
        "From clients and authorized representatives",
        "From third-party sources identified by the individual",
        "From public records and other lawful sources",
        "By providing third-party references or information, the individual is expected to have obtained appropriate authorization for such disclosure.",
        "Use and disclosure of personal information",
        "To clients for the purposes of providing Services",
        "To authorized verification sources (e.g., employers, educational institutions, public authorities)",
        "To third-party service providers engaged to support service delivery",
        "Where required or permitted by applicable law",
        "Storage and security",
        "HelloVerify stores personal information in secure systems, which may include electronic databases and, where applicable, physical records. We implement appropriate administrative, technical, and physical safeguards. Access is restricted to authorized personnel on a need-to-know basis.",
        "Retention",
        "Personal information is retained only for as long as necessary to fulfill the purposes for which it was collected or to comply with legal, regulatory, or contractual obligations. When personal information is no longer required, it is securely deleted, anonymized, or destroyed.",
        "Identifiers",
        "HelloVerify does not adopt, use, or disclose government-issued identifiers (such as tax file numbers or similar identifiers) except as permitted under applicable law.",
        "Overseas disclosure",
        "Verification sources located overseas",
        "Clients and affiliates in other jurisdictions",
        "Authorized service providers supporting global service delivery",
        "Such disclosures are carried out in accordance with applicable Privacy Legislation and subject to appropriate safeguards.",
        "Access and correction",
        "Individuals may request access to personal information held about them and request correction of inaccurate or incomplete information. Requests may be submitted using the contact details below and will be handled in accordance with applicable Privacy Legislation. Verification of identity may be required. In certain circumstances, access may be restricted where permitted under applicable law.",
        "Contact us",
        "For any questions, requests, or concerns relating to this Supplement, please contact: Email: privacy@helloverify.com",
      ]),
      s("ca-supplement", "Canada — privacy supplement", [
        "This Canada Privacy Supplement applies to the processing of personal information by HelloVerify in connection with individuals located in Canada, in accordance with the Personal Information Protection and Electronic Documents Act (\"PIPEDA\") and applicable provincial privacy laws. This Supplement should be read in conjunction with the Global Privacy Policy. In the event of any inconsistency, this Supplement shall prevail with respect to personal information processed in Canada.",
        "Scope and role of processing",
        "HelloVerify may process personal information in Canada in connection with the provision of its Services. Depending on the nature of the engagement, HelloVerify may process personal information on behalf of clients or for its own legitimate business purposes, where permitted by applicable law.",
        "Purpose of processing",
        "Identity verification and background screening",
        "Verification of employment, education, and professional credentials",
        "Compliance with legal, regulatory, and client requirements",
        "Fraud prevention, risk management, and due diligence",
        "Service delivery, quality assurance, and audit activities",
        "Business operations and client relationship management",
        "Consent",
        "HelloVerify collects, uses, and discloses personal information with consent where required under applicable law, or where otherwise permitted. Consent may be express or implied, depending on the nature and sensitivity of the information and the reasonable expectations of the individual. Individuals may withdraw consent at any time, subject to legal or contractual restrictions. Where HelloVerify processes personal information on behalf of clients, consent may be obtained by the relevant client.",
        "Limiting collection, use, and disclosure",
        "To clients and authorized parties for the purpose of providing Services",
        "To verification sources and third parties as required to complete background checks",
        "To service providers supporting HelloVerify operations",
        "Where required or permitted by law",
        "Accuracy",
        "HelloVerify takes reasonable steps to ensure that personal information is as accurate, complete, and up to date as necessary for the purposes for which it is used. Individuals are encouraged to report inaccuracies through the appropriate channels.",
        "Safeguards",
        "HelloVerify implements appropriate administrative, technical, and physical safeguards to protect personal information. Access is restricted to authorized personnel on a need-to-know basis.",
        "Retention",
        "Personal information is retained only for as long as necessary to fulfill the purposes for which it was collected or to comply with legal, regulatory, or contractual obligations. When personal information is no longer required, it is securely deleted, anonymized, or destroyed.",
        "Openness and transparency",
        "HelloVerify makes information available regarding its privacy practices through this Privacy Policy and applicable supplements. Additional information may be requested using the contact details below.",
        "Access and correction",
        "Individuals may request access to personal information held about them and request correction of inaccurate or incomplete information. Requests will be handled in accordance with applicable law. Identity verification may be required. In certain circumstances, access may be restricted where permitted by law.",
        "Accountability",
        "HelloVerify is responsible for personal information under its control and has implemented policies and procedures to ensure compliance with applicable privacy laws. Where third-party service providers are engaged, they are required to protect personal information in a manner consistent with this Policy.",
        "Cross-border transfers",
        "Personal information may be processed or transferred outside Canada where necessary for the provision of Services. HelloVerify takes reasonable steps to ensure that such information receives an appropriate level of protection and is handled in accordance with applicable legal requirements.",
        "Contact us",
        "For any questions, requests, or concerns relating to this Supplement, please contact: Email: privacy@helloverify.com",
      ]),
    ],
  },
  {
    slug: "terms-of-service",
    title: "Terms of Service",
    summary:
      "The terms on which HelloVerify provides verification services, and the obligations that come with using them.",
    effective: "Awaiting legal sign-off",
    sections: [
      s("agreement", "The agreement", [
        "Please read the following terms and conditions carefully before using this site. By using this site, you signify your agreement to these Terms and Conditions. If you do not agree to these Terms and Conditions, do not use this site. HelloVerify group may modify these Terms and Conditions at any time.",
      ]),
      s("definitions", "Definitions"),
      s("services", "The services we provide"),
      s("your-obligations", "Your obligations, including consent to verify"),
      s("acceptable-use", "Acceptable use", [
        "You are solely responsible for the content of any comments you make. You agree that no comments submitted by you to this web site will:",
        "Violate any right of any third party, including copyright, trademark, privacy or other personal or proprietary rights;",
        "Be or contain libelous or otherwise unlawful, abusive, or obscene material or constitute the misappropriation of the trade secrets of any third party; and",
        "Disparage the products or services of any third party. You agree not to submit any personal information (other than your email address or user name) through email sent to other users or messages posted on this site by you.",
      ]),
      s("fees", "Fees, payment and taxes"),
      s("turnaround", "Turnaround times and service levels"),
      s("accuracy", "Accuracy, disputes and re-verification"),
      /** 01. Restrictions on Use paragraphs 1-2 (the copyright licence and the
       *  trademark reservation) then 03. Submissions paragraphs 1-2 (the feedback
       *  assignment). Split at the old paragraph boundaries; paragraphs 3-7 of 01
       *  are the warranty, liability and secure-storage text and are in
       *  `liability` below. */
      s("ip", "Intellectual property", [
        "This site is copyright protected. Any textual or graphic material you copy, print, or download is licensed to you by HelloVerify Group for personal, non-commercial use only, provided that you do not change or delete any copyright, trademark, or proprietary notices.",
        "All trademarks and logos are owned by HelloVerify Group and may not be copied or used in any manner. HelloVerify may change, move, delete, or add portions of this site at any time.",
        "Should any viewer of a document on this web site respond to HelloVerify with information including feedback data, such as questions, comments, suggestions, or the like regarding the site, or the content of any item, such information shall be deemed to be non-confidential and HelloVerify shall have no obligation of any kind with respect to such information. In addition, HelloVerify shall be free to reproduce, use, disclose, display, exhibit, transmit, perform, create derivative works, and distribute the information to others without limitation, and to authorize others to do the same. Further, HelloVerify shall be free to use any ideas, concepts, know-how or techniques contained in such information for any purpose whatsoever, including, but not limited to, developing, manufacturing and marketing products and other items incorporating such information. This paragraph is not intended to apply to any personal information about you (such as name, mailing address and e-mail address), the use of which will be governed by HelloVerify's Privacy Statement.",
        "In consideration of HelloVerify's continuing efforts to enhance and improve these products and to respond to feedback from users, you agree to transfer such ideas, concepts, know-how and techniques to HelloVerify without any compensation. You agree to execute any and all documents that HelloVerify may reasonably request in connection with confirming HelloVerify's ownership of and unlimited right to use such ideas, concepts, know-how and techniques.",
      ]),
      s("confidentiality", "Confidentiality"),
      s("liability", "Limitation of liability", [
        "The materials on this site are provided \"as is\" without warranties of any kind, either express or implied. HelloVerify does not warrant the accuracy, reliability, or completeness of any materials on the site.",
        "The fact that a document is available on this site does not mean that the information contained in such document has not been modified or superseded by events or by a subsequent document or filing.",
        "To the fullest extent permissible pursuant to applicable law, HelloVerify does not warrant the accuracy, completeness or usefulness of any information contained on this site. HelloVerify does not warrant that the functions contained in the materials available on this site will be uninterrupted or error-free, that defects will be corrected, or that the materials, this site or the server that makes them available are free of viruses or other harmful components. You (and not HelloVerify) assume the entire cost of all necessary servicing, repair and correction.",
        "Under no circumstances, including, but not limited to, negligence, shall HelloVerify be liable for any special or consequential damages that result from the use of, or the inability to use, site or any downloaded materials, even if HelloVerify or its representative has been advised of the possibility of such damages. In no event shall HelloVerify's total liability to you from all damages, losses, and causes of action (whether in contract, or otherwise) exceed the amount you paid to HelloVerify, if any, for payments done through this site. Applicable law may not allow the exclusion of implied warranties, or the above limitations of liability, so the above exclusions may not apply to you.",
        "All information you provide to us is stored on our secure servers. Once we have received your information, we will use strict procedures and security features to try to prevent unauthorized access.",
      ]),
      /** 02. Links to Other Web Sites, whole. */
      s("links", "Links to other websites", [
        "HelloVerify makes no representation whatsoever regarding the content of any other web sites which you may access from this site. When you access a non-HelloVerify web site, please understand that it is independent from HelloVerify and that HelloVerify has no control over the content on that web site. A link to a non-HelloVerify web site does not mean that HelloVerify endorses or accepts any responsibility for the content or use of such web site.",
      ]),
      s("indemnity", "Indemnity"),
      s("term", "Term, suspension and termination", [
        "This Agreement is effective unless and until terminated by either you or HelloVerify. You may terminate this Agreement at any time by no longer using this web site, provided that all prior uses of this web site shall be governed by this Agreement. HelloVerify may terminate this Agreement at any time and without notice, and accordingly deny you access to this web site, in HelloVerify's sole discretion for any reason, including your failure to comply with any term or provision of this Agreement. Upon any termination of this Agreement by either you or HelloVerify, you must promptly destroy all materials downloaded or otherwise obtained from this web site, as well as all copies of such materials, whether made under the terms of this Agreement or otherwise.",
        "Click here to see HelloVerify's Privacy Statement.",
      ]),
      s("law", "Governing law and disputes"),
    ],
  },
  {
    slug: "cookie-policy",
    title: "Cookie Policy",
    summary: "The cookies and similar technologies this website uses, and how to control them.",
    effective: "Awaiting legal sign-off",
    sections: [
      s("what-are-cookies", "What cookies are", [
        "Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences, understanding how you use our services, and improving our platform's functionality.",
        "This Cookie Policy explains what cookies are, how we use them, and how you can control them. This policy complies with GDPR (EU), India's Digital Personal Data Protection Act, UAE Data Loss, 2023, and other applicable data protection regulations.",
      ]),
      s("categories", "Categories we use"),
      /** The four blocks of the old "Types of Cookies We Use", split at its own
       *  subheadings, in the old order. Each old subheading is dropped where
       *  this section's `h` already says it. */
      s("essential", "Strictly necessary cookies", [
        "These cookies are essential for our website to function properly. They enable core functionality such as security, network management, and accessibility.",
        "Purpose:",
        "Authentication and account access",
        "Security and fraud prevention",
        "Load balancing and session management",
        "Remembering cookie consent preferences",
        "Consent Required:",
        "No (Essential for service delivery)",
        "Duration:",
        "Session or up to 1 year",
      ]),
      s("analytics", "Analytics and performance", [
        "These cookies collect information about how you use our website, helping us understand visitor behavior and improve our services.",
        "Purpose:",
        "Website traffic analysis",
        "Understanding user journey and behavior patterns",
        "Identifying technical errors and performance issues",
        "Testing new features and improvements",
        "Third-Party Services:",
        "Google Analytics, Mixpanel",
        "Consent Required:",
        "Yes",
        "Duration:",
        "Up to 2 years",
      ]),
      s("functional", "Functional cookies", [
        "These cookies enable enhanced functionality and personalization, such as remembering your preferences and choices.",
        "Purpose:",
        "Language preferences",
        "Display settings and customization",
        "Form auto-fill preferences",
        "Remembering notification preferences",
        "Consent Required:",
        "Yes",
        "Duration:",
        "Up to 1 year",
      ]),
      s("marketing", "Marketing cookies", [
        "These cookies are used to deliver relevant advertisements and track advertising campaign effectiveness.",
        "Purpose:",
        "Displaying relevant advertisements",
        "Limiting ad frequency",
        "Measuring advertising campaign effectiveness",
        "Building user interest profiles",
        "Third-Party Services:",
        "Google Ads, LinkedIn Ads, Facebook Pixel",
        "Consent Required:",
        "Yes",
        "Duration:",
        "Up to 13 months",
      ]),
      /** Specific Cookies We Use, whole. */
      s("specific-cookies", "Specific cookies we use", [
        "The table below lists the specific cookies used on our website, their purpose, type, and duration:",
        "hv_session — Session management — Essential — Session",
        "hv_auth — Authentication token — Essential — 1 year",
        "hv_consent — Cookie consent preferences — Essential — 1 year",
        "_ga — Google Analytics user ID — Analytics — 2 years",
        "_gid — Google Analytics session ID — Analytics — 24 hours",
        "hv_lang — Language preference — Functional — 1 year",
      ]),
      s("third-party", "Third-party cookies", [
        "You can opt out of third-party advertising cookies through:",
        "Network Advertising Initiative (NAI): https://optout.networkadvertising.org/",
        "Digital Advertising Alliance (DAA): http://www.aboutads.info/choices/",
        "Your Online Choices (EU): https://www.youronlinechoices.eu/",
        "Google Analytics Opt-out Browser Add-on: https://tools.google.com/dlpage/gaoptout",
      ]),
      /** "1. Cookie Consent Manager" and "2. Browser Settings" from the old "How
       *  to Manage Cookies", then the whole of "Do Not Track (DNT) Signals" --
       *  DNT is a browser control, and the new skeleton has no DNT section. Both
       *  old subheadings are KEPT as body paragraphs here, unlike in `essential`
       *  above, because this section's `h` is neither of them. */
      s("managing", "Managing your preferences", [
        "1. Cookie Consent Manager",
        "When you first visit our website, you'll see a cookie consent banner allowing you to accept or reject non-essential cookies. You can change your preferences at any time using our Privacy Preference Center, available via the cookie settings option in the website footer.",
        "2. Browser Settings",
        "Most browsers allow you to control cookies through their settings. You can:",
        "Block all cookies",
        "Accept all cookies",
        "Choose which cookies to accept",
        "Delete cookies after closing the browser",
        "Browser-specific cookie management instructions:",
        "Chrome: Settings → Privacy and security → Cookies and other site data",
        "Firefox: Options → Privacy & Security → Cookies and Site Data",
        "Safari: Preferences → Privacy → Cookies and website data",
        "Edge: Settings → Cookies and site permissions → Cookies and site data",
        "⚠️ Important Note:",
        "Blocking or deleting essential cookies may prevent you from accessing certain features or services on our website. Some functionality may not work as intended.",
        "Some browsers include a \"Do Not Track\" (DNT) feature that signals websites you visit that you do not want your online activity tracked.",
        "Currently, there is no universally accepted standard for how to respond to DNT signals. We will continue to monitor developments in this area and may update our practices accordingly.",
      ]),
      s("changes", "Changes to this policy", [
        "We may update this Cookie Policy from time to time to reflect changes in technology, legal requirements, or our business practices. We will notify you of any significant changes by posting the updated policy on our website with a new \"Last Updated\" date.",
      ]),
      /** Questions About Cookies?, whole. */
      s("questions", "Questions about cookies", [
        "If you have any questions about our use of cookies, please contact our Data Protection Officer:",
        "Email: dpo@helloverify.com",
      ]),
    ],
  },
  {
    slug: "acceptable-use-policy",
    title: "Acceptable Use Policy",
    summary:
      "What HelloVerify may not be used for — including running checks without the subject's consent.",
    effective: "Awaiting legal sign-off",
    sections: [
      s("purpose", "Purpose of this policy"),
      s("consent-required", "Consent is required, without exception"),
      s("prohibited", "Prohibited uses"),
      s("discrimination", "Prohibited discriminatory use of results"),
      s("data-handling", "Handling results you receive"),
      s("reporting", "Reporting misuse"),
      s("enforcement", "Enforcement and suspension"),
    ],
  },
  {
    slug: "data-processing-addendum",
    title: "Data Processing Addendum",
    summary:
      "The DPA governing HelloVerify's processing of personal data on your behalf, including sub-processors and transfer terms.",
    effective: "Awaiting legal sign-off",
    sections: [
      s("roles", "Roles of the parties"),
      s("scope", "Scope and duration of processing"),
      s("instructions", "Processing instructions"),
      s("confidentiality", "Personnel and confidentiality"),
      s("security-measures", "Technical and organisational measures"),
      s("sub-processing", "Sub-processing and the sub-processor register"),
      s("assistance", "Assistance with data subject requests"),
      s("breach", "Personal data breach notification"),
      s("transfers", "International transfers and safeguards"),
      s("audit", "Audits and evidence"),
      s("deletion", "Deletion and return of data"),
    ],
  },
  {
    slug: "refund-policy",
    title: "Refund Policy",
    summary:
      "When a check is refundable, when it is not, and what happens when a verification cannot be completed.",
    effective: "Awaiting legal sign-off",
    sections: [
      /** The old "Refund Eligibility" section, whole. The heading is a poor fit --
       *  this is three specific cases, not a principle -- and the honest fix is to
       *  rename the section, which is a structure change this port did not make.
       *  The alternative, leaving it pending, would have stranded the only copy
       *  the old site has on when a refund IS due. */
      s("principle", "The principle", [
        "01. Technical Issues",
        "In the event of technical issues leading to duplicate payments, a full refund (without any deduction) will be provided for the second payment.",
        "02. Express / Fast-Track Application",
        "A full refund of the express fees (without any deduction) will be processed if HelloVerify is unable to meet the express turnaround time.",
        "03. Issuing Authority Fees",
        "While we strive to only collect the exact Issuing Authority(IA) fees required, occasional discrepancies may occur. If, for any reason, we collect an excess amount exceeding $5 in Issuing Authority(IA) fees that are not passed on to the Issuing Authority, a full refund for that excess amount will be issued to the applicant.",
      ]),
      s("unverifiable", "When a source cannot be reached"),
      s("consent-refused", "When the subject does not consent"),
      s("re-runs", "Corrections and free re-verification"),
      /** The old "Not Eligible for Refund" section, whole, numbering 01-08 intact.
       *  Item 05 is the "unable to verify" case that `unverifiable` above asks
       *  for; it stays here because lifting one item out of a numbered list
       *  leaves a hole in it. */
      s("non-refundable", "What is not refundable", [
        "01. Cancellation Request",
        "Once a case is selected we cannot issue a refund. You can request to cancel/stop by emailing us @ scfhs@helloverifyksa.com.",
        "02. Single Document as Part of Package Payment",
        "Package prices are a fixed cost irrespective of the number of documents submitted by the applicant. As such, no refund is applicable for packages.",
        "03. Stop / Remove / Change a Document",
        "Requests to stop, remove, or amend any document submitted at the time of application is received will not be eligible for a refund.",
        "04. Premium Services",
        "No refunds will be processed for applications/cases under gold assistance and walk in assistance once a service has been purchased.",
        "05. Unable to Verify Case Status",
        "No refund of verification fees will be processed if an application/case is closed as unable to verify.",
        "06. Discrepancy Case Status",
        "No refund will be processed if an application/case is closed as a discrepancy.",
        "07. Application Rejection",
        "In the event that regulators or government ministries reject the application for licensing or equivalency, regardless of the HelloVerify report's status or the cause of the rejection.",
        "08. Other Scenarios",
        "All other scenarios not specifically noted in the \"Refund Eligibility\" section are by default not eligible for refunds.",
        "*Administration fees represent charges and efforts undertaken by HelloVerify and its employees up until the point of refund.",
      ]),
      s("how-to-request", "How to request a refund"),
      s("timeframes", "Timeframes and method"),
    ],
  },
  /* The two policies below exist because their URLs are indexed on the old
   * site and had no successor here, so `/en/equal-opportunities` and
   * `/en/criminal-convictions-policy` would have 404'd at cutover. Section ids
   * and order are lifted from the old pages (`src/pages/policy/*.tsx`, 311 and
   * 347 lines of real copy) so the verbatim port is a 1:1 paste per section
   * rather than a re-derivation. */
  {
    slug: "equal-opportunities",
    title: "Equal Opportunities",
    summary:
      "How HelloVerify treats applicants and employees equally, and how that obligation carries into the verification work we do for clients.",
    effective: "Awaiting legal sign-off",
    sections: [
      s("scope", "Scope", [
        "The Equal Opportunities Policy (\"Policy\") applies to all applicants and employees of the HelloVerify Group. This Policy applies to all existing employees, new employees, and applicants of the company. It also applies to officers, consultants, contractors, volunteers, interns, casual workers, and agency workers. The Policy does not form part of any employee's contract of employment and we may amend it from time to time.",
      ]),
      s("purpose", "Purpose", [
        "HelloVerify is an equal opportunities employer and is committed to diversity, and equality, and providing a safe and productive environment that fosters open dialogue and the free expression of ideas, free of harassment, discrimination, and hostile conduct.",
        "The objective of this policy is to promote equal opportunities and the avoidance of discrimination at work. Employees and job applicants will receive equal treatment regardless of age, disability, gender reassignment, marital or civil partner status, pregnancy or maternity, race, colour, nationality, ethnic or national origin, religion or belief, sex, or sexual orientation ('Protected Characteristics'). It applies to all aspects of employment with us, including recruitment, pay and conditions, training, appraisals, promotion, conduct at work, disciplinary and grievance procedures, and termination of employment.",
      ]),
      s("discrimination", "Discrimination", [
        "You must not unlawfully discriminate against or harass other people including current and former employees, job applicants, clients, customers, suppliers and visitors. This applies in the workplace, outside the workplace (when dealing with customers, suppliers or other work-related contacts, or when wearing a work uniform), and on work-related trips or events including social events.",
        "The following forms of discrimination are prohibited under this Policy and are unlawful:",
        "Direct discrimination: treating someone less favourably because of a Protected Characteristic. For example, rejecting a job applicant because of their religious views or because they might be gay.",
        "Indirect discrimination: a provision, criterion or practice that applies to everyone but adversely affects people with a particular Protected Characteristic more than others, and is not justified. For example, requiring a job to be done full-time rather than part-time would adversely affect women because they generally have greater childcare commitments than men. Such a requirement would be discriminatory unless it can be justified.",
        "Harassment: this includes sexual harassment and other unwanted conduct related to a Protected Characteristic, which has the purpose or effect of violating someone's dignity or creating an intimidating, hostile, degrading, humiliating or offensive environment for them. Harassment is dealt with further in our Anti-harassment Policy.",
        "Victimisation: retaliation against someone who has complained or has supported someone else's complaint about discrimination or harassment.",
        "Disability discrimination: this includes direct and indirect discrimination, any unjustified less favourable treatment because of the effects of a disability, and failure to make reasonable adjustments to alleviate disadvantages caused by a disability.",
      ]),
      s("recruitment", "Recruitment and selection", [
        "There will be no discrimination on hiring as selection for employment at HelloVerify will be on the basis of merit and ability. During employment, employees are encouraged to develop their skills through training and all promotion decisions will be made on the basis of merit, against objective criteria and will not be influenced by any of the Protected Characteristics outlined in this policy. The Company's rewards and recognition program also covers all the employees without any discrimination.",
        "Vacancies should generally be advertised to a diverse section of the labour market. Advertisements should avoid stereotyping or using wording that may discourage particular groups from applying. They should include a short policy statement on equal opportunities and a copy of this Policy will be made available on request.",
        "Job applicants should not be asked questions which might suggest an intention to discriminate on grounds of a Protected Characteristic. For example, applicants should not be asked whether they are pregnant or planning to have children.",
        "Job applicants should not be asked about health or disability before a job offer is made.",
        "There are limited exceptions which should only be used with the approval of the Human Resources Department. For example:",
        "Questions necessary to establish if an applicant can perform an intrinsic part of the job (subject to any reasonable adjustments).",
        "Questions to establish if an applicant is fit to attend an assessment or any reasonable adjustments that may be needed at interview or assessment.",
        "Positive action to recruit disabled persons.",
        "Equal opportunities monitoring (which will not form part of the selection or decision-making process).",
        "Where necessary, job offers can be made conditional on a satisfactory medical check.",
        "All terms of employment, benefits, facilities and services will be periodically reviewed to ensure that they do not unlawfully discriminate. Some of the actions that we positively promote in our aims of achieving equality are:",
        "Use of inclusive, diversity-sensitive language in all official documents",
        "Protecting the privacy of team members' personal information",
        "Leave and flexible work arrangement policies to provide for parental, medical or other needs",
        "Ensuring employment benefits are provided to everyone irrespective of their Protected Characteristics",
        "Providing a safe working environment to all employees",
        "Inclusion of religious or national holidays of all people that are part of the workforce in the Company",
        "Open door practices to make the reporting of unlawful discriminatory conduct easier",
        "Active encouragement of employees to propose improvements",
        "We are required by law to ensure that all employees are entitled to work in the country they are located. Assumptions about immigration status should not be made based on appearance or apparent nationality. All prospective employees, regardless of nationality, must be able to produce original documents (such as a passport) before employment starts, to satisfy current immigration legislation. The list of acceptable documents is available from the Human Resources Department.",
        "To ensure that this Policy is operating effectively, and to identify groups that may be underrepresented or disadvantaged in our organisation, we monitor applicants' ethnic group, gender, disability, sexual orientation, religion and age as part of the recruitment procedure. Provision of this information is voluntary and it will not adversely affect an individual's chances of recruitment or any other decision related to their employment. The information is removed from applications before shortlisting, and kept in an anonymised format solely for the purposes stated in this policy. Analysing this data helps us take appropriate steps to avoid discrimination and improve equality and diversity.",
      ]),
      s("training", "Training, promotion and conditions of service", [
        "Training needs will be identified through regular appraisals. Employees will be given appropriate access to training to enable them to progress within the organisation and all promotion decisions will be made on the basis of merit.",
        "HelloVerify is committed to equal pay and equality of terms in employment. It believes that all its employees should receive equal pay irrespective of gender where they are carrying out work similar to that of others, work rated as equivalent, or work of equal value. We review salaries and benefits periodically to ensure appropriate benefits are available to all employees who should have access to them and that there are no unlawful obstacles to accessing them.",
        "Diversity and inclusion along with respect for all HelloVerify employees form the basis of our Culture. At HelloVerify, we appreciate and value each employee's distinct contribution and leverage our collective strengths to achieve the Company's vision. Governance towards maintaining this is that each of the Department heads at HelloVerify aims at ensuring diversity and inclusion in their respective departments while making hiring decisions.",
      ]),
      s("disabilities", "Disabilities", [
        "If you are disabled or become disabled, we encourage you to tell us about your condition so that we can support you as appropriate.",
        "If you experience difficulties at work because of your disability, you may wish to contact your line manager or the Human Resources Department to discuss any reasonable adjustments that would help overcome or minimise the difficulty. Your line manager or the Human Resources Department may wish to consult with you and your medical adviser about possible adjustments. We will consider the matter carefully and try to accommodate your needs within reason. If we consider a particular adjustment would not be reasonable we will explain our reasons and try to find an alternative solution where possible.",
        "We will monitor the physical features of our premises to consider whether they might place anyone with a disability at a substantial disadvantage. Where necessary, we will take reasonable steps to improve access.",
      ]),
      s("part-time", "Part-time and fixed-term work", [
        "Part-time and fixed-term staff should be treated the same as comparable full-time or permanent staff and enjoy no less favourable terms and conditions (on a pro-rata basis where appropriate), unless different treatment is justified.",
      ]),
      s("monitoring", "Monitoring equal opportunity", [
        "The company will regularly monitor the effects of selection decisions and personnel practices and procedures in order to assess whether equal opportunity is being followed / achieved. If changes are required, the Company will implement them.",
        "Every employee is entitled to a working environment that promotes dignity, equality and respect for all. HelloVerify will not tolerate any acts of unlawful or unfair discrimination (including harassment) committed against an employee, contractor, job applicant or visitor because of a Protected Characteristic.",
      ]),
      s("grievance", "Grievance management", [
        "All supervisors and managers are responsible to ensure that this Policy of equal opportunities is applied at all times and that all procedures and practices are free of discrimination. All employees are obliged to follow the guidelines and equal opportunities employer principles. In case there is any issue then employees can report to the Human Resources department under our Grievance Procedure.",
      ]),
      s("responsibility", "Responsibility and administration of the policy", [
        "The HelloVerify Board has overall responsibility for this Policy. However, the Human Resources Department has been delegated the day-to-day responsibility for administering, tracking, communicating and reviewing this Policy and answering any questions that may arise. HR advise managers:",
        "On the application of this policy and equality legislation",
        "On the application of other HR employment related policies in relation to equality and diversity issues",
        "Each department head of HelloVerify shall assist in the implementation of this Policy by disseminating it within their departments and creating in their departments a respect for the seriousness of compliance with this policy.",
        "All managers must set an appropriate standard of behaviour, lead by example and ensure that those they manage adhere to the Policy and promote our aims and objectives with regard to equal opportunities. Managers will be given appropriate training on equal opportunities awareness and equal opportunities recruitment and selection best practice. Human Resources has overall responsibility for equal opportunities training.",
        "If you are involved in management or recruitment, or if you have any questions about the content or application of this Policy, you should contact Human Resources to request training or further information. This Policy is reviewed annually by Human Resources.",
        "Recommendations for change should be reported to the Human Resources Department.",
      ]),
      s("breach", "Breach of the policy", [
        "HelloVerify takes a strict approach to breaches of this Policy, which will be dealt with in accordance with our Disciplinary Procedure. Serious cases of deliberate discrimination may amount to gross misconduct resulting in dismissal. This Policy document is made available with a clear objective to establish a standard approach in addressing issues discussed in this Policy.",
        "If you believe that you have suffered discrimination you can raise the matter through our Grievance Procedure or through our Anti-harassment Policy as appropriate. Complaints will be treated in confidence and investigated as appropriate.",
        "There must be no victimisation or retaliation against staff who complain about discrimination. However, making a false allegation deliberately and in bad faith will be treated as misconduct and dealt with under our Disciplinary Procedure.",
      ]),
      s("policy-changes", "Policy changes", [
        "Management reserves the right to make any amendments to this Policy.",
      ]),
    ],
  },
  {
    slug: "criminal-convictions-policy",
    title: "Criminal Convictions and Data Malpractice Policy",
    summary:
      "The basis on which HelloVerify processes criminal conviction and professional malpractice data, which is special-category data almost everywhere we operate.",
    effective: "Awaiting legal sign-off",
    sections: [
      s("about", "About this policy", [
        "This is the \"appropriate policy document\" (as required by data protection law in certain jurisdictions) for HelloVerify Document Verification Follow-Up Services Co. LLC. (\"HelloVerify\", \"we\") setting out how we will protect Criminal Convictions Data and Professional Malpractice Data.",
        "This policy supports HelloVerify's Data Protection Policies (including its policies on data classification, information security and data retention).",
        "This document meets the requirement of the UK's Data Protection Act 2018 that an appropriate policy document be in place where Processing Criminal Convictions Data in certain circumstances.",
      ]),
      s("definitions", "Definitions", [
        "Controller: the person or organisation that determines when, why and how to Process Personal Data (for example HelloVerify or another group company).",
        "Criminal Convictions Data: personal data relating to criminal convictions and offences, including Personal Data relating to criminal allegations and proceedings.",
        "Data Retention Policy: HelloVerify's policy on how the organisation classifies and manages the retention and disposal of its information.",
        "Data Subject: a living, identified or identifiable individual about whom we hold Personal Data. Data Subjects may be nationals or residents of any country and may have legal rights regarding their Personal Data.",
        "Data Privacy Impact Assessment (DPIA): tools and assessments used to identify and reduce risks of a data processing activity. A DPIA can be carried out as part of \"Privacy by Design\" and should be conducted for all major system or business change programmes involving the Processing of Personal Data.",
        "DPA 2018: the UK Data Protection Act 2018 (as amended, updated or superseded from time to time).",
        "GDPR: as applicable, the General Data Protection Regulation ((EU) 2016/679) as it forms part of the law of England and Wales, Scotland and Northern Ireland by virtue of section 3 of the European Union (Withdrawal) Act of 2018, or the UK GDPR (having the meaning given to it in section 3(10) (as supplemented by section 205(4)) of the DPA 2018).",
        "Personal Data: any information identifying a Data Subject or information relating to a Data Subject that we can identify (directly or indirectly) from that data alone or in combination with other identifiers we possess or can reasonably possess.",
        "Privacy Notice: a separate notice setting out information that may be provided to Data Subjects when the organisation collects information about them.",
        "Processing or Process: any activity that involves the use of Personal Data. It includes obtaining, recording or holding the data, or carrying out any operation or set of operations on the data including organising, amending, retrieving, using, disclosing, erasing or destroying it. Processing also includes transmitting or transferring Personal Data to third parties.",
        "Professional Malpractice Data: Personal Data revealing a Data Subject's fraudulent records, misconduct records and/or disciplinary action taken against a Data Subject.",
      ]),
      s("why", "Why we process criminal conviction and professional malpractice data", [
        "We process Criminal Convictions Data and Professional Malpractice Data for the following purposes, in the course of providing our services to our clients:",
        "Conducting background screening on individuals",
        "Checking an applicant's right to work in a country",
        "Verifying that candidates are suitable for employment, in order to expose forged academic degrees, employment certificates and practice licences, as well as fraudulent passports and work permits, on behalf of clients as part of our verification services to ensure that hired professionals have the qualifications they claim",
        "Personal Data Protection Principles",
        "The GDPR requires personal data to be processed in accordance with the six principles set out in Article 5(1). Article 5(2) requires controllers to be able to demonstrate compliance with Article 5(1).",
        "We comply with the principles relating to Processing of Personal Data set out in the GDPR which require Personal Data to be:",
        "Processed lawfully, fairly and in a transparent manner (Lawfulness, Fairness and Transparency)",
        "Collected only for specified, explicit and legitimate purposes (Purpose Limitation)",
        "Adequate, relevant and limited to what is necessary in relation to the purposes for which it is Processed (Data Minimisation)",
        "Accurate and where necessary kept up to date (Accuracy)",
        "Not kept in a form which permits identification of Data Subjects for longer than is necessary for the purposes for which the data is Processed (Storage Limitation)",
        "Processed in a manner that ensures its security using appropriate technical and organisational measures to protect against unauthorised or unlawful Processing and against accidental loss, destruction or damage (Security, Integrity and Confidentiality)",
        "We are responsible for and must be able to demonstrate compliance with the data protection principles listed above (Accountability).",
      ]),
      s("lawfulness", "Lawfulness, fairness and transparency", [
        "Personal Data must be processed lawfully, fairly and in a transparent manner in relation to the Data Subject.",
        "We will only Process Personal Data fairly and lawfully and for specified purposes. The GDPR restricts our actions regarding Personal Data to specified lawful purposes. We can Process Criminal Convictions Data and Professional Malpractice Data only if we have a legal ground for Processing and one of the specific Processing conditions applies. We will identify and document the legal ground and specific Processing condition relied on for each Processing activity.",
        "When collecting Criminal Convictions Data and Professional Malpractice Data from Data Subjects, either directly from Data Subjects or indirectly (for example from a third party or publicly available source), we will provide Data Subjects with a Privacy Notice setting out all the information required by the GDPR in a privacy notice which is concise, transparent, intelligible, easily accessible and in clear plain language which can be easily understood.",
        "Lawful Processing Basis and Processing Conditions",
        "Criminal Convictions Data",
        "Lawful basis: compliance with a legal obligation (Article 6(1)(c)), or the organisation's legitimate interests (Article 6(1)(f)) which are not outweighed by the fundamental rights and freedoms of the Data Subject. Processing condition: necessary for the purposes of performing or exercising obligations or rights which are imposed or conferred by law on the Controller or the Data Subject in connection with employment, social security or social protection (Paragraph 1(1)(a), Schedule 1, DPA 2018), or meets one of the substantial public interest conditions set out in Part 2 of Schedule 1 to the DPA 2018, such as preventing or detecting unlawful acts (Paragraph 10(1), Schedule 1, DPA 2018).",
        "Professional Malpractice Data",
        "Lawful basis: compliance with a legal obligation (Article 6(1)(c)), or the organisation's legitimate interests (Article 6(1)(f)) which are not outweighed by the fundamental rights and freedoms of the Data Subject. Processing condition: meets one of the substantial public interest conditions set out in Part 2 of Schedule 1 to the DPA 2018, such as protecting the public against dishonesty (Paragraph 11(1), Schedule 1, DPA 2018) or regulatory requirements relating to unlawful acts and dishonesty (Paragraph 12(1), Schedule 1, DPA 2018).",
      ]),
      s("purpose-limitation", "Purpose limitation", [
        "Personal Data must be collected only for specified, explicit and legitimate purposes. They must not be further Processed in any manner incompatible with those purposes.",
        "We will only collect personal data for specified purposes and will inform Data Subjects what those purposes are in a published Privacy Notice. We will not use Personal Data for new, different or incompatible purposes from those disclosed when it was first obtained unless we have informed the Data Subject of the new purposes and they have consented where necessary.",
      ]),
      s("data-minimisation", "Data minimisation", [
        "Personal Data shall be adequate, relevant and limited to what is necessary in relation to the purposes for which it is processed.",
        "We will only collect or disclose the minimum Personal Data required for the purpose for which the data is collected or disclosed. We will ensure that we do not collect excessive data and that the Personal Data collected is adequate and relevant for the intended purposes.",
      ]),
      s("accuracy", "Accuracy", [
        "Personal Data must be accurate and, where necessary, kept up to date. It must be corrected or deleted without delay when inaccurate.",
        "We will ensure that the Personal Data we hold and use is accurate, complete, kept up to date and relevant to the purpose for which it is collected by us. We check the accuracy of any Personal Data at the point of collection and at regular intervals afterwards. We take all reasonable steps to destroy or amend inaccurate or out-of-date Personal Data.",
      ]),
      s("storage", "Storage limitation", [
        "We only keep Personal Data in an identifiable form for as long as is necessary for the purposes for which it was collected, or where we have a legal obligation to do so. Once we no longer need Personal Data it shall be deleted or rendered permanently anonymous.",
        "We maintain a Data Retention Policy and related procedures to ensure Personal Data is deleted after a reasonable time has elapsed for the purposes for which it was being held, unless we are legally required to retain that data for longer.",
        "We will ensure Data Subjects are informed of the period for which data is stored and how that period is determined in any applicable Privacy Notice.",
      ]),
      s("security", "Security, integrity and confidentiality", [
        "Personal Data shall be Processed in a manner that ensures appropriate security of the Personal Data, including protection against unauthorised or unlawful Processing and against accidental loss, destruction or damage, using appropriate technical or organisational measures.",
        "We will implement and maintain reasonable and appropriate security measures against unlawful or unauthorised Processing of Personal Data and against the accidental loss of or damage to Personal Data.",
      ]),
      s("accountability", "Accountability principle", [
        "We are responsible for, and able to demonstrate compliance with these principles. Our Data Protection Officer (DPO) is responsible for ensuring that we are compliant with these principles. Any questions about this policy should be submitted to the DPO.",
        "We will:",
        "Ensure that records are kept of all Personal Data Processing activities, and that these are provided to the Information Commissioner on request.",
        "Carry out a DPIA for any high-risk Personal Data Processing to understand how Processing may affect Data Subjects and consult the Information Commissioner if appropriate.",
        "Maintain a DPO to provide independent advice and monitoring of Personal Data handling, and ensure that it has access to report to the highest management level.",
        "Have internal processes to ensure that Personal Data is only collected, used or handled in a way that is compliant with data protection law.",
        "Retention and Erasure of Personal Data",
        "We take the security of Criminal Convictions Data and Professional Malpractice Data very seriously. We have administrative, physical and technical safeguards in place to protect Personal Data against unlawful or unauthorised Processing, or accidental loss or damage. We will ensure, where Criminal Convictions Data or Professional Malpractice Data are Processed that:",
        "The Processing is recorded, and the record sets out, where possible, a suitable time period for the safe and permanent erasure of the different categories of data in accordance with our Data Retention Policy.",
        "Where we no longer require Criminal Convictions Data or Professional Malpractice Data for the purpose for which it was collected, we will delete it or render it permanently anonymous as soon as possible. We generally hold Criminal Convictions Data or Professional Malpractice Data in the form it was supplied to our clients for 15 years from the date it was collected, on the basis that it is often required by our clients to support a malpractice investigation or similar proceedings which can occur in the medical industry many years after the original verification was carried out, and because individuals may move to work in different jurisdictions where the legislation may require the data to be held for these periods of time.",
        "Where records are destroyed we will ensure that they are safely and permanently disposed of.",
        "Data Subjects receive a Privacy Notice setting out how their Personal Data will be handled when we first obtain their Personal Data, and this will include the period for which the Personal Data will be stored, or if that is not possible, the criteria used to determine that period. The Privacy Notice is also available on our website.",
      ]),
      s("review", "Review", [
        "This policy on Processing Criminal Convictions Data and Professional Malpractice Data is reviewed bi-annually, or more frequently in the event of a change in the law.",
        "The policy will be retained where we process Criminal Convictions Data and Professional Malpractice Data and for a period of at least six months after we stop carrying out such processing.",
        "A copy of this policy will be provided to the Information Commissioner on request and free of charge.",
        "For further information about our compliance with data protection law, please contact our Data Protection Officer at: support@helloverify.com",
      ]),
    ],
  },
];

export function getLegal(slug: string) {
  return LEGAL.find((d) => d.slug === slug);
}
