import { useState } from "react";
import {
  Box,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  Menu,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import logo from "../../assets/Thb_logo2.png";

const Navbar = () => {
  const [isMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isAuth = Boolean(useSelector((state) => state.token));

  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    console.log(event.currentTarget);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const primaryLight = theme.palette.primary.light;
  const fullName = isAuth ? `${user.name}` : "";

  return (
    <FlexBetween padding="5px 6%">
      <FlexBetween gap="1.75rem">
        <Typography
          fontWeight="bold"
          color="primary"
          onClick={() => navigate("/home")}
          sx={{
            "&:hover": {
              color: primaryLight,
              cursor: "pointer",
            },
          }}
        >
          <img src={logo} alt="logo" width="80px" />
        </Typography>
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          {isAuth ? (
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}  onClick={() => navigate("/home")}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => navigate("/")}>
                  <Typography>Leaderboard</Typography>
                </MenuItem>
                <MenuItem onClick={() =>navigate(`/profile/${user._id}`)}>
                  <Typography>History</Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Log Out
                </MenuItem>
              </Select>
            </FormControl>
          ) : (
            <Typography
              fontWeight="400"
              fontSize="16px"
              color="#fff"
              padding="8px 15px"
              backgroundColor="#4b4b4b"
              onClick={() => navigate("/login")}
              sx={{
                "&:hover": {
                  color: "#fff",
                  cursor: "pointer",
                },
              }}
            >
              Login
            </Typography>
          )}
        </FlexBetween>
      ) : (
        <Box>
          {isAuth ? (
            <Box>
              <Avatar
                alt="Remy Sharp"
                src={user.picturePath.url}
                onClick={handleClick}
              />
              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <MenuItem onClick={() => navigate("/home")}>Vote</MenuItem>
                <MenuItem onClick={() => navigate("/")}>Leaderboard</MenuItem>
                <MenuItem onClick={() => navigate(`/profile/${user._id}`)}>History</MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Typography
              fontWeight="medium"
              fontSize="16px"
              color="#fff"
              onClick={() => navigate("/login")}
              sx={{
                "&:hover": {
                  color: "#fff",
                  cursor: "pointer",
                },
              }}
            >
              Login
            </Typography>
          )}
        </Box>
      )}

      {/* New Mobile NAV  */}

      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && <h1>Hello</h1>}
    </FlexBetween>
  );
};

export default Navbar;
