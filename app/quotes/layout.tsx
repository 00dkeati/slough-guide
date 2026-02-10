import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Get Free Quotes | Slough.co',
  description: 'Get free quotes from trusted local tradespeople in Berkshire.',
}

export default function QuotesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
