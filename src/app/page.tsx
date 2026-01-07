import Image from 'next/image'
import Link from 'next/link'
import { Layers, Users, Bell, BarChart } from 'lucide-react'
import LandingHeader from '@/components/LandingHeader'

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <LandingHeader />
      {/* Hero Section */}
      <section id="hero" className="relative overflow-hidden border-b border-gray-200 dark:border-gray-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950/20 dark:via-gray-950 dark:to-purple-950/20" />
        
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
              Track, Share & Manage
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Subscriptions Effortlessly
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400 sm:text-xl">
              Manage shared subscriptions, track payments, and never miss a renewal.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 text-base font-medium text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
              >
                Get Started Free
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-8 py-3 text-base font-medium text-gray-700 transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:ring-offset-gray-950"
              >
                View Dashboard
              </Link>
            </div>
            <div className="mt-16">
              <div className="relative mx-auto max-w-5xl rounded-xl border border-gray-200 bg-white p-2 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
                <div className="aspect-video w-full rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Section */}
      <section className="border-b border-gray-200 bg-gray-50 py-12 dark:border-gray-800 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-gray-600 dark:text-gray-400">
            Trusted by teams & families
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8 opacity-50 grayscale">
            {['Netflix', 'Spotify', 'Google', 'Adobe', 'Amazon', 'Apple'].map((brand) => (
              <div
                key={brand}
                className="flex h-12 w-24 items-center justify-center rounded-lg bg-gray-200 text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-400"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-b border-gray-200 py-20 dark:border-gray-800 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Everything you need to manage subscriptions
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Powerful features to help you stay organized and save money
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Layers,
                title: 'Subscription Management',
                description: 'Create, track, and organize all subscriptions in one place.',
              },
              {
                icon: Users,
                title: 'Shared Plans & Members',
                description: 'Manage family groups and member payments easily.',
              },
              {
                icon: Bell,
                title: 'Smart Reminders',
                description: 'Automatic email reminders before payments are due.',
              },
              {
                icon: BarChart,
                title: 'Analytics & Insights',
                description: 'Visualize spending trends and optimize costs.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:border-blue-500 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-500"
              >
                <div className="mb-4 inline-flex rounded-lg bg-blue-100 p-3 dark:bg-blue-900/20">
                  <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-b border-gray-200 bg-gray-50 py-20 dark:border-gray-800 dark:bg-gray-900/50 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              How it works
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Get started in minutes with our simple process
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { step: '1', title: 'Add your subscriptions', description: 'Create entries for all your active subscriptions' },
              { step: '2', title: 'Invite members or family', description: 'Share subscription costs with your group' },
              { step: '3', title: 'Track payments & renewals', description: 'Monitor all upcoming and past payments' },
              { step: '4', title: 'Get reminders automatically', description: 'Receive email notifications before renewals' },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                    {item.step}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="border-b border-gray-200 py-20 dark:border-gray-800 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Beautiful dashboard, powerful insights
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Track everything in one place with our intuitive interface
            </p>
          </div>
          <div className="mt-16">
            <div className="relative mx-auto max-w-6xl rounded-xl border border-gray-200 bg-white p-4 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-800/50">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Cost</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">$127.50</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-800/50">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming Payments</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">5</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-800/50">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Members</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">8</p>
                </div>
              </div>
              <div className="mt-4 aspect-video rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900" />
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="border-b border-gray-200 bg-gray-50 py-20 dark:border-gray-800 dark:bg-gray-900/50 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Built for everyone
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Perfect for families, teams, and businesses of all sizes
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'Family subscription management',
                description: 'Share Netflix, Spotify, and other subscriptions with family members. Track who pays what.',
              },
              {
                title: 'Small teams & startups',
                description: 'Manage SaaS tools and team subscriptions. Keep track of all software expenses in one place.',
              },
              {
                title: 'Resellers & account managers',
                description: 'Manage multiple client subscriptions and billing cycles efficiently.',
              },
            ].map((useCase) => (
              <div
                key={useCase.title}
                className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {useCase.title}
                </h3>
                <p className="mt-4 text-gray-600 dark:text-gray-400">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      {/* <section id="pricing" className="border-b border-gray-200 py-20 dark:border-gray-800 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Choose the plan that's right for you
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                name: 'Free',
                price: '$0',
                description: 'Perfect for getting started',
                features: ['Up to 5 subscriptions', 'Basic tracking', 'Email reminders', 'Mobile responsive'],
                highlighted: false,
              },
              {
                name: 'Pro',
                price: '$9',
                description: 'For power users',
                features: ['Unlimited subscriptions', 'Advanced analytics', 'Family groups', 'Priority support', 'Export data'],
                highlighted: true,
              },
              {
                name: 'Team',
                price: '$29',
                description: 'For teams and businesses',
                features: ['Everything in Pro', 'Team collaboration', 'Admin controls', 'API access', 'Custom integrations'],
                highlighted: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 ${
                  plan.highlighted
                    ? 'border-blue-500 bg-blue-50 shadow-xl dark:bg-blue-950/20'
                    : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-sm font-medium text-white">
                    Recommended
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{plan.description}</p>
                  <p className="mt-6">
                    <span className="text-5xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                    <span className="text-gray-600 dark:text-gray-400">/month</span>
                  </p>
                  <Link
                    href="/login"
                    className={`mt-8 block rounded-lg px-6 py-3 text-center font-medium transition-all ${
                      plan.highlighted
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                  >
                    Get started
                  </Link>
                </div>
                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                      <svg className="mr-3 h-5 w-5 flex-shrink-0 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Final CTA */}
      <section className="border-b border-gray-200 py-20 dark:border-gray-800 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 px-8 py-16 text-center shadow-2xl sm:px-16">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Start managing subscriptions smarter today
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
                Join thousands of users who are saving time and money with our platform
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-base font-medium text-blue-600 transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                >
                  Create Free Account
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-white px-8 py-3 text-base font-medium text-white transition-all hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:24px_24px]" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Subscription Tracker</h3>
              <p className="mt-4 max-w-md text-sm text-gray-600 dark:text-gray-400">
                The easiest way to track, share, and manage all your subscriptions in one place. Save time and money.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Product</h4>
              <ul className="mt-4 space-y-2">
                {['Features', 'Pricing', 'Dashboard', 'API'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Company</h4>
              <ul className="mt-4 space-y-2">
                {['About', 'Blog', 'Contact', 'Privacy'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                © 2026 Subscription Tracker. All rights reserved.
              </p>
              <div className="flex gap-6">
                {['Twitter', 'GitHub', 'LinkedIn'].map((social) => (
                  <Link
                    key={social}
                    href="#"
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="h-6 w-6 rounded bg-gray-300 dark:bg-gray-700" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
