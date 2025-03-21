import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Upload, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useSelector, useDispatch } from "react-redux";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateProfileSchema } from "@/utils/validations/schema";
import { url } from "@/utils/url";
import { Loader2 } from "lucide-react";
import { RootState } from "@/main";
import { updateUser } from "@/redux";

const Profile = () => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  console.log("Current User State:", user);
  const token = useSelector((state: RootState) => state.token);
  const userId = user._id;
  console.log(userId);

  const updateForm = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      instaUsername: "",
      picturePath: "",
    },
  });

  const getUser = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`${url}/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch user data.");
      const data = await response.json();
      dispatch(updateUser(data))

    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    if(userId) getUser()
  }, [userId])

  useEffect(() => {
    if (user) {
      updateForm.setValue("name", user.name || "", { shouldDirty: true });
      updateForm.setValue("instaUsername", user.instaUsername || "", {
        shouldDirty: true,
      });
      updateForm.setValue("picturePath", user.picturePath.url || "", {
        shouldDirty: true,
      });
    }
  }, [user]);

  const handleUpload = async (file: File | null) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const res = await fetch(`${url}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      if (!data.imageUrl) {
        throw new Error("Invalid response: No imageUrl returned");
      }
      setImageUrl(data.imageUrl);
      updateForm.setValue("picturePath", data.imageUrl, { shouldDirty: true });
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  async function onUpdate(
    values: z.infer<typeof updateProfileSchema>
  ): Promise<void> {
    setLoading(true); // Start loading
    try {
      console.log(values);
      if (!userId) return;
      const response = await fetch(`${url}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // If auth is required
        },
        body: JSON.stringify(values),
      });

      const updatedUser = await response.json();
      dispatch(updateUser(updatedUser));

      if (!response.ok) {
        throw new Error(data.message || "Failed to update user");
      }

      getUser()

      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.warn(error);
      toast.error("Error updating account. Please try again later.");
    } finally {
      setLoading(false); // Start loading
    }
  }

  return (
    <div className="flex flex-col items-center mt-8">
      <Card className="w-full max-w-md  py-4 px-6 rounded-2xl bg-[#161B22] text-white border-none ">
        <CardContent>
          <h2 className="text-2xl font-semibold ">Edit Profile</h2>
          <Form {...updateForm}>
            <form
              onSubmit={updateForm.handleSubmit(onUpdate)}
              className="space-y-8 max-w-3xl mx-auto py-10"
            >
              <div className="flex flex-col gap-2">
                <FormLabel
                  htmlFor="file-upload"
                  className="text-sm font-medium"
                >
                  Upload Profile Picture
                </FormLabel>
                <Label
                  htmlFor="file-upload"
                  className="flex items-center justify-center gap-2 w-full p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 hover:text-black"
                >
                  {imageUrl ? (
                    <>
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-sm">Uploaded</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <span className="text-sm">
                        {uploading ? "Uploading..." : "Upload"}
                      </span>
                    </>
                  )}
                </Label>

                <Input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                  }}
                />
              </div>

              {/* Hidden Input to store image URL */}
              <FormField
                control={updateForm.control}
                name="picturePath"
                render={({ field }) => (
                  <Input
                    type="hidden"
                    {...field}
                    value={imageUrl || user.picturePath.url || ""}
                  />
                )}
              />
              <FormField
                control={updateForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your Name"
                        type="text"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={updateForm.control}
                name="instaUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Insta Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your Instagram username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full cursor-pointer rounded-full "
                disabled={true} // Disable button when loading
              >
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  "Update Profile"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
