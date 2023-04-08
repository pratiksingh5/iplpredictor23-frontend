import React from 'react';
import { Box, Typography, Divider, useTheme } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";

const PublicUserWidget = ({user}) => {
    const { palette } = useTheme();   
    const dark = palette.neutral.dark;
    const medium = palette.neutral.medium;
    const main = palette.neutral.main;

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
      >
        <FlexBetween gap="1rem">
          <UserImage image={user.picturePath.url} />
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
              {user.name}
            </Typography>
            <Typography color={medium}> {user.instaUsername}</Typography>
          </Box>
        </FlexBetween>
        {/* <ManageAccountsOutlined /> */}
      </FlexBetween>

      <Divider />
      {/* THIRD ROW */}
      <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Prediction Correct</Typography>
          <Typography color={main} fontWeight="500">
            {user.correctedVote}
          </Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography color={medium}>Total Prediction</Typography>
          <Typography color={main} fontWeight="500">
            {user.totalVote}
          </Typography>
        </FlexBetween>
      </Box>

      <Divider />
    </WidgetWrapper>
  )
}

export default PublicUserWidget