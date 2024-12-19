import type { Route } from "../track-one/+types"
import UserPage from "./user/UserPage";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Track Two" }]
}

export default function TrackTwo() {
  return (
      <div className="max-w-screen-2xl mx-auto">
        <UserPage />
      </div>
  )
}