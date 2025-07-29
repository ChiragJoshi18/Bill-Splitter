"use client"

import React from "react"
import { ArrowUpRight, ArrowDownLeft, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern"
import AnimatedNumberCountdown from "./ui/animated-number-countdown"

interface FinancialSummaryCardsProps {
  amountToPay: number
  amountToReceive: number
  totalExpenses: number
  currencySymbol: string
}

const FinancialSummaryCards: React.FC<FinancialSummaryCardsProps> = ({
  amountToPay,
  amountToReceive,
  totalExpenses,
  currencySymbol,
}) => {
  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      {/* Amount to Pay Card */}
      <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-6">
          <Badge
            variant="outline"
            className="rounded-[14px] border border-neutral-200 text-lg font-semibold text-neutral-800 dark:border-neutral-700 dark:text-neutral-200 mb-6"
          >
            <ArrowUpRight className="fill-red-500 stroke-1 text-neutral-800 dark:text-neutral-200 w-5 h-5" /> &nbsp;
            Amount to Pay
          </Badge>
          <AnimatedNumberCountdown
            value={amountToPay}
            className="text-neutral-900 dark:text-neutral-100 text-4xl font-bold"
            prefix={currencySymbol}
          />
        </div>
      </div>

      {/* Amount to Receive Card */}
      <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-6">
          <Badge
            variant="outline"
            className="rounded-[14px] border border-neutral-200 text-lg font-semibold text-neutral-800 dark:border-neutral-700 dark:text-neutral-200 mb-6"
          >
            <ArrowDownLeft className="fill-green-500 stroke-1 text-neutral-800 dark:text-neutral-200 w-5 h-5" /> &nbsp;
            Amount to Receive
          </Badge>
          <AnimatedNumberCountdown
            value={amountToReceive}
            className="text-neutral-900 dark:text-neutral-100 text-4xl font-bold"
            prefix={currencySymbol}
          />
        </div>
      </div>

      {/* Total Expenses Card */}
      <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-6">
          <Badge
            variant="outline"
            className="rounded-[14px] border border-neutral-200 text-lg font-semibold text-neutral-800 dark:border-neutral-700 dark:text-neutral-200 mb-6"
          >
            <DollarSign className="fill-blue-500 stroke-1 text-neutral-800 dark:text-neutral-200 w-5 h-5" /> &nbsp;
            Total Expenses
          </Badge>
          <AnimatedNumberCountdown
            value={totalExpenses}
            className="text-neutral-900 dark:text-neutral-100 text-4xl font-bold"
            prefix={currencySymbol}
          />
        </div>
      </div>
    </div>
  )
}

export default FinancialSummaryCards 