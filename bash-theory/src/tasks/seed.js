const dbConnection = require("../config/mongoConnection");
const posts = require("../data/posts");

async function main() {
    const db = await dbConnection();
    await db.dropDatabase();
    
    const p1 = await posts.create({
        posterName: 'J',
        title: 'Babbio',
        content: 'Blah',
        date: new Date(),
        location: {lat:0,lng:1}
    });
    console.log(p1);

    console.log("Done seeding database");

    await db.serverConfig.close();
}

main();