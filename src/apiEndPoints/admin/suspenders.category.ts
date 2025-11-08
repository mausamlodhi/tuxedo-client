interface SuspendersCategoryEndpoints {
  list: APIEndPointInterface;
  create: APIEndPointInterface;
  details: (id: number) => APIEndPointInterface;
  update: (id: number) => APIEndPointInterface;
  delete: (id: number) => APIEndPointInterface;
}

const SuspendersCategory: SuspendersCategoryEndpoints = {
  list: {
    url: "/suspenders",
    method: "GET",
  },
  create: {
    url: "/suspenders",
    method: "POST",
  },
  details: (id: number) => ({
    url: `/suspenders/${id}`,
    method: "GET",
  }),
  update: (id: number) => ({
    url: `/suspenders/${id}`,
    method: "PATCH",
  }),
  delete: (id: number) => ({
    url: `/suspenders/${id}`,
    method: "DELETE",
  }),
};

export default SuspendersCategory;
