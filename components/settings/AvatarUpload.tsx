"use client";

import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Upload } from "lucide-react";

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function AvatarUpload({
  userId,
  initialUrl,
  onUploaded,
}: {
  userId: string;
  initialUrl: string;
  onUploaded: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(initialUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Vain JPEG, PNG tai WebP-kuvat sallittu.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Kuva on liian suuri (max 3 MB).");
      return;
    }

    setUploading(true);

    const ext = file.name.split(".").pop();
    // Path is prefixed with the user's own id — matches the storage RLS policy
    const path = `${userId}/avatar-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setUploading(false);
      toast.error("Kuvan lataus epäonnistui.");
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(path);

    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: publicUrl },
    });

    setUploading(false);

    if (updateError) {
      toast.error("Profiilikuvan tallennus epäonnistui.");
      return;
    }

    setAvatarUrl(publicUrl);
    onUploaded(publicUrl);
    toast.success("Profiilikuva päivitetty.");
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="w-24 h-24 rounded-full bg-slate-200 bg-cover bg-center border border-slate-200"
        style={{
          backgroundImage: avatarUrl ? `url(${avatarUrl})` : undefined,
        }}
      />
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="text-xs border px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium disabled:opacity-50"
      >
        <Upload size={14} />
        {uploading ? "Ladataan..." : "Vaihda kuva"}
      </button>
    </div>
  );
}
