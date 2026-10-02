"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  adminGetNotifications,
  NotificationLogDto,
} from "@/lib/api";

const STATUS_TABS = [
  { label: "ALL STATUSES", value: "all" },
  { label: "SENT", value: "sent" },
  { label: "FAILED", value: "failed" },
];

const TYPE_OPTIONS = [
  { label: "All Notification Types", value: "all" },
  { label: "Order Confirmed", value: "order_confirmed" },
  { label: "Status Update", value: "order_status_changed" },
  { label: "Payment Failed", value: "payment_failed" },
];

export default function AdminNotificationsPage() {
  const [logs, setLogs] = useState<NotificationLogDto[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<NotificationLogDto | null>(null);

  const fetchLogs = async (currentPage = page, status = statusFilter, type = typeFilter) => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminGetNotifications({
        status: status === "all" ? undefined : status,
        notification_type: type === "all" ? undefined : type,
        page: currentPage,
        page_size: pageSize,
      });
      setLogs(res.items);
      setTotal(res.total);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load notification audit logs";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchLogs(1, statusFilter, typeFilter);
  }, [statusFilter, typeFilter]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchLogs(newPage, statusFilter, typeFilter);
  };

  const filteredLogs = logs.filter((log) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      log.recipient_email.toLowerCase().includes(q) ||
      log.subject.toLowerCase().includes(q) ||
      (log.order_number && log.order_number.toLowerCase().includes(q))
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return "text-emerald-800 border-emerald-200 bg-emerald-50";
      case "failed":
        return "text-rose-700 border-rose-200 bg-rose-50";
      default:
        return "text-[#78716C] border-[#EFECE6] bg-[#FAF8F5]";
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "order_confirmed":
        return "text-amber-800 border-amber-200 bg-amber-50";
      case "order_status_changed":
        return "text-purple-800 border-purple-200 bg-purple-50";
      case "payment_failed":
        return "text-rose-700 border-rose-200 bg-rose-50";
      default:
        return "text-[#78716C] border-[#EFECE6] bg-[#FAF8F5]";
    }
  };

  const formatTypeLabel = (type: string) => {
    switch (type) {
      case "order_confirmed":
        return "Order Confirmation";
      case "order_status_changed":
        return "Status Update";
      case "payment_failed":
        return "Payment Failure";
      default:
        return type.replace(/_/g, " ");
    }
  };

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-[#EFECE6] pb-6 gap-4">
        <div>
          <span className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#9E6544]">
            Communications &bull; Audit Trail
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-wider text-[#1A1816] mt-1">
            Notification Audit Logs
          </h1>
          <p className="text-xs text-[#78716C] font-body mt-0.5">
            Real-time delivery history for transactional emails and client communications across TN78.
          </p>
        </div>
        <button
          onClick={() => fetchLogs(page, statusFilter, typeFilter)}
          className="bg-white border border-[#EFECE6] hover:border-[#1A1816] text-[#1A1816] text-xs font-mono font-bold uppercase tracking-wider px-5 py-2.5 rounded-full shadow-sm transition-all self-start sm:self-auto"
        >
          ↻ Refresh Logs
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
          {error}
        </div>
      )}

      {/* Controls: Tabs & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-4 py-2 text-xs font-heading uppercase tracking-wider transition-all rounded-full ${
                statusFilter === tab.value
                  ? "bg-[#1A1816] text-[#FAF8F5] font-bold shadow-sm"
                  : "bg-white text-[#78716C] border border-[#EFECE6] hover:border-[#1A1816]/30 hover:text-[#1A1816]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Type Dropdown & Search Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-white border border-[#EFECE6] rounded-xl px-4 py-2 text-xs text-[#1A1816] focus:outline-none focus:border-[#9E6544] font-heading uppercase tracking-wider shadow-sm"
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search email, order, subject..."
            className="w-64 bg-white border border-[#EFECE6] rounded-xl px-4 py-2 text-xs text-[#1A1816] placeholder-[#A8A29E] focus:outline-none focus:border-[#9E6544] focus:ring-1 focus:ring-[#9E6544]/30 shadow-sm"
          />
        </div>
      </div>

      {/* Notifications Table */}
      <div className="bg-white border border-[#EFECE6] rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-[#78716C] font-mono text-xs uppercase tracking-widest">
            Loading notification audit records...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-16 text-center text-[#78716C] font-mono text-xs uppercase tracking-widest">
            No notification logs found matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-body">
              <thead className="bg-[#FAF8F5] font-heading text-[10px] uppercase tracking-wider text-[#78716C] border-b border-[#EFECE6]">
                <tr>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Type</th>
                  <th className="py-3.5 px-6">Recipient</th>
                  <th className="py-3.5 px-6">Subject</th>
                  <th className="py-3.5 px-6">Related Order</th>
                  <th className="py-3.5 px-6">Sent At</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE6] text-[#1A1816]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    {/* Status */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-0.5 text-[10px] font-heading font-bold uppercase tracking-wider border rounded-full ${getStatusBadge(
                          log.status
                        )}`}
                      >
                        {log.status}
                      </span>
                    </td>

                    {/* Notification Type */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-0.5 text-[10px] font-heading font-medium uppercase tracking-wider border rounded-full ${getTypeBadge(
                          log.notification_type
                        )}`}
                      >
                        {formatTypeLabel(log.notification_type)}
                      </span>
                    </td>

                    {/* Recipient Email */}
                    <td className="py-4 px-6 font-mono text-[11px] text-[#1A1816] font-medium">
                      {log.recipient_email}
                    </td>

                    {/* Subject */}
                    <td className="py-4 px-6 text-[#1A1816]/90 max-w-xs truncate" title={log.subject}>
                      {log.subject}
                    </td>

                    {/* Related Order */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      {log.order_number ? (
                        <Link
                          href={`/admin/orders/${log.order_number}`}
                          className="font-mono text-[11px] text-[#9E6544] hover:underline font-bold"
                        >
                          {log.order_number}
                        </Link>
                      ) : (
                        <span className="text-[#A8A29E]">—</span>
                      )}
                    </td>

                    {/* Timestamp */}
                    <td className="py-4 px-6 text-[#78716C] whitespace-nowrap font-mono text-[11px]">
                      {new Date(log.sent_at).toLocaleString("en-IN", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#1A1816] hover:text-[#9E6544] bg-[#FAF8F5] hover:bg-[#EFECE6] border border-[#EFECE6] px-3.5 py-1 rounded-full transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {total > pageSize && (
          <div className="p-4 border-t border-[#EFECE6] flex items-center justify-between text-xs text-[#78716C]">
            <div>
              Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total} records
            </div>
            <div className="flex items-center space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
                className="px-3.5 py-1.5 border border-[#EFECE6] rounded-full text-[#1A1816] hover:border-[#1A1816] disabled:opacity-40 transition-colors uppercase text-[10px] font-heading tracking-wider"
              >
                Previous
              </button>
              <span className="font-mono text-[11px] text-[#1A1816] px-2 font-bold">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
                className="px-3.5 py-1.5 border border-[#EFECE6] rounded-full text-[#1A1816] hover:border-[#1A1816] disabled:opacity-40 transition-colors uppercase text-[10px] font-heading tracking-wider"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-[#1A1816]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#EFECE6] rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-fade-in">
            <div className="flex items-start justify-between border-b border-[#EFECE6] pb-4">
              <div>
                <span
                  className={`inline-block px-2.5 py-0.5 text-[10px] font-heading font-bold uppercase tracking-wider border rounded-full mb-2 ${getStatusBadge(
                    selectedLog.status
                  )}`}
                >
                  {selectedLog.status}
                </span>
                <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-[#1A1816]">
                  {formatTypeLabel(selectedLog.notification_type)}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-[#78716C] hover:text-[#1A1816] text-xl font-bold leading-none p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[#78716C] font-bold mb-1">
                  Recipient Email
                </label>
                <p className="font-mono text-[#1A1816] bg-[#FAF8F5] p-2.5 rounded-lg border border-[#EFECE6]">
                  {selectedLog.recipient_email}
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[#78716C] font-bold mb-1">
                  Subject Line
                </label>
                <p className="text-[#1A1816] font-medium bg-[#FAF8F5] p-2.5 rounded-lg border border-[#EFECE6]">
                  {selectedLog.subject}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[#78716C] font-bold mb-1">
                    Order Reference
                  </label>
                  <p className="font-mono text-[#9E6544] font-bold bg-[#FAF8F5] p-2.5 rounded-lg border border-[#EFECE6]">
                    {selectedLog.order_number || "None"}
                  </p>
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[#78716C] font-bold mb-1">
                    Dispatch Time (UTC)
                  </label>
                  <p className="text-[#1A1816] font-mono text-[11px] bg-[#FAF8F5] p-2.5 rounded-lg border border-[#EFECE6]">
                    {new Date(selectedLog.sent_at).toUTCString()}
                  </p>
                </div>
              </div>

              {selectedLog.status === "failed" && selectedLog.error_message && (
                <div className="pt-2">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-rose-700 font-bold mb-1">
                    Error Diagnostic
                  </label>
                  <pre className="p-3 bg-rose-50 border border-rose-200 text-rose-700 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap rounded-xl">
                    {selectedLog.error_message}
                  </pre>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#EFECE6] flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-5 py-2 border border-[#EFECE6] hover:border-[#1A1816] text-[#1A1816] text-xs font-mono font-bold uppercase tracking-wider rounded-full transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
