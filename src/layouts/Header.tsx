import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setLogout } from "@/redux";
import { useDispatch, useSelector } from "react-redux";
import { setYear } from "@/redux";

import { RootState } from "@/main";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);
  const currentYear = useSelector((state: RootState) => state.year);
  const isAuth = Boolean(useSelector((state: RootState) => state.token));

  const handleYearChange = (value: string) => {
    dispatch(setYear({ year: value }));
  };

  const handleLogout = () => {
    dispatch(setLogout());
  };

  return (
    <header className="w-full  bg-background px-[6vw] ">
      <div className="container relative mx-auto min-h-20 flex gap-4 flex-row items-center justify-between">
        <div className="">
          <p
            className="font-bold uppercase cursor-pointer text-xs md:text-xl"
            onClick={() => navigate("/")}
          >
            IPL Predictor <span className="text-primary">2025</span>{" "}
          </p>
        </div>

        <div className="flex gap-4">
          <Select value={currentYear} onValueChange={handleYearChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder={currentYear} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="cursor-pointer" value="2025">
                IPL 2025
              </SelectItem>
              <SelectItem className="cursor-pointer" value="2024">
                IPL 2024
              </SelectItem>
            </SelectContent>
          </Select>

          {!isAuth ? (
            <div className="">
              <Button
                className="cursor-pointer rounded-full min-w-24"
                onClick={() =>
                  navigate(
                    location.pathname === "/login" ? "/register" : "/login"
                  )
                }
              >
                {location.pathname === "/login" ? "Register" : "Login"}
              </Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer outline-none">
                {" "}
                <Avatar className="border-2 border-primary">
                  <AvatarImage src={user?.picturePath?.url} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => navigate("/profile")}
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
