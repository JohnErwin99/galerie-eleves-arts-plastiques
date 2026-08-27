"use client";

export function DeleteButton({
  confirmText,
  label = "Supprimer",
}: {
  confirmText: string;
  label?: string;
}) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
      className="rounded-md border border-red-200 px-3 py-1 text-red-700 hover:bg-red-50"
    >
      {label}
    </button>
  );
}
