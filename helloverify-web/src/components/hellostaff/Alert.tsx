import { AlertIcon } from "@/components/momapply/icons";

export function Alert({ text }: { text: string }) {
  return (
    <p className="ma-alert" role="alert">
      <AlertIcon />
      <span>{text}</span>
    </p>
  );
}
