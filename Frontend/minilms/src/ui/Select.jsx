export default function Select({ className="", children, ...props }){
  return <select className={["select", className].join(" ")} {...props}>{children}</select>;
}
