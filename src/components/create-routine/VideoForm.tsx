
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Form validation schema
const formSchema = z.object({
  videoUrl: z.string().min(1, "Video URL is required"),
  title: z.string().min(1, "Routine title is required"),
});

export type VideoFormValues = z.infer<typeof formSchema>;

interface VideoFormProps {
  onSubmit: (data: VideoFormValues) => void;
}

const VideoForm: React.FC<VideoFormProps> = ({ onSubmit }) => {
  const form = useForm<VideoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoUrl: "",
      title: "",
    },
  });

  return (
    <div className="max-w-xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="videoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>YouTube Video URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://www.youtube.com/watch?v=..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Routine Title</FormLabel>
                <FormControl>
                  <Input placeholder="My Dance Routine" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-gradient-dance w-full">Continue</Button>
        </form>
      </Form>
    </div>
  );
};

export default VideoForm;
