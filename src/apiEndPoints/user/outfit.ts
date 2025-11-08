interface OutfitEndPoints {
  list: APIEndPointInterface;
  create: APIEndPointInterface;
  details: (id: number) => APIEndPointInterface;
  update: (id: number) => APIEndPointInterface;
  delete: (id: number) => APIEndPointInterface;
}

const Endpoints: OutfitEndPoints = {
  list: {
    url: "/outfit",
    method: "GET",
  },
  create: { url: "/outfit", method: "POST" },
  details: (id: number) => ({ url: `/outfit/${id}`, method: "GET" }),
  update: (id: number) => ({
    url: `/outfit/${id}`,
    method: "PATCH",
  }),
  delete: (id: number) => ({ url: `/outfit/${id}`, method: "DELETE" }),
};

export default Endpoints;
