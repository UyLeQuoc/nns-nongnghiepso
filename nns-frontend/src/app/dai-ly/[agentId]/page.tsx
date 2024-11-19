// Server-side component handling static parameters
import ClientAgentProductPreferences from "./ClientAgentProductPreferences";

export async function generateStaticParams() {
  const response = await fetch("https://nns-api.uydev.id.vn/api/User/all");
  const agentData = await response.json();

  return agentData.map((agent: { id: number }) => ({
    agentId: agent.id.toString(),
  }));
}

export default function AgentProductPreferencesPage({ params }: { params: { agentId: string } }) {
  return <ClientAgentProductPreferences params={params} />;
}
