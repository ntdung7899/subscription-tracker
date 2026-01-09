"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';
import {
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  Users,
  Save,
  X,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ServiceIcons, PopularServices } from "@/assets/serviceIcons";

interface Member {
  id: string;
  name: string;
  email: string;
  amountPaid: number;
  nextPaymentDate: string;
  status: "active" | "pending" | "overdue";
}

interface FamilyGroup {
  id: string;
  groupName: string;
  purchaseDate: string;
  expirationDate: string;
  notes: string;
  members: Member[];
}

interface FormData {
  appName: string;
  serviceKey?: string;
  category: string;
  price: number;
  currency: string;
  billingCycle: "monthly" | "yearly";
  startDate: string;
  expirationDate: string;
  autoRenew: boolean;
  isShared: boolean;
  maxMembers: number;
  notificationDays: number;
  familyGroups: FamilyGroup[];
}

export default function NewSubscriptionPage() {
  const t = useTranslations("subscriptions");
  const tErrors = useTranslations("errors");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAllServices, setShowAllServices] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    appName: "",
    serviceKey: undefined,
    category: "",
    price: 0,
    currency: "VND",
    billingCycle: "monthly",
    startDate: new Date().toISOString().split("T")[0],
    expirationDate: "",
    autoRenew: true,
    isShared: false,
    maxMembers: 5,
    notificationDays: 7,
    familyGroups: [],
  });

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          // Extract unique category names from the response
          const categoryNames = data.map((cat: any) => cat.categoryName);
          setCategories(categoryNames);
        } else {
          // Fallback to default categories if API fails
          setCategories([
            "Productivity",
            "Development",
            "Design",
            "Entertainment",
            "Cloud",
            "Security",
            "Other",
          ]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to default categories
        setCategories([
          "Productivity",
          "Development",
          "Design",
          "Entertainment",
          "Cloud",
          "Security",
          "Other",
        ]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const currencies = ["VND", "USD", "EUR", "GBP", "JPY"];

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      return;
    }

    setIsAddingCategory(true);
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryName: newCategoryName.trim(),
          status: 'active',
        }),
      });

      if (response.ok) {
        const newCategory = await response.json();
        // Add new category to the list
        setCategories((prev) => [...prev, newCategory.categoryName]);
        // Select the new category
        setFormData((prev) => ({ ...prev, category: newCategory.categoryName }));
        // Reset and close modal
        setNewCategoryName("");
        setShowAddCategory(false);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category');
    } finally {
      setIsAddingCategory(false);
    }
  };

  const handleQuickSelect = (serviceName: string, serviceKey: string, price: number) => {
    setSelectedService(serviceKey);
    setFormData((prev) => ({
      ...prev,
      appName: serviceName,
      serviceKey: serviceKey,
      price: price,
    }));
    // Clear errors if any
    if (errors.appName) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.appName;
        return newErrors;
      });
    }
  };

  const allServices = Object.entries(ServiceIcons).filter(
    ([key]) => key !== "other"
  );
  const displayedServices = showAllServices 
    ? allServices 
    : allServices.slice(0, 7);

  const handleInputChange = (
    field: keyof FormData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const addFamilyGroup = () => {
    const newGroup: FamilyGroup = {
      id: Date.now().toString(),
      groupName: "",
      purchaseDate: new Date().toISOString().split("T")[0],
      expirationDate: "",
      notes: "",
      members: [],
    };
    setFormData((prev) => ({
      ...prev,
      familyGroups: [...prev.familyGroups, newGroup],
    }));
  };

  const removeFamilyGroup = (groupId: string) => {
    setFormData((prev) => ({
      ...prev,
      familyGroups: prev.familyGroups.filter((g) => g.id !== groupId),
    }));
  };

  const updateFamilyGroup = (
    groupId: string,
    field: keyof FamilyGroup,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      familyGroups: prev.familyGroups.map((g) =>
        g.id === groupId ? { ...g, [field]: value } : g
      ),
    }));
  };

  const addMember = (groupId: string) => {
    const newMember: Member = {
      id: Date.now().toString(),
      name: "",
      email: "",
      amountPaid: 0,
      nextPaymentDate: new Date().toISOString().split("T")[0],
      status: "active",
    };
    setFormData((prev) => ({
      ...prev,
      familyGroups: prev.familyGroups.map((g) =>
        g.id === groupId ? { ...g, members: [...g.members, newMember] } : g
      ),
    }));
  };

  const removeMember = (groupId: string, memberId: string) => {
    setFormData((prev) => ({
      ...prev,
      familyGroups: prev.familyGroups.map((g) =>
        g.id === groupId
          ? { ...g, members: g.members.filter((m) => m.id !== memberId) }
          : g
      ),
    }));
  };

  const updateMember = (
    groupId: string,
    memberId: string,
    field: keyof Member,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      familyGroups: prev.familyGroups.map((g) =>
        g.id === groupId
          ? {
              ...g,
              members: g.members.map((m) =>
                m.id === memberId ? { ...m, [field]: value } : m
              ),
            }
          : g
      ),
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.appName.trim()) {
      newErrors.appName = "App name is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!formData.expirationDate) {
      newErrors.expirationDate = "Expiration date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/dashboard/subscriptions");
      } else {
        const error = await response.json();
        setErrors({ submit: error.message || tErrors('failedToCreate') });
      }
    } catch (error) {
      setErrors({ submit: tErrors('networkError') });
    } finally {
      setIsSubmitting(false);
    }
  };
  // Filter services based on search

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('newSubscription.title')}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t('newSubscription.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quick Select Popular Services */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('quickSelect')}
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {displayedServices.map(([key, service]) => {
                const isSelected = selectedService === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      const popularService = PopularServices.find(s => s.key === key);
                      handleQuickSelect(
                        popularService?.name || key.charAt(0).toUpperCase() + key.slice(1),
                        key,
                        popularService?.price || 0
                      );
                    }}
                    className={`relative flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all group ${
                      isSelected
                        ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-500 dark:ring-blue-400 ring-offset-2 dark:ring-offset-gray-800'
                        : 'border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    }`}
                    style={{
                      background: isSelected ? `${service.gradient}25` : `${service.gradient}15`,
                    }}
                  >
                    <div
                      className={`text-3xl mb-2 transition-transform ${
                        isSelected ? 'scale-110' : 'group-hover:scale-110'
                      }`}
                    >
                      {service.icon}
                    </div>
                    <span className={`text-xs font-medium text-center capitalize ${
                      isSelected
                        ? 'text-blue-700 dark:text-blue-300 font-semibold'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Show More/Less Button */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setShowAllServices(!showAllServices)}
                className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {showAllServices ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-2" />
                    {t('showLess')}
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-2" />
                    {t('showMore', { count: allServices.length - 7 })}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              {t('basicInfo')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* App Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('fields.appName')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.appName}
                  onChange={(e) => handleInputChange("appName", e.target.value)}
                  placeholder={t('fields.appNamePlaceholder')}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.appName
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                />
                {errors.appName && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.appName}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('fields.category')} <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-2">
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    className={`flex-1 px-4 py-2 rounded-lg border ${
                      errors.category
                        ? "border-red-500 dark:border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  >
                    <option value="">{t('fields.selectCategory')}</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowAddCategory(true)}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
                    title="Add new category"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.category}
                  </p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('fields.price')} <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      handleInputChange(
                        "price",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="0"
                    step="0.01"
                    className={`flex-1 px-4 py-2 rounded-lg border ${
                      errors.price
                        ? "border-red-500 dark:border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  />
                  <select
                    value={formData.currency}
                    onChange={(e) =>
                      handleInputChange("currency", e.target.value)
                    }
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    {currencies.map((curr) => (
                      <option key={curr} value={curr}>
                        {curr}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.price}
                  </p>
                )}
              </div>

              {/* Billing Cycle */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('fields.billingCycle')}
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="monthly"
                      checked={formData.billingCycle === "monthly"}
                      onChange={(e) =>
                        handleInputChange("billingCycle", e.target.value)
                      }
                      className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {t('fields.monthly')}
                    </span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="yearly"
                      checked={formData.billingCycle === "yearly"}
                      onChange={(e) =>
                        handleInputChange("billingCycle", e.target.value)
                      }
                      className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {t('fields.yearly')}
                    </span>
                  </label>
                </div>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  {t('fields.startDate')}
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              {/* Expiration Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  {t('fields.expirationDate')} <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="date"
                  value={formData.expirationDate}
                  onChange={(e) =>
                    handleInputChange("expirationDate", e.target.value)
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.expirationDate
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                />
                {errors.expirationDate && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.expirationDate}
                  </p>
                )}
              </div>

              {/* Auto Renew */}
              <div className="md:col-span-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.autoRenew}
                    onChange={(e) =>
                      handleInputChange("autoRenew", e.target.checked)
                    }
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('fields.autoRenew')}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Shared Subscription Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              {t('sharedSettings')}
            </h2>

            <div className="space-y-4">
              {/* Is Shared Toggle */}
              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isShared}
                    onChange={(e) =>
                      handleInputChange("isShared", e.target.checked)
                    }
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('fields.isShared')}
                  </span>
                </label>
              </div>

              {formData.isShared && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pl-8">
                  {/* Max Members */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('fields.maxMembers')}
                    </label>
                    <input
                      type="number"
                      value={formData.maxMembers}
                      onChange={(e) =>
                        handleInputChange(
                          "maxMembers",
                          parseInt(e.target.value) || 1
                        )
                      }
                      min="1"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>

                  {/* Notification Days */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('fields.notificationDays')}
                    </label>
                    <input
                      type="number"
                      value={formData.notificationDays}
                      onChange={(e) =>
                        handleInputChange(
                          "notificationDays",
                          parseInt(e.target.value) || 7
                        )
                      }
                      min="1"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Family Groups */}
          {formData.isShared && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  {t('familyGroups')}
                </h2>
                <button
                  type="button"
                  onClick={addFamilyGroup}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('addFamilyGroup')}</span>
                </button>
              </div>

              {formData.familyGroups.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  {t('noFamilyGroups')}
                </p>
              ) : (
                <div className="space-y-6">
                  {formData.familyGroups.map((group, groupIndex) => (
                    <div
                      key={group.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {t('group', { number: groupIndex + 1 })}
                        </h3>
                        <button
                          type="button"
                          onClick={() => removeFamilyGroup(group.id)}
                          className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Group Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('fields.groupName')}
                          </label>
                          <input
                            type="text"
                            value={group.groupName}
                            onChange={(e) =>
                              updateFamilyGroup(
                                group.id,
                                "groupName",
                                e.target.value
                              )
                            }
                            placeholder="Family A"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          />
                        </div>

                        {/* Purchase Date */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('fields.purchaseDate')}
                          </label>
                          <input
                            type="date"
                            value={group.purchaseDate}
                            onChange={(e) =>
                              updateFamilyGroup(
                                group.id,
                                "purchaseDate",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          />
                        </div>

                        {/* Expiration Date */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('fields.expirationDate')}
                          </label>
                          <input
                            type="date"
                            value={group.expirationDate}
                            onChange={(e) =>
                              updateFamilyGroup(
                                group.id,
                                "expirationDate",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          />
                        </div>

                        {/* Notes */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('fields.notes')}
                          </label>
                          <input
                            type="text"
                            value={group.notes}
                            onChange={(e) =>
                              updateFamilyGroup(
                                group.id,
                                "notes",
                                e.target.value
                              )
                            }
                            placeholder={t('fields.notesPlaceholder')}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          />
                        </div>
                      </div>

                      {/* Members Section */}
                      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {t('fields.memberName')}
                          </h4>
                          <button
                            type="button"
                            onClick={() => addMember(group.id)}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm"
                          >
                            <Plus className="w-3 h-3" />
                            <span>{t('addMember')}</span>
                          </button>
                        </div>

                        {group.members.length === 0 ? (
                          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                            {t('noMembers')}
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {group.members.map((member, memberIndex) => (
                              <div
                                key={member.id}
                                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                    {t('member', { number: memberIndex + 1 })}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeMember(group.id, member.id)
                                    }
                                    className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  {/* Name */}
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      {t('fields.memberName')}
                                    </label>
                                    <input
                                      type="text"
                                      value={member.name}
                                      onChange={(e) =>
                                        updateMember(
                                          group.id,
                                          member.id,
                                          "name",
                                          e.target.value
                                        )
                                      }
                                      placeholder="John Doe"
                                      className="w-full px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                  </div>

                                  {/* Email */}
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      {t('fields.memberEmail')}
                                    </label>
                                    <input
                                      type="email"
                                      value={member.email}
                                      onChange={(e) =>
                                        updateMember(
                                          group.id,
                                          member.id,
                                          "email",
                                          e.target.value
                                        )
                                      }
                                      placeholder="john@example.com"
                                      className="w-full px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                  </div>

                                  {/* Amount Paid */}
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      {t('fields.amountPaid')}
                                    </label>
                                    <input
                                      type="number"
                                      value={member.amountPaid}
                                      onChange={(e) =>
                                        updateMember(
                                          group.id,
                                          member.id,
                                          "amountPaid",
                                          parseFloat(e.target.value) || 0
                                        )
                                      }
                                      placeholder="0"
                                      step="0.01"
                                      className="w-full px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                  </div>

                                  {/* Next Payment Date */}
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      {t('fields.nextPaymentDate')}
                                    </label>
                                    <input
                                      type="date"
                                      value={member.nextPaymentDate}
                                      onChange={(e) =>
                                        updateMember(
                                          group.id,
                                          member.id,
                                          "nextPaymentDate",
                                          e.target.value
                                        )
                                      }
                                      className="w-full px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                  </div>

                                  {/* Status */}
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      {t('fields.status')}
                                    </label>
                                    <select
                                      value={member.status}
                                      onChange={(e) =>
                                        updateMember(
                                          group.id,
                                          member.id,
                                          "status",
                                          e.target.value
                                        )
                                      }
                                      className="w-full px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    >
                                      <option value="active">{t('status.active')}</option>
                                      <option value="pending">{t('status.pending')}</option>
                                      <option value="overdue">{t('status.overdue')}</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {errors.submit}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4 inline mr-2" />
              {t('actions.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 text-white rounded-lg font-medium transition-colors flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? t('actions.creating') : t('actions.create')}
            </button>
          </div>
        </form>

        {/* Add Category Modal */}
        {showAddCategory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('addCategory')}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddCategory(false);
                    setNewCategoryName("");
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('fields.category')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCategory();
                    }
                  }}
                  placeholder="e.g., Finance, Education..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddCategory(false);
                    setNewCategoryName("");
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {t('actions.cancel')}
                </button>
                <button
                  type="button"
                  onClick={handleAddCategory}
                  disabled={!newCategoryName.trim() || isAddingCategory}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 text-white rounded-lg font-medium transition-colors"
                >
                  {isAddingCategory ? t('actions.adding') : t('actions.add')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
