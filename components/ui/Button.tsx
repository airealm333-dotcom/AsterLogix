import Link from "next/link";

type ButtonProps = {
  href?: string;
  variant?: "primary" | "outline" | "ghost";
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
};

export default function Button({
  href,
  variant = "primary",
  className = "",
  children,
  onClick,
  type = "button",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 text-sm px-7 py-3.5";
  const variants = {
    primary:
      "bg-primary text-foreground hover:bg-primary-dark",
    outline:
      "border border-border text-foreground hover:bg-foreground hover:text-white",
    ghost: "text-foreground hover:text-primary",
  };

  const cls = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
