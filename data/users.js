const faker = require ("faker");

const users = new Array(10).fill(null).map((ele)=>{
    return {
        name: faker.name.firstName(),
        lastname: faker.name.firstName(),
        email: faker.internet.email(),
        password: "a",
        career: faker.commerce.department(),
        hobbies: faker.commerce.department(),
        active: true,
    };
});

module.exports = users;
