interface TextInputProps {
  onTextSubmit: (text: string) => void;
}

export function TextInput({ onTextSubmit }: TextInputProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const text = formData.get('text') as string;
    if (text.trim()) {
      onTextSubmit(text);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <textarea
        name="text"
        placeholder="Paste or type your text here..."
        rows={6}
        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 resize-none focus:outline-none focus:border-blue-500"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors self-end"
      >
        Load Text
      </button>
    </form>
  );
}
