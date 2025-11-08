interface ContactUsEndPoints {
  list: APIEndPointInterface;
  create: APIEndPointInterface;
  details: (id: number) => APIEndPointInterface;
  update: (id: number) => APIEndPointInterface;
  delete: (id: number) => APIEndPointInterface;
}

const ContactUsEnpoints: ContactUsEndPoints = {
  list: {
    url: "/contact",
    method: "GET",
  },
  create: { url: "/contact", method: "POST" },
  details: (id: number) => ({ url: `/contact/${id}`, method: "GET" }),
  update: (id: number) => ({
    url: `/contact/${id}`,
    method: "PATCH",
  }),
  delete: (id: number) => ({ url: `/contact/${id}`, method: "DELETE" }),
};

export default ContactUsEnpoints;
