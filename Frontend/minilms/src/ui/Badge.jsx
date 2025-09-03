export default function Badge({ tone="info", children }){
  const cls = tone==="ok" ? "badge ok" : tone==="warn" ? "badge warn" : "badge info";
  return <span className={cls}>{children}</span>;
}
