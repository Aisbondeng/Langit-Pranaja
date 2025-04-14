import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown, Sparkles, Music, Download, Headphones } from "lucide-react";

export default function PremiumPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const isPremium = user?.userType === "premium" || user?.userType === "admin";

  const handleUpgrade = () => {
    setLoading(true);
    // Di sini seharusnya ada proses pembayaran asli
    // Untuk demo, kita hanya simulasikan loading
    setTimeout(() => {
      setLoading(false);
      alert("Fitur pembayaran belum diimplementasikan dalam versi demo");
    }, 1500);
  };

  return (
    <div className="container py-10 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">PRANAJA ARISHAF STUDIO PREMIUM</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Tingkatkan pengalaman musik Anda dengan fitur premium eksklusif. Nikmati musik berkualitas tinggi, playlist tak terbatas, dan banyak lagi.
        </p>
      </div>

      {isPremium ? (
        <Card className="bg-gradient-to-r from-primary/20 to-primary/5 border-primary/30 mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Crown className="h-6 w-6 mr-2 text-primary" />
              Anda Sudah Premium!
            </CardTitle>
            <CardDescription>
              Nikmati semua manfaat dan fitur eksklusif dari PRANAJA ARISHAF STUDIO PREMIUM
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Terima kasih telah berlangganan PRANAJA ARISHAF STUDIO PREMIUM. Anda memiliki akses ke semua fitur premium kami.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Bulanan</CardTitle>
              <CardDescription>Langganan bulan-ke-bulan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <span className="text-3xl font-bold">Rp45.000</span>
                <span className="text-muted-foreground"> / bulan</span>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-primary shrink-0" />
                  <span>Kualitas audio tinggi</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-primary shrink-0" />
                  <span>Playlist tanpa batas</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-primary shrink-0" />
                  <span>Akses ke semua fitur premium</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleUpgrade} disabled={loading}>
                {loading ? "Memproses..." : "Berlangganan"}
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-primary relative">
            <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-xs rounded-bl-lg rounded-tr-lg font-medium">
              POPULER
            </div>
            <CardHeader>
              <CardTitle>6 Bulan</CardTitle>
              <CardDescription>Hemat 25%</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <span className="text-3xl font-bold">Rp200.000</span>
                <span className="text-muted-foreground"> / 6 bulan</span>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-primary shrink-0" />
                  <span>Semua fitur paket Bulanan</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-primary shrink-0" />
                  <span>Hemat 25% dari harga bulanan</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-primary shrink-0" />
                  <span>Akses konten eksklusif</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="default" onClick={handleUpgrade} disabled={loading}>
                {loading ? "Memproses..." : "Berlangganan"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tahunan</CardTitle>
              <CardDescription>Hemat 40%</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <span className="text-3xl font-bold">Rp320.000</span>
                <span className="text-muted-foreground"> / tahun</span>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-primary shrink-0" />
                  <span>Semua fitur paket 6 Bulan</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-primary shrink-0" />
                  <span>Hemat 40% dari harga bulanan</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-primary shrink-0" />
                  <span>Prioritas dukungan pelanggan</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleUpgrade} disabled={loading}>
                {loading ? "Memproses..." : "Berlangganan"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
        <div className="flex flex-col items-center text-center p-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Kualitas Audio Premium</h3>
          <p className="text-muted-foreground">
            Nikmati musik Anda dengan kualitas audio terbaik, menghadirkan pengalaman mendengarkan yang lebih kaya.
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Music className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Playlist Tanpa Batas</h3>
          <p className="text-muted-foreground">
            Buat playlist sebanyak yang Anda inginkan dan atur musik Anda dengan cara yang paling sesuai untuk Anda.
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Headphones className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Konten Eksklusif</h3>
          <p className="text-muted-foreground">
            Akses konten khusus yang hanya tersedia untuk pengguna premium, termasuk trek musik eksklusif.
          </p>
        </div>
      </div>
    </div>
  );
}