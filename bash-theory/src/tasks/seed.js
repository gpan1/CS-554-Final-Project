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
    const c1 = await posts.addComment({
        postId: p1._id,
        name: 'Hill',
        body: 'great place!'
    });
    console.log(c1);

    console.log("Done seeding database");
    await db.serverConfig.close();
}

main();