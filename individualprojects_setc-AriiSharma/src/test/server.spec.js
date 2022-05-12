// Imports the server.js file to be tested.
const server = require("src\server.js");
// Assertion (Test Driven Development) and Should,  Expect(Behaviour driven 
// development) library
const chai = require("chai");
// Chai HTTP provides an interface for live integration testing of the API's.
const chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp);
const { assert, expect } = chai;

describe("Server!", () => {

    it("Loads Main Page",(done) => {
        chai
            .request(server)
            .get("/main")
            .end((err,res)=>{
                expect(res.body).to.have.property('imageLink');
                expect(res.body).to.have.property('bandName');
                expect(res.body).to.have.property('link');
                expect(res.body).to.have.property('year');
                expect(res.body).to.have.property('genre');
                done();
            })
    });

    it("Loads Searches Page",(done)=>{
        chai
            .request(server)
            .get("/searches")
            .end((err,res)=>{
                expect(res.body).to.have.property('data');
                done();
            })
    });
});