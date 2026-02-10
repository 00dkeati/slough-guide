import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Part Time Jobs in Slough 2026 | Local Employment Opportunities',
  description: 'Find part time jobs in Slough. Retail, hospitality, care, delivery & warehouse positions. Major local employers hiring now. Student-friendly & flexible hours available.',
  keywords: 'part time jobs slough, jobs slough, part time work, employment slough, flexible work, student jobs',
}

export const dynamic = 'force-dynamic'

export default async function PartTimeJobsPage() {
  const majorEmployers = [
    {
      name: 'Sainsbury\'s Slough',
      icon: '🛒',
      type: 'Retail',
      roles: ['Store Assistant', 'Customer Service', 'Stock Replenishment', 'Checkouts'],
      pay: '£10.50-£11.50/hr',
      hours: 'Flexible, evenings & weekends',
      description: 'Major supermarket with regular part-time vacancies',
      link: '/slough-sainsburys'
    },
    {
      name: 'Asda Slough',
      icon: '🏪',
      type: 'Retail',
      roles: ['Retail Assistant', 'Customer Service Colleague', 'Section Leader'],
      pay: '£10.42-£11.20/hr',
      hours: '16-24 hours per week',
      description: 'Large superstore with regular part-time opportunities',
      link: '/slough-asda'
    },
    {
      name: 'Argos Slough',
      icon: '📦',
      type: 'Retail',
      roles: ['Customer Advisor', 'Stock Assistant', 'Collection Point Staff'],
      pay: '£10.50-£11.00/hr',
      hours: 'Various shifts available',
      description: 'Retail positions with flexible hours',
      link: '/slough-argos'
    },
    {
      name: 'Wickes Slough',
      icon: '🔨',
      type: 'DIY Retail',
      roles: ['Customer Advisor', 'Trade Counter', 'Warehouse Assistant'],
      pay: '£10.50-£12.00/hr',
      hours: 'Part-time & weekend shifts',
      description: 'DIY retailer seeking trade & retail staff',
      link: '/slough-wickes'
    },
    {
      name: 'Queen Alexandra Hospital',
      icon: '🏥',
      type: 'Healthcare',
      roles: ['Healthcare Assistant', 'Porter', 'Catering Staff', 'Domestic Services'],
      pay: '£10.90-£12.50/hr',
      hours: 'Flexible shifts including nights',
      description: 'NHS hospital with various support roles',
      link: null
    },
    {
      name: 'Local Cafes & Restaurants',
      icon: '☕',
      type: 'Hospitality',
      roles: ['Waiting Staff', 'Barista', 'Kitchen Assistant', 'Bar Staff'],
      pay: '£10.42-£11.50/hr + tips',
      hours: 'Evenings & weekends',
      description: 'Multiple venues hiring across Slough',
      link: '/restaurants'
    },
  ]

  const jobTypes = [
    {
      category: 'Retail',
      icon: '🛍️',
      roles: 'Store assistants, cashiers, stock handlers',
      typical: '12-24 hrs/week',
      pay: '£10.42-£11.50/hr',
      employers: 'Sainsbury\'s, Asda, Argos, retail parks'
    },
    {
      category: 'Hospitality',
      icon: '🍽️',
      roles: 'Waiting staff, bar staff, kitchen assistants',
      typical: '16-30 hrs/week',
      pay: '£10.42-£11.50/hr + tips',
      employers: 'Pubs, restaurants, cafes, takeaways'
    },
    {
      category: 'Care & Support',
      icon: '🤝',
      roles: 'Care assistants, support workers',
      typical: '20-30 hrs/week',
      pay: '£11.00-£13.00/hr',
      employers: 'Care homes, domiciliary care agencies'
    },
    {
      category: 'Delivery & Driving',
      icon: '🚗',
      roles: 'Delivery drivers, couriers',
      typical: 'Flexible hours',
      pay: '£11.00-£14.00/hr + mileage',
      employers: 'Royal Mail, DPD, food delivery apps'
    },
    {
      category: 'Warehouse',
      icon: '📦',
      roles: 'Warehouse operatives, forklift drivers',
      typical: '20-30 hrs/week',
      pay: '£11.00-£13.50/hr',
      employers: 'Distribution centres, logistics companies'
    },
    {
      category: 'Cleaning',
      icon: '🧹',
      roles: 'Cleaners, domestic staff',
      typical: '10-20 hrs/week',
      pay: '£10.42-£11.50/hr',
      employers: 'Offices, schools, care facilities'
    },
  ]

  const jobBoards = [
    { name: 'Indeed', url: 'https://www.indeed.co.uk/jobs?q=part+time&l=Slough', icon: '💼' },
    { name: 'Reed', url: 'https://www.reed.co.uk/jobs/part-time-jobs-in-slough', icon: '📋' },
    { name: 'Totaljobs', url: 'https://www.totaljobs.com/jobs/in-slough', icon: '🔍' },
    { name: 'CV-Library', url: 'https://www.cv-library.co.uk/search-jobs?q=part+time&geo=Slough', icon: '📄' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-slate-900">
            Slough<span className="text-blue-600">.co</span>
          </Link>
          <Link href="/categories" className="text-sm text-slate-600 hover:text-slate-900">
            All Categories →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center gap-2 text-purple-300 text-sm font-medium mb-4">
            <span>💼</span>
            <span>EMPLOYMENT</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Part Time Jobs in Slough
          </h1>
          <p className="text-lg text-slate-200 max-w-3xl mb-6">
            Find flexible part-time work in Slough. From retail and hospitality to care and delivery, discover local employers hiring now with student-friendly hours and competitive pay.
          </p>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">{majorEmployers.length}+</span>
              <span className="text-slate-300">Major Employers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">{jobTypes.length}</span>
              <span className="text-slate-300">Job Categories</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">£10.42+</span>
              <span className="text-slate-300">Hourly Pay</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Overview */}
        <section className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            💼 Part Time Work in Slough
          </h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-700 text-lg leading-relaxed mb-4">
              Slough offers excellent part-time employment opportunities across multiple sectors. With major retailers like Sainsbury's, Asda, and Argos headquartered in the town centre, plus numerous hospitality venues, care facilities, and the nearby Queen Alexandra Hospital, there's strong demand for flexible workers.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              The town's location just off the A3(M) means easy access to distribution centres and warehouses in the region, many offering part-time shift work with competitive pay. Slough is particularly popular with students from Portsmouth and Chichester universities seeking term-time and holiday work.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-4">
              <p className="text-green-900 text-sm mb-0">
                💡 <strong>Job Seeker Tip:</strong> Major retailers like Sainsbury's and Asda typically recruit heavily in September (back-to-school), November (Christmas), and January (new year sales). Apply 4-6 weeks before these peak periods for best chances.
              </p>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Typical part-time hourly rates in Slough range from <strong>£10.42 to £13.50</strong> depending on the role and employer. Retail and hospitality roles start at National Living Wage (£10.42), while care work, warehouse positions, and skilled roles pay £11-£13.50 per hour. Many positions include staff discounts, pension contributions, and flexible scheduling.
            </p>
          </div>
        </section>

        {/* Major Employers */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            🏢 Major Employers Hiring Part Time Staff
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {majorEmployers.map((employer) => (
              <div key={employer.name} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-lg bg-purple-100 flex items-center justify-center text-3xl flex-shrink-0">
                    {employer.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-slate-900 mb-1">{employer.name}</h3>
                    <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                      {employer.type}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-slate-600 mb-3">{employer.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-purple-600 font-medium">Roles:</span>
                    <span className="text-slate-600">{employer.roles.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-purple-600 font-medium">Pay:</span>
                    <span className="text-slate-900 font-semibold">{employer.pay}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-purple-600 font-medium">Hours:</span>
                    <span className="text-slate-600">{employer.hours}</span>
                  </div>
                </div>
                
                {employer.link && (
                  <Link 
                    href={employer.link}
                    className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    View Location Details →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Job Types */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            📋 Types of Part Time Jobs Available
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobTypes.map((job) => (
              <div key={job.category} className="bg-white rounded-xl p-5 shadow-sm">
                <div className="text-3xl mb-3">{job.icon}</div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{job.category}</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-slate-500">Typical Roles:</span>
                    <p className="text-slate-700">{job.roles}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Hours:</span>
                    <p className="text-slate-900 font-semibold">{job.typical}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Pay:</span>
                    <p className="text-purple-600 font-bold">{job.pay}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Where:</span>
                    <p className="text-slate-600 text-xs">{job.employers}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Job Search Resources */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            🔍 Where to Find Part Time Jobs
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Online Job Boards</h3>
              <div className="space-y-3">
                {jobBoards.map((board) => (
                  <a
                    key={board.name}
                    href={board.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-white rounded-lg p-3 hover:shadow-md transition-shadow"
                  >
                    <span className="text-2xl">{board.icon}</span>
                    <div className="flex-1">
                      <span className="font-medium text-slate-900">{board.name}</span>
                      <p className="text-xs text-slate-500">Search Slough jobs</p>
                    </div>
                    <span className="text-blue-600">→</span>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Direct Application Tips</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Visit stores in person with your CV during quiet periods (weekday mornings)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Check company websites directly - many don't advertise externally</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Ask existing staff about vacancies - employee referrals often work well</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Follow local businesses on social media for job announcements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Check notice boards in community centers and libraries</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Sign up for job alerts on multiple platforms</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-slate-900 mb-2">🎓 Student Job Seekers</h4>
            <p className="text-sm text-slate-700">
              Portsmouth and Chichester students: Slough is accessible via bus routes 37, 38, and 39. Many employers offer flexible shifts around lectures and exam periods. Consider retail (weekends/evenings) or hospitality (evening shifts) for maximum flexibility.
            </p>
          </div>
        </section>

        {/* Application Advice */}
        <section className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            📝 Application & Interview Tips
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <span className="text-xl">📄</span>
                <span>CV & Application</span>
              </h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>• Highlight availability clearly - employers value flexibility</li>
                <li>• Include any retail/hospitality experience, even informal</li>
                <li>• Mention customer service skills and reliability</li>
                <li>• Keep CV to 1-2 pages, focus on relevant experience</li>
                <li>• Check spelling and grammar carefully</li>
                <li>• Include references (teacher, previous employer, or character reference)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <span className="text-xl">💬</span>
                <span>Interview Success</span>
              </h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>• Arrive 10 minutes early in smart casual dress</li>
                <li>• Bring ID and proof of address (for right to work checks)</li>
                <li>• Research the company beforehand - show enthusiasm</li>
                <li>• Prepare examples of customer service or teamwork</li>
                <li>• Be honest about your availability</li>
                <li>• Ask questions - show genuine interest in the role</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Workers Rights */}
        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            ⚖️ Your Rights as a Part Time Worker
          </h2>
          <div className="prose prose-amber max-w-none">
            <p className="text-slate-700 mb-4">
              Part-time workers in the UK have the same employment rights as full-time employees. Here's what you're entitled to:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2">💷 Pay & Benefits</h4>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>• National Living Wage (£10.42/hr for 21+)</li>
                  <li>• Equal hourly pay to full-time colleagues</li>
                  <li>• Pro-rata holiday entitlement (5.6 weeks)</li>
                  <li>• Pension contributions (if eligible)</li>
                  <li>• Sick pay (Statutory Sick Pay after 3 days)</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2">⏰ Working Hours</h4>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>• 20-minute break if working 6+ hours</li>
                  <li>• 11 hours rest between shifts</li>
                  <li>• Cannot be forced to work more hours than agreed</li>
                  <li>• Notice required for shift changes</li>
                  <li>• Right to request flexible working</li>
                </ul>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-4">
              ℹ️ For more information visit: <a href="https://www.gov.uk/employment-rights" className="text-blue-600 hover:underline" target="_blank" rel="noopener">gov.uk/employment-rights</a> or contact ACAS on 0300 123 1100
            </p>
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            ❓ Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'What is the typical pay for part-time jobs in Slough?',
                a: 'Most part-time roles in Slough pay between £10.42-£13.50 per hour. Retail and hospitality typically start at National Living Wage (£10.42 for 21+), while care work, warehouse roles, and skilled positions pay £11-£13.50. Some hospitality roles also include tips.'
              },
              {
                q: 'How many hours is considered part-time?',
                a: 'Part-time work is typically anything under 35 hours per week. Common part-time contracts in Slough are 12-24 hours for retail, 16-30 hours for hospitality, and 20-30 hours for care and warehouse roles. Many employers offer flexible hours to fit around other commitments.'
              },
              {
                q: 'Can students work part-time in Slough?',
                a: 'Yes! Slough is popular with Portsmouth and Chichester students. Retail and hospitality employers actively seek student workers and offer flexible shifts around lectures. Most roles require 16-20 hours maximum during term time, with full-time options during holidays.'
              },
              {
                q: 'Do I need experience to get a part-time job?',
                a: 'Many entry-level positions don\'t require prior experience. Retail stores, cafes, and restaurants often provide training. What matters most is reliability, good attitude, and availability. Highlight any customer service experience (even informal), volunteer work, or relevant skills on your CV.'
              },
              {
                q: 'How do I apply for jobs at Sainsbury\'s, Asda, or Argos in Slough?',
                a: 'Major retailers use online application systems. Visit their careers websites, search for "Slough" locations, and apply directly. Applications typically include an online questionnaire, CV upload, and video interview. Peak recruitment times are September, November, and January.'
              },
              {
                q: 'Are there part-time jobs with evening or weekend hours only?',
                a: 'Yes! Hospitality venues (pubs, restaurants, bars) primarily need evening and weekend staff. Retail stores need weekend coverage, and some supermarkets have evening shelf-stacking shifts (typically 6pm-10pm). These are ideal if you work or study during the day.'
              },
            ].map((faq, i) => (
              <div key={i} className="border-b border-slate-200 last:border-0 pb-6 last:pb-0">
                <h3 className="font-semibold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Pages */}
        <section className="bg-slate-100 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Related Information
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Link href="/slough-sainsburys" className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
              <span className="text-2xl">🛒</span>
              <span className="font-medium text-slate-900">Sainsbury's Info</span>
            </Link>
            <Link href="/restaurants" className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
              <span className="text-2xl">🍽️</span>
              <span className="font-medium text-slate-900">Local Restaurants</span>
            </Link>
            <Link href="/categories" className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
              <span className="text-2xl">📂</span>
              <span className="font-medium text-slate-900">All Categories</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
