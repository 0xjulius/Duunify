import { FileText } from "lucide-react";
import { DocumentItem, UserDocument } from "./DocumentItem";

interface UserDocumentsCardProps {
  cvDoc: UserDocument | null;
  coverLetterDoc: UserDocument | null;
  uploadingCv: boolean;
  uploadingLetter: boolean;
  deletingType: "cv" | "letter" | null;
  openingType: "cv" | "letter" | null;
  onOpen: (type: "cv" | "letter") => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>, type: "cv" | "letter") => void;
  onDelete: (type: "cv" | "letter") => void;
}

export function UserDocumentsCard({
  cvDoc,
  coverLetterDoc,
  uploadingCv,
  uploadingLetter,
  deletingType,
  openingType,
  onOpen,
  onUpload,
  onDelete,
}: UserDocumentsCardProps) {
  return (
    <section className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F2937] rounded-3xl overflow-hidden shadow-sm">
      <div className="px-6 py-5 border-b border-slate-200 dark:border-[#1F2937]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
            <FileText size={18} className="text-indigo-600 dark:text-indigo-400" />
          </div>

          <div>
            <h2 className="font-bold">Omat asiakirjat</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Maks. koko 500 KB / tiedosto
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-3">
        <DocumentItem
          type="cv"
          title="CV"
          doc={cvDoc}
          isUploading={uploadingCv}
          isDeleting={deletingType === "cv"}
          isOpening={openingType === "cv"}
          onOpen={onOpen}
          onUpload={onUpload}
          onDelete={onDelete}
        />

        <DocumentItem
          type="letter"
          title="Hakemuspohja"
          doc={coverLetterDoc}
          isUploading={uploadingLetter}
          isDeleting={deletingType === "letter"}
          isOpening={openingType === "letter"}
          onOpen={onOpen}
          onUpload={onUpload}
          onDelete={onDelete}
        />
      </div>
    </section>
  );
}