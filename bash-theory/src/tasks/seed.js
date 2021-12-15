const dbConnection = require("../config/mongoConnection");
const posts = require("../data/posts");

async function main() {
    const db = await dbConnection();
    await db.dropDatabase();
    
    const p1 = await posts.create({
        posterName: 'J',
        title: 'Babbio',
        content: 'Building',
        date: new Date(),
        location: {lat:0,lng:1}
    });
    console.log(p1);
    const p2 = await posts.create({
        posterName: 'J',
        title: 'Muteki Ramen',
        content: 'Eating Spots',
        date: new Date(),
        location: {lat:1,lng:1}
    });
    console.log(p2);
    const c1 = await posts.addComment({
        postId: p1._id,
        name: 'Hill',
        body: 'great place!',
        rating: 4.5
    });
    console.log(c1);
    const s1 = await posts.searchByTitle('Ba');
    console.log(s1);


    console.log("Done seeding database");
    await db.serverConfig.close();
}

main();