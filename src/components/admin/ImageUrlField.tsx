"use client";

import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { inputClass } from "./FormField";

export default function ImageUrlField({
  value,
  onChange,
  folder,
}: {
  value: string;
  onChange: (url: string) => void;
  folder: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setUploading(true);
    setError("");
    try {
      const ext = file.name.split(".").pop();
      const path = `${folder}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("media").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Upload failed — check that the 'media' storage bucket exists (see supabase/schema.sql)."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/images/projects/cover.jpg or https://..."
          className={inputClass}
        />
        <label className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium text-muted hover:text-text">
          {uploading ? (
            "Uploading…"
          ) : (
            <>
              <UploadCloud size={14} />
              Upload
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt="Preview"
          className="mt-2 h-24 w-40 rounded-lg border border-border object-cover"
          onError={(e) => (e.currentTarget.style.display = "none")}
          onLoad={(e) => (e.currentTarget.style.display = "block")}
        />
      )}
    </div>
  );
}
