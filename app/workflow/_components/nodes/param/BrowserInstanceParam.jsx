export function BrowserInstanceParam({ param }) {
  return (
    <p className="text-xs">
      {param.name}
      {param.required && <span className="text-red-400 px-2">*</span>}
    </p>
  );
}
