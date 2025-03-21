import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components";

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center">
      <Card className="w-full max-w-md  p-6 rounded-2xl bg-[#161B22] text-white border-none ">
        <CardContent>
          <h2 className="text-2xl font-semibold ">Chalo Game Khele!</h2>
          <LoginForm type="login" />
          <h6 className="text-primary underline cursor-pointer flex justify-end" onClick={() => navigate('/forget-password')}>Forget your password</h6>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
