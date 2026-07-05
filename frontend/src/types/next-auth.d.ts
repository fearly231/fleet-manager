import NextAuth, { DefaultSession } from "next-auth";
import { WorkerPublic } from "@/types/worker.types"; // Dostosuj ścieżkę do swojego pliku z interfejsami Workera

declare module "next-auth" {

  interface Session {
    user: {
      id: number;
      is_superuser: boolean; 
    } & DefaultSession["user"];
  }

  interface User {
    id: number;
    is_superuser: boolean;
  }
}

declare module "next-auth/jwt" {
 
  interface JWT {
    id: number;
    is_superuser: boolean;
  }
}