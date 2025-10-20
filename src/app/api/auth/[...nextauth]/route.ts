/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log(
          "🔐 Authorization attempt with credentials:",
          credentials?.email
        );

        try {
          const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}auth/login`;
          console.log("🌐 Calling API endpoint:", apiUrl);

          const res = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          const text = await res.text();
          let data;
          try {
            data = JSON.parse(text);
          } catch {
            console.error("❌ Failed to parse JSON response:", text);
            return null;
          }

          console.log("📦 Full API response:", JSON.stringify(data, null, 2));

          if (!res.ok || !data.success) {
            console.error("❌ API returned error:", data?.message);
            return null;
          }

          // ✅ Extract JWT token from response
          const token = data.data?.token;

          if (!token) {
            console.error("❌ No token found in API response");
            return null;
          }

          console.log("🔑 JWT token received");

          // ✅ Decode the JWT to extract user information
          let decodedToken;
          try {
            // Decode without verification (since we trust our backend)
            // If you want to verify, pass your JWT secret as options
            decodedToken = jwt.decode(token, { complete: false }) as any;

            if (!decodedToken) {
              console.error("❌ Failed to decode JWT token");
              return null;
            }

            console.log(
              "🔓 Decoded token:",
              JSON.stringify(decodedToken, null, 2)
            );
          } catch (err) {
            console.error("❌ JWT decode error:", err);
            return null;
          }

          // ✅ Extract user data from decoded token
          const user = {
            id:
              decodedToken.sub ||
              decodedToken.userId ||
              decodedToken.id ||
              "unknown",
            email: decodedToken.email || credentials?.email || "unknown",
            name:
              decodedToken.name ||
              decodedToken.username ||
              credentials?.email?.split("@")[0] ||
              "User",
            role: decodedToken.role || "user",
            accessToken: token, // Store the JWT token as accessToken
            image: decodedToken.image || null,
          };

          console.log(
            "✅ Extracted user from token:",
            JSON.stringify(user, null, 2)
          );

          // ✅ Validate required fields
          if (!user.id || !user.email) {
            console.error("❌ User missing required fields:", user);
            return null;
          }

          return user;
        } catch (err) {
          console.error("❌ Authorize error:", err);
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, user }) {
      console.log(
        "🔐 JWT callback - user:",
        user ? JSON.stringify(user, null, 2) : "refreshing token"
      );

      // When user logs in for the first time
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }

      console.log(
        "🔐 JWT callback - returning token:",
        JSON.stringify(token, null, 2)
      );
      return token;
    },

    async session({ session, token }) {
      console.log(
        "💼 Session callback - token:",
        JSON.stringify(token, null, 2)
      );

      session.user = {
        id: (token.id as string) || "unknown",
        name: (token.name as string) || "User",
        email: (token.email as string) || "unknown",
        role: (token.role as string) || "user",
        accessToken: (token.accessToken as string) || "",
        image: (token.picture as string) || null,
      };

      console.log(
        "💼 Session callback - returning session:",
        JSON.stringify(session, null, 2)
      );
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };
