import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload } from "lucide-react";

export const AdminSettings = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Profile settings
  const [formData, setFormData] = useState({
    full_name: '',
    job_title: '',
    department: '',
    location: '',
    avatar_url: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        job_title: profile.job_title || '',
        department: profile.department || '',
        location: profile.location || '',
        avatar_url: profile.avatar_url || ''
      });
    }
  }, [profile]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }
        setIsLoading(true);
        const file = event.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user?.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
        
        setFormData(prev => ({ ...prev, avatar_url: data.publicUrl }));
        toast({
            title: "Avatar Uploaded",
            description: "Click Save Changes to apply.",
        });
    } catch (error: any) {
        toast({
            title: "Upload Failed",
            description: error.message,
            variant: "destructive"
        });
    } finally {
        setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: formData.full_name,
                job_title: formData.job_title,
                department: formData.department,
                location: formData.location,
                avatar_url: formData.avatar_url,
                updated_at: new Date()
            })
            .eq('id', user.id);

        if (error) throw error;

        toast({
            title: "Settings Saved",
            description: "Admin profile updated successfully."
        });
    } catch (error: any) {
        toast({
            title: "Error",
            description: error.message,
            variant: "destructive"
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your admin profile and system preferences.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal information and profile picture.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={formData.avatar_url} />
                    <AvatarFallback className="text-xl">
                        {user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="relative">
                    <input
                        type="file"
                        id="admin-avatar-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        disabled={isLoading}
                    />
                    <Button 
                        variant="outline" 
                        disabled={isLoading}
                        onClick={() => document.getElementById('admin-avatar-upload')?.click()}
                    >
                        <Upload className="mr-2 h-4 w-4" />
                        {isLoading ? 'Uploading...' : 'Change Avatar'}
                    </Button>
                </div>
             </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="admin-name">Full Name</Label>
                <Input 
                    id="admin-name" 
                    value={formData.full_name} 
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input id="admin-email" value={user?.email || ''} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-title">Job Title</Label>
                <Input 
                    id="admin-title" 
                    value={formData.job_title} 
                    onChange={(e) => setFormData({...formData, job_title: e.target.value})}
                    placeholder="e.g. Senior Administrator"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-dept">Department</Label>
                <Input 
                    id="admin-dept" 
                    value={formData.department} 
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    placeholder="e.g. Operations"
                />
              </div>
               <div className="space-y-2">
                <Label htmlFor="admin-loc">Location</Label>
                <Input 
                    id="admin-loc" 
                    value={formData.location} 
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>

            <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
