import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      adminId: string;
      name?: string | null;
    };
  }

  interface User {
    id: string;
    name?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    adminId?: string;
  }
}
