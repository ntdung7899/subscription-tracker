"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { BasicInfoForm, FamilyGroupsSection } from "./_components";
import { Member, FamilyGroup, EditFormData } from "./_types";
import { useI18n } from '@/hooks/useI18n'

const categories = [
  "Productivity",
  "Development",
  "Design",
  "Entertainment",
  "Cloud",
  "Security",
  "Other",
];

const currencies = ["VND", "USD", "EUR", "GBP", "JPY"];

const billingCycles = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "quarterly", label: "Quarterly" },
];

export default function EditSubscriptionPage() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useParams();
  const subscriptionId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<EditFormData>({
    appName: "",
    category: "",
    price: "",
    currency: "VND",
    billingCycle: "monthly",
    notificationDays: "3",
    isShared: false,
    familyGroups: [],
  });

  useEffect(() => {
    fetchSubscription();
  }, [subscriptionId]);

  const fetchSubscription = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/subscriptions/${subscriptionId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch subscription");
      }

      const data = await response.json();
      //   console.log('Fetched subscription data:', data);

      // Transform familyGroups data from database format to form format
      const transformedFamilyGroups = (data.familyGroups || []).map(
        (group: any) => ({
          id: group.id,
          name: group.name || "",
          purchaseDate: group.purchaseDate
            ? new Date(group.purchaseDate).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          expirationDate: group.expirationDate
            ? new Date(group.expirationDate).toISOString().split("T")[0]
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
          notes: group.notes || "",
          members: (group.members || []).map((member: any) => ({
            id: member.id,
            name: member.name || "",
            email: member.email || "",
            amountPaid: member.amountPaid || 0,
            nextPaymentDate: member.nextPaymentDate
              ? new Date(member.nextPaymentDate).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0],
            status: member.status || "active",
          })),
        })
      );

      //   console.log('Transformed family groups:', transformedFamilyGroups);

      setFormData({
        appName: data.appName || "",
        category: data.category || "",
        price: data.price?.toString() || "",
        currency: data.currency || "VND",
        billingCycle: data.billingCycle || "monthly",
        notificationDays: data.notificationDays?.toString() || "3",
        familyGroups: transformedFamilyGroups,
        isShared: data.isShared || false,
      });
    } catch (error) {
      console.error("Error fetching subscription:", error);
      toast.error(t('subscriptions.edit.toast.loadError'));
      router.push("/dashboard/subscriptions");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.appName.trim()) {
      newErrors.appName = t('subscriptions.edit.validation.appNameRequired');
    }

    if (!formData.category) {
      newErrors.category = t('subscriptions.edit.validation.categoryRequired');
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = t('subscriptions.edit.validation.priceInvalid');
    }

    if (!formData.billingCycle) {
      newErrors.billingCycle = t('subscriptions.edit.validation.billingCycleRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t('subscriptions.edit.validation.checkInfo'));
      return;
    }

    setIsSubmitting(true);

    try {
      //   console.log('Submitting form data:', formData);
      const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appName: formData.appName,
          category: formData.category,
          price: formData.price,
          currency: formData.currency,
          billingCycle: formData.billingCycle,
          notificationDays: formData.notificationDays,
          isShared: formData.isShared,
          familyGroups: formData.familyGroups,
        }),
      });
      //   console.log("Response status:", response.status);
      //   console.log("Response ok:", response.ok);

      const responseData = await response.json();
      //   console.log("Response data:", responseData);

      if (!response.ok) {
        throw new Error(
          responseData.details ||
            responseData.error ||
            "Failed to update subscription"
        );
      }

      toast.success(t('subscriptions.edit.toast.updateSuccess'));
      router.push(`/dashboard/subscriptions/${subscriptionId}`);
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast.error(t('subscriptions.edit.toast.updateError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof EditFormData,
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
      id: `new-${Date.now()}`,
      name: "",
      purchaseDate: new Date().toISOString().split("T")[0],
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
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
      id: `new-${Date.now()}`,
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t('subscriptions.edit.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/dashboard/subscriptions/${subscriptionId}`}
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('subscriptions.edit.backToDetail')}
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('subscriptions.edit.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {t('subscriptions.edit.subtitle')}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <BasicInfoForm
          formData={formData}
          errors={errors}
          onInputChange={handleInputChange}
        />

        {/* Family Groups */}
        {formData.isShared && (
          <FamilyGroupsSection
            familyGroups={formData.familyGroups}
            onAddGroup={addFamilyGroup}
            onUpdateGroup={updateFamilyGroup}
            onRemoveGroup={removeFamilyGroup}
            onAddMember={addMember}
            onUpdateMember={updateMember}
            onRemoveMember={removeMember}
          />
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href={`/dashboard/subscriptions/${subscriptionId}`}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {t('subscriptions.edit.cancel')}
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('subscriptions.edit.saving')}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {t('subscriptions.edit.save')}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
