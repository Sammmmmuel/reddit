const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const should = chai.should();
chai.use(chaiHttp);

// Agent that will keep track of our cookies
const agent = chai.request.agent(server);

const User = require("../models/user");

describe("User", function() {
    it("should not be able to sign in if they are not registered", function(done) {
        agent
            .post("/login", { email: "no@no.com", password: "nono" })
            .end(function(err, res) {
                res.status.should.be.equal(401)
                done()
            })
    })

    it("should be able to signup", function(done) {
        User.findOneAndRemove("test@test.com", function() {
            agent
                .post("/sign-up")
                .send({ email: "test@test.com", password: "1234" })
                .end(function(err, res) {
                    res.status.should.be.equal(200)
                    agent.should.have.cookie("nToken")
                    done()
                })
        })
    })

    after(function() {
        agent.close()
    })
})