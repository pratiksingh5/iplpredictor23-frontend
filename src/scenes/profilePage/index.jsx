import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import { url } from "helper/url";
import { toast } from "react-toastify";
import MatchHistoryWidgets from "scenes/widgets/MatchHistoryWidgets";
import PublicUserWidget from "scenes/widgets/PublicUserWidget";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const [userMatches, setUserMatches] = useState([]);
  const [loading, setLoading] = useState(false);



  const getUser = async () => {
    const response = await fetch(`${url}/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  const getUserMatches = async () => {
    const response = await fetch(`${url}/votes/${userId}`, {
      method: "GET",
    });
    const data = await response.json();
    setUserMatches(data);
    toast.success("Matches History Loaded!", { toastId: 'history-call' });
    setLoading(false);
  };

  useEffect(() => {
    getUser();
    setLoading(true);
    getUserMatches();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <PublicUserWidget user ={user}/>
          <Box m="2rem 0" />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MatchHistoryWidgets userMatches={userMatches} loading={loading} />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
