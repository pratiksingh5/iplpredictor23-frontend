import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import ResetPassword from "@/components/ResetPassword";

const ForgetPassword = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center">
      <Card className="w-full max-w-md  p-6 rounded-2xl bg-[#161B22] text-white border-none ">
        <CardContent>
          <h2 className="text-2xl font-semibold ">Reset Your Password</h2>
          <ResetPassword />
          <h6
            className="text-primary underline cursor-pointer flex justify-end"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </h6>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgetPassword;
