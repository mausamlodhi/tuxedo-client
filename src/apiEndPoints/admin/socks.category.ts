interface SocksCategoryEndpoints {
  list: APIEndPointInterface;
  create: APIEndPointInterface;
  details: (id: number) => APIEndPointInterface;
  update: (id: number) => APIEndPointInterface;
  delete: (id: number) => APIEndPointInterface;
}

const SocksCategory: SocksCategoryEndpoints = {
  list: {
    url: "/socks",
    method: "GET",
  },
  create: {
    url: "/socks",
    method: "POST",
  },
  details: (id: number) => ({
    url: `/socks/${id}`,
    method: "GET",
  }),
  update: (id: number) => ({
    url: `/socks/${id}`,
    method: "PATCH",
  }),
  delete: (id: number) => ({
    url: `/socks/${id}`,
    method: "DELETE",
  }),
};

export default SocksCategory;
