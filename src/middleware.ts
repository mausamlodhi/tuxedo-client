// middleware.ts
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { CUSTOMER_ROLE, TOKEN_KEY } from "./utils/env";
// import logger from "./utils/logger";

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get(TOKEN_KEY)?.value;
//   const role = request.cookies.get(CUSTOMER_ROLE)?.value;

 
//   logger("Token : ", token);
//   logger("Request URL : ", request.url);
//   logger("role : ", role);
   
//   const protectedRoutes = ["/vipadmin/dashboard", "/vipadmin/category"];

//   const authPages = ["/signin", "/signup"];

//   const vipPages= ["/vipadmin"]

//   // if (!token) {
//   //   logger("User is not authenticated");
//   //   const loginUrl = new URL("/vipadmin", request.url);
//   //   return NextResponse.redirect(loginUrl);
//   // }


//   if (token && authPages.includes(request.nextUrl.pathname)) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

   
//   // if (token && request.nextUrl.pathname.startsWith("/vipadmin")) {
//   //   if (role !== "ADMIN") {
//   //     return NextResponse.redirect(new URL("/", request.url)); // redirect home
//   //   }
//   // }


//   // if (token && vipPages.includes(request.nextUrl.pathname)) {
    
//   //   return NextResponse.redirect(new URL("/vipadmin/dashboard", request.url));
//   // }





//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/vipadmin/:path*", "/signin", "/signup"
//   ],

  
// };




import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_ROLE, CUSTOMER_ROLE, TOKEN_KEY } from "./utils/env";
import logger from "./utils/logger";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(TOKEN_KEY)?.value;
  const customerRole = request.cookies.get(CUSTOMER_ROLE)?.value;
  const adminRole = request.cookies.get(ADMIN_ROLE)?.value;

  let role: typeof  CUSTOMER_ROLE |typeof ADMIN_ROLE | null = null;

  if (adminRole) role = ADMIN_ROLE;
  else if (customerRole) role = CUSTOMER_ROLE;

  const path = request.nextUrl.pathname;

  logger(" Token:", token);
  logger(" Role:", role);
  logger(" Path:", path);

  const authPages = ["/signin", "/signup"];
  const isAdminRoot = path === "/vipadmin";
  const isAdminChild = path.startsWith("/vipadmin/");

  
  const response = NextResponse.next();
  response.cookies.set("lastPage", path);

  if (!token) {
    if (isAdminChild) {
      return NextResponse.redirect(new URL("/vipadmin", request.url));
    }
    return response;
  }

  if (role === CUSTOMER_ROLE) {
    if (authPages.includes(path) || isAdminRoot || isAdminChild) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return response;
  }

  if (role === ADMIN_ROLE) {
    if (path === "/" || isAdminRoot || authPages.includes(path)) {
     
      const lastPage = request.cookies.get("lastPage")?.value;

      
      if (lastPage && !authPages.includes(lastPage) && lastPage !== "/" && lastPage !== "/vipadmin") {
        return NextResponse.redirect(new URL(lastPage, request.url));
      }

      
      return NextResponse.redirect(new URL("/vipadmin/dashboard", request.url));
    }
    return response;
  }

  return response;
}

export const config = {
  matcher: ["/", "/signin", "/signup", "/vipadmin", "/vipadmin/:path*"],
};
