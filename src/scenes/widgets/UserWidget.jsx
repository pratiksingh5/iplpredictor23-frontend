import axios from "axios";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { Box, Typography, Divider, useTheme, Button } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setMatches } from "state";
import { url } from "helper/url";
import { toast } from 'react-toastify';

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const dispatch = useDispatch();
  const matches = useSelector((state) => state.matches);
  const [selectedTeam, setSelectedTeam] = useState("");

  const getUser = async () => {
    const response = await fetch(`${url}/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  const getAllMacthes = async () => {
    const response = await fetch(
      `${url}/matches/${userId}/allmatches`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    const currentDate = new Date();
    const filteredData = data.filter((match) => {
      const matchStartTime = new Date(match.date);
      matchStartTime.setMinutes(matchStartTime.getMinutes() - 30);
      return (
        matchStartTime.getTime() - currentDate.getTime() <=
          24 * 60 * 60 * 1000 && currentDate < matchStartTime
      );
    });
    console.log(filteredData);
    dispatch(setMatches({ matches: filteredData }));
  };

  useEffect(() => {
    getUser();
    getAllMacthes();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const teamImages = {
    CSK: "https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T1/images/I/513mh5xOQmL._SR600%2C315_PIWhiteStrip%2CBottomLeft%2C0%2C35_SCLZZZZZZZ_FMpng_BG255%2C255%2C255.jpg",
    GT: "https://upload.wikimedia.org/wikipedia/en/thumb/0/09/Gujarat_Titans_Logo.svg/1200px-Gujarat_Titans_Logo.svg.png",
    DC: "https://www.nsbpictures.com/wp-content/uploads/2019/03/1024px-Delhi_Capitals_Logo.svg_.png",
    KKR: "https://logowik.com/content/uploads/images/kolkata-knight-riders6292.jpg",
    LSG: "https://hindubabynames.info/downloads/wp-content/themes/hbn_download/download/sports-ipl/lucknow-super-giants-logo.png",
    MI: "https://www.pngall.com/wp-content/uploads/2017/04/Mumbai-Indians-Logo-PNG.png",
    PBKS : "https://pixlok.com/wp-content/uploads/2021/04/Punjab-Kings-Logo-PNG-Image.jpg",
    RR: "https://upload.wikimedia.org/wikipedia/en/thumb/6/60/Rajasthan_Royals_Logo.svg/1200px-Rajasthan_Royals_Logo.svg.png",
    RCB: "https://e1.pxfuel.com/desktop-wallpaper/436/167/desktop-wallpaper-rcb-logo-ipl-logo-thumbnail.jpg",
    SRH: "https://www.pngitem.com/pimgs/m/77-776155_sunrisers-hyderabad-logo-png-image-free-download-searchpng.png"
  };

  const handleSelectTeam = (event) => {
    setSelectedTeam(event.target.value);
  };

  const handleSubmit = async (e, matchId, selectedTeam) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${url}/votes/makevote`,
        {
          userId,
          matchId,
          selectedTeam,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Predicted successfully!',  { toastId: 'vote-call' });
      console.log(response.data); // log the response message
      getUser();
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) {
    return null;
  }

  const { name, correctedVote, totalVote, instaUsername } = user;

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        onClick={() => navigate(`/profile/${userId}`)}
      >
        <FlexBetween gap="1rem">
          <UserImage image={picturePath.url} />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {name}
            </Typography>
            <Typography color={medium}> {instaUsername}</Typography>
          </Box>
        </FlexBetween>
        {/* <ManageAccountsOutlined /> */}
      </FlexBetween>

      <Divider />

      {/* SECOND ROW */}
      {/* <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{location}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{occupation}</Typography>
        </Box>
      </Box>

      <Divider /> */}

      {/* THIRD ROW */}
      <Box p="1rem 0">
        {/* <FlexBetween mb="0.5rem">
          <Typography color={medium}>Current Rank</Typography>
        <Typography color={main} fontWeight="500">{rank}</Typography>
        </FlexBetween> */}
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Prediction Correct</Typography>
          <Typography color={main} fontWeight="500">
            {correctedVote}
          </Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography color={medium}>Total Prediction</Typography>
          <Typography color={main} fontWeight="500">
            {totalVote}
          </Typography>
        </FlexBetween>
      </Box>

      <Divider />

      {/* FOURTH ROW */}
      <Box p="1rem 0">
        <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
          Today's Match
        </Typography>
        {matches &&
          matches.length > 0 &&
          matches.map((match, i) => {
            const voteForMatch = user.votes.find(
              (vote) => vote.matchId === match._id
            );
            return (
              <form
                onSubmit={(e) => {
                  handleSubmit(e, match._id, selectedTeam);
                }}
              >
                <Box sx={{marginTop: "1.5rem"}}>
                  <Typography
                    fontSize="0.9rem"
                    color={main}
                    fontWeight="500"
                    mb="1rem"
                  >
                    Match {match.matchNo}
                  </Typography>
                  <FormControl style={{ width: "100%" }}>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      value={selectedTeam}
                      onChange={handleSelectTeam}
                      name={match._id}
                      row
                    >
                      <FlexBetween style={{ width: "100%" }}>
                        <FormControlLabel
                          value={match.team1}
                          control={<Radio />}
                          label={
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <img
                                src={teamImages[match.team1]}
                                alt="twitter"
                                width="60"
                              />
                              <Typography color={main} fontWeight="500">
                                {match.team1}
                              </Typography>
                            </Box>
                          }
                        >
                          {" "}
                        </FormControlLabel>
                        <FormControlLabel
                          value={match.team2}
                          control={<Radio />}
                          label={
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <img
                                src={teamImages[match.team2]}
                                alt="twitter"
                                width="60"
                              />

                              <Typography color={main} fontWeight="500">
                                {match.team2}
                              </Typography>
                            </Box>
                          }
                        />
                      </FlexBetween>
                    </RadioGroup>

                    <Button
                      type="submit"
                      variant="contained"
                      style={{ marginTop: "1rem" }}
                      disabled={voteForMatch}
                    >
                      Vote Now{" "}
                    </Button>
                  </FormControl>
                </Box>
              </form>
            );
          })}
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;
