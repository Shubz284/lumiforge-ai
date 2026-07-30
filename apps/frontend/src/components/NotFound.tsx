import { Button } from "@base-ui/react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="mt-2 text-gray-500">Page not found</p>

        <Button className="mt-6">
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
