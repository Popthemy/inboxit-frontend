import { Link } from "react-router-dom";

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <img src="/inboxIT.png" alt="inboxIT Logo" className="h-6 w-auto" />
      <span className="text-lg font-bold tracking-tight">inboxIT</span>
    </Link>
  );
}

export default Logo;