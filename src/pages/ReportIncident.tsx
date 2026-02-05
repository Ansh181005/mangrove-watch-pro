import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  type: z.string().min(1, "Detailed selection is required"),
  location: z.string().min(2, "Location is required"),
  description: z.string().min(10, "Description needs to be at least 10 characters"),
  severity: z.enum(["low", "medium", "high", "critical"]),
});

export const ReportIncident = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      location: "",
      description: "",
      severity: "medium",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { error } = await supabase.from("incidents").insert({
        ...values,
        reporter_id: user?.id,
        status: "new",
      });

      if (error) throw error;

      toast({
        title: "Incident Reported",
        description: "Your report has been submitted successfully.",
      });
      
      form.reset();
      navigate('/user/reports');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Report New Incident</h1>
        <p className="text-muted-foreground">Help us protect our mangroves by reporting suspicious activities or environmental damage.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Incident Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the type of incident" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Illegal Logging">Illegal Logging</SelectItem>
                    <SelectItem value="Unauthorized Fishing">Unauthorized Fishing</SelectItem>
                    <SelectItem value="Pollution Discharge">Pollution Discharge</SelectItem>
                    <SelectItem value="Wildlife Poaching">Wildlife Poaching</SelectItem>
                    <SelectItem value="Land Reclamation">Land Reclamation/Encroachment</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Northern Mangrove Reserve, Sector 4" {...field} />
                </FormControl>
                <FormDescription>
                  Be as specific as possible about where the incident occurred.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="severity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Severity Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low - Minor issue, low urgency</SelectItem>
                    <SelectItem value="medium">Medium - Requires attention</SelectItem>
                    <SelectItem value="high">High - Significant damage or threat</SelectItem>
                    <SelectItem value="critical">Critical - Immediate action required</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe what you observed..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">Submit Report</Button>
        </form>
      </Form>
    </div>
  );
};
