import ProductTypePriceTrend from "./ProductTypePriceTrend";

// Generate static parameters for all productTypeId
export async function generateStaticParams() {
  // Fetch product types from the API
  const productTypesResponse = await fetch("https://nns-api.uydev.id.vn/ProductType");
  const productTypes = await productTypesResponse.json();

  // Generate static params for each productTypeId
  const params = productTypes.map((productType: { id: number }) => ({
    productTypeId: productType.id.toString(),
  }));

  return params;
}

export default function Page({ params }: { params: { productTypeId: string } }) {
  return <ProductTypePriceTrend params={params} />;
}
