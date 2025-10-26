"use client";

import React, { useState } from "react";
import { Check, X, Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
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
import { FormSubmission, SubmissionType } from "../../../types";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Submission, updateSubmission, deleteSubmission } from "@/lib/api";
import { toast } from "sonner";
// import { useSession } from "next-auth/react";
import DashboardHeader from "@/components/dashboard-header";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";
// import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useThem } from "@/hooks";

export default function DashboardPage() {
  // const { data: session } = useSession();
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
    const { data:them } = useThem();
  
  // console.log(date, "hey date ");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubmission, setSelectedSubmission] =
    useState<FormSubmission | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const itemsPerPage = 7;
  const queryClient = useQueryClient();

  const { data: allSubmissions, isLoading } = useQuery({
    queryKey: ["submissions"],
    queryFn: Submission,
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "active" | "deactivate" | "pending";
    }) => {
      return updateSubmission(id, status);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      toast.success(
        variables.status === "active"
          ? "Submission approved successfully."
          : "Submission rejected successfully."
      );
    },
    onError: () => {
      toast.error("Something went wrong while updating submission.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return deleteSubmission(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      toast.success("Submission deleted successfully.");
    },
    onError: () => {
      toast.error("Failed to delete submission.");
    },
  });

  const handleApprove = (id: string) => {
    updateMutation.mutate({ id, status: "active" });
  };

  const handleReject = (id: string) => {
    updateMutation.mutate({ id, status: "deactivate" });
  };

  const handleDelete = (id: string) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteMutation.mutate(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  // Bulk approve function
  const handleBulkApprove = () => {
    if (!filteredSubmissions || filteredSubmissions.length === 0) {
      toast.error("No submissions to approve.");
      return;
    }

    const pendingSubmissions = filteredSubmissions.filter(
      (sub: SubmissionType) => sub.status === "pending"
    );

    if (pendingSubmissions.length === 0) {
      toast.info("No pending submissions to approve.");
      return;
    }

    // Approve each pending submission
    pendingSubmissions.forEach((submission: SubmissionType) => {
      updateMutation.mutate({ id: submission._id, status: "active" });
    });

    toast.success(`Approving ${pendingSubmissions.length} submissions...`);
  };

  let filteredSubmissions = allSubmissions?.filter(
    (sub: { status: string }) => {
      if (filter === "all") return true;
      return sub.status === filter;
    }
  );

  if (date) {
    filteredSubmissions = filteredSubmissions?.filter(
      (item: SubmissionType) => {
        const itemDate = new Date(item.createdAt)
          .toUTCString()
          .split(" ")
          .slice(0, 4)
          .join(" ");
        const selectedDate = date
          .toUTCString()
          .split(" ")
          .slice(0, 4)
          .join(" ");
        return itemDate === selectedDate;
      }
    );
  }

  const totalPages = Math.ceil(
    (filteredSubmissions?.length || 0) / itemsPerPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubmissions = filteredSubmissions?.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-600">
        Loading submissions...
      </div>
    );
  }

  const handleClearDate = () => {
    setDate(undefined);
    setOpen(false);
  };

  const dates = new Date(allSubmissions?.[0]?.createdAt || "");
  const formate = dates.toUTCString().replace(" 00:45:23 GMT", "");
  console.log(formate);


  const color= them?.data?.color
  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-primary">
              Audience Submissions
            </h1>
            <p className="text-gray-600">
              Welcome back! Here&apos;s what&apos;s happening with your app
              today.
            </p>
          </div>
          <DashboardHeader />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Approved</SelectItem>
                <SelectItem value="deactivate">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex flex-col gap-3">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date"
                    className="w-48 justify-between font-normal"
                  >
                    {date ? date.toLocaleDateString() : "Select date"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={date}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      setDate(date);
                      setOpen(false);
                    }}
                  />
                  <div className="p-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearDate}
                      className="w-full cursor-pointer"
                    >
                      Clear
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Button
            style={{ backgroundColor: color }}
            onClick={handleBulkApprove}
            className={` hover:bg-primary-hover text-white cursor-pointer`}
          >
            Approve All ({filteredSubmissions?.length || 0})
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

                   Email
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
              {paginatedSubmissions?.map((submission: SubmissionType) => (
                <tr key={submission._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    #{submission.serial}
                  </td>
                   <td className="px-6 py-4 text-sm text-gray-700">
                    <div className="line-clamp-2">{submission.email ? submission.email :'NO Email'}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div className="line-clamp-2">{submission.quote}</div>
                  </td>
                  <td className="px-6 py-4 flex items-center justify-end gap-2">
                    {submission.status === "active" ? (
                      <span className="px-3 py-2 rounded-sm text-sm font-medium bg-[#E6FAEE] text-green-700">
                        Approved
                      </span>
                    ) : submission.status === "pending" ? (
                      <>
                        <button
                          onClick={() => handleApprove(submission._id)}
                          className="p-2 rounded-sm bg-[#E6FAEE] text-[#1F9854] hover:bg-green-200 cursor-pointer"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleReject(submission._id)}
                          className="p-2 rounded-sm bg-[#FEECEE] text-red-600 hover:bg-red-200 cursor-pointer"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </>
                    ) : (
                      <span className="px-3 py-2 rounded-sm text-sm font-medium bg-[#FEECEE] text-red-600">
                        Rejected
                      </span>
                    )}
                    <button
                      onClick={() => setSelectedSubmission(submission)}
                      className="p-2 rounded-lg bg-[#EBDFFA] text-[#9B5DE5] hover:bg-[#d5bcf5] cursor-pointer"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(submission._id)}
                      className="p-2 rounded-lg bg-[#FFF5E5] text-[#E67E22] hover:bg-[#FFE1B3] cursor-pointer"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to{" "}
            {Math.min(
              startIndex + itemsPerPage,
              filteredSubmissions?.length || 0
            )}{" "}
            of {filteredSubmissions?.length || 0} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="cursor-pointer"
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
                    ? "bg-primary hover:bg-primary-hover cursor-pointer"
                    : "cursor-pointer"
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
              className="cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* View Modal */}
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
                {selectedSubmission.photos?.length && (
                  <Image
                    width={500}
                    height={500}
                    src={selectedSubmission.photos[0] as string}
                    alt="Submission"
                    className="w-full rounded-lg max-h-96 object-cover"
                  />
                )}
              </div>
            </div>
          )}
          <DialogFooter className="gap-2"></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete?</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            This action cannot be undone. The submission will be permanently
            removed.
          </p>
          <DialogFooter className="mt-4 flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
