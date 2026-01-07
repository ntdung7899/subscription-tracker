'use client'

import { useEffect, useState } from 'react'
import { Building2, Mail, MapPin, Save, X } from 'lucide-react'

interface BillingProfile {
  billingEmail: string
  companyName: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  taxId: string
}

export default function BillingSettingsPage() {
  const [profile, setProfile] = useState<BillingProfile>({
    billingEmail: '',
    companyName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    taxId: '',
  })
  const [originalProfile, setOriginalProfile] = useState<BillingProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    fetchBillingProfile()
  }, [])

  useEffect(() => {
    if (originalProfile) {
      setHasChanges(JSON.stringify(profile) !== JSON.stringify(originalProfile))
    }
  }, [profile, originalProfile])

  const fetchBillingProfile = async () => {
    try {
      const response = await fetch('/api/billing/settings')
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setOriginalProfile(data)
      }
    } catch (error) {
      console.error('Failed to fetch billing profile:', error)
      setMessage({ type: 'error', text: 'Failed to load billing information' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const response = await fetch('/api/billing/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setOriginalProfile(data)
        setMessage({ type: 'success', text: 'Billing information updated successfully' })
        setTimeout(() => setMessage(null), 5000)
      } else {
        setMessage({ type: 'error', text: 'Failed to update billing information' })
      }
    } catch (error) {
      console.error('Failed to save billing profile:', error)
      setMessage({ type: 'error', text: 'An error occurred while saving' })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (originalProfile) {
      setProfile(originalProfile)
      setMessage(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Billing Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your billing information and payment methods</p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Contact Information</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="billingEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Billing Email *
                </label>
                <input
                  type="email"
                  id="billingEmail"
                  value={profile.billingEmail}
                  onChange={(e) => setProfile({ ...profile, billingEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Invoices will be sent to this email address</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Company Information</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  value={profile.companyName}
                  onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label htmlFor="taxId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tax ID / VAT Number
                </label>
                <input
                  type="text"
                  id="taxId"
                  value={profile.taxId}
                  onChange={(e) => setProfile({ ...profile, taxId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Billing Address</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  id="address"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="123 Main Street"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    State / Province
                  </label>
                  <input
                    type="text"
                    id="state"
                    value={profile.state}
                    onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ZIP / Postal Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    value={profile.zipCode}
                    onChange={(e) => setProfile({ ...profile, zipCode: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Country
                  </label>
                  <select
                    id="country"
                    value={profile.country}
                    onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="JP">Japan</option>
                    <option value="VN">Vietnam</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <button
              onClick={handleCancel}
              disabled={!hasChanges || saving}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-400 mb-3">Why this information?</h3>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                <span>Your billing email receives all invoices and receipts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                <span>Company info appears on your invoices</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                <span>Tax ID helps with VAT/tax compliance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                <span>Billing address is required for tax calculations</span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Method</h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded flex items-center justify-center text-white font-bold">
                  ••••
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">•••• •••• •••• 4242</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Expires 12/25</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full text-xs font-semibold">
                Default
              </span>
            </div>
            <button className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium">
              Update Payment Method
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
