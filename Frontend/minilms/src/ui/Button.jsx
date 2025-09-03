export default function Button({ as:Comp="button", variant="default", size="md", className="", ...props }){
  const base = "btn";
  const vs = {
    default: "", primary:"btn-primary", ghost:"btn-ghost",
    danger:"btn-danger", outline:"btn-outline"
  }[variant] || "";
  const sz = { sm:"btn-small", md:"", lg:"" }[size] || "";
  const cls = [base,vs,sz,className].filter(Boolean).join(" ");
  return <Comp className={cls} {...props} />;
}
