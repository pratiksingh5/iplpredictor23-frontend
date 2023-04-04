import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MatchesWidget from "scenes/widgets/MatchesWidget";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath, role } = useSelector((state) => state.user);
  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          {role === "admin" ? (
            "Tum Vote nhi karoge!"
          ) : (
            <UserWidget userId={_id} picturePath={picturePath} />
          )}
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "66%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          {role === "admin" ? (
            <MatchesWidget />
          ) : (
            <>
              <h1>Big things brewing!</h1>
            </>
          )}
        </Box>
        {/* {isNonMobileScreens && (
          <Box flexBasis="26%">
            <AdvertWidget />
          </Box>
        )} */}
      </Box>
    </Box>
  );
};

export default HomePage;
