import { auth } from "@/auth";
import AppComponent from "@/components/App";
import { redirect } from "next/navigation";

export default async function AppPage(){
  
  const session = await auth()
  if(!session?.user){
    return redirect('/')
  }
  return <AppComponent/>
};