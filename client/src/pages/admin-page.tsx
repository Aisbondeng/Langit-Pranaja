import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Edit, ShieldAlert, Trash, Users } from "lucide-react";

// Tipe data simulasi untuk halaman admin
type AdminUser = {
  id: number;
  username: string;
  email: string;
  userType: "free" | "premium" | "admin";
  registeredAt: string;
  lastLogin: string;
};

type UserStats = {
  totalUsers: number;
  premiumUsers: number;
  freeUsers: number;
  activeToday: number;
  activeThisWeek: number;
  newUsersToday: number;
};

// Data simulasi untuk contoh
const sampleUsers: AdminUser[] = [
  {
    id: 1,
    username: "admin",
    email: "admin@pranajamusik.com",
    userType: "admin",
    registeredAt: "2023-01-15T08:30:00Z",
    lastLogin: "2023-04-13T09:45:00Z",
  },
  {
    id: 2,
    username: "johndoe",
    email: "john@example.com",
    userType: "premium",
    registeredAt: "2023-02-20T14:22:00Z",
    lastLogin: "2023-04-12T18:30:00Z",
  },
  {
    id: 3,
    username: "janedoe",
    email: "jane@example.com",
    userType: "free",
    registeredAt: "2023-03-05T10:15:00Z",
    lastLogin: "2023-04-10T12:45:00Z",
  },
  {
    id: 4,
    username: "bobsmith",
    email: "bob@example.com",
    userType: "free",
    registeredAt: "2023-03-10T16:40:00Z",
    lastLogin: "2023-04-11T20:15:00Z",
  },
  {
    id: 5,
    username: "alicegreen",
    email: "alice@example.com",
    userType: "premium",
    registeredAt: "2023-02-28T09:20:00Z",
    lastLogin: "2023-04-13T08:10:00Z",
  },
];

const userStats: UserStats = {
  totalUsers: 50,
  premiumUsers: 18,
  freeUsers: 31,
  activeToday: 23,
  activeThisWeek: 42,
  newUsersToday: 3,
};

export default function AdminPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>(sampleUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Pastikan hanya admin yang bisa akses
  useEffect(() => {
    if (user?.userType !== "admin") {
      // Dalam aplikasi sebenarnya, redirect atau tampilkan error
      console.error("Unauthorized access to admin page");
    }
  }, [user]);

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserTypeChange = (userId: number, newUserType: "free" | "premium" | "admin") => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, userType: newUserType } : user
        )
      );
      setIsLoading(false);
    }, 500);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  if (user?.userType !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Akses Ditolak</h1>
        <p className="text-muted-foreground text-center max-w-md">
          Anda tidak memiliki izin untuk mengakses halaman admin.
          Halaman ini hanya tersedia untuk pengguna dengan hak administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Admin</h1>
          <p className="text-muted-foreground">
            Kelola pengguna dan lihat statistik Pranaja Musik Studio
          </p>
        </div>
        <div className="flex items-center mt-4 sm:mt-0 space-x-2">
          <Badge variant="outline" className="flex items-center">
            <Users className="h-3.5 w-3.5 mr-1" />
            Admin
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.totalUsers}</div>
            <div className="text-xs text-muted-foreground mt-1">
              +{userStats.newUsersToday} hari ini
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pengguna Premium</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.premiumUsers}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {Math.round((userStats.premiumUsers / userStats.totalUsers) * 100)}% dari total pengguna
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pengguna Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.activeToday}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {userStats.activeThisWeek} dalam 7 hari terakhir
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Manajemen Pengguna</TabsTrigger>
          <TabsTrigger value="premium">Konten Premium</TabsTrigger>
          <TabsTrigger value="analytics">Analitik</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Manajemen Pengguna</CardTitle>
              <CardDescription>
                Kelola pengguna, ubah status, dan lihat informasi akun.
              </CardDescription>
              <div className="mt-4">
                <Input
                  placeholder="Cari pengguna..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>Daftar pengguna Pranaja Musik Studio.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Terdaftar</TableHead>
                    <TableHead>Login Terakhir</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.userType === "admin"
                              ? "destructive"
                              : user.userType === "premium"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {user.userType}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(user.registeredAt)}</TableCell>
                      <TableCell>{formatDate(user.lastLogin)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => alert("Edit user")}
                            disabled={isLoading}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {user.userType !== "premium" && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleUserTypeChange(user.id, "premium")}
                              disabled={isLoading}
                            >
                              Jadikan Premium
                            </Button>
                          )}
                          {user.userType !== "free" && user.userType !== "admin" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUserTypeChange(user.id, "free")}
                              disabled={isLoading}
                            >
                              Jadikan Free
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="premium">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Kelola Konten Premium</CardTitle>
                <CardDescription>
                  Tambahkan atau ubah konten yang hanya tersedia untuk pengguna premium.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-primary/5 p-6 rounded-lg flex flex-col items-center justify-center text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Fitur dalam pengembangan
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    Manajemen konten premium saat ini sedang dalam pengembangan dan akan segera tersedia.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Analitik Penggunaan</CardTitle>
                <CardDescription>
                  Lihat statistik tentang bagaimana aplikasi Anda digunakan.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-primary/5 p-6 rounded-lg flex flex-col items-center justify-center text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Fitur dalam pengembangan
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    Dashboard analitik saat ini sedang dalam pengembangan dan akan segera tersedia.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}