import { getUserProfile } from "@/actions/users";
import { getFollowers, getFollowing } from "@/actions/follows";

export default async function TestUserPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = await getUserProfile(username);

  if (!profile) return <div>User not found</div>;

  const followers = await getFollowers(profile.id);
  const following = await getFollowing(profile.id);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug: {profile.username}</h1>
      <pre className="bg-slate-100 p-4 rounded mb-4">
        {JSON.stringify(profile._count, null, 2)}
      </pre>
      
      <h2 className="text-xl font-bold mb-2">Followers ({followers.length})</h2>
      <pre className="bg-slate-100 p-4 rounded mb-4">
        {JSON.stringify(followers, null, 2)}
      </pre>

      <h2 className="text-xl font-bold mb-2">Following ({following.length})</h2>
      <pre className="bg-slate-100 p-4 rounded">
        {JSON.stringify(following, null, 2)}
      </pre>
    </div>
  );
}
