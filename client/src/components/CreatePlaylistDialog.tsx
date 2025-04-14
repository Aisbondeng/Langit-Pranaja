import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { usePlaylist } from "../contexts/PlaylistContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface CreatePlaylistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().min(1, "Playlist name is required").max(50, "Name must be 50 characters or less"),
});

type FormValues = z.infer<typeof formSchema>;

const CreatePlaylistDialog: React.FC<CreatePlaylistDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { createPlaylist } = usePlaylist();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await createPlaylist(data.name);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create playlist:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-dark-lighter text-white border-dark-lighter">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Create New Playlist</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Playlist Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="My Awesome Playlist" 
                      {...field} 
                      className="bg-dark-DEFAULT border-dark-DEFAULT text-white"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="bg-transparent border-gray-600 text-white hover:bg-dark-DEFAULT"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-secondary hover:bg-secondary-dark text-white"
              >
                Create Playlist
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePlaylistDialog;
