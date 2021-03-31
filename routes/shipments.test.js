"use strict";

const shipItApi = require("../shipItApi");
shipItApi.shipProduct = jest.fn()

const request = require("supertest");
const app = require("../app");


describe("POST /", function () {
  test("valid", async function () {
    shipItApi.shipProduct.mockReturnValue(1234)

    const resp = await request(app).post("/shipments").send({
      productID: 1234,
      name: "Jon Test",
      addr: "Test Tester",
      zip: "12345-6989",
    });

    expect(resp.body).toEqual({ shipped: 1234 });
  });
  test("invalid", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 1500,
      name: "Jim Test",
      addr: "100 Five St",
      zip: "12395-9182",
    });

    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message).toEqual([
      "instance is not allowed to have the additional property \"productId\"",
      "instance requires property \"productID\"",
      ]);
  });
});
