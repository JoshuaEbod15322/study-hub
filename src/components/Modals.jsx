// src/components/Modals.jsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FaCheck, FaTimes, FaComment, FaCalendar } from "react-icons/fa";
import { format } from "date-fns";

// Generate time options
const timeOptions = [];
for (let hour = 8; hour <= 20; hour++) {
  for (let minute = 0; minute < 60; minute += 30) {
    const timeString = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
    timeOptions.push(timeString);
  }
}

export function PostModal({
  open,
  onOpenChange,
  newPost,
  onPostChange,
  onImageChange,
  onSubmit,
  uploading,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Create New Study Place
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Study Place Name *
            </Label>
            <Input
              id="name"
              type="text"
              required
              value={newPost.name}
              onChange={(e) => onPostChange("name", e.target.value)}
              placeholder="Enter study place name"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Description *
            </Label>
            <Textarea
              id="description"
              required
              value={newPost.description}
              onChange={(e) => onPostChange("description", e.target.value)}
              placeholder="Enter description about this study place..."
              rows={4}
              className="w-full resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="location"
              className="text-sm font-medium text-gray-700"
            >
              Location *
            </Label>
            <Input
              id="location"
              type="text"
              required
              value={newPost.location}
              onChange={(e) => onPostChange("location", e.target.value)}
              placeholder="Enter location (e.g., Library Floor 2, Room 201)"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="image"
              className="text-sm font-medium text-gray-700"
            >
              Image (Optional)
            </Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
            />
            <p className="text-xs text-gray-500">
              Supported formats: JPG, PNG, GIF. Max size: 5MB
            </p>
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={uploading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {uploading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </div>
              ) : (
                "Create Study Place"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ReserveModal({
  open,
  onOpenChange,
  selectedPlace,
  reservationData,
  onReservationChange,
  onReserve,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Reserve Study Space
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            {selectedPlace?.name} • {selectedPlace?.location}
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Select Date *
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal h-12 px-4 border-2"
                >
                  <FaCalendar className="mr-3 h-4 w-4 text-gray-500" />
                  {reservationData.date ? (
                    format(reservationData.date, "EEEE, MMMM d, yyyy")
                  ) : (
                    <span className="text-gray-500">
                      Pick a reservation date
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={reservationData.date}
                  onSelect={(date) => onReservationChange("date", date)}
                  disabled={(date) => date < new Date().setHours(0, 0, 0, 0)}
                  initialFocus
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Start Time *
              </Label>
              <Select
                value={reservationData.startTime}
                onValueChange={(value) =>
                  onReservationChange("startTime", value)
                }
              >
                <SelectTrigger className="h-12 border-2">
                  <SelectValue placeholder="Start time" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                End Time *
              </Label>
              <Select
                value={reservationData.endTime}
                onValueChange={(value) => onReservationChange("endTime", value)}
              >
                <SelectTrigger className="h-12 border-2">
                  <SelectValue placeholder="End time" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {reservationData.date &&
            reservationData.startTime &&
            reservationData.endTime && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  Reservation Summary
                </h4>
                <p className="text-sm text-blue-800">
                  <strong>Date:</strong>{" "}
                  {format(reservationData.date, "MMMM d, yyyy")}
                </p>
                <p className="text-sm text-blue-800">
                  <strong>Time:</strong> {reservationData.startTime} -{" "}
                  {reservationData.endTime}
                </p>
                <p className="text-sm text-blue-800">
                  <strong>Duration:</strong>{" "}
                  {(() => {
                    const start = parseInt(
                      reservationData.startTime.split(":")[0]
                    );
                    const end = parseInt(reservationData.endTime.split(":")[0]);
                    return `${end - start} hour${end - start !== 1 ? "s" : ""}`;
                  })()}
                </p>
              </div>
            )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={onReserve}
            disabled={
              !reservationData.date ||
              !reservationData.startTime ||
              !reservationData.endTime
            }
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Reserve Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function EditReservationModal({
  open,
  onOpenChange,
  selectedReservation,
  reservationData,
  onReservationChange,
  onUpdate,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Edit Reservation
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            {selectedReservation?.study_place?.name} •{" "}
            {selectedReservation?.study_place?.location}
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Select Date *
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal h-12 px-4 border-2"
                >
                  <FaCalendar className="mr-3 h-4 w-4 text-gray-500" />
                  {reservationData.date ? (
                    format(reservationData.date, "EEEE, MMMM d, yyyy")
                  ) : (
                    <span className="text-gray-500">
                      Pick a reservation date
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={reservationData.date}
                  onSelect={(date) => onReservationChange("date", date)}
                  disabled={(date) => date < new Date().setHours(0, 0, 0, 0)}
                  initialFocus
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Start Time *
              </Label>
              <Select
                value={reservationData.startTime}
                onValueChange={(value) =>
                  onReservationChange("startTime", value)
                }
              >
                <SelectTrigger className="h-12 border-2">
                  <SelectValue placeholder="Start time" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                End Time *
              </Label>
              <Select
                value={reservationData.endTime}
                onValueChange={(value) => onReservationChange("endTime", value)}
              >
                <SelectTrigger className="h-12 border-2">
                  <SelectValue placeholder="End time" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {reservationData.date &&
            reservationData.startTime &&
            reservationData.endTime && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  Updated Reservation
                </h4>
                <p className="text-sm text-blue-800">
                  <strong>Date:</strong>{" "}
                  {format(reservationData.date, "MMMM d, yyyy")}
                </p>
                <p className="text-sm text-blue-800">
                  <strong>Time:</strong> {reservationData.startTime} -{" "}
                  {reservationData.endTime}
                </p>
                <p className="text-xs text-blue-700 mt-2">
                  Note: Updating your reservation will require re-approval.
                </p>
              </div>
            )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={onUpdate}
            disabled={
              !reservationData.date ||
              !reservationData.startTime ||
              !reservationData.endTime
            }
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Update Reservation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CommentsModal({
  open,
  onOpenChange,
  selectedPlace,
  comments,
  newComment,
  onCommentChange,
  onAddComment,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Comments
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            {selectedPlace?.name} • {comments.length} comment
            {comments.length !== 1 ? "s" : ""}
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="max-h-96 overflow-y-auto space-y-4 border rounded-lg p-4 bg-gray-50">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white rounded-lg p-4 shadow-sm border"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-sm text-gray-900">
                    {comment.user?.name || "Anonymous User"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {format(
                      new Date(comment.created_at),
                      "MMM d, yyyy 'at' h:mm a"
                    )}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{comment.content}</p>
              </div>
            ))}
            {comments.length === 0 && (
              <div className="text-center py-8">
                <FaComment className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No comments yet.</p>
                <p className="text-sm text-gray-400 mt-1">
                  Be the first to comment!
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Input
              value={newComment}
              onChange={onCommentChange}
              placeholder="Write your comment here..."
              onKeyPress={(e) => e.key === "Enter" && onAddComment()}
              className="flex-1 h-12"
            />
            <Button
              onClick={onAddComment}
              disabled={!newComment.trim()}
              className="h-12 bg-blue-600 hover:bg-blue-700"
            >
              Post
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ApprovalsModal({
  open,
  onOpenChange,
  pendingApprovals,
  onApprove,
  onReject,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Pending Approvals
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            {pendingApprovals.length} pending request
            {pendingApprovals.length !== 1 ? "s" : ""}
          </p>
        </DialogHeader>

        <div className="max-h-96 overflow-y-auto space-y-4">
          {pendingApprovals.map((approval) => (
            <div
              key={approval.id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg text-gray-900">
                    {approval.study_place?.name}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">
                        Requested by:
                      </span>
                      <p className="text-gray-600">{approval.user?.name}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Email:</span>
                      <p className="text-gray-600">{approval.user?.email}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Date:</span>
                      <p className="text-gray-600">
                        {approval.reservation_date}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Time Slot:
                      </span>
                      <p className="text-gray-600">
                        {approval.start_time} - {approval.end_time}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    onClick={() => onApprove(approval.id)}
                    className="bg-green-600 hover:bg-green-700 h-10 w-10"
                  >
                    <FaCheck className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onReject(approval.id)}
                    className="h-10 w-10"
                  >
                    <FaTimes className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {pendingApprovals.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheck className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-500 text-lg">All caught up!</p>
              <p className="text-sm text-gray-400 mt-1">
                No pending approvals at the moment.
              </p>
            </div>
          )}
        </div>

        {pendingApprovals.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-blue-800 text-center">
              Click the checkmark to approve or the X to reject reservation
              requests.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
