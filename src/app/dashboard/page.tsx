"use client";

import { useState, useEffect } from "react";
import { getStoredUser } from "@/lib/auth";

import { Check, X, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FormSubmission } from "../../../types";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function DashboardPage() {
  const user = getStoredUser();
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubmission, setSelectedSubmission] =
    useState<FormSubmission | null>(null);
  const itemsPerPage = 5;
  const { data: session } = useSession();
  console.log(session);

  useEffect(() => {
    const stored = localStorage.getItem("submissions");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSubmissions(parsed);
      } catch (e) {
        console.error("Failed to parse submissions:", e);
      }
    }
  }, []);

  const filteredSubmissions = submissions.filter((sub) => {
    if (filter === "all") return true;
    return sub.status === filter;
  });

  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubmissions = filteredSubmissions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleApprove = (id: string) => {
    const updated = submissions.map((sub) =>
      sub.id === id ? { ...sub, status: "active" as const } : sub
    );
    setSubmissions(updated);
    localStorage.setItem("submissions", JSON.stringify(updated));
  };

  const handleReject = (id: string) => {
    const updated = submissions.map((sub) =>
      sub.id === id ? { ...sub, status: "inactive" as const } : sub
    );
    setSubmissions(updated);
    localStorage.setItem("submissions", JSON.stringify(updated));
  };

  const handleApproveAll = () => {
    const updated = submissions.map((sub) => ({
      ...sub,
      status: "active" as const,
    }));
    setSubmissions(updated);
    localStorage.setItem("submissions", JSON.stringify(updated));
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-primary">
              Answer&apos;s Submissions
            </h1>
            <p className="text-gray-600">
              Welcome back! Here&apos;s what&apos;s happening with your app
              today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Image
              width={40}
              height={40}
              src="/placeholder.svg?height=40&width=40"
              alt={user?.name || "User"}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="font-semibold text-gray-900">
                {user?.name || "Olivia Rhye"}
              </div>
              <div className="text-sm text-gray-600">
                {user?.email || "olivia@untitledui.com"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Approved</SelectItem>
              <SelectItem value="inactive">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleApproveAll}
            className="bg-primary hover:bg-primary-hover text-white"
          >
            Approve All ({filteredSubmissions.length})
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-purple-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Serial
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  User&apos;s Answer
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedSubmissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    #{submission.serial}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div className="line-clamp-2">{submission.quote}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {submission.status === "active" ? (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                          Approved
                        </span>
                      ) : submission.status === "inactive" ? (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                          Rejected
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => handleApprove(submission.id)}
                            className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleReject(submission.id)}
                            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setSelectedSubmission(submission)}
                        className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + itemsPerPage, filteredSubmissions.length)} of{" "}
            {filteredSubmissions.length} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={
                  page === currentPage
                    ? "bg-primary hover:bg-primary-hover"
                    : ""
                }
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog
        open={!!selectedSubmission}
        onOpenChange={() => setSelectedSubmission(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Serial: #{selectedSubmission?.serial}</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">
                  1. Child&apos;s name and age?
                </h3>
                <p className="text-gray-700">
                  {selectedSubmission.childName}, {selectedSubmission.age} years
                  old
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  2. What did your child say?
                </h3>
                <p className="text-gray-700">{selectedSubmission.quote}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Media</h3>
                {selectedSubmission.photos && (
                  <Image
                    width={500}
                    height={500}
                    src={selectedSubmission.photos || "/placeholder.svg"}
                    alt="Submission"
                    className="w-full rounded-lg max-h-96 object-cover"
                  />
                )}
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
              onClick={() => {
                if (selectedSubmission) handleReject(selectedSubmission.id);
                setSelectedSubmission(null);
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => {
                if (selectedSubmission) handleApprove(selectedSubmission.id);
                setSelectedSubmission(null);
              }}
            >
              <Check className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
