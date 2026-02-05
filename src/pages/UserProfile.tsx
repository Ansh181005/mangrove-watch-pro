import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Loader2, Upload } from "lucide-react";

export const UserProfile = () => {
    const { user, profile } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        full_name: '',
        location: '',
        avatar_url: ''
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                full_name: profile.full_name || '',
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

            // Get Public URL
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

    const handleSave = async () => {
        try {
            setIsLoading(true);
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.full_name,
                    location: formData.location,
                    avatar_url: formData.avatar_url,
                    updated_at: new Date()
                })
                .eq('id', user?.id);

            if (error) throw error;

            toast({
                title: "Profile Updated",
                description: "Your details have been saved successfully.",
            });
        } catch (error: any) {
            toast({
                title: "Update Failed",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Manage your public profile details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={formData.avatar_url} />
                            <AvatarFallback className="text-xl">
                                {user?.email?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="relative">
                            <input
                                type="file"
                                id="avatar-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                disabled={isLoading}
                            />
                            <Button 
                                variant="outline" 
                                disabled={isLoading}
                                onClick={() => document.getElementById('avatar-upload')?.click()}
                            >
                                <Upload className="mr-2 h-4 w-4" />
                                {isLoading ? 'Uploading...' : 'Change Avatar'}
                            </Button>
                        </div>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input 
                                id="fullName" 
                                value={formData.full_name} 
                                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                placeholder="Your name" 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" value={user?.email || ''} disabled />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input 
                                id="location" 
                                value={formData.location} 
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                                placeholder="Your city/region" 
                            />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="type">User Type</Label>
                            <Input id="type" defaultValue={profile?.type || 'Individual'} disabled />
                        </div>
                    </div>
                    
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Save Changes
                    </Button>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Account Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-4 bg-muted rounded-lg">
                            <div className="text-2xl font-bold">{profile?.points || 0}</div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wide">Points</div>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                            <div className="text-2xl font-bold">{profile?.tier || 'Bronze'}</div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wide">Current Tier</div>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                            <div className="text-2xl font-bold">
                                {new Date(profile?.join_date || Date.now()).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wide">Joined</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
