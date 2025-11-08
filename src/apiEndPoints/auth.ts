import { url } from "inspector";

interface AuthEndpoints {
  login: APIEndPointInterface;
  signup: APIEndPointInterface;
  forgotPassword: APIEndPointInterface;
  logout: APIEndPointInterface;
  getRoles: APIEndPointInterface;
  verifyEmail: APIEndPointInterface;
  resendEmail: APIEndPointInterface;
  resetPassword: APIEndPointInterface;
  getCustomerDetails: APIEndPointInterface;
  createOrder: APIEndPointInterface;
  eventInvitation:APIEndPointInterface;
  invitedEvent:(id:string)=>APIEndPointInterface;
}

const Auth: AuthEndpoints = {
  login: {
    url: '/auth/login',
    method: 'POST',
  },
  signup: {
    url: '/auth/signup',
    method: 'POST',
  },
  forgotPassword: {
    url: '/auth/forgot-password',
    method: 'POST',
  },
  logout: {
    url: '/auth/logout',
    method: 'POST',
  },
  getRoles: {
    url: '/auth/roles',
    method: 'GET',
  },
  verifyEmail: {
    url: '/auth/verify-email',
    method: 'POST',
  },
  resendEmail: {
    url: '/auth/resend-otp',
    method: 'POST',
  },

  resetPassword: {
    url: '/auth/reset-password',
    method: 'POST',
  },
  getCustomerDetails: {
    url: '/auth/get_invited_customers_status',
    method:'POST'
  },
  createOrder :{
    method:"POST",
    url:"/order"
  },
  eventInvitation:{
    method:'POST',
    url:"/order/event-invitation"
  },
  invitedEvent:(referenceId:string)=>({
    method:'GET',
    url:`/eventDetails/reference/${referenceId}`
  })
};

export default Auth;
