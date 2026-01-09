"use client";

import { Layers, Wallet, AlertTriangle, Users, Home } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  StatsCard,
  MonthlySpendingChart,
  CategoryBreakdownChart,
  UpcomingPaymentsTable,
  RecentSubscriptionsList,
} from "./_components";
import { useDashboard } from "@/hooks/useDashboard";
import { formatCurrency } from "@/utils/formatters";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const { summary, charts, isLoading, error } = useDashboard();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400">
            {error || t("error.loadingData")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t("subtitle")}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title={t("stats.totalSubscriptions")}
            value={summary?.stats.totalSubscriptions ?? 0}
            icon={Layers}
            isLoading={isLoading}
          />
          <StatsCard
            title={t("stats.monthlyCost")}
            value={formatCurrency(summary?.stats.monthlyCost ?? 0, "VND")}
            icon={Wallet}
            isLoading={isLoading}
          />
          <StatsCard
            title={t("stats.expiringSoon")}
            value={summary?.stats.expiringSoon ?? 0}
            icon={AlertTriangle}
            isLoading={isLoading}
          />
          <StatsCard
            title={t("stats.totalMembers")}
            value={summary?.stats.totalMembers ?? 0}
            icon={Users}
            isLoading={isLoading}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <MonthlySpendingChart
            data={charts?.monthlySpending ?? []}
            isLoading={isLoading}
          />
          <CategoryBreakdownChart
            data={charts?.categoryBreakdown ?? []}
            isLoading={isLoading}
          />
        </div>

        {/* Upcoming Payments Section */}
        <div className="mb-8">
          <UpcomingPaymentsTable
            payments={summary?.upcomingPayments ?? []}
            isLoading={isLoading}
          />
        </div>

        {/* Recent Subscriptions Section */}
        <div>
          <RecentSubscriptionsList
            subscriptions={summary?.recentSubscriptions ?? []}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
