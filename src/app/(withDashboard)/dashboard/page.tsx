import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import Image from "next/image";

const DashboardPage = async () => {
  const session = await getServerSession(authOptions); // here authOptions carries all providers. i need to get user info from browser's cookies
  // console.log(session);
  const userEmail = session?.user?.email;
  let dbUser = null;

  if (userEmail) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/registers/${userEmail}`,
      {
        cache: "no-store", // if I want to get real time data then it should better to cache off
      },
    );
    const data = await res.json();
    console.log("Backend Raw Data:", data);
    dbUser = data;
  }

  // console.log(dbUser);
  console.log("Email from session:", session?.user?.email);
  console.log("Full Session Object:", session);

  return (
    <div>
      {session?.user && (
        <>
          <h1 className="text-4xl text-center mt-10">
            Welcome {dbUser?.username}
          </h1>
          <h2 className="text-4xl text-center mt-10">
            Logged In email: {dbUser?.email}
          </h2>
          <Image
            src={
              (dbUser?.image as string) ||
              "https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211471.png"
            }
            alt="User Image"
            width={200}
            height={200}
            className="mx-auto rounded-full mt-5"
          />
          <h1 className="text-4xl text-center mt-10">Role: {dbUser?.role}</h1>
          <h1 className="text-2xl text-center mt-5">
            Last Login: {new Date(dbUser?.lastLogin).toLocaleString()}
          </h1>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
