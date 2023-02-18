import NotiIn from "@/components/d-notice/notIn";
import NavBar from "@/components/navBar";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { auth } from "../../Firebase/main";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Message({ userData, userDe }) {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, router, user]);

  return (
    <Meesagey>
      <main>
        <NavBar userData={userData} />
        <NotiIn userData={userData} />
      </main>
    </Meesagey>
  );
}

const Meesagey = styled.section`
  main {
    display: flex;
    font-family: "Satoshi";
    height: 100vh;
  }
`;
