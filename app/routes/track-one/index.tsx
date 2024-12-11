import type { MetaArgs } from 'react-router-dom';
import { ProductList } from "./shop/ProductListPage";


export function meta(_: MetaArgs) {
  return [{ title: "Track One" }];
}

export default function TrackOne() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-center">Tracks One</h1>
      <ProductList />
    </div>
  );
}

