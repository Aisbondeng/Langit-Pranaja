import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(3, {
    message: "Username harus memiliki setidaknya 3 karakter.",
  }),
  password: z.string().min(6, {
    message: "Password harus memiliki setidaknya 6 karakter.",
  }),
});

const registerSchema = z.object({
  username: z.string().min(3, {
    message: "Username harus memiliki setidaknya 3 karakter.",
  }),
  email: z.string().email({
    message: "Silakan masukkan email yang valid.",
  }),
  password: z.string().min(6, {
    message: "Password harus memiliki setidaknya 6 karakter.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok.",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user, loginMutation, registerMutation } = useAuth();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    const { confirmPassword, ...registerData } = data;
    const currentDate = new Date().toISOString();
    
    registerMutation.mutate({
      ...registerData,
      userType: "free",
      registeredAt: currentDate,
    });
  };

  // Redirect if already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center space-y-3">
            <Logo size={24} />
            <h1 className="text-2xl font-bold mt-4 text-amber-500">PRANAJA ARISHAF STUDIO</h1>
            <p className="text-sm text-muted-foreground text-center italic font-medium">
              "Musik Bukan Sekadar Suara. Ia Adalah Emosi, Kenangan, dan Harapan — Hadir Bersama PRANAJA ARISHAF STUDIO"
            </p>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Login atau mendaftar untuk menikmati berbagai musik favorit Anda
            </p>
          </div>
          
          <Tabs 
            defaultValue="login" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Daftar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="******" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Loading..." : "Login"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="register">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="******" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Konfirmasi Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="******" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Loading..." : "Daftar"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <div className="hidden md:flex flex-1 bg-primary/10 p-10 flex-col justify-center items-center">
        <div className="max-w-md space-y-6">
          <div className="bg-background p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <Music className="h-6 w-6 mr-2 text-amber-500" />
              <h3 className="font-bold text-lg">PRANAJA ARISHAF STUDIO</h3>
            </div>
            <p className="text-xs text-muted-foreground italic mb-2">
              "Musik Bukan Sekadar Suara. Ia Adalah Emosi, Kenangan, dan Harapan"
            </p>
            <h2 className="text-2xl font-bold mb-4">Dengarkan Musik Favoritmu Kapan Saja</h2>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Putar file musik lokalmu dari mana saja</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Buat dan kelola playlist dengan mudah</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Optimalkan pengalaman musik di perangkat Android</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Upgrade ke Premium untuk fitur eksklusif</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-primary/5 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2 text-amber-500">Fitur Premium</h3>
            <p className="mb-4">Nikmati pengalaman musik tanpa batas dengan PRANAJA ARISHAF STUDIO Premium!</p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Kualitas audio yang lebih tinggi</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Playlist tanpa batas</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Akses ke konten eksklusif</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}