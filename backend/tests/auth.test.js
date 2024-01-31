import app from "../app.js";
import User from "../models/user.model.js";
import request from "supertest";
import bcrypt from "bcrypt";
// const app = require("../app.js");
// const signup = require("../controllers/auth.controller.js");
// const User =  require("../models/user.model.js");
// const request = require("supertest");


const userOne = {
    username: "testuser",
    password: bcrypt.hashSync("weRT123!", 10),
    email: "testuser@mail.com"
}

const userTwo = {
    email: "avirageorge@gmail.com",
    username: "avira",
    password: "123456"
}

beforeEach(async () => {
    await User.deleteMany();
    await User(userOne).save();
});

test("Check if sigup works with valid inputs", async () => {
    await request(app).post("/api/auth/signup")
    .send(userTwo)
    .expect(200);
});


test("Check if Signin works with valid input", async () => {

    const response = await request(app)
    .post("/api/auth/signin")
    .send({
        username: userOne.username,
        password: "weRT123!"
    })
    .expect(200)
    .expect((response) => {
        expect(response._body.success).toEqual(true);
    });

    //expect(response.status).toEqual(200);
    //expect(response.success).toEqual(true);
})

afterEach(async () => {
    //await User.deleteMany();
});