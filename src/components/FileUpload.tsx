interface FileUploadProps {
  onFileLoad: (text: string) => void;
}

export function FileUpload({ onFileLoad }: FileUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const text = event.target?.result as string;
      if (text) {
        onFileLoad(text);
      }
    };
    reader.readAsText(file);

    // Reset input so same file can be selected again
    e.target.value = '';
  };

  return (
    <div className="flex items-center gap-3">
      <label className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg cursor-pointer transition-colors">
        Upload .txt File
        <input
          type="file"
          accept=".txt"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
      <span className="text-gray-500 text-sm">or paste text above</span>
    </div>
  );
}
