import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Slough.co',
  description: 'Privacy policy for Slough.co - how we collect, use, and protect your data.',
}

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <p className="text-gray-600 mb-6">Last updated: 10 February 2026</p>
      
      <div className="prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
        <p className="mb-4">
          Slough.co ("we", "our", or "us") is committed to protecting your privacy. 
          This Privacy Policy explains how we collect, use, and safeguard your information 
          when you visit our website slough.co or submit information through our forms.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
        <p className="mb-4">We may collect the following types of information:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Contact Information:</strong> Name, email address, phone number when you submit a form or contact us</li>
          <li><strong>Business Information:</strong> Business name, address, and services if you register your business</li>
          <li><strong>Usage Data:</strong> Pages visited, time spent on site, and other analytics data</li>
          <li><strong>Cookies:</strong> We use cookies to improve your experience and for analytics</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
        <p className="mb-4">We use your information to:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Respond to your enquiries and provide customer support</li>
          <li>Send you information about our services (with your consent)</li>
          <li>Improve our website and services</li>
          <li>Display business listings on our directory</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">4. Data Sharing</h2>
        <p className="mb-4">
          We do not sell your personal data. We may share information with:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Service providers who help us operate our website (e.g., hosting, analytics)</li>
          <li>Legal authorities if required by law</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">5. Your Rights</h2>
        <p className="mb-4">Under UK GDPR, you have the right to:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Object to processing of your data</li>
          <li>Withdraw consent at any time</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">6. Data Security</h2>
        <p className="mb-4">
          We implement appropriate technical and organisational measures to protect your 
          personal data against unauthorised access, alteration, disclosure, or destruction.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">7. Cookies</h2>
        <p className="mb-4">
          Our website uses cookies to enhance your browsing experience and analyse site traffic. 
          You can control cookies through your browser settings.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">8. Third-Party Links</h2>
        <p className="mb-4">
          Our website may contain links to third-party websites. We are not responsible for 
          the privacy practices of these external sites.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">9. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy or wish to exercise your rights, 
          please contact us at:
        </p>
        <p className="mb-4">
          <strong>Email:</strong> zack@slough.co
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">10. Changes to This Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. Any changes will be posted on 
          this page with an updated revision date.
        </p>
      </div>
    </div>
  )
}
