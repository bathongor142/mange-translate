import { useState } from "react";
import UploadArea from "./components/UploadArea";
import Tesseract from "tesseract.js";
import MangaEditor from "./components/MangaEditor";

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file: File) => {
    try {
      const url = URL.createObjectURL(file);
      setImage(url);

      setLoading(true);

      const result = await Tesseract.recognize(file, "eng");
      const data: any = result.data;

      console.log("OCR Data:", result.data);
      console.log("Keys:", Object.keys(result.data));
      console.log(data.blocks);

      if (data.blocks?.length) {
        console.log(JSON.stringify(data.blocks[0], null, 2));
      }

      setText(result.data.text);

      setLoading(false);
    } catch (error) {
      console.error("OCR Error:", error);
      setLoading(false);
    }
  };

  const translateText = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
        }),
      });

      const data = await res.json();

      setTranslatedText(data.translation);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <UploadArea onSelect={handleUpload} />

      {/* {image && (
        <div className="mt-6">
          <MangaEditor imageUrl={image} />
        </div>
      )} */}

      {loading && (
        <div className="mt-4 text-lg font-semibold">Текст уншиж байна...</div>
      )}

      {text && (
        <div className="mt-6 border rounded-lg p-4">
          <h2 className="font-bold mb-2 text-xl">Илэрсэн текст</h2>

          <pre className="whitespace-pre-wrap">{text}</pre>
        </div>
      )}
      {text && (
        <button
          onClick={translateText}
          className="mt-4 bg-purple-600 text-white px-4 py-2 rounded"
        >
          Монгол руу орчуулах
        </button>
      )}
    </div>
  );
}
