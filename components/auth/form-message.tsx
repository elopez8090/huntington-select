type FormMessageProps = {
  variant: "error" | "success";
  message: string;
};

export function FormMessage({ variant, message }: FormMessageProps) {
  const styles =
    variant === "error"
      ? "border-red-200 bg-red-50 text-red-800"
      : "border-emerald-200 bg-emerald-50 text-emerald-800";

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`rounded-lg border px-3 py-2 text-sm ${styles}`}
    >
      {message}
    </div>
  );
}
