"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { UserProfile } from "@/types";
import { Camera, Save, X } from "lucide-react";
import { ImageCropper } from "@/components/ui/ImageCropper";

interface ProfileEditFormProps {
  profile: UserProfile;
  onSuccess?: () => void;
}

export function ProfileEditForm({ profile, onSuccess }: ProfileEditFormProps) {
  const router = useRouter();
  const { update: updateSession } = useSession();
  const [formData, setFormData] = useState({
    bio: profile.bio || "",
    image: profile.image || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Image cropping state
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result?.toString() || null);
        setCropperOpen(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    setCropperOpen(false);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", croppedImageBlob, "avatar.jpg");
      formData.append("folder", "nextjemari");
      formData.append("type", "avatar");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }

      setFormData(prev => ({ ...prev, image: data.data.url }));
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch("/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to update profile");
      }

      setSuccess(true);

      // Update session
      await updateSession();

      // Refresh router
      router.refresh();

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="animate-[slide-in-down_0.3s_ease-out] rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="animate-[slide-in-down_0.3s_ease-out] rounded-lg bg-green-50 p-4 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
            Profile updated successfully!
          </div>
        )}

        {/* Avatar Upload */}
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="relative group/avatar cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-slate-200 transition-all duration-300 group-hover/avatar:border-blue-500 group-hover/avatar:shadow-lg dark:border-[#1A1A1C]">
              {formData.image ? (
                <img
                  src={formData.image}
                  alt="Profile"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover/avatar:scale-110"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-200 dark:bg-[#1A1A1C]">
                  <Camera className="h-12 w-12 text-slate-400" />
                </div>
              )}
            </div>
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity duration-300 group-hover/avatar:opacity-100">
              <Camera className="h-8 w-8 text-white" />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Profile Picture</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Click the image to upload a new photo. You can crop it before saving.
            </p>
            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
              Recommended: Square image, max 5MB.
            </p>
          </div>
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Bio
          </label>
          <textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={4}
            maxLength={500}
            placeholder="Tell us about yourself..."
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:scale-[1.01] dark:border-[#1A1A1C] dark:bg-[#111113] dark:text-slate-100 dark:placeholder-slate-500"
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {formData.bio.length}/500 characters
          </p>
        </div>

        {/* Username (read-only) */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Username
          </label>
          <input
            type="text"
            value={profile.username}
            disabled
            title="Username cannot be changed"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500 dark:border-[#1A1A1C] dark:bg-[#0A0A0C] dark:text-slate-400"
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Username cannot be changed
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="group/btn flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <Save className="h-4 w-4 transition-transform duration-300 group-hover/btn:scale-110" />
            <span>{loading ? "Saving..." : "Save Changes"}</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFormData({
                bio: profile.bio || "",
                image: profile.image || "",
              });
              setError("");
              setSuccess(false);
            }}
            className="flex items-center gap-2 transition-all duration-300 hover:scale-105"
          >
            <X className="h-4 w-4" />
            <span>Reset</span>
          </Button>
        </div>
      </form>

      {imageSrc && (
        <ImageCropper
          imageSrc={imageSrc}
          open={cropperOpen}
          onCancel={() => {
            setCropperOpen(false);
            setImageSrc(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
          onCropComplete={handleCropComplete}
        />
      )}
    </>
  );
}

