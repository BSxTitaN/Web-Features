import CompIn from "@/components/complaints/compIn";
import NavBar from "@/components/navBar";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { auth } from "../../Firebase/main";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Complaints({ userData }) {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, router, user]);

  return (
    <Complainy>
      <main>
        <NavBar userData={userData} />
        <CompIn />
      </main>
    </Complainy>
  );
}

const Complainy = styled.section`
  main {
    display: flex;
    font-family: "Satoshi";
    height: 100vh;
  }
`;
