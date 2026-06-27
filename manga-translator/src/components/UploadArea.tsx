import { useRef } from "react";

interface Props {
  onSelect: (file: File) => void;
}

export default function UploadArea({ onSelect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="border-2 border-dashed rounded-xl p-10 text-center">
      <h2 className="text-xl font-bold mb-4">Manga зураг оруулах</h2>

      <button
        onClick={() => inputRef.current?.click()}
        className="bg-blue-500 text-white px-5 py-2 rounded-lg"
      >
        Зураг сонгох
      </button>

      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (file) {
            onSelect(file);
          }
        }}
      />
    </div>
  );
}
