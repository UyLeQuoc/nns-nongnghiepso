import ChartProductTypeOfUserPage from "./ChartProductTypeOfUserPage";

// Generate all static params for agentId and productTypeId
export async function generateStaticParams() {
  // Fetch agents (users) from API
  const agentsResponse = await fetch("https://nns-api.uydev.id.vn/api/User/all");
  const agents = await agentsResponse.json();

  // Fetch product types from API
  const productTypesResponse = await fetch("https://nns-api.uydev.id.vn/ProductType");
  const productTypes = await productTypesResponse.json();

  // Combine agentId and productTypeId into static params
  const params = agents.flatMap((agent: { id: number }) =>
    productTypes.map((productType: { id: number }) => ({
      agentId: agent.id.toString(),
      productTypeId: productType.id.toString(),
    }))
  );

  return params;
}

export default function Page({ params }: { params: { agentId: string; productTypeId: string } }) {
  return <ChartProductTypeOfUserPage params={params} />;
}
