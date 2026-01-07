import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { RecentSubscriptionsListProps } from "../_types";
import { formatCurrency, formatRelativeTime } from "@/utils/formatters";

export function RecentSubscriptionsList({
  subscriptions,
  isLoading = false,
}: RecentSubscriptionsListProps) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse" />
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-20 bg-gray-100 dark:bg-gray-900 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }
  console.log("subscriptions", subscriptions);
  if (!subscriptions || subscriptions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Subscriptions
          </h3>
        </div>
        <div className="p-12 text-center text-gray-500 dark:text-gray-400">
          No subscriptions yet
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Subscriptions
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Latest {subscriptions.length} added subscriptions
        </p>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {subscriptions.map((subscription) => (
          <Link
            key={subscription.id}
            href={`/dashboard/subscriptions/${subscription.id}`}
            className="block p-6 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  {subscription.name?.charAt(0) || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {subscription.name || "Unknown"}
                  </h4>
                  <div className="flex items-center mt-1 space-x-3">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {subscription.category || "Uncategorized"}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      •
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {subscription.status || "personal"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatRelativeTime(subscription.createdAt)}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
