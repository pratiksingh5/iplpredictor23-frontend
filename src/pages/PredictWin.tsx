import { useState, useEffect, useCallback } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSelector, useDispatch } from "react-redux";
import { setMatches } from "@/redux";
import { teamImages } from "@/utils/constants";
import { url } from "@/utils/url";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Check, Loader2 } from "lucide-react";
import { RootState } from "@/main";

const PredictWin = () => {
  const { _id: userId } = useSelector((state) => state.user);
  const token = useSelector((state: RootState) => state.token);
  const matches = useSelector((state: RootState) => state.matches);
  const year = useSelector((state: RootState) => state.year);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const form = useForm({
    defaultValues: { selectedTeam: "" },
  });

  /** ✅ Memoized Function to Check If User Has Already Voted */
  const hasVoted = useCallback(
    (matchId: string) => user?.votes.some((vote) => vote.matchId === matchId),
    [user]
  );

  const getUser = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`${url}/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch user data.");
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const getAllMatches = async () => {
    try {
      const response = await fetch(`${url}/matches/allmatches`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(`Error fetching matches: ${response.statusText}`);
      }

      const data = await response.json();
      const currentDate = new Date();

      // ✅ Filter Matches within 28 hours
      const filteredData = data.filter((match) => {
        const matchStartTime = new Date(match.date);
        matchStartTime.setMinutes(matchStartTime.getMinutes() + 30);
        return (
          matchStartTime.getTime() - currentDate.getTime() <=
            28 * 60 * 60 * 1000 && currentDate < matchStartTime
        );
      });

      dispatch(setMatches({ matches: filteredData }));
    } catch (error) {
      console.error("Error fetching matches:", error);
      toast.error("Failed to fetch match data.");
    }
  };

  const onSubmit = async (data, matchId) => {
    if (!data.selectedTeam)
      return toast.error("Please select a team before voting.");

    setLoading(true);
    try {
      const response = await fetch(`${url}/votes/makevote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          matchId,
          selectedTeam: data.selectedTeam,
          year: year,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit vote");

      toast.success("Predicted successfully!");
      // ✅ Update user state immediately instead of waiting for API call
      getUser();
    } catch (error) {
      console.error("Voting Error:", error);
      toast.error("Failed to predict.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) getUser();
    getAllMatches();
  }, [userId]); // Ensures API call only when userId is available

  return (
    <div className="py-4 flex justify-center flex-col items-center gap-6 ">
      <h6> Today's Match</h6>
      {matches?.length > 0 ? (
        matches.map((match) => {
          // const voteForMatch = user?.votes.find(
          //   (vote) => vote.matchId === match._id
          // );
          return (
            <Form key={match._id} {...form}>
              <form
                className="mb-6 w-80"
                onSubmit={form.handleSubmit((data) =>
                  onSubmit(data, match?._id)
                )}
              >
                <Card className="bg-transparent text-white ">
                  <CardContent className="p-6 space-y-4 flex justify-center flex-col items-center ">
                    <h6> Match {match?.matchNo}</h6>

                    <FormField
                      control={form.control}
                      name="selectedTeam"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              value={field.value}
                              onValueChange={(value) => {
                                form.setValue("selectedTeam", value);
                              }}
                              className="flex justify-between w-full gap-8"
                            >
                              {[match.team1, match.team2].map((team) => (
                                <div
                                  key={team}
                                  className="flex flex-col items-center"
                                >
                                  <img
                                    src={teamImages[team]}
                                    alt={team}
                                    className="w-16 h-16 mb-2 object-contain"
                                  />
                                  <label
                                    htmlFor={team}
                                    className={`px-6 py-2 mt-2 rounded-lg cursor-pointer text-center transition-all border 
          ${
            field.value === team
              ? " text-white border-4 border-primary"
              : " border-gray-300 hover:bg-gray-300"
          }`}
                                  >
                                    {team}
                                    <RadioGroupItem
                                      value={team}
                                      id={team}
                                      className="sr-only"
                                    />
                                  </label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={hasVoted(match._id)}
                      className={`w-full mt-4 cursor-pointer ${
                        hasVoted(match._id) ? "cursor-not-allowed" : ""
                      }`}
                    >
                      {hasVoted(match._id) ? (
                        <>
                          <Check className="w-5 h-5 text-green-500" />
                          <span className="text-sm">Already voted</span>
                        </>
                      ) : loading ? (
                        <>
                          <Loader2 className="animate-spin h-5 w-5" />
                          Predicting...
                        </>
                      ) : (
                        "Predict Now"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </form>
            </Form>
          );
        })
      ) : (
        <p>No matches available</p>
      )}
    </div>
  );
};

export default PredictWin;
