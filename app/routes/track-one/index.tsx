import type { Route } from "../track-one/+types";

import { Button } from "~/components/ui/button";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Track One" }];
}

export default function TrackOne() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Button>Click me</Button>
    </div>
  );
}