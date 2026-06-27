import {
  Stage,
  Layer,
  Image as KonvaImage,
  Rect,
  Text,
  Transformer,
} from "react-konva";
import useImage from "use-image";
import { useState, useRef, useEffect } from "react";

interface Props {
  imageUrl: string;
  translatedText: string;
}

interface TextBox {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  fontSize: number;
  backgroundColor: string;
  textColor: string;
  textStrokeColor: string;
  textStrokeWidth: number;
  showBackground: boolean;
}

export default function MangaEditor({ imageUrl }: Props) {
  const [image] = useImage(imageUrl);

  const [translatedText, setTranslatedText] = useState("");
  const stageRef = useRef<any>(null);
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [boxes, setBoxes] = useState<TextBox[]>([
    {
      id: 1,
      x: 100,
      y: 100,
      width: 350,
      height: 150,
      text: "Орчуулга",
      fontSize: 22,
      backgroundColor: "#ffffff",
      textColor: "#000000",
      textStrokeColor: "#000000",
      textStrokeWidth: 0.5,
      showBackground: true,
    },
  ]);

  const addTranslatedText = () => {
    if (!translatedText.trim()) return;

    setBoxes((prev) => [
      ...prev,
      {
        id: Date.now(),
        x: 200,
        y: 200,
        width: 350,
        height: 150,
        text: translatedText,
        fontSize: 22,
        backgroundColor: "#ffffff",
        textColor: "#000000",
        textStrokeColor: "#000000",
        textStrokeWidth: 0.5,
        showBackground: true,
      },
    ]);
  };

  useEffect(() => {
    if (selectedId && shapeRef.current && trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [selectedId]);

  const selectedBox = boxes.find((b) => b.id === selectedId) || null;

  const addBox = () => {
    setBoxes((prev) => [
      ...prev,
      {
        id: Date.now(),
        x: 150,
        y: 150,
        width: 350,
        height: 150,
        text: "Шинэ текст",
        fontSize: 22,
        backgroundColor: "#ffffff",
        textColor: "#000000",
        textStrokeColor: "#000000",
        textStrokeWidth: 0.5,
        showBackground: true,
      },
    ]);
  };

  const downloadImage = () => {
    if (!stageRef.current) return;

    const uri = stageRef.current.toDataURL({
      pixelRatio: 2,
    });

    const link = document.createElement("a");

    link.download = "translated-manga.png";
    link.href = uri;
    link.click();
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={addBox}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Text Box нэмэх
        </button>

        <button
          onClick={downloadImage}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          PNG татах
        </button>
        <button
          onClick={addTranslatedText}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Орчуулгыг Box болгох
        </button>
      </div>

      <Stage ref={stageRef} width={1000} height={1400}>
        <Layer>
          {image && <KonvaImage image={image} width={1000} height={1400} />}

          {boxes.map((box) => (
            <Rect
              key={box.id}
              ref={selectedId === box.id ? shapeRef : undefined}
              x={box.x}
              y={box.y}
              width={box.width}
              height={box.height}
              fill={box.showBackground ? box.backgroundColor : "transparent"}
              stroke={selectedId === box.id ? "red" : "black"}
              strokeWidth={2}
              draggable
              onClick={() => setSelectedId(box.id)}
              onTap={() => setSelectedId(box.id)}
              onDragEnd={(e) => {
                setBoxes((prev) =>
                  prev.map((b) =>
                    b.id === box.id
                      ? {
                          ...b,
                          x: e.target.x(),
                          y: e.target.y(),
                        }
                      : b,
                  ),
                );
              }}
              onTransformEnd={(e) => {
                const node = e.target;

                const scaleX = node.scaleX();
                const scaleY = node.scaleY();

                node.scaleX(1);
                node.scaleY(1);

                setBoxes((prev) =>
                  prev.map((b) =>
                    b.id === box.id
                      ? {
                          ...b,
                          width: Math.max(100, node.width() * scaleX),
                          height: Math.max(50, node.height() * scaleY),
                        }
                      : b,
                  ),
                );
              }}
            />
          ))}

          {boxes.map((box) => (
            <Text
              key={`text-${box.id}`}
              x={box.x + 10}
              y={box.y + 10}
              width={box.width - 20}
              text={box.text}
              fontSize={box.fontSize}
              fill={box.textColor}
              stroke={box.textStrokeColor}
              strokeWidth={box.textStrokeWidth}
              align="center"
              draggable
              onClick={() => setSelectedId(box.id)}
              onTap={() => setSelectedId(box.id)}
              onDragEnd={(e) => {
                setBoxes((prev) =>
                  prev.map((b) =>
                    b.id === box.id
                      ? {
                          ...b,
                          x: e.target.x() - 10,
                          y: e.target.y() - 10,
                        }
                      : b,
                  ),
                );
              }}
            />
          ))}

          {selectedId && <Transformer ref={trRef} rotateEnabled={false} />}
        </Layer>
      </Stage>

      {translatedText && (
        <div className="mt-4 border rounded-lg p-4 bg-gray-100">
          <h2 className="font-bold mb-2 text-xl">Монгол орчуулга</h2>

          <textarea
            className="w-full border rounded p-2"
            rows={8}
            value={translatedText}
            onChange={(e) => setTranslatedText(e.target.value)}
          />
        </div>
      )}

      {selectedBox && (
        <div className="mt-4 border rounded p-4">
          <h2 className="font-bold mb-3">Text Box Засварлах</h2>

          <textarea
            className="w-full border p-2 rounded"
            rows={4}
            value={selectedBox.text}
            onChange={(e) => {
              setBoxes((prev) =>
                prev.map((b) =>
                  b.id === selectedId
                    ? {
                        ...b,
                        text: e.target.value,
                      }
                    : b,
                ),
              );
            }}
          />

          <div className="mt-4">
            <label>Font Size: {selectedBox.fontSize}</label>

            <input
              className="w-full"
              type="range"
              min="12"
              max="60"
              value={selectedBox.fontSize}
              onChange={(e) => {
                const size = Number(e.target.value);

                setBoxes((prev) =>
                  prev.map((b) =>
                    b.id === selectedId
                      ? {
                          ...b,
                          fontSize: size,
                        }
                      : b,
                  ),
                );
              }}
            />
          </div>

          <div className="mt-4">
            <label className="block mb-2">Background Color</label>

            <input
              type="color"
              value={selectedBox.backgroundColor}
              onChange={(e) => {
                setBoxes((prev) =>
                  prev.map((b) =>
                    b.id === selectedId
                      ? {
                          ...b,
                          backgroundColor: e.target.value,
                        }
                      : b,
                  ),
                );
              }}
            />
          </div>

          <div className="mt-4">
            <label className="block mb-2">Text Color</label>

            <input
              type="color"
              value={selectedBox.textColor}
              onChange={(e) => {
                setBoxes((prev) =>
                  prev.map((b) =>
                    b.id === selectedId
                      ? {
                          ...b,
                          textColor: e.target.value,
                        }
                      : b,
                  ),
                );
              }}
            />
          </div>

          <div className="mt-4">
            <label className="block mb-2">Background ON/OFF</label>

            <input
              type="checkbox"
              checked={selectedBox.showBackground}
              onChange={(e) => {
                setBoxes((prev) =>
                  prev.map((b) =>
                    b.id === selectedId
                      ? {
                          ...b,
                          showBackground: e.target.checked,
                        }
                      : b,
                  ),
                );
              }}
            />
          </div>

          <div className="mt-4">
            <label className="block mb-2">Text Outline</label>

            <input
              className="w-full"
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={selectedBox.textStrokeWidth}
              onChange={(e) => {
                setBoxes((prev) =>
                  prev.map((b) =>
                    b.id === selectedId
                      ? {
                          ...b,
                          textStrokeWidth: Number(e.target.value),
                        }
                      : b,
                  ),
                );
              }}
            />
          </div>

          <button
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => {
              setBoxes((prev) => prev.filter((b) => b.id !== selectedId));

              setSelectedId(null);
            }}
          >
            Устгах
          </button>
        </div>
      )}
    </div>
  );
}
