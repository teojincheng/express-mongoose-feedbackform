const request = require("supertest");
const app = require("../app");
const {
  setupMongoServer,
  tearDownMongoServer,
} = require("../utils/testing-mongoose");
const Company = require("../../src/models/company.model");
const mongoose = require("mongoose");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

describe("companies", () => {
  let mongoServer;
  beforeAll(async () => {
    mongoServer = await setupMongoServer();
  });

  afterAll(async () => {
    await tearDownMongoServer(mongoServer);
  });

  beforeEach(async () => {
    const companiesData = [
      {
        id: "e5cc2c0a-93b5-4014-8910-6ed9f3056456",
        companyName: "Brakus, Aufderhar and Gutkowski",
        companySuffix: "and Sons",
        numberOfEmployees: 60497,
        description:
          "Voluptas reiciendis quasi expedita ex qui sit. Qui enim facilis adipisci qui.",
        reviews: [
          {
            id: "7da4d967-715b-4dc1-a74b-82a7992704f3",
            userId: "f6e016e6-e254-4375-bf82-797e6c00e3eb",
            userName: "Brennan Fisher",
            rating: 0,
            title: "eligendi adipisci",
            review:
              "Consequatur esse beatae voluptate voluptatibus expedita aperiam perspiciatis cumque voluptatem. Cum quasi dolor ut dignissimos illum magni eos. Et aspernatur illum commodi.",
          },
          {
            id: "fa07ef47-5849-4642-8af0-640e4887b1e6",
            userId: "13d0782f-2793-4c83-8279-93c9a03b3ac3",
            userName: "Annalise Nicolas",
            rating: 4,
            title: "iusto consequatur",
            review:
              "Facere dicta delectus impedit sunt sed officia omnis. Officiis vel optio corrupti iure. Atque iusto nemo. Ut voluptas quaerat omnis quis impedit maiores nihil ipsam. Quod ea sed voluptates. Dolorem officia esse enim.",
          },
        ],
      },
    ];
    await Company.create(companiesData);
  });

  afterEach(async () => {
    await Company.deleteMany();
  });

  describe("/companies", () => {
    it("GET should return all companies' information without reviews", async () => {
      const expectedCompanies = [
        {
          id: "e5cc2c0a-93b5-4014-8910-6ed9f3056456",
          companyName: "Brakus, Aufderhar and Gutkowski",
          companySuffix: "and Sons",
          numberOfEmployees: 60497,
          description:
            "Voluptas reiciendis quasi expedita ex qui sit. Qui enim facilis adipisci qui.",
        },
      ];
      const { body: actualCompanies } = await request(app)
        .get("/companies")
        .expect(200);
      actualCompanies.sort((a, b) => a.id > b.id);
      expect(actualCompanies).toEqual(expectedCompanies);
    });
  });

  describe("/companies/:id", () => {
    it("GET should return company information with reviews", async () => {
      const expectedCompany = {
        id: "e5cc2c0a-93b5-4014-8910-6ed9f3056456",
        companyName: "Brakus, Aufderhar and Gutkowski",
        companySuffix: "and Sons",
        numberOfEmployees: 60497,
        description:
          "Voluptas reiciendis quasi expedita ex qui sit. Qui enim facilis adipisci qui.",
        reviews: [
          {
            id: "7da4d967-715b-4dc1-a74b-82a7992704f3",
            userId: "f6e016e6-e254-4375-bf82-797e6c00e3eb",
            userName: "Brennan Fisher",
            rating: 0,
            title: "eligendi adipisci",
            review:
              "Consequatur esse beatae voluptate voluptatibus expedita aperiam perspiciatis cumque voluptatem. Cum quasi dolor ut dignissimos illum magni eos. Et aspernatur illum commodi.",
          },
          {
            id: "fa07ef47-5849-4642-8af0-640e4887b1e6",
            userId: "13d0782f-2793-4c83-8279-93c9a03b3ac3",
            userName: "Annalise Nicolas",
            rating: 4,
            title: "iusto consequatur",
            review:
              "Facere dicta delectus impedit sunt sed officia omnis. Officiis vel optio corrupti iure. Atque iusto nemo. Ut voluptas quaerat omnis quis impedit maiores nihil ipsam. Quod ea sed voluptates. Dolorem officia esse enim.",
          },
        ],
      };
      const { body: actualCompany } = await request(app)
        .get(`/companies/${expectedCompany.id}`)
        .expect(200);
      expect(actualCompany).toEqual(expectedCompany);
    });
  });

  describe("/companies/:id/reviews", () => {
    it("POST should add a review to the correct company", async () => {
      const companyId = "e5cc2c0a-93b5-4014-8910-6ed9f3056456";
      const expectedReviews = [
        {
          id: "7da4d967-715b-4dc1-a74b-82a7992704f3",
          userId: "f6e016e6-e254-4375-bf82-797e6c00e3eb",
          userName: "Brennan Fisher",
          rating: 0,
          title: "eligendi adipisci",
          review:
            "Consequatur esse beatae voluptate voluptatibus expedita aperiam perspiciatis cumque voluptatem. Cum quasi dolor ut dignissimos illum magni eos. Et aspernatur illum commodi.",
        },
        {
          id: "fa07ef47-5849-4642-8af0-640e4887b1e6",
          userId: "13d0782f-2793-4c83-8279-93c9a03b3ac3",
          userName: "Annalise Nicolas",
          rating: 4,
          title: "iusto consequatur",
          review:
            "Facere dicta delectus impedit sunt sed officia omnis. Officiis vel optio corrupti iure. Atque iusto nemo. Ut voluptas quaerat omnis quis impedit maiores nihil ipsam. Quod ea sed voluptates. Dolorem officia esse enim.",
        },
        {
          userId: "754aece9-64bf-42ab-b91c-bb65e2db3a37",
          userName: "Humberto Bruen",
          rating: 4,
          title: "eligendi adipisci",
          review:
            "Et voluptatem voluptas quisquam quos officia assumenda. Mollitia delectus vitae quia molestias nulla ut hic praesentium. Sed et assumenda et iusto velit laborum sunt non.",
        },
      ];
      const newReview = {
        rating: 4,
        title: "eligendi adipisci",
        review:
          "Et voluptatem voluptas quisquam quos officia assumenda. Mollitia delectus vitae quia molestias nulla ut hic praesentium. Sed et assumenda et iusto velit laborum sunt non.",
      };

      const { body: actualReviews } = await request(app)
        .post(`/companies/${companyId}/reviews`)
        .send(newReview)
        .expect(201);

      expect(actualReviews).toMatchObject(expectedReviews);
      expect(actualReviews[2]).toHaveProperty("id");
      expect(actualReviews[2]).not.toHaveProperty("_id");
    });

    it("POST should respond with error 400 when required property not given", async () => {
      const companyId = "e5cc2c0a-93b5-4014-8910-6ed9f3056456";
      const incorrectReview = {
        rating: 4,
        title: "eligendi adipisci",
      };
      const { body: error } = await request(app)
        .post(`/companies/${companyId}/reviews`)
        .send(incorrectReview)
        .expect(400);
      expect(error.error).toContain("validation failed");
    });
  });
});