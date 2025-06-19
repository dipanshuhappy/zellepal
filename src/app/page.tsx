import { auth } from "@/auth";
import HomeComponent from "@/components/Home";
import { redirect } from "next/navigation";



export default async function Home() {
  const session = await auth()
  if(session?.user){
   return redirect('/app')
  }
  return (
    <HomeComponent/>
  );
}