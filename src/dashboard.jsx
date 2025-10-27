// src/dashboard.jsx
import { useEffect, useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import { supabase } from "./lib/supabase";
import { StudyPlaceCard } from "./components/StudyPlaceCard";
import { Sidebar } from "./components/Sidebar";
import {
  PostModal,
  ReserveModal,
  EditReservationModal,
  CommentsModal,
  ApprovalsModal,
} from "./components/Modals";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { FaComment } from "react-icons/fa";
import educationImg from "/books.svg";
import { format } from "date-fns";

function Dashboard() {
  const { user, signOut } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [studyPlaces, setStudyPlaces] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Modal states
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [reserveModalOpen, setReserveModalOpen] = useState(false);
  const [editReservationModalOpen, setEditReservationModalOpen] =
    useState(false);
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [approvalsModalOpen, setApprovalsModalOpen] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [selectedComments, setSelectedComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [reactions, setReactions] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Form states
  const [newPost, setNewPost] = useState({
    name: "",
    description: "",
    location: "",
    image: null,
  });

  const [reservationData, setReservationData] = useState({
    date: new Date(),
    startTime: "09:00",
    endTime: "10:00",
  });

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchStudyPlaces();
      fetchReservations();
    }
  }, [user]);

  useEffect(() => {
    if (userProfile?.role === "library_staff") {
      fetchPendingApprovals();
    }
  }, [userProfile]);

  // Data fetching functions
  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();
      if (!error) {
        setUserProfile(data);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const fetchStudyPlaces = async () => {
    try {
      const { data: placesData, error } = await supabase
        .from("study_places")
        .select(
          `
          *,
          creator:users!created_by(name, profile_picture_url),
          comments:comments(content, user_id, created_at, users(name))
        `
        )
        .order("created_at", { ascending: false });

      if (!error) {
        setStudyPlaces(placesData || []);

        // Process reactions and comments for UI
        const reactionsObj = {};
        // In fetchStudyPlaces function in dashboard.jsx
        const userReactionsPromises = placesData?.map(async (place) => {
          // Fetch likes count
          const { count: likesCount, error: likesError } = await supabase
            .from("reactions")
            .select("id", { count: "exact", head: true })
            .eq("study_place_id", place.id)
            .eq("type", "like");

          // Check if current user liked this post
          const { data: userLike, error: userLikeError } = await supabase
            .from("reactions")
            .select("id")
            .eq("study_place_id", place.id)
            .eq("user_id", user.id)
            .eq("type", "like")
            .single();

          // Fetch comments count for this place
          const { count: commentsCount, error: commentsError } = await supabase
            .from("comments")
            .select("id", { count: "exact", head: true })
            .eq("study_place_id", place.id);

          reactionsObj[place.id] = {
            likes: likesError ? 0 : likesCount || 0,
            comments: commentsError ? 0 : commentsCount || 0, // Use count instead of array
            userLiked: !userLikeError && !!userLike,
          };
        });

        await Promise.all(userReactionsPromises);
        setReactions(reactionsObj);
      }
    } catch (error) {
      console.error("Error fetching study places:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReservations = async () => {
    try {
      const { data, error } = await supabase
        .from("reservations")
        .select(
          `
          *,
          study_place:study_places(name, location),
          user:users(name)
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (!error) setReservations(data || []);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const fetchPendingApprovals = async () => {
    try {
      const { data, error } = await supabase
        .from("reservations")
        .select(
          `
          *,
          study_place:study_places(name, location, created_by),
          user:users(name, email)
        `
        )
        .eq("study_place.created_by", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false });
      if (!error) setPendingApprovals(data || []);
    } catch (error) {
      console.error("Error fetching pending approvals:", error);
    }
  };

  const fetchComments = async (studyPlaceId) => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select(
          `
          *,
          user:users(name)
        `
        )
        .eq("study_place_id", studyPlaceId)
        .order("created_at", { ascending: false });
      if (!error) setSelectedComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Action handlers
  const handleReserveClick = (place) => {
    if (userProfile?.role === "library_staff") return;
    setSelectedPlace(place);
    setReservationData({
      date: new Date(),
      startTime: "09:00",
      endTime: "10:00",
    });
    setReserveModalOpen(true);
  };

  const handleReserve = async () => {
    try {
      const { error } = await supabase.from("reservations").insert([
        {
          user_id: user.id,
          study_place_id: selectedPlace.id,
          reservation_date: format(reservationData.date, "yyyy-MM-dd"),
          start_time: reservationData.startTime,
          end_time: reservationData.endTime,
          status: "pending",
        },
      ]);

      if (error) throw error;

      setReserveModalOpen(false);
      setSuccessMessage(
        "Reservation requested successfully! Waiting for approval."
      );
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchReservations();
      fetchStudyPlaces();
    } catch (error) {
      console.error("Error reserving study place:", error);
      setSuccessMessage("Error making reservation. Please try again.");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleEditReservation = (reservation) => {
    setSelectedReservation(reservation);
    setReservationData({
      date: new Date(reservation.reservation_date),
      startTime: reservation.start_time,
      endTime: reservation.end_time,
    });
    setEditReservationModalOpen(true);
  };

  const handleUpdateReservation = async () => {
    try {
      const { error } = await supabase
        .from("reservations")
        .update({
          reservation_date: format(reservationData.date, "yyyy-MM-dd"),
          start_time: reservationData.startTime,
          end_time: reservationData.endTime,
          status: "pending",
        })
        .eq("id", selectedReservation.id);

      if (error) throw error;

      setEditReservationModalOpen(false);
      setSuccessMessage(
        "Reservation updated successfully! Waiting for re-approval."
      );
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchReservations();
    } catch (error) {
      console.error("Error updating reservation:", error);
      setSuccessMessage("Error updating reservation. Please try again.");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleApproveReservation = async (reservationId) => {
    try {
      const { error } = await supabase
        .from("reservations")
        .update({ status: "confirmed" })
        .eq("id", reservationId);

      if (error) throw error;

      setSuccessMessage("Reservation approved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchPendingApprovals();
      fetchReservations();
    } catch (error) {
      console.error("Error approving reservation:", error);
    }
  };

  const handleRejectReservation = async (reservationId) => {
    try {
      const { error } = await supabase
        .from("reservations")
        .update({ status: "cancelled" })
        .eq("id", reservationId);

      if (error) throw error;

      setSuccessMessage("Reservation rejected successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchPendingApprovals();
    } catch (error) {
      console.error("Error rejecting reservation:", error);
    }
  };

  const handleToggleAvailability = async (placeId, currentStatus) => {
    try {
      const { error } = await supabase
        .from("study_places")
        .update({ is_available: !currentStatus })
        .eq("id", placeId);

      if (error) throw error;

      setSuccessMessage(
        `Study place ${
          !currentStatus ? "set as available" : "set as unavailable"
        }!`
      );
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchStudyPlaces();
    } catch (error) {
      console.error("Error toggling availability:", error);
    }
  };

  const handleDeletePost = async (placeId) => {
    try {
      const { error } = await supabase
        .from("study_places")
        .delete()
        .eq("id", placeId);

      if (error) throw error;

      setSuccessMessage("Post deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchStudyPlaces();
    } catch (error) {
      console.error("Error deleting post:", error);
      setSuccessMessage("Error deleting post. Please try again.");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleAddComment = async (placeId, commentText) => {
    try {
      const { error } = await supabase.from("comments").insert([
        {
          user_id: user.id,
          study_place_id: placeId,
          content: commentText,
        },
      ]);

      if (error) throw error;

      setSuccessMessage("Comment added successfully!");
      setTimeout(() => setSuccessMessage(""), 2000);

      // Refresh to get updated comments
      fetchStudyPlaces();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleViewComments = (place) => {
    setSelectedPlace(place);
    fetchComments(place.id);
    setCommentsModalOpen(true);
  };

  const handleLike = async (placeId) => {
    try {
      // Check if user has already liked this post
      const { data: existingLike, error: checkError } = await supabase
        .from("reactions")
        .select("id")
        .eq("user_id", user.id)
        .eq("study_place_id", placeId)
        .eq("type", "like")
        .single();

      if (existingLike && !checkError) {
        // Unlike: Remove the reaction
        const { error: deleteError } = await supabase
          .from("reactions")
          .delete()
          .eq("id", existingLike.id);

        if (!deleteError) {
          // Update local state immediately
          setReactions((prev) => ({
            ...prev,
            [placeId]: {
              ...prev[placeId],
              likes: Math.max(0, (prev[placeId]?.likes || 0) - 1),
              userLiked: false,
            },
          }));
        }
      } else {
        // Like: Add new reaction
        const { error: insertError } = await supabase.from("reactions").insert([
          {
            user_id: user.id,
            study_place_id: placeId,
            type: "like",
          },
        ]);

        if (!insertError) {
          // Update local state immediately
          setReactions((prev) => ({
            ...prev,
            [placeId]: {
              ...prev[placeId],
              likes: (prev[placeId]?.likes || 0) + 1,
              userLiked: true,
            },
          }));
        }
      }

      // Refresh data to ensure consistency
      fetchStudyPlaces();
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!userProfile || userProfile.role !== "library_staff") return;

    setUploading(true);
    try {
      let imageUrl = null;

      if (newPost.image) {
        const fileExt = newPost.image.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("study-place-images")
          .upload(filePath, newPost.image);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("study-place-images")
          .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;
      }

      const { error } = await supabase.from("study_places").insert([
        {
          name: newPost.name,
          description: newPost.description,
          location: newPost.location,
          image_url: imageUrl,
          is_available: true,
          created_by: user.id,
        },
      ]);

      if (error) throw error;

      setPostModalOpen(false);
      setNewPost({ name: "", description: "", location: "", image: null });
      setSuccessMessage("Study place created successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchStudyPlaces();
    } catch (error) {
      console.error("Error creating study place:", error);
      setSuccessMessage("Error creating study place. Please try again.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPost((prev) => ({ ...prev, image: file }));
    }
  };

  const handlePostChange = (field, value) => {
    setNewPost((prev) => ({ ...prev, [field]: value }));
  };

  const handleReservationChange = (field, value) => {
    setReservationData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setSigningOut(false);
    }
  };

  // Helper functions
  const getUserReservation = (placeId) => {
    return reservations.find(
      (r) =>
        r.study_place_id === placeId &&
        (r.status === "confirmed" || r.status === "pending") &&
        r.user_id === user.id
    );
  };

  const isStudentOrTeacher =
    userProfile?.role === "student" || userProfile?.role === "teacher";

  // Skeleton loader component
  const StudyPlaceSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 flex items-center space-x-3">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="w-full h-48 rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="w-4 h-4" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="w-4 h-4" />
            <Skeleton className="w-4 h-4" />
          </div>
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Success Message Popup */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-right">
          {successMessage}
        </div>
      )}

      {/* Sidebar */}
      <Sidebar
        userProfile={userProfile}
        pendingApprovals={pendingApprovals}
        onPost={() => setPostModalOpen(true)}
        onApprovals={() => setApprovalsModalOpen(true)}
        onSignOut={handleSignOut}
        onSettingsToggle={() => setSettingsOpen(!settingsOpen)}
        settingsOpen={settingsOpen}
        signingOut={signingOut}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        <main className="flex-1 p-6 relative">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <StudyPlaceSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studyPlaces.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <img
                    src={educationImg}
                    alt="Login Visual"
                    className="max-w-xs mx-auto mb-4"
                  />
                  <p className="text-gray-500 text-lg mb-2">No posts yet.</p>
                  {userProfile?.role === "library_staff" && (
                    <p className="text-blue-600 font-medium">
                      Be the first to add a study place!
                    </p>
                  )}
                </div>
              ) : (
                studyPlaces.map((place) => {
                  const userReservation = getUserReservation(place.id);
                  const canReserve =
                    isStudentOrTeacher &&
                    place.is_available &&
                    !userReservation;

                  return (
                    <StudyPlaceCard
                      key={place.id}
                      place={place}
                      userProfile={userProfile}
                      userReservation={userReservation}
                      reactions={reactions}
                      onReserve={handleReserveClick}
                      onEditReservation={handleEditReservation}
                      onToggleAvailability={handleToggleAvailability}
                      onLike={handleLike}
                      onAddComment={handleAddComment}
                      onDeletePost={handleDeletePost}
                    />
                  );
                })
              )}
            </div>
          )}

          {/* Floating Comment Button */}
          <Button
            onClick={() => setCommentsModalOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors group"
          >
            <FaComment className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </Button>
        </main>
      </div>

      {/* Modals */}
      <PostModal
        open={postModalOpen}
        onOpenChange={setPostModalOpen}
        newPost={newPost}
        onPostChange={handlePostChange}
        onImageChange={handleImageChange}
        onSubmit={handleCreatePost}
        uploading={uploading}
      />

      <ReserveModal
        open={reserveModalOpen}
        onOpenChange={setReserveModalOpen}
        selectedPlace={selectedPlace}
        reservationData={reservationData}
        onReservationChange={handleReservationChange}
        onReserve={handleReserve}
      />

      <EditReservationModal
        open={editReservationModalOpen}
        onOpenChange={setEditReservationModalOpen}
        selectedReservation={selectedReservation}
        reservationData={reservationData}
        onReservationChange={handleReservationChange}
        onUpdate={handleUpdateReservation}
      />

      <CommentsModal
        open={commentsModalOpen}
        onOpenChange={setCommentsModalOpen}
        selectedPlace={selectedPlace}
        comments={selectedComments}
        newComment={newComment}
        onCommentChange={(e) => setNewComment(e.target.value)}
        onAddComment={() => {
          if (selectedPlace) {
            handleAddComment(selectedPlace.id, newComment);
            setNewComment("");
          }
        }}
      />

      <ApprovalsModal
        open={approvalsModalOpen}
        onOpenChange={setApprovalsModalOpen}
        pendingApprovals={pendingApprovals}
        onApprove={handleApproveReservation}
        onReject={handleRejectReservation}
      />
    </div>
  );
}

export default Dashboard;
