import React from 'react';
import { Section, SubSection } from '../../components/policy/Section';
import { PermissionsTable } from '../../components/policy/PermissionsTable';
import { permissionDataEU } from '../../components/policy/permissionData';

export const PrivacyPolicyEU_EN: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div className="bg-blue-900 text-white p-8 -mx-8 -mt-8 mb-8 rounded-t-2xl">
        <h1 className="text-3xl font-bold mb-2">afreshtrip Basic Functions Privacy Policy</h1>
        <p className="opacity-90 text-sm">Region: European Union (GDPR Compliant) | Version: EU-2025-V1</p>
      </div>

      <Section title="Introduction">
        <p>
          Welcome to afreshtrip! We are <strong>anstalle (Hangzhou) Information Technology Co., Ltd.</strong> (Address: Number 2 Building, Zhihui Innovation Center,Xihu District, Hangzhou, Zhejiang, China).
          We act as the <strong>Data Controller</strong> strictly complying with the EU <em>General Data Protection Regulation</em> (GDPR).
        </p>
        
        {/* Consent Checkboxes Visual Representation */}
        <div className="bg-slate-50 border border-slate-200 p-4 my-4 rounded-md">
          <p className="text-sm font-bold text-slate-700 mb-2">Before using the service, please confirm:</p>
          <div className="space-y-2">
            <label className="flex items-center space-x-3">
              <input type="checkbox" disabled checked className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
              <span className="text-slate-700">You have carefully read and agree to the "afreshtrip Privacy Policy"</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" disabled checked className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
              <span className="text-slate-700">You agree to share your data with third parties in compliance with regulations</span>
            </label>
          </div>
        </div>
      </Section>

      <Section title="I. Collection and Use Scenarios">
        <SubSection title="1.1 Core Functions (Article 6(1)(b) GDPR)">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Location Information:</strong> Precise/Approximate GPS data for route planning.</li>
            <li><strong>Account Information:</strong> Mobile number for identity verification.</li>
          </ul>
        </SubSection>

        <SubSection title="1.2 Service Optimization and Security Assurance (Article 6(1)(f) GDPR)">
          <p>
            To improve service quality and ensure the safety and experience of all users, we process the following data based on "legitimate interests":
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>Device Identifiers:</strong> Such as Android ID for application crash analysis</li>
            <li><strong>IP Address:</strong> For network attack prevention (DDoS) and fraud detection</li>
            <li><strong>Approximate Location:</strong> Based on IP for service optimization</li>
          </ul>
          <p className="mt-3 text-sm text-slate-600">
            <strong>Our main purpose is to analyze application crash reasons, prevent network attacks (such as DDoS), and diagnose fraudulent behavior. 
            To ensure your data security, we have minimized the impact on your privacy through data anonymization and minimized collection.</strong>
          </p>
          <div className="bg-blue-50 p-3 rounded mt-3 text-blue-800 text-sm">
            <strong>Your Right to Object:</strong> You have the right to object to such processing through [Me → Settings → Privacy Center].
          </div>
        </SubSection>

        <SubSection title="1.3 Personalized Recommendations and Marketing">
          <p>
            To provide you with content more suited to your preferences, we may, based on your location information, search history, and saved locations, 
            analyze your preferences through algorithms to recommend personalized travel itineraries, attractions, or hotels that may interest you.
          </p>
          <div className="bg-amber-50 border border-amber-200 p-4 rounded mt-3 text-amber-800 text-sm">
            <strong>Important:</strong> Please note that such personalized recommendation functions are <strong>not necessary for core functions</strong>. 
            We will pop up a window and obtain your separate consent before making such recommendations to you for the first time. 
            You can turn off this function at any time in [Me → Settings → Privacy Center].
          </div>
        </SubSection>

        <SubSection title="1.4 Processing of Special Categories of Data">
          <p>
            <strong>In principle, we do not process any special category personal data</strong> (such as race, political views, health data, etc.).
          </p>
          <div className="bg-red-50 border border-red-200 p-4 rounded mt-3 text-red-800 text-sm">
            <strong>Warning:</strong> If you voluntarily upload or disclose such information in comments, profiles, or other publicly accessible areas, 
            it will be deemed that you have explicitly consented to its public disclosure. <strong>Please treat such information with caution.</strong>
          </div>
        </SubSection>

        <SubSection title="1.5 Permission List">
          <PermissionsTable items={permissionDataEU} />
        </SubSection>
      </Section>

      <Section title="II. Sharing and Cross-Border Transfer">
        <SubSection title="2.1 Entrusted Processing">
          <p>
            We sign <strong>Data Processing Agreements (DPA)</strong> with all processors to ensure they only process data per our instructions.
          </p>
        </SubSection>

        <SubSection title="2.2 Sharing with Independent Controllers (Based on Your Separate Consent)">
          <p>
            We may share your personal information with our affiliated companies (referring to legal entities that now or in the future have a relationship of control, 
            controlled by, or under common control with anstalle Company). Sharing will be strictly limited to the scope necessary to achieve the purposes described in this Privacy Policy. 
            Affiliated companies will be equally bound by this Privacy Policy and follow the same security standards and confidentiality obligations.
          </p>
          <div className="bg-blue-50 p-4 rounded mt-3 text-blue-800 text-sm">
            <strong>Consent Required:</strong> Before any such data sharing occurs, we will seek your explicit and informed consent. 
            You can turn off this consent in [Me → Settings → Privacy Center].
          </div>
        </SubSection>

        <SubSection title="2.3 Cross-Border Data Transfer">
          <p>
            As some of our service providers may be located in countries or regions outside the EU, your personal data may be transferred to these areas. 
            <strong>All such transfers will ensure execution based on appropriate legal safeguard measures recognized by the European Commission to ensure your data remains protected.</strong>
          </p>
          <p className="mt-2 text-sm text-slate-600">
            <strong>Our core legal tool is the adoption of the "Standard Contractual Clauses" (SCCs) adopted by the European Commission.</strong> 
            We have signed data protection agreements containing SCCs with each third-country recipient, setting legally binding data protection obligations for them.
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Furthermore, as part of our transparency commitment, you have the right to request a copy of the core content of these SCC safeguard measures 
            by contacting our Data Protection Officer (DPO) to understand in detail how your data is protected globally.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Contact email: contact@anstalle.com | Contact phone: +86-15822674205
          </p>
        </SubSection>
      </Section>

      <Section title="III. Storage and Protection of Personal Information">
        <SubSection title="3.1 Data Storage Period">
          <p>
            <strong>We only store your personal information for the period required by the GDPR.</strong> 
            After the above period expires, we will delete or anonymize your personal information. 
            For example, after you actively cancel your account, we will securely dispose of your personal data within a prescribed reasonable period.
          </p>
        </SubSection>

        <SubSection title="3.2 Data Storage and Cross-Border Transfer">
          <p>
            To efficiently provide services to you, your personal data will be processed and stored in the following locations:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-3">
            <li><strong>Primary Storage Location:</strong> Data centers within the EU. All data stored within the EU enjoys the direct protection of the GDPR.</li>
            <li><strong>Cross-Border Transfer:</strong> To support some global functions (such as map services), we may transfer some data to countries/regions outside the EU. All such transfers ensure execution based on SCC safeguard measures; this legal contract provides protection for your data equivalent to the EU level.</li>
          </ul>
        </SubSection>

        <SubSection title="3.3 Data Security Protection Measures">
          <p>
            We have adopted security protection measures in line with industry standards, including but not limited to:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-3">
            <li><strong>Technical Measures:</strong> Data encryption during transmission (e.g., TLS/SSL), encrypted data storage, strict access control mechanisms.</li>
            <li><strong>Administrative Measures:</strong> Establishing data security management systems, providing security training for employees, signing confidentiality agreements.</li>
            <li><strong>Employee Training:</strong> Regular GDPR compliance and security awareness training for employees handling personal data.</li>
            <li><strong>Data Protection Impact Assessment (DPIA):</strong> We conduct a DPIA before engaging in high-risk processing activities.</li>
            <li><strong>Emergency Response:</strong> We have established a formal data security incident response plan to deal with possible data breaches.</li>
          </ul>
        </SubSection>

        <SubSection title="3.4 Data Breach Notification Commitment">
          <p>
            Despite the above protective measures, the risk of data breaches cannot be completely eliminated. 
            If a personal data breach incident occurs that may pose a risk to your rights and freedoms, we commit to:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-3">
            <li><strong>1. Report to the relevant EU data protection supervisory authority within 72 hours of becoming aware</strong></li>
            <li><strong>2. If the data breach is likely to cause a high risk to you, we will inform you of the nature of the breach, potential consequences, and the remedial measures we have taken or recommended through effective means such as email</strong></li>
          </ul>
        </SubSection>
      </Section>

      <Section title="IV. Your Rights (GDPR Chapter III)">
        <SubSection title="4.1 Access and Query">
          <p>
            You have the right to access your personal information and obtain a copy thereof. 
            You can view most personal information through the [Me → Settings → Privacy Center] page within the App. 
            If you need a copy of specific information, you can make a written request to us through the contact information at the end.
          </p>
        </SubSection>

        <SubSection title="4.2 Correction and Supplementation">
          <p>
            When you find that the personal information we process about you is inaccurate or incomplete, 
            you have the right to request us to correct or supplement it. You can directly modify personal information 
            (such as nickname, avatar) within the App [Me → Settings → Privacy Center], or request us to make corrections through customer service channels.
          </p>
        </SubSection>

        <SubSection title="4.3 Deletion of Personal Information">
          <p>
            In circumstances complying with laws and regulations, you have the right to request us to delete your personal information. 
            You can request deletion in the following scenarios:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-3">
            <li><strong>Processing purpose achieved or no longer necessary:</strong> When the relevant processing purpose for using the service has been achieved, or we no longer need to continue processing your information for that purpose;</li>
            <li><strong>Processing after withdrawal of consent:</strong> When you have withdrawn your authorization for previous information processing, and there is no other legal basis for processing that information;</li>
            <li><strong>Information processing violates legal provisions:</strong> When our processing of your personal information violates laws, administrative regulations, or agreements between both parties;</li>
            <li><strong>Service terminated:</strong> When we terminate service operation or the storage period has expired.</li>
          </ul>
        </SubSection>

        <SubSection title="4.4 Withdrawal of Consent">
          <p>
            <strong>You have the right to change or withdraw your previously authorized consent at any time.</strong> 
            You can withdraw authorization for a specific function to continue collecting and using your personal information by:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-3">
            <li>Turning off permissions such as location, photo album, camera in the device system settings</li>
            <li>Turning off functions like personalized recommendations in the App [Me → Settings → Privacy Center]</li>
          </ul>
          <div className="bg-blue-50 p-4 rounded mt-3 text-blue-800 text-sm">
            <strong>Processing Timeframe:</strong> After you submit the application, we will process it within <strong>25 days</strong> and provide feedback. 
            Please note that withdrawing consent does not affect the validity of information processing activities already carried out based on your prior authorization.
          </div>
        </SubSection>

        <SubSection title="4.5 Account Cancellation">
          <p>
            <strong>You have the right to cancel the account you registered in this service.</strong> 
            You can submit an account cancellation application by following the instructions and process provided in the App 
            [Me → Settings → Account & Security → Cancel Account].
          </p>
          <div className="bg-amber-50 border border-amber-200 p-4 rounded mt-3 text-amber-800 text-sm">
            <strong>Important:</strong> We will complete the account cancellation and delete or anonymize your personal information 
            within <strong>15 working days</strong> after verifying your identity. Please note that account cancellation is an irreversible operation. 
            Once canceled, you will no longer be able to use that account or any services and data associated with it.
          </div>
        </SubSection>
      </Section>

      <Section title="V. Minor Protection (GDPR Article 8)">
        <p className="mb-4">
          <strong>anstalle (Hangzhou) Information Technology Co., Ltd. solemnly commits to taking special protective measures for processing minors' personal data. 
          We will protect minors in accordance with the GDPR and relevant laws of EU member states.</strong>
        </p>

        <SubSection title="5.1 Age Verification and Guardian Consent">
          <p>
            <strong>Users under the age of 16 require authorization and consent from their parents or legal guardians.</strong> 
            They can only use our services after the guardian completes the verification process.
          </p>
          <p className="mt-2">
            Considering that some EU member states may lower this age threshold through domestic laws (down to 13 years old at the minimum), 
            if your member state stipulates a lower age, that shall prevail. You are responsible for understanding and complying with the legal provisions of your member state. 
            We will verify and confirm identity through the guardian's registered mobile phone number + SMS verification code.
          </p>
          <p className="mt-2">
            Enable additional parent control and custom preference functions associated with all personal profiles in the app across all your devices. 
            This may include allowing or blocking specific videos within the app, and allowing all personal profiles to subscribe to channels within the app.
          </p>
          <div className="bg-red-50 border border-red-200 p-4 rounded mt-3 text-red-800 text-sm">
            <strong>Important:</strong> If the above verifiable consent process is not successfully completed, we will not create an account or process any personal data for users below the legal age. 
            After you pass guardian verification, you can manage children's information through [Me → Settings → Privacy Center → Children Information Management], 
            such as viewing account information, editing submitted information, etc.
          </div>
        </SubSection>

        <SubSection title="5.2 Principles for Processing Children's Data">
          <p>
            Once the service is provided after obtaining verifiable consent, we will only collect the minimum amount of data necessary to provide the specific service. 
            <strong>We promise never to use children's data for personalized advertising, user profiling, or any non-directly related marketing activities.</strong> 
            We guarantee that all privacy information provided to children uses clear, plain language to ensure they can understand.
          </p>
        </SubSection>

        <SubSection title="5.3 Guardian's Rights and Exercise Methods">
          <p>
            As a parent or legal guardian of a minor, you have the following rights:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-3">
            <li><strong>Right of Access:</strong> Query the personal data your child has provided to us.</li>
            <li><strong>Right to Deletion:</strong> Request immediate deletion of all your child's personal data.</li>
            <li><strong>Right to Withdraw Consent:</strong> Withdraw given consent at any time, and we will stop processing the relevant data accordingly.</li>
          </ul>
          <div className="bg-blue-50 p-4 rounded mt-3 text-blue-800 text-sm">
            <strong>Unified Channel for Exercising Rights:</strong> Please contact us through the dedicated email <strong>contact@anstalle.com</strong>. 
            To ensure child safety, we require you to provide verifiable identity proof (such as proof of guardianship, ID documents of both parties) to process your request. 
            We commit to responding and processing within <strong>72 hours</strong> of receiving a valid request.
          </div>
        </SubSection>

        <SubSection title="5.4 Protection Commitment">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Active Screening:</strong> We will proactively screen and suspend accounts suspected of being created by minors without authorization through technical means.</li>
            <li><strong>Employee Training:</strong> All relevant employees have received specialized training on the particularities of handling children's data.</li>
            <li><strong>Priority Processing:</strong> All inquiries and complaints related to children's data will be marked as the highest priority for processing.</li>
          </ul>
          <p className="mt-4 text-sm text-slate-600">
            <strong>Your child's privacy and safety are paramount to us.</strong> We will continuously review and update our protection measures to comply with the latest EU regulatory guidance. 
            If you discover any protection measures that do not comply with regulations, you can provide feedback through the dedicated email <strong>dpo@anstalle.com</strong>. 
            We commit to responding and processing within <strong>72 hours</strong> of receiving feedback.
          </p>
        </SubSection>
      </Section>

      <Section title="Updates to this Policy">
        <p>
          anstalle Company reserves the right to revise these User Service Terms from time to time. 
          If the terms change, we will publish the revised version on the afreshtrip related software and website. 
          Major changes (including substantive modifications such as service models, rights and obligations) will be additionally notified through in-site notification. 
          Each update to the Service Terms and Privacy Policy will require your consent again.
        </p>
      </Section>

      <Section title="Contact Us">
        <p>
          If you have any questions or suggestions, you can contact us through the anstalle official website (www.anstalle.com) or customer service hotline [+86-15822674205]. 
          We will sincerely provide you with assistance.
        </p>
        <div className="bg-blue-50 p-4 rounded mt-4 text-blue-800 text-sm">
          <strong>Data Protection Officer (DPO) Contact:</strong><br />
          Email: contact@anstalle.com<br />
          Phone: +86-15822674205
        </div>
      </Section>
    </div>
  );
};