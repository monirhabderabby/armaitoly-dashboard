"use client";

import { useAddGallery } from "@/hooks/gallery/use-add-gallery-image";
import type {
  OutputCollectionState,
  OutputFileEntry,
  UploadCtxProvider,
} from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";
import { FileUploaderRegular } from "@uploadcare/react-uploader/next";
import { useRef } from "react";

interface Props {
  roomId: string;
  roomName: string;
}

// ── Calls your Next.js route handler (keeps secret key server-side) ──
async function deleteUploadcareFile(uuid: string): Promise<void> {
  await fetch("/api/uploadcare/delete", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uuid }),
  });
}

// Extract UUID from CDN URL
// "https://ucarecdn.com/1bac376c-aa7e-4356-861b-dd2657b5bfd2/" → "1bac376c-..."
function extractUuid(cdnUrl: string): string {
  const parts = cdnUrl.replace(/\/$/, "").split("/");
  return parts[parts.length - 1];
}

export default function RoomImageUploader({ roomId, roomName }: Props) {
  // Tracks UUIDs that are uploaded but not yet confirmed via Done
  // useRef so event callbacks always read the latest value without re-renders
  const pendingUuids = useRef<Set<string>>(new Set());
  const uploaderApiRef = useRef<UploadCtxProvider | null>(null);

  // Tracks whether Done was clicked in the current modal session
  const doneClicked = useRef(false);

  const { mutate: addGallery } = useAddGallery();

  // ── Fires whenever upload state changes (files added, removed, uploaded) ──
  const handleUploadSuccess = (state: OutputCollectionState) => {
    const successEntries = state.allEntries.filter(
      (e: OutputFileEntry) => e.status === "success",
    );

    // Keep pendingUuids in sync with the uploader's current successful files
    // This also handles the case where a user removes a file before clicking Done
    pendingUuids.current = new Set(
      successEntries.map((e: OutputFileEntry) =>
        extractUuid(e.cdnUrl as string),
      ),
    );
  };

  // ── User clicked the Done button ──
  const handleDoneClick = () => {
    doneClicked.current = true;

    const urls = Array.from(pendingUuids.current).map(
      (uuid) => `https://ucarecdn.com/${uuid}/`,
    );

    pendingUuids.current = new Set(); // clear — they're now confirmed

    addGallery(
      {
        roomId: Number(roomId),
        roomName,
        images: urls,
      },
      {
        onSuccess: () => {
          uploaderApiRef.current?.getAPI().removeAllFiles();
        },
        onError: (err) => {
          console.error("Failed to save gallery:", err);
        },
      },
    );

    // 👉 Send `urls` to your Express server here
    // e.g. await fetch("https://your-api.com/rooms/photos", { method: "POST", body: JSON.stringify({ roomId, urls }) })

    // reset
    uploaderApiRef.current?.getAPI().removeAllFiles(); // wipes the uploader UI
  };

  // ── Fires when the modal is closed via X / backdrop / Escape ──
  const handleModalClose = () => {
    // Done was already clicked → nothing to clean up, just reset the flag
    if (doneClicked.current) {
      doneClicked.current = false; // reset for the next modal session
      return;
    }

    // Done was NOT clicked → delete every file that was uploaded this session
    const toDelete = Array.from(pendingUuids.current);

    if (toDelete.length === 0) return;

    console.log(
      `[Room ${roomId}] ⚠️ Modal closed without Done. Deleting ${toDelete.length} file(s):`,
      toDelete,
    );

    // Fire-and-forget: delete all in parallel
    Promise.all(toDelete.map(deleteUploadcareFile))
      .then(() => console.log(`[Room ${roomId}] 🗑️ Cleanup complete.`))
      .catch((err) => console.error(`[Room ${roomId}] Cleanup error:`, err));

    pendingUuids.current = new Set();
    uploaderApiRef.current?.getAPI().removeAllFiles(); // wipes the uploader UI
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,300&display=swap');
        @keyframes pulseDot {
          0%,100% { opacity:1;   transform:scale(1);   }
          50%      { opacity:.45; transform:scale(.78); }
        }
        .pulse-dot { animation: pulseDot 2.2s ease-in-out infinite; }
      `}</style>

      <div className="min-h-screen flex flex-col text-slate-900 antialiased">
        <div
          className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-5
                        shadow-[0_1px_3px_rgba(0,0,0,.05),0_8px_24px_rgba(0,0,0,.05)]"
        >
          {/* Card header */}
          <div className="flex items-center justify-between px-5 py-4 bg-slate-50/80 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center shrink-0">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2.5" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <div>
                <p className="text-[13.5px] font-semibold text-slate-900 leading-none mb-0.5">
                  Room media
                </p>
                <p className="text-[10px] text-slate-500">
                  JPG, PNG, WEBP · Max 25 MB per file
                </p>
              </div>
            </div>
          </div>

          {/* Uploader */}
          <div className="p-5">
            <FileUploaderRegular
              apiRef={uploaderApiRef}
              pubkey={
                process.env.NEXT_PUBLIC_UPLOADCARE_KEY ?? "e66f1e31ebf82bf7908e"
              }
              sourceList="local, camera, gdrive, facebook"
              classNameUploader="uc-light uc-purple"
              filesViewMode="grid"
              imgOnly
              userAgentIntegration="llm-nextjs"
              onCommonUploadSuccess={handleUploadSuccess} // ← syncs pendingUuids
              onDoneClick={handleDoneClick} // ← confirms upload
              onModalClose={handleModalClose} // ← cleans up if Done skipped
            />
          </div>
        </div>
      </div>
    </>
  );
}
